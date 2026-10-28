import bcrypt from "bcryptjs";
import { badRequest, conflict, notFound } from "../../shared/errors.js";
import {
  assertObject,
  requireEmail,
  requirePassword,
  requirePersonName,
  requireUuid,
  requireEnum,
} from "../../shared/validation.js";

export class DriverService {
  constructor({ userRepository, auditRepository }) {
    this.userRepository = userRepository;
    this.auditRepository = auditRepository;
  }

  async list() {
    const drivers = await this.userRepository.listDrivers();
    return drivers.map((driver) => this.toPublicDriver(driver));
  }

  async create(input, actorId) {
    assertObject(input);
    const email = requireEmail(input.email);
    const name = requireString(input.name, "name", { min: 3, max: 120 });
    const password = requireString(input.password, "password", {
      min: 12,
      max: 128,
    });
    if (await this.userRepository.findByEmail(email))
      throw conflict("El correo ya se encuentra registrado");
    const passwordHash = await bcrypt.hash(password, 12);
    const driver = await this.userRepository.createDriver({
      email,
      name,
      passwordHash,
    });
    await this.auditRepository.record({
      userId: actorId,
      action: "DRIVER_CREATED",
      entity: "users",
      entityId: driver.id,
    });
    return this.toPublicDriver(driver);
  }

  async get(id) {
    requireUuid(id);
    const driver = await this.userRepository.findById(id);
    if (!driver || driver.role !== "DRIVER") throw notFound("Conductor");
    return this.toPublicDriver(driver);
  }

  async update(id, input, actorId) {
    requireUuid(id);
    assertObject(input);
    const allowed = ["name", "email", "password", "status"];
    const unknown = Object.keys(input).filter((key) => !allowed.includes(key));
    if (unknown.length || !Object.keys(input).length) {
      throw badRequest("Datos inválidos", {
        unknown: unknown.length
          ? `Campos no permitidos: ${unknown.join(", ")}`
          : "Debe enviar al menos un campo",
      });
    }
    if (input.name !== undefined) changes.name = requirePersonName(input.name);
    if (input.email !== undefined) {
      changes.email = requireEmail(input.email);
      const duplicate = await this.userRepository.findByEmail(changes.email);
      if (duplicate && duplicate.id !== id)
        throw conflict("El correo ya se encuentra registrado");
    }
    if (input.status !== undefined)
      changes.status = requireEnum(input.status, "status", [
        "ACTIVE",
        "INACTIVE",
      ]);
    if (input.password)
      changes.passwordHash = await bcrypt.hash(
        requirePassword(input.password),
    if (input.password)
      changes.passwordHash = await bcrypt.hash(
        requireString(input.password, "password", { min: 12, max: 128 }),
        12,
      );
    const driver = await this.userRepository.updateDriver(id, changes);
    await this.auditRepository.record({
      userId: actorId,
      action: "DRIVER_UPDATED",
      entity: "users",
      entityId: id,
    });
    return this.toPublicDriver(driver);
  }

  async remove(id, actorId) {
    await this.get(id);
    const driver = await this.userRepository.updateDriver(id, {
      status: "INACTIVE",
    });
    await this.auditRepository.record({
      userId: actorId,
      action: "DRIVER_DEACTIVATED",
      entity: "users",
      entityId: id,
    });
    return this.toPublicDriver(driver);
  }

  toPublicDriver(driver) {
    return {
      id: driver.id,
      email: driver.email,
      name: driver.name,
      role: driver.role,
      status: driver.status,
    };
  }
}
