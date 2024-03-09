import Database from '@ioc:Adonis/Lucid/Database'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import City from 'App/Models/MasterCity'
import Province from 'App/Models/MasterProvince'
import Subdistrict from 'App/Models/MasterSubdistrict'
import DeliveryGatewayConfig from 'Config/deliveryGateway'

interface iRajaOngkirResponse<T> {
  rajaongkir: {
    query: Record<string, string>
    status: {
      code: number
      description: string
    }
    results: T
  }
}

interface iRajaOngkirProvince {
  province_id: string
  province: string
}

interface iRajaOngkirCity {
  city_id: string
  province_id: string
  type: string
  city_name: string
  postal_code: string
}

interface iRajaOngkirSubdistrict {
  subdistrict_id: string
  province_id: string
  province: string
  city_id: string
  city: string
  type: string
  subdistrict_name: string
}

export default class extends BaseSeeder {
  public async run() {
    // // Write your database queries inside the run method
    // const provinces = await this.fetchProvince()
    // const promises = []
    // for await (const province of provinces) {
    //   promises.push(this.fetchCity(province.id))
    // }

    await Database.transaction(
      async (trx) => {
        for await (const province of await this.fetchProvince()) {
          console.log(province)
          await Province.create(province, { client: trx })
          for await (const city of await this.fetchCity(province.id)) {
            await City.create(city, { client: trx })
            console.log(city)
            for await (const subdistrict of await this.fetchSubdistrict(city.id)) {
              await Subdistrict.create(subdistrict, { client: trx })
              console.log(subdistrict)
            }
          }
        }
      },
      {
        isolationLevel: 'read uncommitted',
      }
    )
    // const provinces = await this.fetchProvince()
  }

  private async fetchProvince() {
    const url = `${DeliveryGatewayConfig.base_url}/province`
    const getProvinces = await fetch(url, {
      method: 'GET',
      headers: {
        key: DeliveryGatewayConfig.api_key,
      },
    })
    const resJson = (await getProvinces.json()) as iRajaOngkirResponse<Array<iRajaOngkirProvince>>
    const provinces = resJson.rajaongkir.results.map((item) => ({
      id: item.province_id,
      province: item.province,
    }))

    return provinces
  }

  private async fetchCity(provinceId: string | number) {
    const url = `${DeliveryGatewayConfig.base_url}/city?province=${provinceId}`
    const getCities = await fetch(url, {
      method: 'GET',
      headers: {
        key: DeliveryGatewayConfig.api_key,
      },
    })
    const resJson = (await getCities.json()) as iRajaOngkirResponse<Array<iRajaOngkirCity>>
    const cities = resJson.rajaongkir.results.map((item) => ({
      id: item.city_id,
      province_id: item.province_id,
      type: item.type,
      city_name: item.city_name,
      postal_code: item.postal_code,
    }))

    return cities
  }

  private async fetchSubdistrict(cityId: string) {
    const url = `${DeliveryGatewayConfig.base_url}/subdistrict?city=${cityId}`
    const getSubdistricts = await fetch(url, {
      method: 'GET',
      headers: {
        key: DeliveryGatewayConfig.api_key,
      },
    })
    const resJson = (await getSubdistricts.json()) as iRajaOngkirResponse<
      Array<iRajaOngkirSubdistrict>
    >
    const subdistricts = resJson.rajaongkir.results.map((item) => ({
      id: item.subdistrict_id,
      province_id: item.province_id,
      city_id: item.city_id,
      city_name: item.city,
      subdistrict_name: item.subdistrict_name,
      province_name: item.province,
    }))

    return subdistricts
  }
}
