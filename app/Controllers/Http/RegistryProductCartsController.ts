import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RegistryProductCart from 'App/Models/RegistryProductCart'
import isAuthorizedForResource from 'App/Utils/auth/resourceAuth'

export default class RegistryProductCartsController {
  public async index({ params }: HttpContextContract) {
    const registry_id = params.registryId
    const registryProductCarts = await RegistryProductCart.query().where('registry_id', registry_id)

    return {
      message: 'registry product carts retrieved',
      data: registryProductCarts,
    }
  }

  // public async show(ctx: HttpContextContract) {
  //   const { params } = ctx
  //   const id = params.id

  //   const registryProductCart = await RegistryProductCart.findOrFail(id)
  //   await registryProductCart.load('registry')

  //   isAuthorizedForResource(ctx, registryProductCart.registry.user_id)

  //   await registryProductCart.load('product_variation')

  //   return
  // }

  public async create({ request }: HttpContextContract) {
    const registry_id = request.input('registry_id')
    const product_variation_id = request.input('product_variation_id')
    const initial_qty = request.input('initial_qty', 1)

    const registryProductCart = await RegistryProductCart.create({
      registry_id,
      product_variation_id,
      initial_qty,
      current_qty: initial_qty,
    })

    return {
      message: 'registry product cart created',
      data: registryProductCart,
    }
  }

  public async update(ctx: HttpContextContract) {
    const { params, request } = ctx
    const id = params.id
    const initial_qty = request.input('initial_qty')

    const registryProductCart = await RegistryProductCart.findOrFail(id)
    await registryProductCart.load('registry')
    isAuthorizedForResource(ctx, registryProductCart.registry.user_id)
    await registryProductCart.merge({ initial_qty }).save()

    return {
      message: 'registry product card updated',
      data: registryProductCart,
    }
  }

  public async delete(ctx: HttpContextContract) {
    const { params } = ctx
    const id = params.id

    const registryProductCart = await RegistryProductCart.findOrFail(id)
    isAuthorizedForResource(ctx, registryProductCart.registry.user_id)
    await registryProductCart.delete()

    return {
      message: 'registry product cart deleted',
    }
  }
}
