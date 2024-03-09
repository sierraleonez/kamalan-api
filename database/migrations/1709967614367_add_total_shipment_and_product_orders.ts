import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('total_shipment_cost').notNullable()
      table.integer('total_product_price').notNullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('total_shipment_cost')
      table.dropColumn('total_product_price')
    })
  }
}
