import { firstRow } from "./base.js";

const selectColumns = `
  pedido_id AS id, nombre_producto AS "productName", direccion AS address,
  ST_Y(coordenadas) AS latitude, ST_X(coordenadas) AS longitude,
  peso_kg::float AS "weightKg", prioridad AS priority,
  to_char(ventana_inicio, 'HH24:MI') AS "windowStart",
  to_char(ventana_fin, 'HH24:MI') AS "windowEnd", estado AS status`;

export class PgOrderRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async list() {
    const result = await this.pool.query(
      `SELECT ${selectColumns} FROM pedidos ORDER BY creado_en DESC`,
    );
    return result.rows;
  }

  async findById(id) {
    const result = await this.pool.query(
      `SELECT ${selectColumns} FROM pedidos WHERE pedido_id = $1`,
      [id],
    );
    return firstRow(result);
  }

  async create(order) {
    const result = await this.pool.query(
      `INSERT INTO pedidos
        (nombre_producto, direccion, coordenadas, peso_kg, prioridad, ventana_inicio, ventana_fin)
       VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326), $5, $6, $7, $8)
       RETURNING pedido_id`,
      [
        order.productName,
        order.address,
        order.longitude,
        order.latitude,
        order.weightKg,
        order.priority,
        order.windowStart,
        order.windowEnd,
      ],
    );
    return this.findById(firstRow(result).pedido_id);
  }

  async update(id, order) {
    await this.pool.query(
      `UPDATE pedidos SET nombre_producto = $2, direccion = $3,
        coordenadas = ST_SetSRID(ST_MakePoint($4, $5), 4326), peso_kg = $6,
        prioridad = $7, ventana_inicio = $8, ventana_fin = $9, actualizado_en = NOW()
       WHERE pedido_id = $1`,
      [
        id,
        order.productName,
        order.address,
        order.longitude,
        order.latitude,
        order.weightKg,
        order.priority,
        order.windowStart,
        order.windowEnd,
      ],
    );
    return this.findById(id);
  }

  async remove(id) {
    await this.pool.query(
      "UPDATE pedidos SET estado = 'CANCELLED', actualizado_en = NOW() WHERE pedido_id = $1",
      [id],
    );
    return this.findById(id);
  }
}
