import { DateTime } from 'luxon'
import { BaseModel, HasOne, beforeCreate, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Order from 'App/Models/Order'
import Registry from 'App/Models/Registry'
import { idGenerator } from 'App/Utils/id/generator'

export default class OrderRegistry extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public order_id: string

  @column()
  public registry_id: string

  @hasOne(() => Order, {
    localKey: 'order_id',
  })
  public order: HasOne<typeof Order>

  @hasOne(() => Registry, {
    localKey: 'registry_id',
  })
  public registry: HasOne<typeof Registry>

  @beforeCreate()
  public static async generateId(orderRegistry: OrderRegistry) {
    orderRegistry.id = idGenerator('orderRegistry')
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
