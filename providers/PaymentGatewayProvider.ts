import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = this.app.container.resolveBinding('Adonis/Lucid/Database')
|   const Event = this.app.container.resolveBinding('Adonis/Core/Event')
|   Event.on('db:query', Database.prettyPrint)
| }
| 
*/
export default class PaymentGatewayProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    this.app.container.singleton('PaymentGateway/yukk', async () => {
      const { client_id, client_secret, merchant_id } = this.app.config.get('paymentGateway')
      const pgClass = require('App/Services/PaymentGateway/index').default
      const pg_access_token = await pgClass.authenticate(client_id, client_secret)

      return new pgClass({ merchant_id, pg_access_token })
    })
    // Register your own bindings
  }

  public async boot() {
    // All bindings are ready, feel free to use them
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
