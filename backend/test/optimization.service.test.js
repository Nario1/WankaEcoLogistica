import test from "node:test";
import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import {
  OptimizationService,
  buildOptimizedSequence,
} from "../src/modules/optimization/optimization.service.js";
import { MemoryAuditRepository } from "./helpers/fakes.js";

const id = (number) =>
  `00000000-0000-4000-8000-${String(number).padStart(12, "0")}`;
const order = (number, overrides = {}) => ({
  id: id(number),
  address: `Parada ${number}`,
  latitude: -12.0651 + number / 10_000,
  longitude: -75.2049 + number / 10_000,
  weightKg: 10,
  priority: "NORMAL",
  windowStart: "08:00",
  windowEnd: "16:00",
  ...overrides,
});

class OptimizationRepository {
  constructor(resources) {
    this.resources = resources;
    this.saved = null;
  }
  async getResources() {
    return this.resources;
  }
  async save(value) {
    this.saved = value;
    return { id: id(100), ...value };
  }
}

function makeService(resources) {
  const repository = new OptimizationRepository(resources);
  return {
    repository,
    service: new OptimizationService({
      optimizationRepository: repository,
      auditRepository: new MemoryAuditRepository(),
    }),
  };
}

test("optimiza pedidos, prioriza urgentes y conserva una secuencia completa", async () => {
  const resources = {
    orders: [order(1), order(2, { priority: "HIGH" })],
    vehicles: [{ id: id(80), capacityKg: 50 }],
    drivers: [{ id: id(90) }],
    depot: { latitude: -12.0651, longitude: -75.2049 },
  };
  const { service, repository } = makeService(resources);
  const result = await service.optimize(
    { orderIds: [id(1), id(2)], startsAt: "2026-10-08T13:00:00Z" },
    id(99),
  );
  assert.equal(result.sequence.length, 2);
  assert.equal(result.sequence[0].id, id(2));
  assert.deepEqual(
    result.sequence.map((item) => item.deliveryOrder),
    [1, 2],
  );
  assert.ok(repository.saved.distanceKm >= 0);
});

test("rechaza duplicados, pedidos no pendientes, falta de capacidad y ventanas inviables", async () => {
  const base = {
    orders: [order(1)],
    vehicles: [{ id: id(80), capacityKg: 5 }],
    drivers: [{ id: id(90) }],
    depot: { latitude: -12.0651, longitude: -75.2049 },
  };
  const { service } = makeService(base);
  await assert.rejects(
    service.optimize(
      { orderIds: [id(1), id(1)], startsAt: "2026-10-08T13:00:00Z" },
      id(99),
    ),
    { code: "VALIDATION_ERROR" },
  );
  await assert.rejects(
    service.optimize(
      { orderIds: [id(1)], startsAt: "2026-10-08T13:00:00Z" },
      id(99),
    ),
    { code: "CONFLICT" },
  );
  const missing = makeService({ ...base, orders: [] }).service;
  await assert.rejects(
    missing.optimize(
      { orderIds: [id(1)], startsAt: "2026-10-08T13:00:00Z" },
      id(99),
    ),
    { code: "CONFLICT" },
  );
  assert.throws(
    () =>
      buildOptimizedSequence(
        [order(1, { windowEnd: "07:59" })],
        new Date("2026-10-08T13:00:00Z"),
        base.depot,
      ),
    { code: "CONFLICT" },
  );
});

test("procesa 50 puntos por debajo del objetivo P95 de 3.5 segundos", () => {
  const orders = Array.from({ length: 50 }, (_, index) => order(index + 1));
  const durations = Array.from({ length: 20 }, () => {
    const start = performance.now();
    buildOptimizedSequence(orders, new Date("2026-10-08T13:00:00Z"), {
      latitude: -12.0651,
      longitude: -75.2049,
    });
    return performance.now() - start;
  }).sort((a, b) => a - b);
  const p95 = durations[Math.ceil(durations.length * 0.95) - 1];
  assert.ok(p95 <= 3500, `P95 observado: ${p95.toFixed(2)} ms`);
});
