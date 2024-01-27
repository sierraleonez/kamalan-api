import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ProductVariationImage extends BaseModel {
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
}
