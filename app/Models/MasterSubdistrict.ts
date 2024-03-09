import { DateTime } from 'luxon'
import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Province from './MasterProvince'
import City from './MasterCity'

export default class MasterSubdistrict extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public province_id: string

  @column()
  public province_name: string

  @column()
  public city_id: string

  @column()
  public city_name: string

  @column()
  public subdistrict_name: string

  @hasOne(() => Province, {
    localKey: 'province_id',
  })
  public province: HasOne<typeof Province>

  @hasOne(() => City, {
    localKey: 'city_id',
  })
  public city: HasOne<typeof City>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
