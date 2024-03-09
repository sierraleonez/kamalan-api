import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'order_carts'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('brand_id').references('id').inTable('brands').notNullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropChecks('brand_id')
    })
  }
}
