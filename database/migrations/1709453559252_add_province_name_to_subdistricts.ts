import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'master_subdistricts'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('province_name').notNullable()
      table.string('city_name').notNullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('province_name', 'city_name')
    })
  }
}
