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
    throw badRequest("Datos invÃ¡lidos", {
      orderIds: `Debe incluir entre 1 y ${MAX_ORDERS} pedidos`,
    });
  }
  const orderIds = input.orderIds.map((id) => requireUuid(id, "orderIds"));
  if (new Set(orderIds).size !== orderIds.length) {
    throw badRequest("Datos invÃ¡lidos", {
      orderIds: "No debe contener duplicados",
    });
  }
  return { orderIds, startsAt: requireDateTime(input.startsAt, "startsAt") };
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
        return { order, legDistance, arrival, waiting };
      })
      .filter(({ order, arrival }) => arrival <= minutes(order.windowEnd))
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
    const { orderIds, startsAt } = validateInput(input);
    const resources = await this.optimizationRepository.getResources(
      orderIds,
      startsAt,
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
    const vehicle = resources.vehicles.find(
      (item) => item.capacityKg >= totalWeightKg,
    );
    if (!vehicle)
      throw conflict(
        "La capacidad disponible es insuficiente para los pedidos seleccionados",
      );
    if (!resources.drivers.length)
      throw conflict(
        "No existe un conductor disponible para el horario solicitado",
      );

    const optimized = buildOptimizedSequence(
      resources.orders,
      startsAt,
      resources.depot,
    );
    const endsAt = new Date(
      startsAt.getTime() + optimized.elapsedMinutes * 60_000,
    );
    const result = await this.optimizationRepository.save({
      startsAt,
      endsAt,
      vehicleId: vehicle.id,
      driverId: resources.drivers[0].id,
      sequence: optimized.sequence,
      distanceKm: optimized.distanceKm,
      totalWeightKg,
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
