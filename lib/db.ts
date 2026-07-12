import mysql, { type Pool } from "mysql2/promise";

declare global { var flightcodersDb: Pool | undefined; }

export class DatabaseConfigurationError extends Error {
  constructor() { super("MySQL environment variables are incomplete."); this.name = "DatabaseConfigurationError"; }
}

function createPool() {
  if (process.env.DATABASE_URL) {
    return mysql.createPool({ uri: process.env.DATABASE_URL, connectionLimit: 10, enableKeepAlive: true });
  }
  if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) throw new DatabaseConfigurationError();
  return mysql.createPool({
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    enableKeepAlive: true,
  });
}

export function getDb() {
  if (!global.flightcodersDb) global.flightcodersDb = createPool();
  return global.flightcodersDb;
}
