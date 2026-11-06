import fs from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "../../src/config/env.js";
import { createPool } from "../../src/config/database.js";
import {
  CRITICAL_TABLES,
  collectTableCounts,
  createSnapshotManifest,
  verifySnapshotIntegrity,
} from "../../src/ops/recovery.js";

const root = dirname(fileURLToPath(import.meta.url));
const backupPath =
  process.argv[2] ?? join(root, "..", "..", "backups", "latest.json");
const dryRun = process.argv.includes("--dry-run");
const targetUrl = process.env.RESTORE_DATABASE_URL;

const snapshot = JSON.parse(await fs.readFile(backupPath, "utf8"));
const check = verifySnapshotIntegrity(snapshot.manifest);
if (!check.ok) {
  console.error(`No se puede restaurar: ${check.reason}`);
  process.exit(1);
}

if (dryRun || !targetUrl) {
  console.error(
    dryRun
      ? "Dry-run: manifiesto válido; no se escribió en ninguna base."
      : "Defina RESTORE_DATABASE_URL para restaurar, o use --dry-run.",
  );
  console.error(`Archivo: ${backupPath}`);
  console.error(`Integridad: ${check.integrity}`);
  console.error(`Filas: ${JSON.stringify(snapshot.manifest.counts)}`);
  process.exit(0);
}

if (targetUrl === loadConfig().databaseUrl) {
  console.error(
    "RESTORE_DATABASE_URL no puede ser igual a DATABASE_URL (protección).",
  );
  process.exit(1);
}

const pool = createPool({
  ...loadConfig(),
  databaseUrl: targetUrl,
});

try {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const table of [...CRITICAL_TABLES].reverse()) {
      await client.query(`DELETE FROM ${table}`);
    }
    for (const table of CRITICAL_TABLES) {
      const rows = snapshot.data?.[table] ?? [];
      for (const row of rows) {
        const columns = Object.keys(row);
        const values = Object.values(row);
        const placeholders = columns.map((_, index) => `$${index + 1}`);
        await client.query(
          `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders.join(", ")})`,
          values,
        );
      }
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  const counts = await collectTableCounts(pool);
  const live = createSnapshotManifest({ tableCounts: counts });
  const ok = live.integrity === snapshot.manifest.integrity;
  console.error(`Restauración ${ok ? "OK" : "INCOMPLETA"} en RESTORE_DATABASE_URL`);
  console.error(`Integridad esperada: ${snapshot.manifest.integrity}`);
  console.error(`Integridad actual:   ${live.integrity}`);
  if (!ok) process.exitCode = 1;
} finally {
  await pool.end();
}
