import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class UserDeliveryAddress extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
