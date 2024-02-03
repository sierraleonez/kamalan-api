import { DateTime } from 'luxon'
import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import RegistryDesign from './RegistryDesign'

export default class Registry extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public is_private: boolean

  @column()
  public is_published: boolean

  @column()
  public message: string

  @column()
  public event_date: Date

  @column()
  public user_asset_url: string

  @column()
  public design_id: number

  @hasOne(() => RegistryDesign, {
    foreignKey: 'design_id'
  })
  public design: HasOne<typeof RegistryDesign>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
