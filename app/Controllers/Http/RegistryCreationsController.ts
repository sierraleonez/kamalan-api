import { Exception } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import { CloudStorageInstance, NewFile } from 'App/Infra/cloud-storage'
import ProductVariation from 'App/Models/ProductVariation'
import Registry from 'App/Models/Registry'
import RegistryDeliveryDatum from 'App/Models/RegistryDeliveryDatum'
import RegistryProductCart from 'App/Models/RegistryProductCart'
import UserDeliveryAddress from 'App/Models/UserDeliveryAddress'
import isAuthorizedForResource from 'App/Utils/auth/resourceAuth'
import { IMAGE_FILE_EXTENSION } from 'App/type/constant'

export default class RegistryCreationsController {
  public async step_1(ctx: HttpContextContract) {
    const { request, auth } = ctx
    const user_id = auth.user?.id

    const validator = schema.create({
      event_date: schema.date({}, [rules.required()]),
      name: schema.string([rules.required()]),
      event_id: schema.string([rules.required()]),
    })

    const payload: { event_date: any; name: string; event_id: string } = await request.validate({
      schema: validator,
    })

    const newRegistry = await Registry.create({
      ...payload,
      user_id,
      is_private: true,
      is_published: false,
    })

    return {
      message: 'step 1 finished',
      data: newRegistry,
    }
  }

  public async step_2(ctx: HttpContextContract) {
    const { request } = ctx
    const validator = schema.create({
      registry_id: schema.string([rules.required()]),
      design_id: schema.string([rules.required()]),
    })

    const payload = await request.validate({ schema: validator })

    const registry = await Registry.findOrFail(payload.registry_id)

    isAuthorizedForResource(ctx, registry.user_id)

    await registry
      .merge({
        design_id: payload.design_id,
      })
      .save()

    return {
      message: 'step 2 finished',
      data: registry,
    }
  }

  public async step_3(ctx: HttpContextContract) {
    const { request, auth } = ctx
    const user_id = auth.user?.id

    const validator = schema.create({
      registry_id: schema.string([rules.required()]),
      is_private: schema.boolean.optional(),
      is_published: schema.boolean.optional(),
      user_asset: schema.file({ extnames: IMAGE_FILE_EXTENSION }, [rules.required()]),
      message: schema.string([rules.required()]),
      registry_name: schema.string.optional(),
      name: schema.string([rules.required()]),
      phone_number: schema.string([rules.required()]),
      province: schema.string([rules.required()]),
      city: schema.string([rules.required()]),
      subdistrict: schema.string([rules.required()]),
      postal_code: schema.number([rules.required()]),
      detail_address: schema.string([rules.required()]),
      event_date: schema.date.optional(),
    })

    const payload = await request.validate({ schema: validator })

    const registry = await Registry.findOrFail(payload.registry_id)

    isAuthorizedForResource(ctx, registry.user_id)
    const {
      city,
      province,
      name,
      detail_address,
      subdistrict,
      phone_number,
      postal_code,
      registry_id,
      // event_date,
      is_private,
      is_published,
      message,
      registry_name,
      user_asset,
    } = payload
    console.log('is private', is_private)

    const asset = new NewFile(user_asset.tmpPath || '', user_asset.extname || '')
    // const user_asset_url = await CloudStorageInstance.upload('kamalan-registry-image', asset)

    await Database.transaction(
      async (trx) => {
        const deliveryAddress = await UserDeliveryAddress.create(
          {
            city,
            province,
            name,
            detail_address,
            subdistrict,
            phone_number,
            postal_code,
            user_id,
          },
          {
            client: trx,
          }
        )

        await RegistryDeliveryDatum.create(
          {
            registry_id: registry_id,
            user_delivery_address_id: deliveryAddress.id,
          },
          {
            client: trx,
          }
        )

        registry.useTransaction(trx)
        await registry
          .merge({
            // event_date: new Date(event_date?.toSQLTime() || ''),
            is_private,
            is_published,
            message,
            name: registry_name,
            user_asset_url: '',
          })
          .save()

        trx.commit()
      },
      { isolationLevel: 'read uncommitted' }
    )
    return {
      message: 'step 3 finished',
    }
  }

  public async listCartItem(ctx: HttpContextContract) {
    const { params } = ctx
    const registry_id = params.id

    const registry = await Registry.findOrFail(registry_id)

    isAuthorizedForResource(ctx, registry.user_id)

    const res = await Database.from('registry_product_carts')
      .where('registry_id', registry_id)
      .join(
        'product_variations',
        'registry_product_carts.product_variation_id',
        '=',
        'product_variations.id'
      )
      .join('products', 'product_variations.product_id', '=', 'products.id')
      .select('registry_product_carts.*')
      .select(
        'product_variations.id as product_variation_id',
        'product_variations.qty as stock_qty'
      )
      .select('products.thumbnail_url', 'products.id as product_id', 'products.name')
      .orderBy('created_at', 'desc')

    // await registry.load('cart')
    // for await (const cart of registry.cart) {
    //   await cart.load('product_variation')
    // }

    return {
      message: 'registry cart items retrieved',
      data: res,
    }
  }

  public async addItemToCart(ctx: HttpContextContract) {
    const { params, request } = ctx
    const registry_id = params.id

    const validator = schema.create({
      product_variation_id: schema.string([rules.required()]),
      qty: schema.number([rules.required()]),
    })

    const { product_variation_id, qty } = await request.validate({ schema: validator })

    const product = await ProductVariation.findOrFail(product_variation_id)

    if (product.qty < qty) {
      throw new Exception('product qty exceeds available stocks', 400)
    }

    const registryProductCart = await RegistryProductCart.create({
      product_variation_id: product_variation_id,
      initial_qty: qty,
      current_qty: qty,
      registry_id,
    })

    return {
      message: 'registry cart item created',
      data: registryProductCart,
    }
  }

  public async updateCartItem(ctx: HttpContextContract) {
    const { params, request } = ctx
    const item_id = params.id

    const payload = await request.validate({
      schema: schema.create({
        qty: schema.number([rules.required()]),
      }),
    })

    const cartItem = await RegistryProductCart.findOrFail(item_id)
    await cartItem.load('registry')

    isAuthorizedForResource(ctx, cartItem.registry.user_id)

    await cartItem.merge({ current_qty: payload.qty }).save()

    return {
      message: 'registry product cart updated',
      data: cartItem,
    }
  }

  public async deleteCartItem(ctx: HttpContextContract) {
    const { params } = ctx
    const item_id = params.id

    const cartItem = await RegistryProductCart.findOrFail(item_id)
    await cartItem.load('registry')

    isAuthorizedForResource(ctx, cartItem.registry.user_id)

    await cartItem.delete()

    return {
      message: 'registry product cart deleted',
    }
  }
}
