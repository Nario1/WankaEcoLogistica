import { firstRow } from "./base.js";

export class PgOptimizationRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async getResources(orderIds, startsAt) {
    const endsAt = new Date(startsAt.getTime() + 8 * 3_600_000);
    const [orders, vehicles, drivers, depot] = await Promise.all([
      this.pool.query(
        `SELECT pedido_id AS id, direccion AS address, ST_Y(coordenadas) AS latitude,
          ST_X(coordenadas) AS longitude, peso_kg::float AS "weightKg", prioridad AS priority,
          to_char(ventana_inicio, 'HH24:MI') AS "windowStart",
          to_char(ventana_fin, 'HH24:MI') AS "windowEnd"
         FROM pedidos WHERE pedido_id = ANY($1::uuid[]) AND estado = 'PENDING' AND ruta_id IS NULL`,
        [orderIds],
      ),
      this.pool.query(
        `SELECT vehiculo_id AS id, capacidad_kg::float AS "capacityKg"
         FROM vehiculos WHERE estado = 'ACTIVE' ORDER BY capacidad_kg, placa`,
      ),
      this.pool.query(
        `SELECT u.usuario_id AS id FROM usuarios u WHERE u.rol = 'DRIVER' AND u.estado = 'ACTIVE'
         AND NOT EXISTS (SELECT 1 FROM rutas r WHERE r.conductor_id = u.usuario_id
           AND r.estado <> 'CANCELLED' AND r.inicio < $2 AND r.fin > $1)
         ORDER BY u.nombre`,
        [startsAt, endsAt],
      ),
      this.pool.query(
        `SELECT COALESCE(AVG(ST_Y(coordenadas)), -12.0651) AS latitude,
          COALESCE(AVG(ST_X(coordenadas)), -75.2049) AS longitude FROM pedidos WHERE pedido_id = ANY($1::uuid[])`,
        [orderIds],
      ),
    ]);
    return {
      orders: orders.rows,
      vehicles: vehicles.rows,
      drivers: drivers.rows,
      depot: firstRow(depot),
    };
  }

  async save({
    startsAt,
    endsAt,
    vehicleId,
    driverId,
    sequence,
    distanceKm,
    totalWeightKg,
  }) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const route = firstRow(
        await client.query(
          `INSERT INTO rutas (vehiculo_id, conductor_id, inicio, fin, distancia_km, peso_total_kg, optimizada)
           VALUES ($1, $2, $3, $4, $5, $6, TRUE) RETURNING ruta_id AS id`,
          [vehicleId, driverId, startsAt, endsAt, distanceKm, totalWeightKg],
        ),
      );
      for (const order of sequence) {
        await client.query(
          `UPDATE pedidos SET ruta_id = $2, orden_entrega = $3, estado = 'PLANNED', actualizado_en = NOW()
           WHERE pedido_id = $1 AND ruta_id IS NULL`,
          [order.id, route.id, order.deliveryOrder],
        );
      }
      await client.query("COMMIT");
      return {
        ...route,
        vehicleId,
        driverId,
        startsAt,
        endsAt,
        distanceKm,
        totalWeightKg,
        orders: sequence,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
