import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from 'App/Models/Event'

export default class EventsController {
  public async index() {
    const events = await Event.all()
    return {
      message: 'events retrieved',
      data: {
        events,
      },
    }
  }

  public async show({ params }: HttpContextContract) {
    const eventId = params.id
    const eventInstance = await Event.findOrFail(eventId)
    return {
      message: 'event retrieved',
      data: {
        event: eventInstance
      }
    }
  }

  public async create({ request }: HttpContextContract) {
    const name = request.input('name')
    const asset_url = request.input('asset_url')
    const include_on = request.input('include_on')

    await Event.create({
      name,
      asset_url,
      include_on,
    })

    return {
      message: 'event created',
    }
  }

  public async update({ request, params }: HttpContextContract) {
    const event_id = params.id
    const name = request.input('name')
    const asset_url = request.input('asset_url')
    const include_on = request.input('include_on')

    const eventInstance = await Event.findOrFail(event_id)
    await eventInstance.merge({ name, asset_url, include_on }).save()

    return {
      message: 'event updated'
    }
  }

  public async delete({ params }: HttpContextContract) {
    const event_id = params.id
    const eventInstance = await Event.findOrFail(event_id)

    await eventInstance.delete()

    return {
      message: "event deleted"
    }
  }
}
