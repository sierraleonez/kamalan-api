import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'brand_delivery_addresses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('brand_id').references('id').inTable('brands').onDelete('CASCADE').notNullable()
      table.string('name').notNullable()
      table.string('phone_number').notNullable()
      table.string('province_id')
      table.string('city_id')
      // table.string('district')
      table.string('subdistrict')
      table.integer('postal_code')
      table.string('detail_address')

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
