import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { idGenerator } from 'App/Utils/id/generator'

export default class UserDeliveryAddress extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public user_id: string

  @column()
  public name: string

  @column()
  public phone_number: string

  @column()
  public province: string

  @column()
  public city: string

  @column()
  public district: string

  @column()
  public subdistrict: string

  @column()
  public postal_code: number

  @column()
  public detail_address: string

  @beforeCreate()
  public static generateId(userDeliveryAddress: UserDeliveryAddress) {
    userDeliveryAddress.id = idGenerator('userAddress')
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
