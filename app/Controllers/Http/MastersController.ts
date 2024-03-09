import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import MasterCity from 'App/Models/MasterCity'
import MasterProvince from 'App/Models/MasterProvince'
import MasterSubdistrict from 'App/Models/MasterSubdistrict'

export default class MastersController {
  public async provinceIndex() {
    const provinces = await MasterProvince.all()
    return {
      message: 'provinces retrieved',
      data: provinces,
    }
  }

  public async cityIndex() {
    const cities = await MasterCity.all()
    return {
      message: 'cities retrieved',
      data: cities,
    }
  }

  public async showCity({ params }: HttpContextContract) {
    const provinceId = params.id
    const cities = await MasterCity.query().where('province_id', provinceId)

    return {
      message: 'cities retrieved',
      data: cities,
    }
  }

  public async subdistrictIndex() {
    const subdistricts = await MasterSubdistrict.all()
    return {
      message: 'subdistricts retrieved',
      data: subdistricts,
    }
  }

  public async showSubdistrict({ params }: HttpContextContract) {
    const cityId = params.id
    const subdistricts = await MasterSubdistrict.query().where('city_id', cityId)

    return {
      message: 'subdistricts retrieved',
      data: subdistricts,
    }
  }
}
