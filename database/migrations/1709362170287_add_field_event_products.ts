import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'event_products'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .string('product_id')
        .references('id')
        .inTable('products')
        .notNullable()
        .onDelete('CASCADE')
      table.string('event_id').references('id').inTable('events').notNullable().onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('product_id', 'event_id')
    })
  }
}
