import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Registry from 'App/Models/Registry'

export default class RegistryController {
  public async index() {
    const registries = await Registry.all()
    return {
      message: 'registries retrieved',
      data: {
        registries
      }
    }
  }

  public async show({ params }: HttpContextContract) {
    const id = params.id
    const registry = await Registry.findOrFail(id)

    return {
      message: 'registry retrieved',
      data: {
        registry
      }
    }
  }
}
