interface iYukkResponse<T> {
  time: number
  status_code: number
  status_message: string
  result: T
}

interface iYukkAuthenticateResult {
  token_type: string
  expires_in: number
  access_token: string
}

type iYukkAuthenticateResponse = iYukkResponse<iYukkAuthenticateResult>

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

interface iYukkOrderDetail {
  order_id: string
  amount: number
  shipping_fee: number
}

interface iYukkCustomer {
  name: string
  phone: string
  email: string
}

interface iYukkPaymentDetail {
  pmt_channel_code: string
}

interface iYukkBillingDetail {
  name: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  country: string
  postal_code: string
}

interface iYukkRequestPaymentPayload {
  request_time: number
  payment: iYukkPaymentDetail
  order_details: iYukkOrderDetail
  customer: iYukkCustomer
  billing?: iYukkBillingDetail
  callback_url?: string
  notification_url?: string
  session_timeout: number
  notes?: string
}

interface iYukkRequestPaymentResult {
  token: string
  redirect_url: string
}

type iYukkRequestPaymentResponse = iYukkResponse<iYukkRequestPaymentResult>

interface iYukkWebhookResponse {
  code: string
  order_id: string
  grand_total: number
  va?: {
    account_id: string
    number: number
    expired_at: string
    expired_in: number
  }
  customer_name: string
  customer_phone: number
  customer_email: string
  request_at: string
  paid_at: string
  notes?: string
  /**
   * SUCCESS = 'Transaction success';
   *
   * PENDING = 'Transaction is created after webpage is requested';
   *
   * WAITING = 'Transaction waiting for payment confirmation';
   *
   * FAILED = 'Transaction failed';
   *
   * CANCELED = 'Transaction canceled’;
   */
  status: 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'PENDING' | 'CANCELED'
  merchant_branch: {
    name: string
  }
  payment_channel: iPaymentMethod
}

interface iYukkCheckPaymentStatusResult extends iYukkWebhookResponse {
  /**
   * Only if status is PENDING
   */
  token?: string
  /**
   * Only if status is PENDING
   */
  redirect_url?: string
}

type iYukkCheckPaymentStatusResponse = iYukkResponse<iYukkCheckPaymentStatusResult>
