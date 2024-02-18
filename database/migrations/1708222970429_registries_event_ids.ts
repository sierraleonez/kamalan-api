import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'registries'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('event_id').references('id').inTable('events').notNullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('event_id')
    })
  }
}
