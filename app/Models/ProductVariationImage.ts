import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  SnakeCaseNamingStrategy,
  beforeCreate,
  belongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import { idGenerator } from 'App/Utils/id/generator'
import ProductVariation from 'App/Models/ProductVariation'

export default class ProductVariationImage extends BaseModel {
  public static namingStrategy = new SnakeCaseNamingStrategy()
  @column({ isPrimary: true })
  public id: string

  @column()
  public product_variation_id: string

  @column()
  public asset_url: string

  @beforeCreate()
  public static async generateId(productImage: ProductVariationImage) {
    productImage.id = idGenerator('productVariationImage')
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => ProductVariation, { foreignKey: 'product_variation_id' })
  public declare productVariations: BelongsTo<typeof ProductVariation>
}
