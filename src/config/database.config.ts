import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions.js';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions.js';

export const databaseConfig = registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: process.env.DB_TYPE as
      | MysqlConnectionOptions['type']
      | PostgresConnectionOptions['type'],
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    url: process.env.DB_URL ?? undefined,
    synchronize: Boolean(process.env.DB_SYNC ?? 'false'),
  }),
);
