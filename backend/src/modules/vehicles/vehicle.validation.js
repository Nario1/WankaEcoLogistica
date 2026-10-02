import {
  VEHICLE_STATUSES,
  assertObject,
  requireEnum,
  requireNumber,
  requireString,
} from "../../shared/validation.js";
import { badRequest } from "../../shared/errors.js";

export function normalizePlate(value) {
  const plate = requireString(value, "plate", { min: 5, max: 10 })
    .toUpperCase()
    .replace(/\s/g, "");
  if (!/^[A-Z0-9-]+$/.test(plate)) {
    throw badRequest("Datos inválidos", {
      plate: "Solo se permiten letras, números y guiones",
    });
  }
  return plate;
}

export function validateVehicle(input) {
  assertObject(input);
  return {
    plate: normalizePlate(input.plate),
    capacityKg: requireNumber(input.capacityKg, "capacityKg", {
      min: 0.01,
      max: 100_000,
    }),
    consumptionPerKm: requireNumber(
      input.consumptionPerKm,
      "consumptionPerKm",
      { min: 0, max: 1_000 },
    ),
    emissionFactor: requireNumber(input.emissionFactor, "emissionFactor", {
      min: 0,
      max: 10_000,
    }),
    status: requireEnum(input.status ?? "ACTIVE", "status", VEHICLE_STATUSES),
  };
}

export function validateVehicleUpdate(input) {
  assertObject(input);
  const allowed = [
    "plate",
    "capacityKg",
    "consumptionPerKm",
    "emissionFactor",
    "status",
  ];
  const unknown = Object.keys(input).filter((key) => !allowed.includes(key));
  if (unknown.length)
    throw badRequest("Datos inválidos", {
      unknown: `Campos no permitidos: ${unknown.join(", ")}`,
    });
  if (!Object.keys(input).length)
    throw badRequest("Debe enviar al menos un campo");
  return input;
}
