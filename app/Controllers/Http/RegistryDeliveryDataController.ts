import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RegistryDeliveryDatum from 'App/Models/RegistryDeliveryDatum'
import isAuthorizedForResource from 'App/Utils/auth/resourceAuth'

export default class RegistryDeliveryDataController {
  public async index() {
    const registryDeliveryData = await RegistryDeliveryDatum.all()
    return {
      message: 'registry delivery data retrieved',
      data: {
        registryDeliveryData,
      },
    }
  }

  public async show(ctx: HttpContextContract) {
    const { params } = ctx
    const id = params.id

    const registryDeliveryData = await RegistryDeliveryDatum.findOrFail(id)
    await registryDeliveryData.load('user_delivery_address')
    const user_id = registryDeliveryData.user_delivery_address.user_id

    isAuthorizedForResource(ctx, user_id)

    return {
      message: 'registry delivery data retrieved',
      data: registryDeliveryData,
    }
  }

  public async create(ctx: HttpContextContract) {
    const { request } = ctx
    const registry_id = request.input('registry_id')
    const user_delivery_address_id = request.input('user_delivery_address_id')

    const registryDeliveryData = await RegistryDeliveryDatum.create({
      registry_id,
      user_delivery_address_id,
    })

    return {
      message: 'registry delivery data created',
      data: registryDeliveryData,
    }
  }

  public async update(ctx: HttpContextContract) {
    const { params, request } = ctx
    const id = params.id
    const registry_id = request.input('registry_id')
    const user_delivery_address_id = request.input('user_delivery_address_id')

    const registryDeliveryData = await RegistryDeliveryDatum.findOrFail(id)
    await registryDeliveryData?.load('user_delivery_address')
    const user_id = registryDeliveryData?.user_delivery_address.user_id

    isAuthorizedForResource(ctx, user_id)

    await registryDeliveryData
      .merge({
        registry_id,
        user_delivery_address_id,
      })
      .save()

    return {
      message: 'registry delivery data updated',
      data: registryDeliveryData,
    }
  }

  public async delete(ctx: HttpContextContract) {
    const { params } = ctx
    const id = params.id

    const registryDeliveryData = await RegistryDeliveryDatum.findOrFail(id)
    await registryDeliveryData?.load('user_delivery_address')
    const user_id = registryDeliveryData?.user_delivery_address.user_id

    isAuthorizedForResource(ctx, user_id)

    await registryDeliveryData.delete()

    return {
      message: 'registry delivery data deleted',
    }
  }
}
