import { DateTime } from 'luxon'
import {
  BaseModel,
  HasMany,
  HasManyThrough,
  HasOne,
  beforeCreate,
  column,
  hasMany,
  hasManyThrough,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'
import RegistryDesign from 'App/Models/RegistryDesign'
import User from 'App/Models/User'
import Event from 'App/Models/Event'
import RegistryProductCart from './RegistryProductCart'
import { idGenerator } from 'App/Utils/id/generator'
import ProductVariation from './ProductVariation'
import RegistryDeliveryDatum from './RegistryDeliveryDatum'

export default class Registry extends BaseModel {
  @column({ isPrimary: true })
  public id: string

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
  public design_id: string

  @column()
  public user_id: string

  @column()
  public event_id: string

  @hasOne(() => RegistryDesign, {
    localKey: 'design_id',
    foreignKey: 'id',
  })
  public design: HasOne<typeof RegistryDesign>

  @hasOne(() => User, {
    localKey: 'user_id',
    foreignKey: 'id',
  })
  public user: HasOne<typeof User>

  @hasOne(() => Event, {
    localKey: 'event_id',
    foreignKey: 'id',
  })
  public event: HasOne<typeof Event>

  @hasOne(() => RegistryDeliveryDatum, {
    foreignKey: 'registry_id',
  })
  public deliveryAddress: HasOne<typeof RegistryDeliveryDatum>

  @hasMany(() => RegistryProductCart, {
    foreignKey: 'registry_id',
  })
  public cart: HasMany<typeof RegistryProductCart>

  @beforeCreate()
  public static async generateId(registry: Registry) {
    registry.id = idGenerator('registry')
  }

  @hasManyThrough([() => ProductVariation, () => RegistryProductCart], {
    foreignKey: 'registry_id',
    throughLocalKey: 'product_variation_id',
    throughForeignKey: 'id',
  })
  public product_variation: HasManyThrough<typeof ProductVariation>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
