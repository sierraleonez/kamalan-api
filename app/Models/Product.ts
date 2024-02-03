import { DateTime } from 'luxon'
import {
  BaseModel,
  HasMany,
  HasManyThrough,
  afterCreate,
  column,
  hasMany,
  hasManyThrough,
} from '@ioc:Adonis/Lucid/Orm'
import ProductVariation from 'App/Models/ProductVariation'
import ProductVariationImage from './ProductVariationImage'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public brand_id: number

  @column()
  public thumbnail_url: string

  @column()
  public description: string

  @hasMany(() => ProductVariation, { foreignKey: 'product_id' })
  public productVariations: HasMany<typeof ProductVariation>

  @hasManyThrough([() => ProductVariationImage, () => ProductVariation], {
    foreignKey: 'product_id',
    throughForeignKey: 'product_variation_id',
  })
  public images: HasManyThrough<typeof ProductVariationImage>

  @afterCreate()
  public static async insertDefaultProductVariation(product: Product) {
    await ProductVariation.create({
      name: 'default',
      price: 0,
      product_id: product.id,
      qty: 1,
    })
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
