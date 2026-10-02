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
}

const route = {
  id: "00000000-0000-4000-8000-000000000010",
  vehicleId: "00000000-0000-4000-8000-000000000001",
  startsAt: "2026-10-02T08:00:00Z",
  endsAt: "2026-10-02T16:00:00Z",
  driverId: null,
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
