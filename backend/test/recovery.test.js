import test from "node:test";
import assert from "node:assert/strict";
import {
  RECOVERY_TARGETS,
  buildIntegrityDigest,
  computeRecoveryMetrics,
  createSnapshotManifest,
  evaluateHealth,
  verifySnapshotIntegrity,
} from "../src/ops/recovery.js";

test("el digest de integridad es estable ante los mismos conteos", () => {
  const counts = {
    usuarios: 1,
    vehiculos: 2,
    rutas: 3,
    pedidos: 4,
    auditoria: 5,
  };
  assert.equal(buildIntegrityDigest(counts), buildIntegrityDigest(counts));
  assert.notEqual(
    buildIntegrityDigest(counts),
    buildIntegrityDigest({ ...counts, pedidos: 99 }),
  );
});

test("verifica manifiestos y detecta manipulación de conteos", () => {
  const manifest = createSnapshotManifest({
    tableCounts: {
      usuarios: 1,
      vehiculos: 1,
      rutas: 1,
      pedidos: 1,
      auditoria: 1,
    },
  });
  assert.equal(verifySnapshotIntegrity(manifest).ok, true);
  assert.equal(
    verifySnapshotIntegrity({ ...manifest, counts: { ...manifest.counts, rutas: 9 } })
      .ok,
    false,
  );
});

test("calcula RTO/RPO y valida objetivos RNF-003", () => {
  const metrics = computeRecoveryMetrics({
    backupTakenAt: "2026-11-06T22:00:00.000Z",
    outageStartedAt: "2026-11-06T22:00:03.000Z",
    recoveredAt: "2026-11-06T22:00:18.000Z",
  });
  assert.equal(metrics.rpoSeconds, 3);
  assert.equal(metrics.rtoSeconds, 15);
  assert.equal(metrics.meetsRpo, true);
  assert.equal(metrics.meetsRto, true);
  assert.equal(metrics.targets.rtoSeconds, RECOVERY_TARGETS.rtoSeconds);
});

test("evaluateHealth refleja el estado de la base", () => {
  assert.equal(evaluateHealth({ databaseOk: true }).status, "ok");
  assert.equal(evaluateHealth({ databaseOk: false }).checks.database, "down");
});
