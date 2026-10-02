import test from "node:test";
import assert from "node:assert/strict";
import pg from "pg";

const testDatabaseUrl = process.env.TEST_DATABASE_URL;

test(
  "PostGIS conserva coordenadas conocidas dentro del margen de 10 metros",
  { skip: !testDatabaseUrl && "TEST_DATABASE_URL no está configurada" },
  async () => {
    const pool = new pg.Pool({ connectionString: testDatabaseUrl, max: 1 });
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("CREATE EXTENSION IF NOT EXISTS postgis");
      await client.query(
        "CREATE TEMP TABLE geo_test (point GEOMETRY(Point, 4326) NOT NULL)",
      );
      const longitude = -75.2049;
      const latitude = -12.0651;
      await client.query(
        "INSERT INTO geo_test(point) VALUES (ST_SetSRID(ST_MakePoint($1, $2), 4326))",
        [longitude, latitude],
      );
      const result = await client.query(
        `SELECT ST_X(point) AS longitude, ST_Y(point) AS latitude,
          ST_DistanceSphere(point, ST_SetSRID(ST_MakePoint($1, $2), 4326)) AS error_meters
         FROM geo_test`,
        [longitude, latitude],
      );
      assert.equal(Number(result.rows[0].longitude), longitude);
      assert.equal(Number(result.rows[0].latitude), latitude);
      assert.ok(Number(result.rows[0].error_meters) <= 10);
    } finally {
      await client.query("ROLLBACK");
      client.release();
      await pool.end();
    }
  },
);
