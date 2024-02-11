import { test } from '@japa/runner'
import ExceptionHandler from 'App/Exceptions/Handler'

test('exception handler', ({ assert }) => {
  const error = new ExceptionHandler().handle()
})
