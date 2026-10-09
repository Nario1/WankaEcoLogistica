import { serviceUnavailable } from "../../shared/errors.js";

const REQUEST_TIMEOUT_MS = 15_000;

async function requestJson(url) {
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

export class RoadRoutingClient {
  constructor({ osrmBaseUrl, tomtomApiKey }) {
    this.osrmBaseUrl = osrmBaseUrl.replace(/\/$/, "");
    this.tomtomApiKey = tomtomApiKey;
  }

  async calculate(points, departureTime) {
    return this.tomtomApiKey
      ? this.calculateWithTraffic(points, departureTime)
      : this.calculateWithOsrm(points);
  }

  async calculateWithOsrm(points) {
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
      provider: "OSRM / OpenStreetMap",
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

  async calculateWithTraffic(points, departureTime) {
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
      provider: "TomTom Traffic",
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
