import fs from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "../../src/config/env.js";
import { createPool } from "../../src/config/database.js";
import { exportLogicalBackup } from "../../src/ops/recovery.js";

const root = dirname(fileURLToPath(import.meta.url));
const backupDir = join(root, "..", "..", "backups");

const config = loadConfig();
const pool = createPool(config);
try {
  await fs.mkdir(backupDir, { recursive: true });
  const snapshot = await exportLogicalBackup(pool);
  const stamp = snapshot.manifest.takenAt.replaceAll(":", "-");
  const filePath = join(backupDir, `snapshot-${stamp}.json`);
  await fs.writeFile(filePath, JSON.stringify(snapshot, null, 2), "utf8");
  const latestPath = join(backupDir, "latest.json");
  await fs.writeFile(latestPath, JSON.stringify(snapshot, null, 2), "utf8");
  console.error(`Respaldo creado: ${filePath}`);
  console.error(`Integridad: ${snapshot.manifest.integrity}`);
  console.error(`Conteos: ${JSON.stringify(snapshot.manifest.counts)}`);
} finally {
  await pool.end();
}
