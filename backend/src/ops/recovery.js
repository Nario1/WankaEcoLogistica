import { createHash } from "node:crypto";

export const CRITICAL_TABLES = Object.freeze([
  "usuarios",
  "vehiculos",
  "rutas",
  "pedidos",
  "auditoria",
]);

/** Objetivos académicos alineados a RNF-003 (MVP de laboratorio). */
export const RECOVERY_TARGETS = Object.freeze({
  rtoSeconds: 30,
  rpoSeconds: 5,
  backupRetention: 7,
  backupIntervalMinutes: 15,
});

export function buildIntegrityDigest(tableCounts) {
  const payload = CRITICAL_TABLES.map(
    (table) => `${table}:${Number(tableCounts[table] ?? 0)}`,
  ).join("|");
  return createHash("sha256").update(payload).digest("hex");
}

export function createSnapshotManifest({
  takenAt = new Date(),
  tableCounts,
  source = "DATABASE_URL",
}) {
  const counts = Object.fromEntries(
    CRITICAL_TABLES.map((table) => [table, Number(tableCounts[table] ?? 0)]),
  );
  return {
    version: 1,
    takenAt: takenAt.toISOString(),
    source,
    tables: CRITICAL_TABLES,
    counts,
    integrity: buildIntegrityDigest(counts),
    targets: RECOVERY_TARGETS,
  };
}

export function verifySnapshotIntegrity(manifest) {
  if (!manifest || typeof manifest !== "object") {
    return { ok: false, reason: "Manifiesto ausente o inválido" };
  }
  if (manifest.version !== 1) {
    return { ok: false, reason: "Versión de respaldo no soportada" };
  }
  const expected = buildIntegrityDigest(manifest.counts ?? {});
  if (expected !== manifest.integrity) {
    return {
      ok: false,
      reason: "El digest de integridad no coincide con los conteos",
      expected,
      actual: manifest.integrity,
    };
  }
  return { ok: true, integrity: expected };
}

export function computeRecoveryMetrics({
  backupTakenAt,
  outageStartedAt,
  recoveredAt,
}) {
  const backupTime = new Date(backupTakenAt).getTime();
  const outageTime = new Date(outageStartedAt).getTime();
  const recoveredTime = new Date(recoveredAt).getTime();
  const rtoSeconds = Number(((recoveredTime - outageTime) / 1000).toFixed(3));
  const rpoSeconds = Number(((outageTime - backupTime) / 1000).toFixed(3));
  return {
    rtoSeconds,
    rpoSeconds,
    meetsRto: rtoSeconds <= RECOVERY_TARGETS.rtoSeconds,
    meetsRpo: rpoSeconds <= RECOVERY_TARGETS.rpoSeconds,
    targets: RECOVERY_TARGETS,
  };
}

export async function collectTableCounts(pool) {
  const counts = {};
  for (const table of CRITICAL_TABLES) {
    const result = await pool.query(`SELECT COUNT(*)::int AS total FROM ${table}`);
    counts[table] = result.rows[0].total;
  }
  return counts;
}

export async function exportLogicalBackup(pool) {
  const takenAt = new Date();
  const tableCounts = await collectTableCounts(pool);
  const data = {};
  for (const table of CRITICAL_TABLES) {
    const result = await pool.query(`SELECT * FROM ${table}`);
    data[table] = result.rows;
  }
  const manifest = createSnapshotManifest({ takenAt, tableCounts });
  return { manifest, data };
}

export function evaluateHealth({ databaseOk, checkedAt = new Date() }) {
  return {
    status: databaseOk ? "ok" : "degraded",
    checkedAt: checkedAt.toISOString(),
    checks: {
      api: "ok",
      database: databaseOk ? "ok" : "down",
    },
  };
}
