import { DateTime } from 'luxon'
import { BaseModel, HasOne, beforeCreate, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Registry from 'App/Models/Registry'
import ProductVariation from 'App/Models/ProductVariation'
import { Exception } from '@adonisjs/core/build/standalone'

export default class RegistryProductCart extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public registry_id: number

  @column()
  public product_variation_id: number

  @column()
  public initial_qty: number

  @column()
  public current_qty: number

  @hasOne(() => Registry, {
    foreignKey: 'id',
    localKey: 'registry_id',
  })
  public registry: HasOne<typeof Registry>

  @hasOne(() => ProductVariation, {
    localKey: 'product_variation_id',
    foreignKey: 'id',
  })
  public product_variation: HasOne<typeof ProductVariation>

  @beforeCreate()
  public static async checkIsItemExistedInCart(cart: RegistryProductCart) {
    const existedItemCart = await RegistryProductCart.query()
      .where('registry_id', cart.registry_id)
      .andWhere('product_variation_id', cart.product_variation_id)
      .first()
    if (existedItemCart) {
      throw new Exception('cart item already existed, please use update instead', 422)
    }
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
