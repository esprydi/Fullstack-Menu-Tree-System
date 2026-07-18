import { DataSource } from 'typeorm';
import { Menu } from './src/menus/menu.entity';
import * as dotenv from 'dotenv';

dotenv.config(); // Membaca file .env

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Menu],
  migrations: ['src/migrations/*.ts'],
});
