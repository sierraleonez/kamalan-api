/* eslint-disable @typescript-eslint/naming-convention */
import { Exception } from '@adonisjs/core/build/standalone'
import env from '@ioc:Adonis/Core/Env'

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

  public async requestPayment({
    orderDetail,
    userDetail,
    paymentMethod,
  }: {
    orderDetail: iYukkOrderDetail
    userDetail: iYukkCustomer
    paymentMethod: string
  }) {
    const payload: iYukkRequestPaymentPayload = {
      request_time: Date.now() / 1000,
      payment: {
        pmt_channel_code: paymentMethod,
      },
      order_details: orderDetail,
      customer: userDetail,
      session_timeout: 86700,
      notification_url: 'https://monkfish-app-jc37p.ondigitalocean.app/api/webhook/payment-gateway',
      callback_url: 'kamalan.id',
    }

    const res = await fetch(`${this.base_url}/api/transactions/request-payment`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Authorization': `Bearer ${this.pg_access_token}`,
        'MID': this.merchant_id,
        'User-device': 'DESKTOP',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })

    const resJson = (await res.json()) as iYukkRequestPaymentResponse

    if (resJson.status_code > 299) {
      throw new Exception(resJson.status_message, resJson.status_code)
    }

    return resJson.result
  }

  public async checkPaymentStatus(order_id: string) {
    const res = await fetch(`${this.base_url}/api/transactions/${order_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.pg_access_token}`,
        'MID': this.merchant_id,
        'User-device': 'DESKTOP',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })

    const resJson = (await res.json()) as iYukkCheckPaymentStatusResponse

    if (resJson.status_code > 299) {
      throw new Exception(resJson.status_message, resJson.status_code)
    }

    return resJson.result
  }
}
