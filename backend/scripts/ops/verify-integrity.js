import fs from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "../../src/config/env.js";
import { createPool } from "../../src/config/database.js";
import {
  collectTableCounts,
  createSnapshotManifest,
  verifySnapshotIntegrity,
} from "../../src/ops/recovery.js";

const root = dirname(fileURLToPath(import.meta.url));
const backupPath =
  process.argv[2] ?? join(root, "..", "..", "backups", "latest.json");

const raw = JSON.parse(await fs.readFile(backupPath, "utf8"));
const fileCheck = verifySnapshotIntegrity(raw.manifest);
if (!fileCheck.ok) {
  console.error(`Integridad del archivo: FALLÓ (${fileCheck.reason})`);
  process.exitCode = 1;
} else {
  console.error(`Integridad del archivo: OK (${fileCheck.integrity})`);
}

if (!process.env.DATABASE_URL && !loadConfig().databaseUrl) {
  console.error("Sin DATABASE_URL: solo se verificó el manifiesto del archivo.");
  process.exit(process.exitCode ?? 0);
}

const pool = createPool(loadConfig());
try {
  const liveCounts = await collectTableCounts(pool);
  const live = createSnapshotManifest({ tableCounts: liveCounts });
  console.error(`Integridad en vivo: ${live.integrity}`);
  console.error(`Conteos en vivo: ${JSON.stringify(live.counts)}`);
  console.error(
    `Coincide con respaldo: ${live.integrity === raw.manifest.integrity ? "SÍ" : "NO (esperado si hubo escrituras posteriores)"}`,
  );
} finally {
  await pool.end();
}
