import { AuthenticationException } from '@adonisjs/auth/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default function isAuthorizedForResource(
  { auth }: HttpContextContract,
  resource_user_id: string
) {
  const current_user_id = auth.user?.id

  if (current_user_id !== resource_user_id) {
    throw new AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED_ACCESS')
  }
}
