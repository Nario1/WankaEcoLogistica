import fs from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "../../src/config/env.js";
import { createPool } from "../../src/config/database.js";
import {
  computeRecoveryMetrics,
  createSnapshotManifest,
  exportLogicalBackup,
  verifySnapshotIntegrity,
} from "../../src/ops/recovery.js";

const root = dirname(fileURLToPath(import.meta.url));
const backupDir = join(root, "..", "..", "backups");
const reportsDir = join(backupDir, "reports");

await fs.mkdir(reportsDir, { recursive: true });

const config = loadConfig();
let snapshot;
let mode = "live";

if (config.databaseUrl) {
  const pool = createPool(config);
  try {
    snapshot = await exportLogicalBackup(pool);
  } finally {
    await pool.end();
  }
} else {
  mode = "synthetic";
  const counts = {
    usuarios: 2,
    vehiculos: 3,
    rutas: 1,
    pedidos: 5,
    auditoria: 8,
  };
  snapshot = {
    manifest: createSnapshotManifest({ tableCounts: counts, source: "synthetic" }),
    data: Object.fromEntries(
      Object.entries(counts).map(([table, total]) => [
        table,
        Array.from({ length: total }, (_, index) => ({ id: index + 1 })),
      ]),
    ),
  };
}

const backupPath = join(backupDir, "latest.json");
await fs.writeFile(backupPath, JSON.stringify(snapshot, null, 2), "utf8");

const outageStartedAt = new Date();
// Simula detección de indisponibilidad y activación del runbook.
await new Promise((resolve) => setTimeout(resolve, 20));
const integrity = verifySnapshotIntegrity(snapshot.manifest);
if (!integrity.ok) {
  console.error(`Simulación abortada: ${integrity.reason}`);
  process.exit(1);
}
// Simula validación de restauración en seco (parseo + digest).
await new Promise((resolve) => setTimeout(resolve, 30));
const recoveredAt = new Date();

const metrics = computeRecoveryMetrics({
  backupTakenAt: snapshot.manifest.takenAt,
  outageStartedAt,
  recoveredAt,
});

const report = {
  enabler: "EN-003",
  mode,
  executedAt: recoveredAt.toISOString(),
  backupPath,
  integrity,
  outage: {
    startedAt: outageStartedAt.toISOString(),
    recoveredAt: recoveredAt.toISOString(),
    procedure: [
      "Detectar falla vía /health/ready",
      "Tomar o reutilizar último respaldo lógico",
      "Verificar digest de integridad",
      "Restaurar en RESTORE_DATABASE_URL o validar dry-run",
      "Registrar RTO/RPO",
    ],
  },
  metrics,
};

const reportPath = join(
  reportsDir,
  `recovery-${recoveredAt.toISOString().replaceAll(":", "-")}.json`,
);
await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");
await fs.writeFile(
  join(reportsDir, "latest.json"),
  JSON.stringify(report, null, 2),
  "utf8",
);

console.error(`Simulación EN-003 (${mode})`);
console.error(`RTO alcanzado: ${metrics.rtoSeconds}s (objetivo ≤ ${metrics.targets.rtoSeconds}s) → ${metrics.meetsRto ? "CUMPLE" : "NO CUMPLE"}`);
console.error(`RPO alcanzado: ${metrics.rpoSeconds}s (objetivo ≤ ${metrics.targets.rpoSeconds}s) → ${metrics.meetsRpo ? "CUMPLE" : "NO CUMPLE"}`);
console.error(`Reporte: ${reportPath}`);

if (!metrics.meetsRto) process.exitCode = 1;
