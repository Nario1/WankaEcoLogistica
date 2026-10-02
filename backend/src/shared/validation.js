import { badRequest } from "./errors.js";

export const ROLES = Object.freeze({
  ADMIN: "ADMIN",
  OPERATOR: "OPERATOR",
  DRIVER: "DRIVER",
  AUDITOR: "AUDITOR",
});

export const VEHICLE_STATUSES = ["ACTIVE", "OUT_OF_SERVICE"];
export const ORDER_PRIORITIES = ["NORMAL", "HIGH"];

export function assertObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw badRequest("El cuerpo de la solicitud debe ser un objeto JSON");
  }
}

export function requireString(value, field, { min = 1, max = 255 } = {}) {
  if (
    typeof value !== "string" ||
    value.trim().length < min ||
    value.trim().length > max
  ) {
    throw badRequest("Datos inválidos", {
      [field]: `Debe contener entre ${min} y ${max} caracteres`,
    });
  }
  return value.trim();
}

export function requireNumber(value, field, { min, max } = {}) {
  const number = Number(value);
  if (
    !Number.isFinite(number) ||
    (min !== undefined && number < min) ||
    (max !== undefined && number > max)
  ) {
    throw badRequest("Datos inválidos", {
      [field]: `Debe ser un número entre ${min ?? "-∞"} y ${max ?? "∞"}`,
    });
  }
  return number;
}

export function requireEnum(value, field, allowed) {
  if (!allowed.includes(value)) {
    throw badRequest("Datos inválidos", {
      [field]: `Valores permitidos: ${allowed.join(", ")}`,
    });
  }
  return value;
}

export function requireEmail(value) {
  const email = requireString(value, "email", { max: 255 }).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw badRequest("Datos inválidos", {
      email: "Formato de correo inválido",
    });
  }
  return email;
}

export function requireTime(value, field) {
  const time = requireString(value, field, { min: 5, max: 8 });
  if (!/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(time)) {
    throw badRequest("Datos inválidos", { [field]: "Use el formato HH:mm" });
  }
  return time.slice(0, 5);
}

export function requireDateTime(value, field) {
  const date = new Date(value);
  if (typeof value !== "string" || Number.isNaN(date.getTime())) {
    throw badRequest("Datos inválidos", {
      [field]: "Debe ser una fecha ISO 8601 válida",
    });
  }
  return date;
}

export function requireUuid(value, field = "id") {
  const id = requireString(value, field, { min: 36, max: 36 });
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      id,
    )
  ) {
    throw badRequest("Datos inválidos", { [field]: "Debe ser un UUID válido" });
  }
  return id;
}
