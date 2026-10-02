import { firstRow } from "./base.js";

const columns = `vehiculo_id AS id, placa AS plate, capacidad_kg::float AS "capacityKg",
  consumo_km::float AS "consumptionPerKm", factor_emision::float AS "emissionFactor", estado AS status`;

export class PgVehicleRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async list() {
    return (
      await this.pool.query(`SELECT ${columns} FROM vehiculos ORDER BY placa`)
    ).rows;
  }

  async findById(id) {
    return firstRow(
      await this.pool.query(
        `SELECT ${columns} FROM vehiculos WHERE vehiculo_id = $1`,
        [id],
      ),
    );
  }

  async findByPlate(plate) {
    return firstRow(
      await this.pool.query(
        `SELECT ${columns} FROM vehiculos WHERE placa = $1`,
        [plate],
      ),
    );
  }

  async create(vehicle) {
    const result = await this.pool.query(
      `INSERT INTO vehiculos (placa, capacidad_kg, consumo_km, factor_emision, estado)
       VALUES ($1, $2, $3, $4, $5) RETURNING vehiculo_id`,
      [
        vehicle.plate,
        vehicle.capacityKg,
        vehicle.consumptionPerKm,
        vehicle.emissionFactor,
        vehicle.status,
      ],
    );
    return this.findById(firstRow(result).vehiculo_id);
  }

  async update(id, vehicle) {
    await this.pool.query(
      `UPDATE vehiculos SET placa = $2, capacidad_kg = $3, consumo_km = $4,
       factor_emision = $5, estado = $6, actualizado_en = NOW() WHERE vehiculo_id = $1`,
      [
        id,
        vehicle.plate,
        vehicle.capacityKg,
        vehicle.consumptionPerKm,
        vehicle.emissionFactor,
        vehicle.status,
      ],
    );
    return this.findById(id);
  }
}
