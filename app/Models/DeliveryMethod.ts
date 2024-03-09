import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
// import { idGenerator } from 'App/Utils/id/generator'

export default class DeliveryMethod extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public icon_url: string

  // @beforeCreate()
  // public static async generateId(deliveryMethod: DeliveryMethod) {
  //   deliveryMethod.id = idGenerator('deliveryMethod')
  // }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
