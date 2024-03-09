import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { idGenerator } from 'App/Utils/id/generator'
import { DateTime } from 'luxon'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public asset_url: string

  @column()
  public include_on: 'REGISTRY' | 'GIFT' | 'BOTH'

  @beforeCreate()
  public static async generateId(event: Event) {
    event.id = idGenerator('event')
  }

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime
}
