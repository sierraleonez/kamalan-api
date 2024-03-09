import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import RajaOngkirDeliveryGateway from '@ioc:DeliveryGateway/RajaOngkir'
import Brand from 'App/Models/Brand'
import Order from 'App/Models/Order'
import OrderCart from 'App/Models/OrderCart'
import OrderDelivery from 'App/Models/OrderDelivery'
import Product from 'App/Models/Product'
import ProductVariation from 'App/Models/ProductVariation'
import Registry from 'App/Models/Registry'
import RegistryDeliveryDatum from 'App/Models/RegistryDeliveryDatum'
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
      const [cost] = selectedService.cost

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
    console.log(orderDeliveries, productCart)

    console.log(totalShipmentCost, totalProductPrice, total)

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
      },
      { isolationLevel: 'read uncommitted' }
    )

    return {
      message: 'order created',
      // data: productsData,
    }
  }
}
