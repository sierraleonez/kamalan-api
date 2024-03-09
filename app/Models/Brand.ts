import { DateTime } from 'luxon'
import { BaseModel, HasOne, beforeCreate, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { idGenerator } from 'App/Utils/id/generator'
import BrandDeliveryAddress from './BrandDeliveryAddress'

export default class Brand extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public location: string

  @column()
  public thumbnail_url: string

  @column()
  public description: string

  @beforeCreate()
  public static async generateId(brand: Brand) {
    brand.id = idGenerator('brand')
  }

  @hasOne(() => BrandDeliveryAddress, {
    localKey: 'id',
    foreignKey: 'brand_id',
  })
  public brandDeliveryAddress: HasOne<typeof BrandDeliveryAddress>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
