import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class RegistryController {
  public async index({ auth }: HttpContextContract) {
    await auth.use('web').authenticate()
    console.log(auth.use('web').isLoggedIn)
    return Database.from('events').select('*')
  }
}
