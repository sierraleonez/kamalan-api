import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { idGenerator } from 'App/Utils/id/generator'

export default class OrderStatus extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public order_id: string

  @column()
  public status: string

  @column()
  public static async generateId(orderStatus: OrderStatus) {
    orderStatus.id = idGenerator('orderStatus')
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
