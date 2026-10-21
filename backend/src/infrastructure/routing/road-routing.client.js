import { createRoutingAdapter } from "./routing.adapter.js";

/**
 * Fachada compatible con RouteService.
 * Delega en el adaptador cartográfico para no acoplar el dominio al proveedor.
 */
export class RoadRoutingClient {
  constructor(config = {}) {
    this.adapter = createRoutingAdapter(config);
  }

  get providerName() {
    return this.adapter.providerName;
  }

  calculate(points, departureTime) {
    return this.adapter.calculate(points, departureTime);
  }
}

export {
  createRoutingAdapter,
  createRoutingProvider,
  resolveRoutingProviderName,
  RoutingAdapter,
} from "./routing.adapter.js";
export { OsrmRoutingProvider } from "./osrm.provider.js";
export { StubRoutingProvider } from "./stub.provider.js";
export { TomtomRoutingProvider } from "./tomtom.provider.js";
