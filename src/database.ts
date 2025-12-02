import setupKnex, { Knex } from 'knex';
import { env } from './env';

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: env.NODE_ENV === 'test' ? {
    filename: env.DATABASE_URL,
  } : env.DATABASE_URL,
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

export const knex = setupKnex(config);
