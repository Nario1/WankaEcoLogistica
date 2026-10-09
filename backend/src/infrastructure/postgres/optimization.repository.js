import { firstRow } from "./base.js";
import { conflict } from "../../shared/errors.js";

export class PgOptimizationRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async getResources(orderIds, routeId) {
    const [orders, route] = await Promise.all([
      this.pool.query(
        `SELECT pedido_id AS id, direccion AS address, ST_Y(coordenadas) AS latitude,
          ST_X(coordenadas) AS longitude, peso_kg::float AS "weightKg", prioridad AS priority,
          to_char(ventana_inicio, 'HH24:MI') AS "windowStart",
          to_char(ventana_fin, 'HH24:MI') AS "windowEnd"
         FROM pedidos WHERE pedido_id = ANY($1::uuid[]) AND estado = 'PENDING' AND ruta_id IS NULL`,
        [orderIds],
      ),
      this.pool.query(
        `SELECT r.ruta_id AS id, r.vehiculo_id AS "vehicleId",
          r.conductor_id AS "driverId", r.inicio AS "startsAt",
          r.estado AS status, r.optimizada AS optimized,
          v.capacidad_kg::float AS "capacityKg", v.estado AS "vehicleStatus",
          u.estado AS "driverStatus"
         FROM rutas r
         JOIN vehiculos v ON v.vehiculo_id = r.vehiculo_id
         LEFT JOIN usuarios u ON u.usuario_id = r.conductor_id
         WHERE r.ruta_id = $1`,
        [routeId],
      ),
    ]);
    return {
      orders: orders.rows,
      route: firstRow(route),
    };
  }

  async hasDriverConflict(driverId, startsAt, endsAt, routeId) {
    const result = await this.pool.query(
      `SELECT EXISTS (
        SELECT 1 FROM rutas WHERE conductor_id = $1 AND ruta_id <> $4
        AND estado <> 'CANCELLED' AND inicio < $3 AND fin > $2
      ) AS conflict`,
      [driverId, startsAt, endsAt, routeId],
    );
    return result.rows[0].conflict;
  }

  async save({
    routeId,
    startsAt,
    endsAt,
    vehicleId,
    driverId,
    sequence,
    distanceKm,
    totalWeightKg,
    depot,
  }) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const routeUpdate = await client.query(
        `UPDATE rutas SET inicio = $2, fin = $3, distancia_km = $4, peso_total_kg = $5,
          optimizada = TRUE, actualizado_en = NOW()
         WHERE ruta_id = $1 AND estado = 'PLANNED' AND optimizada = FALSE
         RETURNING ruta_id AS id`,
        [routeId, startsAt, endsAt, distanceKm, totalWeightKg],
      );
      if (routeUpdate.rowCount !== 1) {
        throw conflict("La ruta ya no está disponible para optimizar");
      }
      const route = firstRow(routeUpdate);
      for (const order of sequence) {
        const orderUpdate = await client.query(
          `UPDATE pedidos SET ruta_id = $2, orden_entrega = $3, estado = 'PLANNED', actualizado_en = NOW()
           WHERE pedido_id = $1 AND ruta_id IS NULL AND estado = 'PENDING'`,
          [order.id, route.id, order.deliveryOrder],
        );
        if (orderUpdate.rowCount !== 1) {
          throw conflict(
            "Uno de los pedidos ya no está disponible; no se realizó ninguna asignación",
          );
        }
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
        depot,
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
