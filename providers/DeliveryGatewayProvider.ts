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
export default class DeliveryGatewayProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    this.app.container.singleton('DeliveryGateway/RajaOngkir', async () => {
      const { base_url, api_key } = this.app.config.get('deliveryGateway')
      const dgClass = require('App/Services/DeliveryGateway/index').default

      return new dgClass(api_key, base_url)
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
