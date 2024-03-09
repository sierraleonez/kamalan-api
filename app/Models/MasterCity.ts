import { DateTime } from 'luxon'
import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Province from './MasterProvince'

export default class MasterCity extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public province_id: string

  @column()
  public type: string

  @column()
  public city_name: string

  @column()
  public postal_code: string

  @hasOne(() => Province, {
    localKey: 'province_id',
  })
  public province: HasOne<typeof Province>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
