import test from "node:test";
import assert from "node:assert/strict";
import {
  createRoutingAdapter,
  resolveRoutingProviderName,
  StubRoutingProvider,
} from "../src/infrastructure/routing/road-routing.client.js";

const points = [
  { latitude: -12.072, longitude: -75.205 },
  { latitude: -12.063, longitude: -75.206 },
];

test("resuelve el proveedor stub, osrm o tomtom según configuración", () => {
  assert.equal(resolveRoutingProviderName({ routingProvider: "stub" }), "stub");
  assert.equal(resolveRoutingProviderName({ routingProvider: "OSRM" }), "osrm");
  assert.equal(
    resolveRoutingProviderName({ tomtomApiKey: "clave" }),
    "tomtom",
  );
  assert.equal(resolveRoutingProviderName({}), "osrm");
});

test("sustituye el proveedor real por stub sin cambiar el contrato calculate()", async () => {
  const adapter = createRoutingAdapter({ routingProvider: "stub" });
  const result = await adapter.calculate(points, new Date());
  assert.equal(result.provider, "Stub / pruebas");
  assert.equal(result.trafficConsidered, false);
  assert.equal(result.geometry.length, 2);
  assert.deepEqual(result.geometry[0], [-12.072, -75.205]);
  assert.ok(result.distanceKm >= 0);
  assert.ok(result.durationMinutes >= 1);
});

test("permite inyectar un proveedor alternativo en el adaptador", async () => {
  const adapter = createRoutingAdapter({});
  adapter.provider = new StubRoutingProvider({ label: "Proveedor staging" });
  const result = await adapter.calculate(points);
  assert.equal(result.provider, "Proveedor staging");
});
