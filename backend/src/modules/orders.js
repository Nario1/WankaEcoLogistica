import crypto from "node:crypto";
import { DomainError } from "./errors.js";

const orders = [];
const priorities = ["ALTA", "NORMAL", "BAJA"];

function validate(data) {
  const errors = [];
  if (!data.address?.trim()) errors.push("La dirección es obligatoria.");
  if (!Number.isFinite(Number(data.latitude)) || Number(data.latitude) < -90 || Number(data.latitude) > 90) errors.push("La latitud debe estar entre -90 y 90.");
  if (!Number.isFinite(Number(data.longitude)) || Number(data.longitude) < -180 || Number(data.longitude) > 180) errors.push("La longitud debe estar entre -180 y 180.");
  if (!Number.isFinite(Number(data.weightKg)) || Number(data.weightKg) <= 0) errors.push("El peso debe ser mayor que cero.");
  if (!priorities.includes(data.priority)) errors.push("La prioridad no es válida.");
  if (!/^\d{2}:\d{2}$/.test(data.windowStart || "") || !/^\d{2}:\d{2}$/.test(data.windowEnd || "") || data.windowStart >= data.windowEnd) errors.push("La ventana horaria no es válida.");
  if (errors.length) throw new DomainError(errors.join(" "));
}

export function createOrder(data) {
  validate(data);
  const order = { id: crypto.randomUUID(), address: data.address.trim(), latitude: Number(data.latitude), longitude: Number(data.longitude), weightKg: Number(data.weightKg), priority: data.priority, windowStart: data.windowStart, windowEnd: data.windowEnd, status: "PENDIENTE", createdAt: new Date().toISOString() };
  orders.push(order);
  return order;
}
export function listOrders() { return [...orders]; }
export function resetOrdersForTests() { orders.length = 0; }
