import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('token', (table) => {
    table.string('id').primary()
    table.timestamp('created_at').notNullable()
    table.timestamp('expires_at').notNullable()
  })

  await knex.schema.createTable('session', (table) => {
    table.string('id').primary()
    table.string('token_id').notNullable().references('id').inTable('token').onDelete('CASCADE')
    table.string('device_id').notNullable()
    table.timestamp('created_at').notNullable()
  })

  await knex.schema.createTable('stream', (table) => {
    table.increments('id').primary()
    table.string('title').notNullable()
    table.string('media_id').notNullable()
    table.string('bitrate').notNullable()
    table.string('url').notNullable()
    table.timestamp('created_at').notNullable()
    table.timestamp('expires_at').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('token')
  await knex.schema.dropTable('session')
  await knex.schema.dropTable('stream')
}
