import { firstRow } from "./base.js";

const columns = `r.ruta_id AS id, r.conductor_id AS "driverId", r.vehiculo_id AS "vehicleId",
  r.inicio AS "startsAt", r.fin AS "endsAt", r.estado AS status,
  u.nombre AS "driverName", v.placa AS "vehiclePlate"`;

export class PgRouteRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async list() {
    return (
      await this.pool.query(
        `SELECT ${columns} FROM rutas r
       LEFT JOIN usuarios u ON u.usuario_id = r.conductor_id
       JOIN vehiculos v ON v.vehiculo_id = r.vehiculo_id ORDER BY r.inicio DESC`,
      )
    ).rows;
  }

  async findById(id) {
    return firstRow(
      await this.pool.query(
        `SELECT ${columns} FROM rutas r
       LEFT JOIN usuarios u ON u.usuario_id = r.conductor_id
       JOIN vehiculos v ON v.vehiculo_id = r.vehiculo_id WHERE r.ruta_id = $1`,
        [id],
      ),
    );
  }

  async create({ vehicleId, startsAt, endsAt }) {
    const result = await this.pool.query(
      `INSERT INTO rutas (vehiculo_id, inicio, fin) VALUES ($1, $2, $3) RETURNING ruta_id`,
      [vehicleId, startsAt, endsAt],
    );
    return this.findById(firstRow(result).ruta_id);
  }

  async hasDriverConflict(driverId, startsAt, endsAt, excludedRouteId) {
    const result = await this.pool.query(
      `SELECT EXISTS (
        SELECT 1 FROM rutas WHERE conductor_id = $1 AND ruta_id <> $4
        AND estado <> 'CANCELLED' AND inicio < $3 AND fin > $2
      ) AS conflict`,
      [driverId, startsAt, endsAt, excludedRouteId],
    );
    return result.rows[0].conflict;
  }

  async assignDriver(routeId, driverId) {
    await this.pool.query(
      "UPDATE rutas SET conductor_id = $2, actualizado_en = NOW() WHERE ruta_id = $1",
      [routeId, driverId],
    );
    return this.findById(routeId);
  }
}
