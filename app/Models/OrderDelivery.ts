import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { idGenerator } from 'App/Utils/id/generator'

export default class OrderDelivery extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public order_id: string

  @column()
  public brand_id: string

  @column()
  public delivery_method_id: string

  @column()
  public service_type: string

  @column()
  public cost: number

  @column()
  /**
   * Estimated Time Delivered
   */
  public etd: string

  @beforeCreate()
  public static async generateId(orderDelivery: OrderDelivery) {
    orderDelivery.id = idGenerator('orderDelivery')
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
