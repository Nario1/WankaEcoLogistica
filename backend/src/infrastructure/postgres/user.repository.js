import { firstRow, mapUser } from "./base.js";

export class PgUserRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async findByEmail(email) {
    const result = await this.pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email],
    );
    return mapUser(firstRow(result));
  }

  async findById(id) {
    const result = await this.pool.query(
      "SELECT * FROM usuarios WHERE usuario_id = $1",
      [id],
    );
    return mapUser(firstRow(result));
  }

  async recordFailedLogin(id, maxAttempts, lockMinutes, now) {
    await this.pool.query(
      `UPDATE usuarios
       SET intentos_fallidos = intentos_fallidos + 1,
           bloqueado_hasta = CASE
             WHEN intentos_fallidos + 1 >= $2 THEN $4::timestamptz + ($3 * INTERVAL '1 minute')
             ELSE NULL
           END
       WHERE usuario_id = $1`,
      [id, maxAttempts, lockMinutes, now],
    );
  }

  async resetLoginAttempts(id) {
    await this.pool.query(
      "UPDATE usuarios SET intentos_fallidos = 0, bloqueado_hasta = NULL WHERE usuario_id = $1",
      [id],
    );
  }

  async createDriver({ email, name, passwordHash }) {
    const result = await this.pool.query(
      `INSERT INTO usuarios (email, nombre, password_hash, rol)
       VALUES ($1, $2, $3, 'DRIVER') RETURNING *`,
      [email, name, passwordHash],
    );
    return mapUser(firstRow(result));
  }

  async listDrivers() {
    const result = await this.pool.query(
      `SELECT * FROM usuarios WHERE rol = 'DRIVER' ORDER BY nombre ASC`,
    );
    return result.rows.map(mapUser);
  }
}
