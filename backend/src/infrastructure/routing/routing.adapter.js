import { OsrmRoutingProvider } from "./osrm.provider.js";
import { StubRoutingProvider } from "./stub.provider.js";
import { TomtomRoutingProvider } from "./tomtom.provider.js";

/**
 * Adaptador cartográfico: el dominio solo habla con calculate().
 * El proveedor concreto (OSRM, TomTom o stub) se intercambia por configuración.
 */
export class RoutingAdapter {
  constructor(provider) {
    if (!provider || typeof provider.calculate !== "function") {
      throw new Error("El adaptador requiere un proveedor con calculate()");
    }
    this.provider = provider;
  }

  get providerName() {
    return this.provider.name ?? "desconocido";
  }

  calculate(points, departureTime) {
    return this.provider.calculate(points, departureTime);
  }
}

export function resolveRoutingProviderName({
  routingProvider,
  tomtomApiKey,
} = {}) {
  const explicit = String(routingProvider ?? "")
    .trim()
    .toLowerCase();
  if (explicit === "stub" || explicit === "osrm" || explicit === "tomtom") {
    return explicit;
  }
  return tomtomApiKey ? "tomtom" : "osrm";
}

export function createRoutingProvider(config = {}) {
  const name = resolveRoutingProviderName(config);
  switch (name) {
    case "stub":
      return new StubRoutingProvider();
    case "tomtom":
      return new TomtomRoutingProvider({
        tomtomApiKey: config.tomtomApiKey,
      });
    case "osrm":
    default:
      return new OsrmRoutingProvider({
        osrmBaseUrl: config.osrmBaseUrl ?? "https://router.project-osrm.org",
      });
  }
}

export function createRoutingAdapter(config = {}) {
  return new RoutingAdapter(createRoutingProvider(config));
}
