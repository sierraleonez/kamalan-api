import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UserController {
  public async create({ request }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    const name = request.input('name')

    const user = await User.create({
      name,
      email,
      password,
    })

    return {
      message: 'user created',
      data: {
        id: user.id,
      },
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

  public async delete({ params }: HttpContextContract) {
    const id = params.id

    const user = await User.findOrFail(id)
    await user.delete()

    return {
      message: 'user deleted',
    }
  }
}
