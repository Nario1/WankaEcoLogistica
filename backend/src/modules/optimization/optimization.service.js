import { badRequest, conflict } from "../../shared/errors.js";
import {
  assertObject,
  requireDateTime,
  requireUuid,
} from "../../shared/validation.js";

const MAX_ORDERS = 50;
const AVERAGE_SPEED_KMH = 25;
const SERVICE_MINUTES = 5;
const MAX_ROUTE_HOURS = 8;
const OPERATION_TIME_ZONE = "America/Lima";
const SAFE_CAPACITY_FACTOR = 0.95;

export const DISPATCH_DEPOT = Object.freeze({
  name: "Local de despacho",
  latitude: -12.07201013486951,
  longitude: -75.20516872975998,
});

function minutes(time) {
  const [hours, mins] = time.split(":").map(Number);
  return hours * 60 + mins;
}

function operationMinutes(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: OPERATION_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const value = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );
  return Number(value.hour) * 60 + Number(value.minute);
}

function distanceKm(from, to) {
  const radians = (degrees) => (degrees * Math.PI) / 180;
  const latitudeDelta = radians(to.latitude - from.latitude);
  const longitudeDelta = radians(to.longitude - from.longitude);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(radians(from.latitude)) *
      Math.cos(radians(to.latitude)) *
      Math.sin(longitudeDelta / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function validateInput(input) {
  assertObject(input);
  if (
    !Array.isArray(input.orderIds) ||
    input.orderIds.length < 1 ||
    input.orderIds.length > MAX_ORDERS
  ) {
    throw badRequest("Datos inválidos", {
      orderIds: `Debe incluir entre 1 y ${MAX_ORDERS} pedidos`,
    });
  }
  const orderIds = input.orderIds.map((id) => requireUuid(id, "orderIds"));
  if (new Set(orderIds).size !== orderIds.length) {
    throw badRequest("Datos inválidos", {
      orderIds: "No debe contener duplicados",
    });
  }
  return {
    orderIds,
    routeId: requireUuid(input.routeId, "routeId"),
    startsAt: requireDateTime(input.startsAt, "startsAt"),
  };
}

export function buildOptimizedSequence(orders, startsAt, depot) {
  const pending = [...orders];
  const sequence = [];
  let current = depot;
  let elapsedMinutes = 0;
  let totalDistanceKm = 0;
  const startMinutes = operationMinutes(startsAt);

  while (pending.length) {
    const candidates = pending
      .map((order) => {
        const legDistance = distanceKm(current, order);
        const arrival =
          startMinutes +
          elapsedMinutes +
          (legDistance / AVERAGE_SPEED_KMH) * 60;
        const waiting = Math.max(0, minutes(order.windowStart) - arrival);
        const serviceStart = arrival + waiting;
        const windowStart = minutes(order.windowStart);
        const windowEnd = minutes(order.windowEnd);
        const deadline =
          order.priority === "HIGH"
            ? windowStart + (windowEnd - windowStart) / 2
            : windowEnd;
        return { order, legDistance, arrival, waiting, serviceStart, deadline };
      })
      .filter(({ serviceStart, deadline }) => serviceStart <= deadline)
      .sort((left, right) => {
        const priority =
          Number(right.order.priority === "HIGH") -
          Number(left.order.priority === "HIGH");
        return (
          priority ||
          left.order.windowEnd.localeCompare(right.order.windowEnd) ||
          left.legDistance - right.legDistance
        );
      });

    if (!candidates.length) {
      throw conflict(
        "Las ventanas horarias no permiten atender todos los pedidos seleccionados",
      );
    }
    const selected = candidates[0];
    elapsedMinutes +=
      (selected.legDistance / AVERAGE_SPEED_KMH) * 60 +
      selected.waiting +
      SERVICE_MINUTES;
    if (elapsedMinutes > MAX_ROUTE_HOURS * 60) {
      throw conflict("La ruta optimizada supera las 8 horas permitidas");
    }
    totalDistanceKm += selected.legDistance;
    sequence.push({ ...selected.order, deliveryOrder: sequence.length + 1 });
    current = selected.order;
    pending.splice(pending.indexOf(selected.order), 1);
  }
  return {
    sequence,
    distanceKm: Number(totalDistanceKm.toFixed(2)),
    elapsedMinutes,
  };
}

export class OptimizationService {
  constructor({ optimizationRepository, auditRepository }) {
    this.optimizationRepository = optimizationRepository;
    this.auditRepository = auditRepository;
  }

  async optimize(input, actorId) {
    const { orderIds, routeId, startsAt } = validateInput(input);
    const resources = await this.optimizationRepository.getResources(
      orderIds,
      routeId,
    );
    if (resources.orders.length !== orderIds.length) {
      throw conflict(
        "Todos los pedidos deben existir y encontrarse pendientes",
      );
    }
    const totalWeightKg = resources.orders.reduce(
      (sum, order) => sum + order.weightKg,
      0,
    );
    if (!resources.route) {
      throw conflict("La ruta manual seleccionada no existe");
    }
    if (resources.route.optimized || resources.route.status !== "PLANNED") {
      throw conflict("Solo se puede optimizar una ruta manual planificada");
    }
    if (resources.route.vehicleStatus !== "ACTIVE") {
      throw conflict("El vehículo de la ruta no se encuentra activo");
    }
    if (!resources.route.driverId) {
      throw conflict("Asigne un conductor a la ruta antes de optimizarla");
    }
    if (resources.route.driverStatus !== "ACTIVE") {
      throw conflict("El conductor asignado no se encuentra activo");
    }
    const usableCapacityKg = resources.route.capacityKg * SAFE_CAPACITY_FACTOR;
    if (totalWeightKg > usableCapacityKg)
      throw conflict(
        `El peso supera la capacidad operativa segura del vehículo (${usableCapacityKg.toFixed(2)} kg, equivalente al 95 % de su capacidad)`,
      );

    const optimized = buildOptimizedSequence(
      resources.orders,
      startsAt,
      DISPATCH_DEPOT,
    );
    const endsAt = new Date(
      startsAt.getTime() + optimized.elapsedMinutes * 60_000,
    );
    if (
      await this.optimizationRepository.hasDriverConflict(
        resources.route.driverId,
        startsAt,
        endsAt,
        routeId,
      )
    ) {
      throw conflict(
        "El conductor asignado tiene otra ruta durante el horario calculado",
      );
    }
    const result = await this.optimizationRepository.save({
      routeId,
      startsAt,
      endsAt,
      vehicleId: resources.route.vehicleId,
      driverId: resources.route.driverId,
      sequence: optimized.sequence,
      distanceKm: optimized.distanceKm,
      totalWeightKg,
      depot: DISPATCH_DEPOT,
    });
    await this.auditRepository.record({
      userId: actorId,
      action: "ROUTE_OPTIMIZED",
      entity: "routes",
      entityId: result.id,
      metadata: {
        orderCount: orderIds.length,
        distanceKm: optimized.distanceKm,
      },
    });
    return result;
  }
}
