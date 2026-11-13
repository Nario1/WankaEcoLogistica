CREATE INDEX IF NOT EXISTS idx_pedidos_creado_en_desc ON pedidos (creado_en DESC);
CREATE INDEX IF NOT EXISTS idx_vehiculos_placa ON vehiculos (placa);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol_nombre ON usuarios (rol, nombre);
CREATE INDEX IF NOT EXISTS idx_rutas_inicio_desc ON rutas (inicio DESC);
