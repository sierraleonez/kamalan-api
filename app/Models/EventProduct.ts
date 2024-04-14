import { DateTime } from 'luxon'
import { BaseModel, HasOne, beforeCreate, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { idGenerator } from 'App/Utils/id/generator'
import Product from './Product'
import Event from './Event'

export default class EventProduct extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public event_id: string

  @column()
  public product_id: string

  @beforeCreate()
  public static async generateId(eventProduct: EventProduct) {
    eventProduct.id = idGenerator('eventProduct')
  }

  @hasOne(() => Product, { foreignKey: 'id', localKey: 'product_id' })
  public product: HasOne<typeof Product>

  @hasOne(() => Event, { foreignKey: 'id', localKey: 'event_id' })
  public event: HasOne<typeof Event>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
