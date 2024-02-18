import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import UserDeliveryAddress from 'App/Models/UserDeliveryAddress'
import isAuthorizedForResource from 'App/Utils/auth/resourceAuth'

export default class UserDeliveryAddressesController {
  public async index() {
    const userDeliveryAddresses = await UserDeliveryAddress.all()
    return {
      message: 'user delivery addresses retrieved',
      data: {
        userDeliveryAddresses,
      },
    }
  }

  public async show(ctx: HttpContextContract) {
    const { params } = ctx
    const id = params.id

    const userDeliveryAddress = await UserDeliveryAddress.findOrFail(id)

    isAuthorizedForResource(ctx, userDeliveryAddress.user_id)

    return {
      message: 'user delivery address retrieved',
      data: {
        userDeliveryAddress,
      },
    }
  }

  public async create(ctx: HttpContextContract) {
    const { auth, request } = ctx
    const user_id = auth.user?.id

    const payload = await request.validate({
      schema: schema.create({
        name: schema.string([rules.required()]),
        phone_number: schema.string([rules.alphaNum(), rules.required()]),
        province: schema.string([rules.required()]),
        city: schema.string([rules.required()]),
        district: schema.string([rules.required()]),
        subdistrict: schema.string([rules.required()]),
        postal_code: schema.number([rules.required()]),
        detail_address: schema.string([rules.required()]),
      }),
    })

    const userDeliveryAddress = await UserDeliveryAddress.create({
      ...payload,
      user_id,
    })

    return {
      message: 'user delivery address created',
      data: {
        id: userDeliveryAddress.id,
      },
    }
  }

  public async update(ctx: HttpContextContract) {
    const { request, params } = ctx
    const id = params.id

    const payload = await request.validate({
      schema: schema.create({
        name: schema.string.optional(),
        phone_number: schema.string.optional([rules.alphaNum()]),
        province: schema.string.optional(),
        city: schema.string.optional(),
        district: schema.string.optional(),
        subdistrict: schema.string.optional(),
        postal_code: schema.number.optional(),
        detail_address: schema.string.optional(),
      }),
    })

    const userDeliveryAddress = await UserDeliveryAddress.findOrFail(id)

    isAuthorizedForResource(ctx, userDeliveryAddress.user_id)

    await userDeliveryAddress.merge({ ...payload }).save()

    return {
      message: 'user delivery address updated',
    }
  }

  public async delete(ctx: HttpContextContract) {
    const { params } = ctx
    const id = params.id

    const userDeliveryAddress = await UserDeliveryAddress.findOrFail(id)

    isAuthorizedForResource(ctx, userDeliveryAddress.id)

    await userDeliveryAddress.delete()

    return {
      message: 'user delivery address deleted',
    }
  }
}
