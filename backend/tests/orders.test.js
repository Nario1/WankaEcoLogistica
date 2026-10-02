import test from "node:test";
import assert from "node:assert/strict";
import { createOrder, listOrders, resetOrdersForTests } from "../src/modules/orders.js";
const validOrder = { address: "Av. Ferrocarril 123, Huancayo", latitude: -12.0651, longitude: -75.2049, weightKg: 12.5, priority: "ALTA", windowStart: "09:00", windowEnd: "12:00" };

test("US-001/EN-006: registra un pedido con coordenadas válidas", () => {
  resetOrdersForTests();
  const order = createOrder(validOrder);
  assert.equal(order.status, "PENDIENTE");
  assert.equal(listOrders().length, 1);
});

test("US-001/EN-006: impide peso negativo y coordenadas fuera de rango", () => {
  resetOrdersForTests();
  assert.throws(() => createOrder({ ...validOrder, weightKg: -1, latitude: -91 }), { status: 400 });
});
