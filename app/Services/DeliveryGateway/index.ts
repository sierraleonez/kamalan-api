import { iCalculateCostArg, iCalculateCostResponse } from 'Contracts/DeliveryGateway/type'

export default class DeliveryGateway {
  constructor(
    public api_key: string,
    public base_url: string
  ) {}

  public async calculateCost({ destination, origin, weight, courier }: iCalculateCostArg) {
    const payload = {
      origin,
      originType: 'subdistrict',
      destination,
      destinationType: 'subdistrict',
      weight,
      courier: courier ?? 'jnt:pos:tiki:jne',
    }

    const res = await fetch(`${this.base_url}/cost`, {
      method: 'POST',
      body: new URLSearchParams(payload).toString(),
      headers: {
        'key': this.api_key,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'content-type': 'application/x-www-form-urlencoded',
      },
    })
    const resJson = (await res.json()) as iCalculateCostResponse
    return resJson.rajaongkir.results
  }
}
