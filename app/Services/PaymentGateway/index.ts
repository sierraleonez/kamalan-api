/* eslint-disable @typescript-eslint/naming-convention */
import env from '@ioc:Adonis/Core/Env'

interface iYukkAuthenticateResponse {
  time: number
  status_code: number
  status_message: string
  result: {
    token_type: string
    expires_in: number
    access_token: string
  }
}

interface iPaymentGatewayCredential {
  merchant_id: string
  pg_access_token: string
}

interface iPaymentMethod {
  code: string
  name: string
  category: {
    code: string
    name: string
  }
}

interface iGetPaymentMethodsResponse {
  time: number // In milisecond
  status_code: number
  status_message: string
  result: Array<iPaymentMethod>
}

export default class PaymentGateway {
  public client_id: string
  public client_secret: string
  public merchant_id: string
  public pg_access_token: string
  public base_url: string = env.get('YUKK_URL')

  constructor({ merchant_id, pg_access_token }: iPaymentGatewayCredential) {
    this.merchant_id = merchant_id
    this.pg_access_token = pg_access_token
  }

  public static async authenticate(client_id: string, client_secret: string) {
    const payload = {
      grant_type: 'client_credentials',
      client_id: client_id,
      client_secret: client_secret,
    }

    const body = new URLSearchParams(payload)
    const res = await fetch(`${env.get('YUKK_URL')}/api/oauth/token`, {
      method: 'POST',
      body: body.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    const parsedResponse = (await res.json()) as iYukkAuthenticateResponse
    return parsedResponse.result.access_token
  }

  public async getPaymentMethods() {
    const res = await fetch(`${this.base_url}/api/payment-channels`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.pg_access_token}`,
        'MID': this.merchant_id,
        'User-device': 'DESKTOP',
      },
    })
    const jsonResponse = (await res.json()) as iGetPaymentMethodsResponse
    return jsonResponse.result
  }

  public requestPayment() {}
}
