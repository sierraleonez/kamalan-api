import { test } from '@japa/runner'

const user = {
  email: 'testuser23@gmail.com',
  password: 'testpassword',
}

let temp: string = ''

test.group('user route', (group) => {
  test('Create user with correct payload', async ({ client, assert }) => {
    assert.plan(2)
    const response = await client.post('/api/user/create').form({ ...user, name: 'Almer' })

    response.assertBodyContains({
      message: 'user created',
    })
    temp = response.body()?.data?.id
    response.assertStatus(200)
  })

  test('Login', async ({ client, assert }) => {
    assert.plan(2)
    const response = await client.post('/api/user/login').form(user)
    response.assertCookie('adonis-session')
    response.assertStatus(200)
  })

  test('Logout', async ({ client, assert }) => {
    assert.plan(2)
    const response = await client.post('/api/user/logout')
    response.assertStatus(200)
    response.assertBodyContains({
      message: 'logout success',
    })
  })

  group.teardown(async (ctx) => {
    const [test1] = ctx.tests
    await test1.context.client.delete(`/api/user/${temp}`)
  })
})
