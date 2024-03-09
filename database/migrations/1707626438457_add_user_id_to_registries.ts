import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'registries'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('user_id')
    })
  }
}
