import pg from "pg";

export function createPool(config) {
  if (!config.databaseUrl) {
    throw new Error("DATABASE_URL es obligatoria");
  }

  return new pg.Pool({
    connectionString: config.databaseUrl,
    ssl: config.databaseSsl ? { rejectUnauthorized: true } : false,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });
}
