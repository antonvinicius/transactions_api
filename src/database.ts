import setupKnex, { Knex } from 'knex';
import { env } from './env';

export let config: Knex.Config;

if (env.NODE_ENV === 'test') {
  config = {
    client: env.DATABASE_CLIENT,
    connection: {
      filename: env.DATABASE_URL,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations',
      directory: './database/migrations',
      extension: 'ts'
    },
    useNullAsDefault: true
  };
} else {
  config = {
    client: env.DATABASE_CLIENT,
    connection: env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations',
      directory: './database/migrations',
      extension: 'ts'
    }
  };
}

export const knex = setupKnex(config);
