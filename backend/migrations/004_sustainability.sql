ALTER TABLE rutas ADD COLUMN IF NOT EXISTS distancia_base_km NUMERIC(10,2) CHECK (distancia_base_km >= 0);
ALTER TABLE rutas ADD COLUMN IF NOT EXISTS emisiones_co2 NUMERIC(12,4) CHECK (emisiones_co2 >= 0);

CREATE INDEX IF NOT EXISTS idx_rutas_inicio_estado
  ON rutas(inicio, estado)
  WHERE estado <> 'CANCELLED';
