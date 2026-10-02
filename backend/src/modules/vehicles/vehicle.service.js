import { conflict, notFound } from "../../shared/errors.js";
import { requireUuid } from "../../shared/validation.js";
import {
  validateVehicle,
  validateVehicleUpdate,
} from "./vehicle.validation.js";

export class VehicleService {
  constructor({ vehicleRepository, auditRepository }) {
    this.vehicleRepository = vehicleRepository;
    this.auditRepository = auditRepository;
  }

  list() {
    return this.vehicleRepository.list();
  }

  async create(input, actorId) {
    const vehicleInput = validateVehicle(input);
    if (await this.vehicleRepository.findByPlate(vehicleInput.plate)) {
      throw conflict("La placa ya se encuentra registrada");
    }
    const vehicle = await this.vehicleRepository.create(vehicleInput);
    await this.auditRepository.record({
      userId: actorId,
      action: "VEHICLE_CREATED",
      entity: "vehicles",
      entityId: vehicle.id,
    });
    return vehicle;
  }

  async update(id, input, actorId) {
    requireUuid(id);
    validateVehicleUpdate(input);
    const current = await this.vehicleRepository.findById(id);
    if (!current) throw notFound("Vehículo");
    const vehicleInput = validateVehicle({ ...current, ...input });
    const duplicate = await this.vehicleRepository.findByPlate(
      vehicleInput.plate,
    );
    if (duplicate && duplicate.id !== id)
      throw conflict("La placa ya se encuentra registrada");
    const vehicle = await this.vehicleRepository.update(id, vehicleInput);
    await this.auditRepository.record({
      userId: actorId,
      action: "VEHICLE_UPDATED",
      entity: "vehicles",
      entityId: id,
    });
    return vehicle;
  }
}
