import { DateTime } from 'luxon'
import { BaseModel, HasMany, HasOne, column, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'
import RegistryDesign from 'App/Models/RegistryDesign'
import User from 'App/Models/User'
import Event from 'App/Models/Event'
import RegistryProductCart from './RegistryProductCart'

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

  @column()
  public user_id: number

  @column()
  public event_id: number

  @hasOne(() => RegistryDesign, {
    foreignKey: 'design_id',
  })
  public design: HasOne<typeof RegistryDesign>

  @hasOne(() => User, {
    foreignKey: 'user_id',
  })
  public user: HasOne<typeof User>

  @hasOne(() => Event, {
    localKey: 'event_id',
  })
  public event: HasOne<typeof Event>

  @hasMany(() => RegistryProductCart, {
    foreignKey: 'registry_id',
  })
  public cart: HasMany<typeof RegistryProductCart>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
