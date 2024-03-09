import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable()
      table
        .string('delivery_address_id')
        .references('id')
        .inTable('user_delivery_addresses')
        .notNullable()
      table.enu('order_type', ['REGISTRY', 'GIFT'], { enumName: 'ORDER_TYPE', useNative: true })

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
