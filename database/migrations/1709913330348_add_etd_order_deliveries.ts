import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'order_deliveries'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('etd').notNullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('etd')
    })
  }
}
