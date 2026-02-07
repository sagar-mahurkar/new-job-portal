import { DataSource, DataSourceOptions } from "typeorm";
import { env } from "./env.config";


// Purpose
// Create DB config
const databaseConfig: DataSourceOptions = {
  type: "postgres",
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  username: env.POSTGRES_USERNAME,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DATABASE,
  synchronize: false,
  logging: false,
  entities: [__dirname + "/../modules/**/*.entity.{ts,js}"],
  migrations: [__dirname + "/migrations/*.{ts,js}"],
  migrationsRun: false,
};

// Export DataSource / Prisma client
export const JobPortalDataSource = new DataSource(databaseConfig);
