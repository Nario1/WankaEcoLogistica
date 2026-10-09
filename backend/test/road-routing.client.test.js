import test from "node:test";
import assert from "node:assert/strict";
import { RoadRoutingClient } from "../src/infrastructure/routing/road-routing.client.js";

const points = [
  { latitude: -12.072, longitude: -75.205 },
  { latitude: -12.063, longitude: -75.206 },
];

test("transforma la geometría OSRM de longitud/latitud al formato del mapa", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    assert.match(String(url), /route\/v1\/driving/);
    return new globalThis.Response(
      JSON.stringify({
        routes: [
          {
            distance: 1500,
            duration: 360,
            geometry: {
              coordinates: [
                [-75.205, -12.072],
                [-75.206, -12.063],
              ],
            },
          },
        ],
      }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
  };
  try {
    const result = await new RoadRoutingClient({
      osrmBaseUrl: "https://router.example.test",
    }).calculate(points, new Date());
    assert.equal(result.provider, "OSRM / OpenStreetMap");
    assert.equal(result.trafficConsidered, false);
    assert.equal(result.distanceKm, 1.5);
    assert.equal(result.durationMinutes, 6);
    assert.deepEqual(result.geometry[0], [-12.072, -75.205]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("usa tráfico TomTom cuando existe una clave configurada", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    assert.match(String(url), /traffic=true/);
    return new globalThis.Response(
      JSON.stringify({
        routes: [
          {
            summary: {
              lengthInMeters: 2200,
              travelTimeInSeconds: 600,
              trafficDelayInSeconds: 120,
            },
            legs: [
              {
                points: [
                  { latitude: -12.072, longitude: -75.205 },
                  { latitude: -12.063, longitude: -75.206 },
                ],
              },
            ],
          },
        ],
      }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
  };
  try {
    const result = await new RoadRoutingClient({
      osrmBaseUrl: "https://router.example.test",
      tomtomApiKey: "test-key",
    }).calculate(points, "2026-10-08T13:00:00Z");
    assert.equal(result.provider, "TomTom Traffic");
    assert.equal(result.trafficConsidered, true);
    assert.equal(result.trafficDelayMinutes, 2);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
