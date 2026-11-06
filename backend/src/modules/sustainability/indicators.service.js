import { badRequest } from "../../shared/errors.js";
import { requireDateTime } from "../../shared/validation.js";
import { calculateEmissions } from "./emissions.service.js";

/** Factor de referencia para sierra central peruana (RN-005), kg CO₂/km. */
export const SIERRA_CENTRAL_EMISSION_FACTOR = 0.21;

export const MAX_INDICATOR_RANGE_DAYS = 93;

function round(value, digits = 2) {
  return Number(Number(value).toFixed(digits));
}

export function parsePeriod(query) {
  const from = requireDateTime(query?.from, "from");
  const to = requireDateTime(query?.to, "to");
  if (to.getTime() < from.getTime()) {
    throw badRequest("Datos inválidos", {
      to: "Debe ser posterior o igual a from",
    });
  }
  const rangeDays = (to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000);
  if (rangeDays > MAX_INDICATOR_RANGE_DAYS) {
    throw badRequest(
      `El rango no puede superar ${MAX_INDICATOR_RANGE_DAYS} días; acote la consulta`,
      {
        from: `Máximo ${MAX_INDICATOR_RANGE_DAYS} días`,
        to: `Máximo ${MAX_INDICATOR_RANGE_DAYS} días`,
      },
    );
  }
  return { from, to };
}

export function consolidateIndicators(routes, orders, { from, to }) {
  if (!routes.length) {
    return {
      hasData: false,
      period: { from: from.toISOString(), to: to.toISOString() },
      message:
        "No hay operaciones registradas en el periodo seleccionado; no se generaron indicadores.",
    };
  }

  let optimizedDistanceKm = 0;
  let baselineDistanceKm = 0;
  let routesWithBaseline = 0;
  let emissionsKgCo2 = 0;
  let emissionFactorSum = 0;
  let emissionFactorWeight = 0;

  for (const route of routes) {
    const distance = Number(route.distanceKm) || 0;
    const factor =
      Number(route.emissionFactor) > 0
        ? Number(route.emissionFactor)
        : SIERRA_CENTRAL_EMISSION_FACTOR;
    const storedEmissions = Number(route.emissionsKgCo2);
    const emissions = Number.isFinite(storedEmissions)
      ? storedEmissions
      : calculateEmissions({
          distanceKm: distance,
          emissionFactor: factor,
        }).emissionsKgCo2;

    optimizedDistanceKm += distance;
    emissionsKgCo2 += emissions;
    emissionFactorSum += factor * distance;
    emissionFactorWeight += distance;

    if (Number.isFinite(Number(route.baselineDistanceKm))) {
      baselineDistanceKm += Number(route.baselineDistanceKm);
      routesWithBaseline += 1;
    }
  }

  const distanceSavedKm =
    routesWithBaseline > 0
      ? Math.max(0, baselineDistanceKm - optimizedDistanceKm)
      : 0;
  const distanceSavedPercent =
    routesWithBaseline > 0 && baselineDistanceKm > 0
      ? round((distanceSavedKm / baselineDistanceKm) * 100)
      : null;

  const totalOrders = orders.length;
  const completedOrders = orders.filter(
    (order) => order.routeStatus === "COMPLETED",
  ).length;
  const serviceLevelPercent =
    totalOrders > 0 ? round((completedOrders / totalOrders) * 100) : null;

  const emissionFactorUsed =
    emissionFactorWeight > 0
      ? round(emissionFactorSum / emissionFactorWeight, 4)
      : SIERRA_CENTRAL_EMISSION_FACTOR;

  return {
    hasData: true,
    period: { from: from.toISOString(), to: to.toISOString() },
    routeCount: routes.length,
    orderCount: totalOrders,
    co2: {
      emissionsKgCo2: round(emissionsKgCo2, 4),
      emissionFactorUsed,
      formula: "distanceKm × emissionFactor",
      referenceFactor: SIERRA_CENTRAL_EMISSION_FACTOR,
      reference: "sierra-central",
    },
    distance: {
      optimizedKm: round(optimizedDistanceKm),
      baselineKm:
        routesWithBaseline > 0 ? round(baselineDistanceKm) : null,
      savedKm: routesWithBaseline > 0 ? round(distanceSavedKm) : null,
      savedPercent: distanceSavedPercent,
    },
    serviceLevel: {
      percent: serviceLevelPercent,
      completedOrders,
      totalOrders,
    },
  };
}

export class IndicatorsService {
  constructor({ indicatorsRepository }) {
    this.indicatorsRepository = indicatorsRepository;
  }

  async getForPeriod(query) {
    const period = parsePeriod(query);
    const [routes, orders] = await Promise.all([
      this.indicatorsRepository.listRoutesInPeriod(period.from, period.to),
      this.indicatorsRepository.listOrdersInPeriod(period.from, period.to),
    ]);
    return consolidateIndicators(routes, orders, period);
  }
}
