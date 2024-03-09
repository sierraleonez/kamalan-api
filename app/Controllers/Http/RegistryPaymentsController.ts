// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import YukkPaymentGateway from '@ioc:PaymentGateway/yukk'

export default class RegistryPaymentsController {
  public async getPaymentMethods() {
    const pg = await YukkPaymentGateway
    const paymentMethods = await pg.getPaymentMethods()
    return {
      message: 'payment methods retrieved',
      data: paymentMethods,
    }
  }

  public async requestPayment() {}
}
