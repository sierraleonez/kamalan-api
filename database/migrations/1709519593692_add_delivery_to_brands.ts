import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'brands'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('brand_delivery_address_id').references('id').inTable('brand_delivery_addresses')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('brand_delivery_addresses')
    })
  }
}
