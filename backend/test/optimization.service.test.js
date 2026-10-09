import test from "node:test";
import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import {
  DISPATCH_DEPOT,
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
  async hasDriverConflict() {
    return Boolean(this.resources.driverConflict);
  }
  async hasVehicleConflict() {
    return Boolean(this.resources.vehicleConflict);
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
    vehicle: { id: id(81), capacityKg: 50, status: "ACTIVE" },
    route: {
      id: id(70),
      vehicleId: id(80),
      driverId: id(90),
      startsAt: "2026-10-08T23:02:00Z",
      status: "PLANNED",
      optimized: false,
      capacityKg: 50,
      vehicleStatus: "ACTIVE",
      driverStatus: "ACTIVE",
    },
  };
  const { service, repository } = makeService(resources);
  const result = await service.optimize(
    {
      routeId: id(70),
      vehicleId: id(81),
      orderIds: [id(1), id(2)],
      startsAt: "2026-10-08T13:00:00Z",
    },
    id(99),
  );
  assert.equal(result.sequence.length, 2);
  assert.equal(result.sequence[0].id, id(2));
  assert.deepEqual(
    result.sequence.map((item) => item.deliveryOrder),
    [1, 2],
  );
  assert.ok(repository.saved.distanceKm >= 0);
  assert.equal(repository.saved.routeId, id(70));
  assert.equal(repository.saved.vehicleId, id(81));
  assert.equal(
    repository.saved.startsAt.toISOString(),
    "2026-10-08T13:00:00.000Z",
  );
  assert.deepEqual(repository.saved.depot, DISPATCH_DEPOT);
});

test("rechaza duplicados, pedidos no pendientes y capacidad superior al 95 %", async () => {
  const base = {
    orders: [order(1)],
    vehicle: { id: id(81), capacityKg: 10.5, status: "ACTIVE" },
    route: {
      id: id(70),
      vehicleId: id(80),
      driverId: id(90),
      startsAt: "2026-10-08T13:00:00Z",
      status: "PLANNED",
      optimized: false,
      capacityKg: 10.5,
      vehicleStatus: "ACTIVE",
      driverStatus: "ACTIVE",
    },
  };
  const { service } = makeService(base);
  await assert.rejects(
    service.optimize(
      {
        routeId: id(70),
        vehicleId: id(81),
        orderIds: [id(1), id(1)],
        startsAt: "2026-10-08T13:00:00Z",
      },
      id(99),
    ),
    { code: "VALIDATION_ERROR" },
  );
  await assert.rejects(
    service.optimize(
      {
        routeId: id(70),
        vehicleId: id(81),
        orderIds: [id(1)],
        startsAt: "2026-10-08T13:00:00Z",
      },
      id(99),
    ),
    { code: "CONFLICT" },
  );
  const missing = makeService({ ...base, orders: [] }).service;
  await assert.rejects(
    missing.optimize(
      {
        routeId: id(70),
        vehicleId: id(81),
        orderIds: [id(1)],
        startsAt: "2026-10-08T13:00:00Z",
      },
      id(99),
    ),
    { code: "CONFLICT" },
  );
  assert.throws(
    () =>
      buildOptimizedSequence(
        [order(1, { windowEnd: "07:59" })],
        new Date("2026-10-08T13:00:00Z"),
        DISPATCH_DEPOT,
      ),
    { code: "CONFLICT" },
  );
});

test("exige ruta manual planificada, vehículo activo y conductor activo asignado", async () => {
  const validRoute = {
    id: id(70),
    vehicleId: id(80),
    driverId: id(90),
    startsAt: "2026-10-08T13:00:00Z",
    status: "PLANNED",
    optimized: false,
    capacityKg: 100,
    vehicleStatus: "ACTIVE",
    driverStatus: "ACTIVE",
  };
  const request = {
    routeId: id(70),
    vehicleId: id(81),
    orderIds: [id(1)],
    startsAt: "2026-10-08T13:00:00Z",
  };
  for (const route of [
    null,
    { ...validRoute, optimized: true },
    { ...validRoute, status: "COMPLETED" },
    { ...validRoute, driverId: null },
    { ...validRoute, driverStatus: "INACTIVE" },
  ]) {
    await assert.rejects(
      makeService({
        orders: [order(1)],
        route,
        vehicle: { id: id(81), capacityKg: 100, status: "ACTIVE" },
      }).service.optimize(request, id(99)),
      { code: "CONFLICT" },
    );
  }
  await assert.rejects(
    makeService({
      orders: [order(1)],
      route: validRoute,
      vehicle: { id: id(81), capacityKg: 100, status: "OUT_OF_SERVICE" },
    }).service.optimize(request, id(99)),
    { code: "CONFLICT" },
  );
});

test("aplica la primera mitad de la ventana a pedidos de prioridad alta", () => {
  const farHighPriority = order(1, {
    latitude: -12.5,
    priority: "HIGH",
    windowStart: "08:00",
    windowEnd: "09:00",
  });
  assert.throws(
    () =>
      buildOptimizedSequence(
        [farHighPriority],
        new Date("2026-10-08T13:00:00Z"),
        DISPATCH_DEPOT,
      ),
    { code: "CONFLICT" },
  );
});

test("rechaza la optimización si el nuevo horario solapa al conductor", async () => {
  const resources = {
    orders: [order(1)],
    vehicle: { id: id(81), capacityKg: 100, status: "ACTIVE" },
    driverConflict: true,
    route: {
      id: id(70),
      vehicleId: id(80),
      driverId: id(90),
      startsAt: "2026-10-08T13:00:00Z",
      status: "PLANNED",
      optimized: false,
      capacityKg: 100,
      vehicleStatus: "ACTIVE",
      driverStatus: "ACTIVE",
    },
  };
  await assert.rejects(
    makeService(resources).service.optimize(
      {
        routeId: id(70),
        vehicleId: id(81),
        orderIds: [id(1)],
        startsAt: "2026-10-08T13:00:00Z",
      },
      id(99),
    ),
    { code: "CONFLICT" },
  );
});

test("rechaza una unidad con conflicto de horario", async () => {
  const resources = {
    orders: [order(1)],
    vehicle: { id: id(81), capacityKg: 100, status: "ACTIVE" },
    vehicleConflict: true,
    route: {
      id: id(70),
      vehicleId: id(80),
      driverId: id(90),
      startsAt: "2026-10-08T13:00:00Z",
      status: "PLANNED",
      optimized: false,
      driverStatus: "ACTIVE",
    },
  };
  await assert.rejects(
    makeService(resources).service.optimize(
      {
        routeId: id(70),
        vehicleId: id(81),
        orderIds: [id(1)],
        startsAt: "2026-10-08T13:00:00Z",
      },
      id(99),
    ),
    { code: "CONFLICT" },
  );
});

test("procesa 50 puntos por debajo del objetivo P95 de 3.5 segundos", () => {
  const orders = Array.from({ length: 50 }, (_, index) => order(index + 1));
  const durations = Array.from({ length: 20 }, () => {
    const start = performance.now();
    buildOptimizedSequence(
      orders,
      new Date("2026-10-08T13:00:00Z"),
      DISPATCH_DEPOT,
    );
    return performance.now() - start;
  }).sort((a, b) => a - b);
  const p95 = durations[Math.ceil(durations.length * 0.95) - 1];
  assert.ok(p95 <= 3500, `P95 observado: ${p95.toFixed(2)} ms`);
});
