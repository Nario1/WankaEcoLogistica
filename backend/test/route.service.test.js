import test from "node:test";
import assert from "node:assert/strict";
import { RouteService } from "../src/modules/routes/route.service.js";
import {
  MemoryAuditRepository,
  MemoryRepository,
  MemoryUserRepository,
} from "./helpers/fakes.js";

class RouteRepository extends MemoryRepository {
  constructor(records, conflict = false) {
    super(records);
    this.conflict = conflict;
  }
  async hasDriverConflict() {
    return this.conflict;
  }
  async assignDriver(routeId, driverId) {
    return this.update(routeId, { driverId });
  }
  async listStops(routeId) {
    return [{ id: "stop-1", routeId, deliveryOrder: 1 }];
  }
  async listByDriver(driverId) {
    return this.records.filter(
      (item) => item.driverId === driverId && item.status !== "CANCELLED",
    );
  }
}

const route = {
  id: "00000000-0000-4000-8000-000000000010",
  vehicleId: "00000000-0000-4000-8000-000000000001",
  startsAt: "2026-10-02T08:00:00Z",
  endsAt: "2026-10-02T16:00:00Z",
  driverId: null,
  optimized: true,
};
const driver = {
  id: "00000000-0000-4000-8000-000000000002",
  email: "driver@example.com",
  role: "DRIVER",
  status: "ACTIVE",
};

function makeService(conflict = false) {
  return new RouteService({
    routeRepository: new RouteRepository([{ ...route }], conflict),
    userRepository: new MemoryUserRepository([driver]),
    vehicleRepository: new MemoryRepository([
      { id: "00000000-0000-4000-8000-000000000001", status: "ACTIVE" },
    ]),
    auditRepository: new MemoryAuditRepository(),
    roadRoutingClient: {
      calculate: async (points) => ({
        provider: "TEST",
        trafficConsidered: false,
        geometry: points.map(({ latitude, longitude }) => [
          latitude,
          longitude,
        ]),
      }),
    },
  });
}

test("asigna un conductor disponible a una ruta de ocho horas", async () => {
  const assigned = await makeService().assignDriver(
    route.id,
    driver.id,
    "operator-1",
  );
  assert.equal(assigned.driverId, driver.id);
});

test("bloquea conflictos horarios y jornadas mayores a ocho horas", async () => {
  await assert.rejects(
    makeService(true).assignDriver(route.id, driver.id, "operator-1"),
    { code: "CONFLICT" },
  );
  await assert.rejects(
    makeService().create(
      {
        vehicleId: "00000000-0000-4000-8000-000000000001",
        startsAt: "2026-10-02T08:00:00Z",
        endsAt: "2026-10-02T16:00:01Z",
      },
      "operator-1",
    ),
    { code: "CONFLICT" },
  );
});

test("lista las paradas ordenadas de una ruta existente", async () => {
  const stops = await makeService().listStops(route.id);
  assert.equal(stops.length, 1);
  assert.equal(stops[0].deliveryOrder, 1);
  await assert.rejects(
    makeService().listStops("00000000-0000-4000-8000-000000000099"),
    { code: "NOT_FOUND" },
  );
});

test("calcula navegación vial desde el local hasta las paradas", async () => {
  const service = makeService();
  service.routeRepository.listStops = async () => [
    {
      id: "stop-1",
      latitude: -12.063181,
      longitude: -75.205992,
      deliveryOrder: 1,
    },
  ];
  const navigation = await service.getNavigation(route.id);
  assert.equal(navigation.provider, "TEST");
  assert.deepEqual(
    navigation.geometry[0],
    [-12.07201013486951, -75.20516872975998],
  );
  assert.deepEqual(navigation.geometry[1], [-12.063181, -75.205992]);
});

test("el conductor solo consulta la ruta que tiene asignada", async () => {
  const service = makeService();
  await service.assignDriver(route.id, driver.id, "operator-1");
  const mine = await service.listMine(driver.id);
  assert.equal(mine.length, 1);
  await assert.rejects(
    service.get(route.id, {
      id: "00000000-0000-4000-8000-000000000099",
      role: "DRIVER",
    }),
    { code: "FORBIDDEN" },
  );
  const owned = await service.get(route.id, { id: driver.id, role: "DRIVER" });
  assert.equal(owned.id, route.id);
});

test("consulta, actualiza y cancela una ruta", async () => {
  const service = makeService();
  assert.equal((await service.get(route.id)).id, route.id);
  const updated = await service.update(
    route.id,
    {
      startsAt: "2026-10-02T09:00:00Z",
      endsAt: "2026-10-02T15:00:00Z",
      status: "IN_PROGRESS",
    },
    "operator-1",
  );
  assert.equal(updated.status, "IN_PROGRESS");
  const cancelled = await service.remove(route.id, "operator-1");
  assert.equal(cancelled.status, "CANCELLED");
});
