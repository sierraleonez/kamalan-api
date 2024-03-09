import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { idGenerator } from 'App/Utils/id/generator'

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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
