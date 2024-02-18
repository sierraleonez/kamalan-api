import { DateTime } from 'luxon'
import { BaseModel, HasOne, beforeSave, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Registry from 'App/Models/Registry'
import UserDeliveryAddress from 'App/Models/UserDeliveryAddress'
import { Exception } from '@adonisjs/core/build/standalone'

export default class RegistryDeliveryDatum extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public registry_id: number

  @column()
  public user_delivery_address_id: number

  @hasOne(() => Registry, {
    localKey: 'registry_id',
  })
  public registry: HasOne<typeof Registry>

  @hasOne(() => UserDeliveryAddress, {
    localKey: 'user_delivery_address_id',
  })
  public user_delivery_address: HasOne<typeof UserDeliveryAddress>

  @beforeSave()
  public static async checkIsRegistryExisted(registryDeliveryData: RegistryDeliveryDatum) {
    if (registryDeliveryData.$dirty.registry_id) {
      try {
        await Registry.findOrFail(registryDeliveryData.registry_id)
      } catch {
        throw new Exception('Registry not exist', 422)
      }
    }
  }

  @beforeSave()
  public static async checkIsDeliveryAddressExisted(registryDeliveryData: RegistryDeliveryDatum) {
    if (registryDeliveryData.$dirty.user_delivery_address_id) {
      try {
        await UserDeliveryAddress.findOrFail(registryDeliveryData.user_delivery_address_id, {
          ...(registryDeliveryData.$trx && { client: registryDeliveryData.$trx }),
        })
      } catch {
        throw new Exception('user delivery address not exist', 422)
      }
    }
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
