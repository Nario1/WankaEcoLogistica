import { serviceUnavailable } from "../../shared/errors.js";
import { requestJson } from "./http.js";

/**
 * Proveedor TomTom con tráfico actual/histórico.
 * Cumple el contrato MapRoutingProvider: calculate(points, departureTime).
 */
export class TomtomRoutingProvider {
  constructor({ tomtomApiKey }) {
    if (!tomtomApiKey) {
      throw new Error("TOMTOM_API_KEY es obligatoria para el proveedor TomTom");
    }
    this.tomtomApiKey = tomtomApiKey;
    this.name = "TomTom Traffic";
  }

  async calculate(points, departureTime) {
    const locations = points
      .map((point) => `${point.latitude},${point.longitude}`)
      .join(":");
    const url = new URL(
      `https://api.tomtom.com/routing/1/calculateRoute/${locations}/json`,
    );
    url.searchParams.set("key", this.tomtomApiKey);
    url.searchParams.set("traffic", "true");
    url.searchParams.set("travelMode", "car");
    url.searchParams.set("routeType", "fastest");
    url.searchParams.set("computeTravelTimeFor", "all");
    url.searchParams.set("departAt", new Date(departureTime).toISOString());
    const payload = await requestJson(url);
    const route = payload.routes?.[0];
    const geometry = route?.legs
      ?.flatMap((leg) => leg.points ?? [])
      .map((point) => [point.latitude, point.longitude]);
    if (!geometry?.length) {
      throw serviceUnavailable("No se encontró una ruta transitable");
    }
    return {
      provider: this.name,
      trafficConsidered: true,
      distanceKm: Number((route.summary.lengthInMeters / 1000).toFixed(2)),
      durationMinutes: Math.ceil(route.summary.travelTimeInSeconds / 60),
      trafficDelayMinutes: Math.ceil(
        (route.summary.trafficDelayInSeconds ?? 0) / 60,
      ),
      geometry,
    };
  }
}
