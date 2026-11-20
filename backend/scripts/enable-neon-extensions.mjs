import "dotenv/config";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.DATABASE_SSL === "true"
      ? { rejectUnauthorized: true }
      : false,
});

try {
  await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await pool.query("CREATE EXTENSION IF NOT EXISTS postgis");
  await pool.query("CREATE EXTENSION IF NOT EXISTS btree_gist");
  const result = await pool.query(
    `SELECT extname
     FROM pg_extension
     WHERE extname IN ('postgis', 'uuid-ossp', 'btree_gist')
     ORDER BY 1`,
  );
  console.error(
    `extensions=${result.rows.map((row) => row.extname).join(",")}`,
  );
} catch (error) {
  console.error(`ERR=${error.message}`);
  process.exitCode = 1;
} finally {
  await pool.end();
}
