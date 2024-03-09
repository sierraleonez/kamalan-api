import env from '@ioc:Adonis/Core/Env'

const DeliveryGatewayConfig = {
  base_url: env.get('RAJAONGKIR_URL'),
  api_key: env.get('RAJAONGKIR_API_KEY'),
}

export default DeliveryGatewayConfig
