export interface iRajaOngkirResponse<T> {
  rajaongkir: {
    query: Record<string, string>
    status: {
      code: number
      description: string
    }
    results: T
  }
}

export interface iRajaOngkirProvince {
  province_id: string
  province: string
}

export interface iRajaOngkirCity {
  city_id: string
  province_id: string
  type: string
  city_name: string
  postal_code: string
}

export interface iRajaOngkirSubdistrict {
  subdistrict_id: string
  province_id: string
  province: string
  city_id: string
  city: string
  type: string
  subdistrict_name: string
}

type iCalculateCostResult = Array<iDeliveryCourierOption>

interface iDeliveryCourierOption {
  code: string
  name: string
  costs: Array<iDeliveryServiceOption>
}

interface iDeliveryServiceOption {
  service: string
  description: string
  cost: Array<iDeliveryCostOption>
}

interface iDeliveryCostOption {
  value: number
  etd: string
  note: string
}

export interface iCalculateCostArg {
  origin: string
  destination: string
  weight: string
  courier?: 'jnt' | 'pos' | 'tiki' | 'jne'
}

export type iCalculateCostResponse = iRajaOngkirResponse<iCalculateCostResult>
