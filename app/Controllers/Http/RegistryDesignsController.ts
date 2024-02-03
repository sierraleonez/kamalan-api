import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import RegistryDesign from "App/Models/RegistryDesign";

export default class RegistryDesignsController {
  public async index() {
    const registryDesigns = await RegistryDesign.all()
    return {
      message: 'registry designs retrieved',
      data: {
        registryDesigns
      }
    }
  }

  public async show({ params }: HttpContextContract) {
    const id = params.id

    const registryDesign = await RegistryDesign.findOrFail(id)
    return {
      message: 'registry design retrieved',
      data: {
        registryDesign
      }
    }
  }

  public async create({ request }: HttpContextContract) {
    const name = request.input('name')
    const asset_url = request.input('asset_url')

    const newRegistryDesign = await RegistryDesign.create({
      name,
      asset_url
    })

    return {
      message: 'registry design created',
      data: {
        id: newRegistryDesign.id
      }
    }
  }

  public async update({ request, params }: HttpContextContract) {
    const id = params.id
    const name = request.input('name')
    const asset_url = request.input('asset_url')

    const registryDesign = await RegistryDesign.findOrFail(id)
    await registryDesign
      .merge({
        name,
        asset_url
      })
      .save()

    return {
      message: 'registry design updated'
    }
  }

  public async delete({ params }: HttpContextContract) {
    const id = params.id

    const registryDesign = await RegistryDesign.findOrFail(id)
    await registryDesign.delete()

    return {
      message: 'registry design deleted'
    }
  }
}
