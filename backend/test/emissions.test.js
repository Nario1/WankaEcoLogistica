import test from "node:test";
import assert from "node:assert/strict";
import { calculateEmissions } from "../src/modules/sustainability/emissions.service.js";

test("calcula emisiones de forma reproducible y conserva fuentes", () => {
  assert.deepEqual(
    calculateEmissions({ distanceKm: 12.5, emissionFactor: 0.21 }),
    {
      distanceKm: 12.5,
      emissionFactor: 0.21,
      emissionsKgCo2: 2.625,
      formula: "distanceKm × emissionFactor",
    },
  );
});

test("rechaza distancias y factores negativos", () => {
  assert.throws(
    () => calculateEmissions({ distanceKm: -1, emissionFactor: 0.2 }),
    { code: "VALIDATION_ERROR" },
  );
  assert.throws(
    () => calculateEmissions({ distanceKm: 1, emissionFactor: -0.2 }),
    { code: "VALIDATION_ERROR" },
  );
});
