import { DateTime } from 'luxon'
import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Order from 'App/Models/Order'
import ProductVariation from './ProductVariation'

export default class OrderCart extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public order_id: number

  @column()
  public product_variation_id: number

  @column()
  public qty: number

  @hasOne(() => Order, {
    localKey: 'order_id',
  })
  public order: HasOne<typeof Order>

  @hasOne(() => ProductVariation, {
    localKey: 'product_variation_id',
  })
  public productVariation: HasOne<typeof ProductVariation>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
