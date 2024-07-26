import type { Knex } from 'knex'

const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: './config/db.sqlite',
  },
  migrations: {
    tableName: 'knex_migrations',
  },
  useNullAsDefault: true,
}

export default config
