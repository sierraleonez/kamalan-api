import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import EventProduct from "App/Models/EventProduct";

export default class EventProductsController {
  public async index() {
    const eventProducts = await EventProduct.all()
    return {
      message: 'event products retrieved',
      data: {
        eventProducts
      }
    }
  }

  public async show({ params }: HttpContextContract) {
    const id = params.id
    const eventProduct = await EventProduct.findOrFail(id)
    return {
      message: 'event product retrieved',
      eventProduct
    }
  }

  public async create({ request }: HttpContextContract) {
    const event_id = request.input('event_id')
    const product_id = request.input('product_id')

    await EventProduct.create({
      event_id,
      product_id
    })

    return {
      message: 'event product created'
    }
  }

  public async update({ request, params }: HttpContextContract) {
    const id = params.id
    const event_id = request.input('event_id')
    const product_id = request.input('product_id')

    const currentEventProduct = await EventProduct.findOrFail(id)
    await currentEventProduct
      .merge({
        event_id,
        product_id
      })
      .save()

    return {
      message: 'event product updated'
    }
  }

  public async delete({ params }: HttpContextContract) {
    const id = params.id

    const currentEventProduct = await EventProduct.findOrFail(id)
    await currentEventProduct.delete()

    return {
      message: 'event product deleted '
    }
  }
}
