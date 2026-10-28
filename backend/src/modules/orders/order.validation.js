import {
  ORDER_PRIORITIES,
  assertObject,
  requireEnum,
  requireNumber,
  requireString,
  requireTime,
} from "../../shared/validation.js";
import { badRequest } from "../../shared/errors.js";

const LETTER = "A-Za-zÁÉÍÓÚÜÑáéíóúüñ";
const PRODUCT_NAME = new RegExp(
  `^[${LETTER}0-9][${LETTER}0-9 .,'\\-]{1,159}$`,
);
const ADDRESS = new RegExp(
  `^[${LETTER}0-9][${LETTER}0-9 .,#°'/\\-]{4,254}$`,
);

function requireShapedText(value, field, { min, max, pattern, message }) {
  const text = requireString(value, field, { min, max });
  if (!pattern.test(text)) {
    throw badRequest("Datos inválidos", { [field]: message });
  }
  return text;
}

export function validateOrder(input) {
  assertObject(input);
  const order = {
    productName: requireShapedText(input.productName, "productName", {
      min: 2,
      max: 160,
      pattern: PRODUCT_NAME,
      message: "Use letras y números. Ejemplo: 4 cajas de limpieza",
    }),
    address: requireShapedText(input.address, "address", {
      min: 5,
      max: 255,
      pattern: ADDRESS,
      message: "Use letras y números de la dirección",
    }),
    latitude: requireNumber(input.latitude, "latitude", { min: -90, max: 90 }),
    longitude: requireNumber(input.longitude, "longitude", {
      min: -180,
      max: 180,
    }),
    weightKg: requireNumber(input.weightKg, "weightKg", {
      min: 0.01,
      max: 100_000,
    }),
    priority: requireEnum(
      input.priority ?? "NORMAL",
      "priority",
      ORDER_PRIORITIES,
    ),
    windowStart: requireTime(input.windowStart, "windowStart"),
    windowEnd: requireTime(input.windowEnd, "windowEnd"),
  };

  if (order.windowStart >= order.windowEnd) {
    throw badRequest("Datos inválidos", {
      windowEnd: "Debe ser posterior al inicio",
    });
  }
  return order;
}

export function validateOrderUpdate(input) {
  assertObject(input);
  const allowed = [
    "address",
    "productName",
    "latitude",
    "longitude",
    "weightKg",
    "priority",
    "windowStart",
    "windowEnd",
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
