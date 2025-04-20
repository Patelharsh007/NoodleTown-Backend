import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.PGHOST,
  port: 5432,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  entities: [__dirname + "/../entities/*{.ts,.js}"],
  synchronize: true,
  logging: true,
  ssl: {
    rejectUnauthorized: false,
  },
});
