import pg from "pg";

export function createPool(config) {
  // En Vercel el frontend puede subir sin PostGIS; /health sigue vivo.
  // Sin DATABASE_URL el pool queda null y /health/ready responde degraded.
  if (!config.databaseUrl) {
    return null;
  }

  return new pg.Pool({
    connectionString: config.databaseUrl,
    ssl: config.databaseSsl ? { rejectUnauthorized: true } : false,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });
}
