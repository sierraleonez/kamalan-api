import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  HasMany,
  afterSave,
  beforeCreate,
  belongsTo,
  column,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import ProductVariationImage from 'App/Models/ProductVariationImage'
import { idGenerator } from 'App/Utils/id/generator'
import Product from './Product'

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

  @belongsTo(() => Product, {
    localKey: 'id',
    foreignKey: 'product_id',
  })
  public product: BelongsTo<typeof Product>

  @beforeCreate()
  public static async generateId(productVariation: ProductVariation) {
    productVariation.id = idGenerator('productVariation')
  }

  @afterSave()
  public static async injectDefaultPrice(_pv: ProductVariation) {
    const productVariation = await ProductVariation.findOrFail(_pv.id)
    if (productVariation.name === 'default') {
      const product_id = productVariation.product_id
      const defaultPrice = productVariation.price

      const product = await Product.findOrFail(product_id)
      await product.merge({ default_price: defaultPrice }).save()
    }
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
