import { DateTime } from 'luxon'
import { BaseModel, HasOne, beforeCreate, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Order from 'App/Models/Order'
import ProductVariation from './ProductVariation'
import { idGenerator } from 'App/Utils/id/generator'

export default class OrderCart extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public order_id: string

  @column()
  public product_variation_id: string

  @column()
  public qty: number

  @column()
  public brand_id: string

  @hasOne(() => Order, {
    localKey: 'order_id',
  })
  public order: HasOne<typeof Order>

  @hasOne(() => ProductVariation, {
    localKey: 'product_variation_id',
  })
  public productVariation: HasOne<typeof ProductVariation>

  @beforeCreate()
  public static async generateId(orderCart: OrderCart) {
    orderCart.id = idGenerator('orderCart')
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
