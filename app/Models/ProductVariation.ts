import { DateTime } from 'luxon'
import { BaseModel, HasMany, beforeCreate, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import ProductVariationImage from 'App/Models/ProductVariationImage'
import { idGenerator } from 'App/Utils/id/generator'

export default class ProductVariation extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public product_id: string

  @column()
  public name: string

  @column()
  public price: number

  @column()
  public qty: number

  @hasMany(() => ProductVariationImage, { foreignKey: 'product_variation_id' })
  public productVariationImages: HasMany<typeof ProductVariationImage>

  @beforeCreate()
  public static async generateId(productVariation: ProductVariation) {
    productVariation.id = idGenerator('productVariation')
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
