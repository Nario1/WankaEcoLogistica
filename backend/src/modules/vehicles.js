import crypto from "node:crypto";
import { DomainError } from "./errors.js";
const vehicles = [];
const statuses = ["ACTIVO", "FUERA_DE_SERVICIO"];

export function createVehicle(data) {
  const plate = String(data.plate || "").trim().toUpperCase();
  if (!/^[A-Z0-9-]{6,10}$/.test(plate)) throw new DomainError("La placa no tiene un formato válido.");
  if (vehicles.some((item) => item.plate === plate)) throw new DomainError("La placa ya está registrada.", 409, "DUPLICATE_PLATE");
  for (const field of ["capacityKg", "consumptionKm", "emissionFactor"]) if (!Number.isFinite(Number(data[field])) || Number(data[field]) <= 0) throw new DomainError("Capacidad, consumo y factor de emisión deben ser mayores que cero.");
  if (!statuses.includes(data.status || "ACTIVO")) throw new DomainError("El estado del vehículo no es válido.");
  const vehicle = { id: crypto.randomUUID(), plate, capacityKg: Number(data.capacityKg), consumptionKm: Number(data.consumptionKm), emissionFactor: Number(data.emissionFactor), status: data.status || "ACTIVO" };
  vehicles.push(vehicle);
  return vehicle;
}
export function listVehicles() { return [...vehicles]; }
export function resetVehiclesForTests() { vehicles.length = 0; }
