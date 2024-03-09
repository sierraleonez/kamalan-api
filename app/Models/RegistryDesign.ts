import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { idGenerator } from 'App/Utils/id/generator'

export default class RegistryDesign extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public asset_url: string

  @beforeCreate()
  public static generateId(design: RegistryDesign) {
    design.id = idGenerator('registryDesign')
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
