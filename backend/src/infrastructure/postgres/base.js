export const firstRow = (result) => result.rows[0] ?? null;

export function mapUser(row) {
  if (!row) return null;
  return {
    id: row.usuario_id,
    email: row.email,
    name: row.nombre,
    passwordHash: row.password_hash,
    role: row.rol,
    status: row.estado,
    failedLoginAttempts: row.intentos_fallidos,
    lockedUntil: row.bloqueado_hasta,
  };
}
