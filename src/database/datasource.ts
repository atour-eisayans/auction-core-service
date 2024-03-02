import 'dotenv/config';
import { DataSource } from 'typeorm';

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

export const AppDataSource = new DataSource({
  type: 'postgres',
  synchronize: false,
  logging: false,
  entities: [`${__dirname}/**/entities/*.entity.{ts,js}`],
  migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASSWORD,
  port: Number(DB_PORT) || 5_432,
  database: DB_NAME,
});
