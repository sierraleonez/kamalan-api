import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CloudStorageInstance, NewFile } from 'App/Infra/cloud-storage'
import Event from 'App/Models/Event'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { EVENT_INCLUDE_ON } from 'App/type/type'

export default class EventsController {
  public async index({ request }: HttpContextContract) {
    const eventType = request.input('event_type', 'REGISTRY')
    const events = await Event.query().where('include_on', eventType.toUpperCase())
    return {
      message: 'events retrieved',
      data: events,
    }
  }

  public async show({ params }: HttpContextContract) {
    const eventId = params.id
    const event = await Event.findOrFail(eventId)
    return {
      message: 'event retrieved',
      data: event,
    }
  }

  public async create({ request }: HttpContextContract) {
    const validationSchema = schema.create({
      name: schema.string([rules.required()]),
      include_on: schema.enum(['REGISTRY', 'GIFT', 'BOTH'], [rules.required()]),
      asset: schema.file({ extnames: ['jpg', 'jpeg', 'png'] }, [rules.required()]),
    })
    const payload = await request.validate({
      schema: validationSchema,
    })
    const { asset, include_on, name } = payload
    const file = new NewFile(asset.tmpPath || '', asset.extname || '')

    const asset_url = await CloudStorageInstance.upload('kamalan-event-images', file)

    const include_on_casted = include_on as EVENT_INCLUDE_ON

    const event = await Event.create({
      name,
      asset_url,
      include_on: include_on_casted,
    })

    return {
      message: 'event created',
      data: event,
    }
  }

  public async update({ request, params }: HttpContextContract) {
    const event_id = params.id
    const name = request.input('name')
    const asset_url = request.input('asset_url')
    const include_on = request.input('include_on')
    const eventInstance = await Event.findOrFail(event_id)
    const event = await eventInstance.merge({ name, asset_url, include_on }).save()

    return {
      message: 'event updated',
      data: event,
    }
  }

  public async delete({ params }: HttpContextContract) {
    const event_id = params.id
    const eventInstance = await Event.findOrFail(event_id)

    await eventInstance.delete()

    return {
      message: 'event deleted',
    }
  }
}
