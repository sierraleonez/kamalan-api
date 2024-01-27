import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import ProductVariationImage from 'App/Models/ProductVariationImage'

export default class ProductVariation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public product_id: number

  @column()
  public name: string

  @column()
  public price: number

  @column()
  public qty: number

  @hasMany(() => ProductVariationImage, { foreignKey: 'product_variation_id' })
  public productVariationImageas: HasMany<typeof ProductVariationImage>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
