import crypto from "node:crypto";
import { DomainError } from "./errors.js";
const drivers = [];

export function createDriver(data) {
  if (!data.name?.trim()) throw new DomainError("El nombre del conductor es obligatorio.");
  if (!/^[0-9]{8}$/.test(String(data.document || ""))) throw new DomainError("El documento debe tener 8 dígitos.");
  if (drivers.some((item) => item.document === data.document)) throw new DomainError("El documento ya está registrado.", 409, "DUPLICATE_DRIVER");
  const driver = { id: crypto.randomUUID(), name: data.name.trim(), document: data.document, phone: data.phone?.trim() || "", available: data.available !== false, assignedRouteId: null };
  drivers.push(driver);
  return driver;
}
export function assignDriver(driverId, routeId, hours = 0) {
  const driver = drivers.find((item) => item.id === driverId);
  if (!driver) throw new DomainError("Conductor no encontrado.", 404, "NOT_FOUND");
  if (!driver.available || driver.assignedRouteId) throw new DomainError("El conductor no está disponible.", 409, "DRIVER_UNAVAILABLE");
  if (Number(hours) > 8) throw new DomainError("La ruta supera el máximo de 8 horas de conducción.", 422, "MAX_DRIVING_HOURS");
  driver.assignedRouteId = routeId;
  driver.available = false;
  return driver;
}
export function listDrivers() { return [...drivers]; }
export function resetDriversForTests() { drivers.length = 0; }
