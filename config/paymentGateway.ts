import env from '@ioc:Adonis/Core/Env'

const YukkPaymentGatewayConfig = {
  client_id: env.get('YUKK_CLIENT_ID'),
  client_secret: env.get('YUKK_CLIENT_SECRET'),
  merchant_id: env.get('YUKK_MERCHANT_ID'),
}

export default YukkPaymentGatewayConfig
