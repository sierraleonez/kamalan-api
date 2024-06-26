import { DateTime } from 'luxon'
import {
  BaseModel,
  HasMany,
  HasManyThrough,
  HasOne,
  afterCreate,
  beforeCreate,
  column,
  hasMany,
  hasManyThrough,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'
import ProductVariation from 'App/Models/ProductVariation'
import ProductVariationImage from './ProductVariationImage'
import { idGenerator } from 'App/Utils/id/generator'
import Brand from './Brand'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public brand_id: string

  @column()
  public thumbnail_url: string

  @column()
  public description: string

  @column()
  public default_price: number

  @hasMany(() => ProductVariation, { foreignKey: 'product_id', localKey: 'id' })
  public productVariations: HasMany<typeof ProductVariation>

  @hasManyThrough([() => ProductVariationImage, () => ProductVariation], {
    foreignKey: 'product_id',
    throughForeignKey: 'product_variation_id',
  })
  public images: HasManyThrough<typeof ProductVariationImage>

  @hasOne(() => Brand, { foreignKey: 'id', localKey: 'brand_id' })
  public brand: HasOne<typeof Brand>

  @afterCreate()
  public static async insertDefaultProductVariation(product: Product) {
    await ProductVariation.create({
      name: 'default',
      price: 0,
      product_id: product.id,
      qty: 1,
    })
  }

  @beforeCreate()
  public static async generateId(product: Product) {
    product.id = idGenerator('product')
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
