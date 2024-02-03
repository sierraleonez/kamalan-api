import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  SnakeCaseNamingStrategy,
  belongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import ProductVariation from 'App/Models/ProductVariation'

export default class ProductVariationImage extends BaseModel {
  public static namingStrategy = new SnakeCaseNamingStrategy()
  @column({ isPrimary: true })
  public id: number

  @column()
  public product_variation_id: number

  @column()
  public asset_url: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => ProductVariation, { foreignKey: 'product_variation_id' })
  public declare productVariations: BelongsTo<typeof ProductVariation>
}
