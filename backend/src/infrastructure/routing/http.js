import { serviceUnavailable } from "../../shared/errors.js";

const REQUEST_TIMEOUT_MS = 15_000;

export async function requestJson(url) {
  let response;
  try {
    response = await fetch(url, {
      headers: { accept: "application/json" },
      signal: globalThis.AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    throw serviceUnavailable(
      "El servicio de rutas viales no está disponible temporalmente",
    );
  }
  if (!response.ok) {
    throw serviceUnavailable(
      "El proveedor no pudo calcular una ruta vial para estos puntos",
    );
  }
  return response.json();
}
