import test from "node:test";
import assert from "node:assert/strict";
import { createVehicle, resetVehiclesForTests } from "../src/modules/vehicles.js";
const validVehicle = { plate: "WKA-123", capacityKg: 1000, consumptionKm: 0.12, emissionFactor: 2.68, status: "ACTIVO" };

test("US-002: registra una unidad de flota", () => {
  resetVehiclesForTests();
  assert.equal(createVehicle(validVehicle).plate, "WKA-123");
});
test("US-002: impide registrar una placa duplicada", () => {
  resetVehiclesForTests();
  createVehicle(validVehicle);
  assert.throws(() => createVehicle(validVehicle), { status: 409, code: "DUPLICATE_PLATE" });
});
