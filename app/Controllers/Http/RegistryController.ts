import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import YukkPaymentGateway from '@ioc:PaymentGateway/yukk'
import Registry from 'App/Models/Registry'
import isAuthorizedForResource from 'App/Utils/auth/resourceAuth'
import RegistryValidator from 'App/Validators/RegistryValidator'

export default class RegistryController {
  public async index() {
    const registries = await Registry.query().where('is_published', true)
    return {
      message: 'registries retrieved',
      data: {
        registries,
      },
    }
  }

  public async show(ctx: HttpContextContract) {
    const { params } = ctx
    const id = params.id

    const registry = await Registry.findOrFail(id)

    isAuthorizedForResource(ctx, registry.user_id)

    await registry.load('event')
    await registry.load('design')
    await registry.load('product_variation')
    registry.product_variation.map(async (t) => {
      await t.load('product')
    })

    await registry.load('user')

    return {
      message: 'registry retrieved',
      data: registry,
    }
  }

  public async create(ctx: HttpContextContract) {
    const { request, auth } = ctx
    const user_id = auth.user?.id
    const validator = new RegistryValidator(ctx)
    const payload = await request.validate({ schema: validator.schema })
    const { name, event_date, event_id } = payload
    const is_private = false
    const is_published = false

    const registry = await Registry.create({
      name,
      event_date: new Date(event_date.toSQLDate() || ''),
      event_id,
      is_private,
      is_published,
      user_id,
    })

    return {
      message: 'registry created',
      data: {
        id: registry.id,
      },
    }
  }

  public async update(ctx: HttpContextContract) {
    const { request, params } = ctx
    const id = params.id
    const name = request.input('name')
    const event_date = request.input('event_date')
    const is_private = request.input('is_private')
    const is_published = request.input('is_published')
    const user_asset_url = request.input('user_asset_url')
    const design_id = request.input('design_id')
    const message = request.input('message')
    const event_id = request.input('event_id')

    const registry = await Registry.findOrFail(id)

    isAuthorizedForResource(ctx, registry.user_id)

    await registry
      .merge({
        name,
        design_id,
        event_date,
        is_private,
        is_published,
        message,
        user_asset_url,
        event_id,
      })
      .save()

    return {
      message: 'registry updated',
    }
  }

  public async delete(ctx: HttpContextContract) {
    const { params } = ctx
    const id = params.id

    const registry = await Registry.findOrFail(id)
    isAuthorizedForResource(ctx, registry.user_id)

    await registry.delete()

    return {
      message: 'registry deleted',
    }
  }

  public async makePayment() {
    const pg = await YukkPaymentGateway

    const paymentMethods = await pg.getPaymentMethods()

    return {
      status: 'success',
      data: paymentMethods,
    }
  }
}
