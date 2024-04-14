import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class UserController {
  public async create({ request }: HttpContextContract) {
    const validatorSchema = schema.create({
      email: schema.string([rules.required(), rules.email()]),
      password: schema.string([rules.required()]),
      name: schema.string([rules.required()]),
      // phone_number: schema.number.optional(),
    })

    const { email, password, name } = await request.validate({ schema: validatorSchema })

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
    const token = await auth.use('api').attempt(email, password)

    return {
      message: 'login success',
      data: token,
    }
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.use('api').logout()
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
