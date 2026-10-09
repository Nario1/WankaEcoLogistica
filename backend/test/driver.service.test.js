import test from "node:test";
import assert from "node:assert/strict";
import { DriverService } from "../src/modules/drivers/driver.service.js";
import {
  MemoryAuditRepository,
  MemoryUserRepository,
} from "./helpers/fakes.js";

const driver = {
  id: "00000000-0000-4000-8000-000000000002",
  email: "driver@example.com",
  name: "Conductor Demo",
  role: "DRIVER",
  status: "ACTIVE",
  passwordHash: "hash",
};

test("consulta, edita y desactiva un conductor", async () => {
  const service = new DriverService({
    userRepository: new MemoryUserRepository([{ ...driver }]),
    auditRepository: new MemoryAuditRepository(),
  });
  assert.equal((await service.get(driver.id)).email, driver.email);
  const updated = await service.update(
    driver.id,
    { name: "Conductor Actualizado", email: "nuevo@example.com" },
    "admin-1",
  );
  assert.equal(updated.name, "Conductor Actualizado");
  const removed = await service.remove(driver.id, "admin-1");
  assert.equal(removed.status, "INACTIVE");
});
