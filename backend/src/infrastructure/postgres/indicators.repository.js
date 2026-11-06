export class PgIndicatorsRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async listRoutesInPeriod(from, to) {
    return (
      await this.pool.query(
        `SELECT r.ruta_id AS id,
          r.inicio AS "startsAt",
          r.fin AS "endsAt",
          r.estado AS status,
          r.distancia_km::float AS "distanceKm",
          r.distancia_base_km::float AS "baselineDistanceKm",
          r.emisiones_co2::float AS "emissionsKgCo2",
          r.optimizada AS optimized,
          v.placa AS "vehiclePlate",
          v.factor_emision::float AS "emissionFactor"
         FROM rutas r
         JOIN vehiculos v ON v.vehiculo_id = r.vehiculo_id
         WHERE r.estado <> 'CANCELLED'
           AND r.inicio >= $1
           AND r.inicio <= $2
         ORDER BY r.inicio ASC`,
        [from, to],
      )
    ).rows;
  }

  async listOrdersInPeriod(from, to) {
    return (
      await this.pool.query(
        `SELECT p.pedido_id AS id,
          p.ruta_id AS "routeId",
          p.nombre_producto AS "productName",
          p.direccion AS address,
          p.estado AS status,
          p.orden_entrega AS "deliveryOrder",
          r.estado AS "routeStatus"
         FROM pedidos p
         JOIN rutas r ON r.ruta_id = p.ruta_id
         WHERE r.estado <> 'CANCELLED'
           AND p.estado <> 'CANCELLED'
           AND r.inicio >= $1
           AND r.inicio <= $2
         ORDER BY r.inicio ASC, p.orden_entrega ASC NULLS LAST`,
        [from, to],
      )
    ).rows;
  }
}
