import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'master_subdistricts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').notNullable()
      table.string('province_id').notNullable()
      table.string('city_id').notNullable()
      table.string('subdistrict_name').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
