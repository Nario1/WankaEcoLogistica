ALTER TABLE rutas ADD COLUMN IF NOT EXISTS distancia_km NUMERIC(10,2) CHECK (distancia_km >= 0);
ALTER TABLE rutas ADD COLUMN IF NOT EXISTS peso_total_kg NUMERIC(10,2) CHECK (peso_total_kg >= 0);
ALTER TABLE rutas ADD COLUMN IF NOT EXISTS optimizada BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_pedidos_pendientes
  ON pedidos(estado, ventana_inicio, ventana_fin) WHERE ruta_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_vehiculos_activos_capacidad
  ON vehiculos(capacidad_kg) WHERE estado = 'ACTIVE';
