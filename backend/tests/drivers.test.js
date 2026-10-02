import test from "node:test";
import assert from "node:assert/strict";
import { createDriver, assignDriver, resetDriversForTests } from "../src/modules/drivers.js";
const validDriver = { name: "Rosa Quispe", document: "12345678", phone: "999111222" };

test("US-003: registra y asigna a un conductor disponible", () => {
  resetDriversForTests();
  const driver = createDriver(validDriver);
  assert.equal(assignDriver(driver.id, "route-001", 8).assignedRouteId, "route-001");
});
test("US-003: no permite conducir más de ocho horas", () => {
  resetDriversForTests();
  const driver = createDriver(validDriver);
  assert.throws(() => assignDriver(driver.id, "route-001", 8.1), { status: 422, code: "MAX_DRIVING_HOURS" });
});
