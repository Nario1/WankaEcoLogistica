import { badRequest, conflict, forbidden, notFound } from "../../shared/errors.js";
import {
  assertObject,
  requireDateTime,
  requireEnum,
  requireUuid,
} from "../../shared/validation.js";
import { DISPATCH_DEPOT } from "../optimization/optimization.service.js";

const MAX_DRIVING_HOURS = 8;

export class RouteService {
  constructor({
    routeRepository,
    userRepository,
    vehicleRepository,
    auditRepository,
    roadRoutingClient,
  }) {
    this.routeRepository = routeRepository;
    this.userRepository = userRepository;
    this.vehicleRepository = vehicleRepository;
    this.auditRepository = auditRepository;
    this.roadRoutingClient = roadRoutingClient;
  }

  list() {
    return this.routeRepository.list();
  }

  listMine(driverId) {
    requireUuid(driverId);
    return this.routeRepository.listByDriver(driverId);
  }

  async get(id, actor = null) {
    requireUuid(id);
    const route = await this.routeRepository.findById(id);
    if (!route) throw notFound("Ruta");
    this.assertRouteAccess(route, actor);
    return route;
  }

  async listStops(routeId, actor = null) {
    requireUuid(routeId);
    const route = await this.routeRepository.findById(routeId);
    if (!route) throw notFound("Ruta");
    this.assertRouteAccess(route, actor);
    return this.routeRepository.listStops(routeId);
  }

  async getNavigation(routeId, actor = null) {
    requireUuid(routeId);
    const route = await this.routeRepository.findById(routeId);
    if (!route) throw notFound("Ruta");
    this.assertRouteAccess(route, actor);
    const stops = await this.routeRepository.listStops(routeId);
    if (!route.optimized || !stops.length) {
      throw conflict("La ruta todavía no tiene paradas optimizadas");
    }
    return this.roadRoutingClient.calculate(
      [DISPATCH_DEPOT, ...stops],
      route.startsAt,
    );
  }

  assertRouteAccess(route, actor) {
    if (!actor || actor.role !== "DRIVER") return;
    if (route.driverId !== actor.id) {
      throw forbidden();
    }
  }

  async create(input, actorId) {
    assertObject(input);
    const vehicleId = requireUuid(input.vehicleId, "vehicleId");
    const startsAt = requireDateTime(input.startsAt, "startsAt");
    const endsAt = requireDateTime(input.endsAt, "endsAt");
    this.assertDuration(startsAt, endsAt);
    const vehicle = await this.vehicleRepository.findById(vehicleId);
    if (!vehicle) throw notFound("Vehículo");
    if (vehicle.status !== "ACTIVE")
      throw conflict("El vehículo está fuera de servicio");
    const route = await this.routeRepository.create({
      vehicleId,
      startsAt,
      endsAt,
    });
    await this.auditRepository.record({
      userId: actorId,
      action: "ROUTE_CREATED",
      entity: "routes",
      entityId: route.id,
    });
    return route;
  }

  async update(id, input, actorId) {
    const current = await this.get(id);
    assertObject(input);
    const allowed = ["vehicleId", "startsAt", "endsAt", "status"];
    const unknown = Object.keys(input).filter((key) => !allowed.includes(key));
    if (unknown.length || !Object.keys(input).length) {
      throw badRequest("Datos inválidos", {
        unknown: unknown.length
          ? `Campos no permitidos: ${unknown.join(", ")}`
          : "Debe enviar al menos un campo",
      });
    }
    const vehicleId = input.vehicleId
      ? requireUuid(input.vehicleId, "vehicleId")
      : current.vehicleId;
    const startsAt = input.startsAt
      ? requireDateTime(input.startsAt, "startsAt")
      : new Date(current.startsAt);
    const endsAt = input.endsAt
      ? requireDateTime(input.endsAt, "endsAt")
      : new Date(current.endsAt);
    const status = input.status
      ? requireEnum(input.status, "status", [
          "PLANNED",
          "IN_PROGRESS",
          "COMPLETED",
          "CANCELLED",
        ])
      : current.status;
    this.assertDuration(startsAt, endsAt);
    const vehicle = await this.vehicleRepository.findById(vehicleId);
    if (!vehicle) throw notFound("Vehículo");
    if (vehicle.status !== "ACTIVE" && vehicleId !== current.vehicleId)
      throw conflict("El vehículo está fuera de servicio");
    const route = await this.routeRepository.update(id, {
      vehicleId,
      startsAt,
      endsAt,
      status,
    });
    await this.auditRepository.record({
      userId: actorId,
      action: "ROUTE_UPDATED",
      entity: "routes",
      entityId: id,
    });
    return route;
  }

  async remove(id, actorId) {
    const route = await this.get(id);
    if (route.status === "COMPLETED")
      throw conflict("Una ruta completada no puede cancelarse");
    const cancelled = await this.routeRepository.remove(id);
    await this.auditRepository.record({
      userId: actorId,
      action: "ROUTE_CANCELLED",
      entity: "routes",
      entityId: id,
    });
    return cancelled;
  }

  async assignDriver(routeId, driverId, actorId) {
    requireUuid(routeId);
    requireUuid(driverId, "driverId");
    const route = await this.routeRepository.findById(routeId);
    if (!route) throw notFound("Ruta");
    this.assertDuration(new Date(route.startsAt), new Date(route.endsAt));
    const driver = await this.userRepository.findById(driverId);
    if (!driver || driver.role !== "DRIVER") throw notFound("Conductor");
    if (driver.status !== "ACTIVE")
      throw conflict("El conductor no está disponible");
    if (
      await this.routeRepository.hasDriverConflict(
        driverId,
        route.startsAt,
        route.endsAt,
        routeId,
      )
    ) {
      throw conflict("El conductor tiene otra ruta en el mismo horario");
    }
    const assigned = await this.routeRepository.assignDriver(routeId, driverId);
    await this.auditRepository.record({
      userId: actorId,
      action: route.driverId
        ? "ROUTE_DRIVER_REASSIGNED"
        : "ROUTE_DRIVER_ASSIGNED",
      entity: "routes",
      entityId: routeId,
      metadata: { driverId },
    });
    return assigned;
  }

  assertDuration(startsAt, endsAt) {
    const durationHours = (endsAt.getTime() - startsAt.getTime()) / 3_600_000;
    if (durationHours <= 0)
      throw badRequest("La fecha final debe ser posterior a la inicial");
    if (durationHours > MAX_DRIVING_HOURS) {
      throw conflict("La ruta supera las 8 horas permitidas sin descanso");
    }
  }
}
