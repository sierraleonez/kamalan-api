import { DateTime } from 'luxon'
import { BaseModel, HasOne, beforeCreate, beforeSave, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import UserDeliveryAddress from './UserDeliveryAddress'
import { Exception } from '@adonisjs/core/build/standalone'
import { idGenerator } from 'App/Utils/id/generator'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public user_id: string

  @column()
  public delivery_address_id: string

  @column()
  public total: number

  @column()
  public total_shipment_cost: number

  @column()
  public total_product_price: number

  @hasOne(() => User, {
    localKey: 'user_id',
  })
  public user: HasOne<typeof User>

  @hasOne(() => UserDeliveryAddress, {
    localKey: 'delivery_address_id',
  })
  public userDeliveryAddress: HasOne<typeof UserDeliveryAddress>

  @beforeSave()
  public static async checkIsUserExisted(order: Order) {
    if (order.$dirty.user_id) {
      try {
        await User.findOrFail(order.user_id)
      } catch {
        throw new Exception('User not exist', 422)
      }
    }
  }

  @beforeSave()
  public static async checkIsDeliveryAddressExisted(order: Order) {
    if (order.$dirty.delivery_address_id) {
      try {
        await UserDeliveryAddress.findOrFail(order.delivery_address_id)
      } catch {
        throw new Exception('delivery address not exist', 422)
      }
    }
  }

  @beforeCreate()
  public static async generateId(order: Order) {
    order.id = idGenerator('order')
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
