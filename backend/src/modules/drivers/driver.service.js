import bcrypt from "bcryptjs";
import { conflict } from "../../shared/errors.js";
import {
  assertObject,
  requireEmail,
  requireString,
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
