import { requireNumber } from "../../shared/validation.js";

export function calculateEmissions(input) {
  const distanceKm = requireNumber(input?.distanceKm, "distanceKm", {
    min: 0,
    max: 1_000_000,
  });
  const emissionFactor = requireNumber(
    input?.emissionFactor,
    "emissionFactor",
    { min: 0, max: 10_000 },
  );
  return {
    distanceKm,
    emissionFactor,
    emissionsKgCo2: Number((distanceKm * emissionFactor).toFixed(4)),
    formula: "distanceKm × emissionFactor",
  };
}
