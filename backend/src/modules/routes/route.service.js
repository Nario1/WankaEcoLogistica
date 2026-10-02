import { badRequest, conflict, notFound } from "../../shared/errors.js";
import {
  assertObject,
  requireDateTime,
  requireUuid,
} from "../../shared/validation.js";

const MAX_DRIVING_HOURS = 8;

export class RouteService {
  constructor({
    routeRepository,
    userRepository,
    vehicleRepository,
    auditRepository,
  }) {
    this.routeRepository = routeRepository;
    this.userRepository = userRepository;
    this.vehicleRepository = vehicleRepository;
    this.auditRepository = auditRepository;
  }

  list() {
    return this.routeRepository.list();
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
