import test from "node:test";
import assert from "node:assert/strict";
import { VehicleService } from "../src/modules/vehicles/vehicle.service.js";
import { MemoryAuditRepository, MemoryRepository } from "./helpers/fakes.js";

class VehicleRepository extends MemoryRepository {
  async findByPlate(plate) {
    return this.records.find((vehicle) => vehicle.plate === plate) ?? null;
  }
  async remove(id) {
    return this.update(id, { status: "OUT_OF_SERVICE" });
  }
}

const vehicle = {
  plate: "w3x-123",
  capacityKg: 1000,
  consumptionPerKm: 0.12,
  emissionFactor: 0.25,
};

test("registra vehículo normalizando la placa y permite sacarlo de servicio", async () => {
  const repository = new VehicleRepository();
  const service = new VehicleService({
    vehicleRepository: repository,
    auditRepository: new MemoryAuditRepository(),
  });
  const created = await service.create(vehicle, "admin-1");
  assert.equal(created.plate, "W3X-123");
  const updated = await service.update(
    created.id,
    { status: "OUT_OF_SERVICE" },
    "admin-1",
  );
  assert.equal(updated.status, "OUT_OF_SERVICE");
  assert.equal((await service.get(created.id)).id, created.id);
  const removed = await service.remove(created.id, "admin-1");
  assert.equal(removed.status, "OUT_OF_SERVICE");
});

test("rechaza una placa duplicada", async () => {
  const repository = new VehicleRepository([
    { id: "v1", ...vehicle, plate: "W3X-123", status: "ACTIVE" },
  ]);
  const service = new VehicleService({
    vehicleRepository: repository,
    auditRepository: new MemoryAuditRepository(),
  });
  await assert.rejects(service.create(vehicle, "admin-1"), {
    code: "CONFLICT",
  });
});
