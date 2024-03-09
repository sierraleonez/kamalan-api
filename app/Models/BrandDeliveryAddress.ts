import { DateTime } from 'luxon'
import { BaseModel, HasOne, beforeCreate, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { idGenerator } from 'App/Utils/id/generator'
import MasterProvince from 'App/Models/MasterProvince'
import MasterCity from 'App/Models/MasterCity'
import MasterSubdistrict from 'App/Models/MasterSubdistrict'
import Brand from 'App/Models/Brand'

export default class BrandDeliveryAddress extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public brand_id: string

  @column()
  public name: string

  @column()
  public phone_number: string

  @column()
  public province_id: string

  @column()
  public city_id: string

  @column()
  public subdistrict: string

  @column()
  public postal_code: number

  @column()
  public detail_address: string

  @beforeCreate()
  public static generateId(brandDelivery: BrandDeliveryAddress) {
    brandDelivery.id = idGenerator('brandAddress')
  }

  @hasOne(() => MasterProvince, {
    localKey: 'province_id',
  })
  public province: HasOne<typeof MasterProvince>

  @hasOne(() => MasterCity, {
    localKey: 'city_id',
  })
  public city: HasOne<typeof MasterCity>

  @hasOne(() => MasterSubdistrict, {
    localKey: 'subdistrict_id',
  })
  public msubdistrict: HasOne<typeof MasterSubdistrict>

  @hasOne(() => Brand, {
    localKey: 'brand_id',
  })
  public brand: HasOne<typeof Brand>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
