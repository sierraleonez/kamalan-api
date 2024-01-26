import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UserController {
  public async create({ request }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    const name = request.input('name')

    await User.create({
      name,
      email,
      password,
    })

    return {
      message: 'success create user',
    }
  }

  public async login({ auth, request }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    await auth.use('web').attempt(email, password)

    return {
      message: 'login success',
    }
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.use('web').logout()
    return {
      message: 'logout success',
    }
  }

}
