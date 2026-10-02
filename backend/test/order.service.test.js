import test from "node:test";
import assert from "node:assert/strict";
import { OrderService } from "../src/modules/orders/order.service.js";
import { MemoryAuditRepository, MemoryRepository } from "./helpers/fakes.js";

const validOrder = {
  address: "Av. Ferrocarril 123, Huancayo",
  latitude: -12.0651,
  longitude: -75.2049,
  weightKg: 25,
  priority: "HIGH",
  windowStart: "08:00",
  windowEnd: "10:00",
};

test("crea y actualiza un pedido válido", async () => {
  const repository = new MemoryRepository();
  const service = new OrderService({
    orderRepository: repository,
    auditRepository: new MemoryAuditRepository(),
  });
  const created = await service.create(validOrder, "operator-1");
  const updated = await service.update(
    created.id,
    { windowStart: "09:00", windowEnd: "11:00" },
    "operator-1",
  );
  assert.equal(updated.windowStart, "09:00");
  assert.equal(repository.records.length, 1);
});

test("rechaza peso negativo, coordenadas fuera de rango y ventana invertida", async () => {
  const service = new OrderService({
    orderRepository: new MemoryRepository(),
    auditRepository: new MemoryAuditRepository(),
  });
  await assert.rejects(
    service.create({ ...validOrder, weightKg: -1 }, "operator-1"),
    { code: "VALIDATION_ERROR" },
  );
  await assert.rejects(
    service.create({ ...validOrder, latitude: -100 }, "operator-1"),
    { code: "VALIDATION_ERROR" },
  );
  await assert.rejects(
    service.create({ ...validOrder, windowEnd: "07:00" }, "operator-1"),
    { code: "VALIDATION_ERROR" },
  );
});
