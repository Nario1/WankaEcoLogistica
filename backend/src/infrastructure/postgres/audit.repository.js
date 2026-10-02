export class PgAuditRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async record({ userId, action, entity, entityId, metadata = {} }) {
    await this.pool.query(
      `INSERT INTO auditoria (usuario_id, accion, entidad, entidad_id, metadata)
       VALUES ($1, $2, $3, $4, $5::jsonb)`,
      [userId, action, entity, entityId, JSON.stringify(metadata)],
    );
  }
}
