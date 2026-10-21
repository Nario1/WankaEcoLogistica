import { serviceUnavailable } from "../../shared/errors.js";
import { requestJson } from "./http.js";

/**
 * Proveedor OSRM / OpenStreetMap para trazado vial sin tráfico en vivo.
 * Cumple el contrato MapRoutingProvider: calculate(points, departureTime).
 */
export class OsrmRoutingProvider {
  constructor({ osrmBaseUrl }) {
    this.osrmBaseUrl = String(osrmBaseUrl).replace(/\/$/, "");
    this.name = "OSRM / OpenStreetMap";
  }

  async calculate(points) {
    const coordinates = points
      .map((point) => `${point.longitude},${point.latitude}`)
      .join(";");
    const url = new URL(`/route/v1/driving/${coordinates}`, this.osrmBaseUrl);
    url.searchParams.set("overview", "full");
    url.searchParams.set("geometries", "geojson");
    url.searchParams.set("steps", "true");
    const payload = await requestJson(url);
    const route = payload.routes?.[0];
    if (!route?.geometry?.coordinates?.length) {
      throw serviceUnavailable("No se encontró una ruta transitable");
    }
    return {
      provider: this.name,
      trafficConsidered: false,
      distanceKm: Number((route.distance / 1000).toFixed(2)),
      durationMinutes: Math.ceil(route.duration / 60),
      trafficDelayMinutes: null,
      geometry: route.geometry.coordinates.map(([longitude, latitude]) => [
        latitude,
        longitude,
      ]),
    };
  }
}
