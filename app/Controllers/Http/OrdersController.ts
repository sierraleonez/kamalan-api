import { Exception } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import Schema from '@ioc:Adonis/Lucid/Schema'
import RajaOngkirDeliveryGateway from '@ioc:DeliveryGateway/RajaOngkir'
import YukkPaymentGateway from '@ioc:PaymentGateway/yukk'
import Brand from 'App/Models/Brand'
import Order from 'App/Models/Order'
import OrderCart from 'App/Models/OrderCart'
import OrderDelivery from 'App/Models/OrderDelivery'
import OrderPaymentMethod from 'App/Models/OrderPaymentMethod'
import OrderStatus from 'App/Models/OrderStatus'
import ProductVariation from 'App/Models/ProductVariation'
import Registry from 'App/Models/Registry'
import RegistryDeliveryDatum from 'App/Models/RegistryDeliveryDatum'
import User from 'App/Models/User'
import DeliveryGateway from 'App/Services/DeliveryGateway'
import isAuthorizedForResource from 'App/Utils/auth/resourceAuth'

export default class OrdersController {
  public async createRegistryOrder(ctx: HttpContextContract) {
    const { request } = ctx
    const validationSchema = schema.create({
      registry_id: schema.string([rules.required()]),
      cart: schema.array().members(
        schema.object().members({
          products: schema.array([rules.required()]).members(
            schema.object().members({
              product_id: schema.string(),
              qty: schema.number([rules.range(1, 999999)]),
            })
          ),
          brand_id: schema.string([rules.required()]),
          delivery_method_id: schema.string([rules.required()]),
          service_type: schema.string([rules.required()]),
        })
      ),
    })

    const { registry_id, cart } = await request.validate({ schema: validationSchema })
    const registry = await Registry.findOrFail(registry_id)
    const user_id = registry.user_id

    isAuthorizedForResource(ctx, user_id)

    const registryDelivery = await RegistryDeliveryDatum.findBy('registry_id', registry_id)
    const deliveryAddressId = registryDelivery?.user_delivery_address_id
    await registryDelivery?.load('user_delivery_address')
    const destination = registryDelivery?.user_delivery_address.subdistrict || ''

    let total = 0
    let totalShipmentCost = 0
    let totalProductPrice = 0
    let productCart: Array<any> = []
    let orderDeliveries: Array<any> = []

    for await (const item of cart) {
      const brand = await Brand.find(item.brand_id)
      await brand?.load('brandDeliveryAddress')
      const origin = brand?.brandDeliveryAddress.subdistrict || ''

      const ro = await RajaOngkirDeliveryGateway
      const apiCostResp = await ro.calculateCost({
        destination,
        origin,
        weight: '1700',
        courier: item.delivery_method_id as 'jnt' | 'jne' | 'pos' | 'tiki',
      })

      for await (const product of item.products) {
        const productVariation = await ProductVariation.find(product.product_id)

        productCart.push({
          qty: product.qty,
          product_variation_id: product.product_id,
          brand_id: item.brand_id,
        })

        totalProductPrice += Number(productVariation?.price) * product.qty
      }

      const [selectedShipment] = apiCostResp
      const selectedService = selectedShipment.costs.find((se) => se.service === item.service_type)
      if (!selectedService) {
        throw new Exception('Selected shipment not found', 400)
      }
      const [cost] = selectedService?.cost

      orderDeliveries.push({
        brand_id: item.brand_id,
        delivery_method_id: item.delivery_method_id,
        service_type: item.service_type,
        cost: cost.value,
        etd: cost.etd,
      })

      totalShipmentCost += cost.value
    }

    total = totalProductPrice + totalShipmentCost

    await Database.transaction(
      async (trx) => {
        const order = await Order.create(
          {
            total,
            total_product_price: totalProductPrice,
            total_shipment_cost: totalShipmentCost,
            delivery_address_id: deliveryAddressId,
            user_id,
          },
          {
            client: trx,
          }
        )

        const orderDeliveries_db = orderDeliveries.map((delivery) => ({
          ...delivery,
          order_id: order.id,
        }))
        const productCart_db = productCart.map((product) => ({ ...product, order_id: order.id }))

        await OrderDelivery.createMany(orderDeliveries_db, { client: trx })
        await OrderCart.createMany(productCart_db, { client: trx })
        await OrderStatus.create(
          {
            order_id: order.id,
            status: 'unpaid',
          },
          {
            client: trx,
          }
        )

        // Deduct product
        for await (const product of productCart) {
          const variation = await ProductVariation.findOrFail(product.product_variation_id, {
            client: trx,
          })
          if (variation.qty < product.qty) {
            throw new Exception('product qty exceeds available stocks', 400)
          }
          await variation.merge({ qty: variation.qty - product.qty }).save()
        }
      },
      { isolationLevel: 'read uncommitted' }
    )

    return {
      message: 'order created',
      // data: productsData,
    }
  }

  public async requestOrderPayment(ctx: HttpContextContract) {
    const { request } = ctx
    const validationSchema = schema.create({
      order_id: schema.string([rules.required()]),
      payment_method: schema.string([rules.required()]),
    })

    const { order_id, payment_method } = await request.validate({ schema: validationSchema })
    const order = await Order.findOrFail(order_id)
    const user = await User.findOrFail(order.user_id)

    const yukk = await YukkPaymentGateway
    const paymentResponse = await yukk.requestPayment({
      orderDetail: {
        amount: order?.total,
        order_id: order_id,
        shipping_fee: order.total_shipment_cost,
      },
      paymentMethod: payment_method,
      userDetail: {
        name: user.name,
        email: user.email,
        phone: '6282242404797',
      },
    })

    Database.transaction(async (trx) => {
      await OrderPaymentMethod.create(
        {
          payment_method,
          order_id,
        },
        {
          client: trx,
        }
      )

      await OrderStatus.create(
        {
          order_id,
          status: 'pending',
        },
        {
          client: trx,
        }
      )
    })

    return {
      message: 'request payment success',
      data: paymentResponse,
    }
  }

  public async webhookPaymentHandler({ request }: HttpContextContract) {
    const body = request.body() as iYukkWebhookResponse
    const order = await OrderStatus.findOrFail(body.order_id)
    let status: string
    switch (body.status) {
      case 'SUCCESS':
        status = 'paid'
        break
      default:
        status = body.status.toLowerCase()
    }

    await order.merge({ status }).save()
  }

  // public async calculateFinalPrice({ request }: HttpContextContract) {
  //   const validationSchema = schema.create({
  //     cart: schema.array().members(
  //       schema.object().members({
  //         products: schema.array().members(
  //           schema.object().members({
  //             product_id: schema.string([rules.required()]),
  //             qty: schema.number([rules.required()]),
  //           })
  //         ),
  //         delivery_method_id: schema.string([rules.required()]),
  //         service_type: schema.string([rules.required()]),
  //         sender_subdistrict_id: schema.string([rules.required()])
  //       })
  //     ),
  //     destination_subdistrict_id: schema.string([rules.required])
  //   })

  //   const { cart, destination_subdistrict_id } = await request.validate({ schema: validationSchema })
  //   const deliveryGateway = await RajaOngkirDeliveryGateway
  //   for await (const c of cart) {
  //     deliveryGateway.calculateCost({
  //       destination: destination_subdistrict_id,
  //       origin: c.sender_subdistrict_id,
  //       weight: '1700',
  //       courier: c.delivery_method_id
  //     })
  //   }
  // }
  public async getShipmentOptions({ request }: HttpContextContract) {
    const validationSchema = schema.create({
      destination_subdistrict_id: schema.string([rules.required()]),
      origin_subdistrict_id: schema.string([rules.required()]),
      product_variation_id: schema.string([rules.required()]),
    })

    const { destination_subdistrict_id, origin_subdistrict_id, product_variation_id } =
      await request.validate({ schema: validationSchema })

    const deliveryGateway = await RajaOngkirDeliveryGateway
    const deliveryApiResponse = await deliveryGateway.calculateCost({
      destination: destination_subdistrict_id,
      origin: origin_subdistrict_id,
      weight: '1000',
    })

    return {
      message: 'Shipment options retrieved',
      data: deliveryApiResponse,
    }
  }
}
