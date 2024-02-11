import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

const user = {
  email: 'testuser20@gmail.com',
  password: 'testpassword',
}

test
test('Login', async ({ client, assert }) => {
  assert.plan(2)
  const response = await client.post('/api/user/login').form(user)
  console.log(response.body())
  response.assertCookie('adonis-session')
  response.assertStatus(200)
})
