CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE IF NOT EXISTS usuarios (
  usuario_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  nombre VARCHAR(120) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('ADMIN', 'OPERATOR', 'DRIVER', 'AUDITOR')),
  estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (estado IN ('ACTIVE', 'INACTIVE')),
  intentos_fallidos SMALLINT NOT NULL DEFAULT 0 CHECK (intentos_fallidos >= 0),
  bloqueado_hasta TIMESTAMPTZ,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehiculos (
  vehiculo_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  placa VARCHAR(10) NOT NULL UNIQUE,
  capacidad_kg NUMERIC(10,2) NOT NULL CHECK (capacidad_kg > 0),
  consumo_km NUMERIC(10,2) NOT NULL CHECK (consumo_km >= 0),
  factor_emision NUMERIC(10,4) NOT NULL CHECK (factor_emision >= 0),
  estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (estado IN ('ACTIVE', 'OUT_OF_SERVICE')),
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rutas (
  ruta_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conductor_id UUID REFERENCES usuarios(usuario_id) ON DELETE RESTRICT,
  vehiculo_id UUID NOT NULL REFERENCES vehiculos(vehiculo_id) ON DELETE RESTRICT,
  inicio TIMESTAMPTZ NOT NULL,
  fin TIMESTAMPTZ NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'PLANNED' CHECK (estado IN ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (fin > inicio),
  CHECK (fin <= inicio + INTERVAL '8 hours')
);

CREATE TABLE IF NOT EXISTS pedidos (
  pedido_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ruta_id UUID REFERENCES rutas(ruta_id) ON DELETE SET NULL,
  direccion VARCHAR(255) NOT NULL,
  coordenadas GEOMETRY(Point, 4326) NOT NULL,
  peso_kg NUMERIC(10,2) NOT NULL CHECK (peso_kg > 0),
  ventana_inicio TIME NOT NULL,
  ventana_fin TIME NOT NULL,
  prioridad VARCHAR(20) NOT NULL DEFAULT 'NORMAL' CHECK (prioridad IN ('NORMAL', 'HIGH')),
  estado VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  orden_entrega INTEGER,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (ventana_fin > ventana_inicio),
  CHECK (ST_X(coordenadas) BETWEEN -180 AND 180),
  CHECK (ST_Y(coordenadas) BETWEEN -90 AND 90)
);

CREATE TABLE IF NOT EXISTS auditoria (
  auditoria_id BIGSERIAL PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(usuario_id) ON DELETE SET NULL,
  accion VARCHAR(80) NOT NULL,
  entidad VARCHAR(80) NOT NULL,
  entidad_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'rutas_conductor_horario_excl'
      AND conrelid = 'rutas'::regclass
  ) THEN
    ALTER TABLE rutas ADD CONSTRAINT rutas_conductor_horario_excl
      EXCLUDE USING GIST (
        conductor_id WITH =,
        tstzrange(inicio, fin, '[)') WITH &&
      ) WHERE (conductor_id IS NOT NULL AND estado <> 'CANCELLED');
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_usuarios_rol_estado ON usuarios(rol, estado);
CREATE INDEX IF NOT EXISTS idx_rutas_conductor_horario ON rutas(conductor_id, inicio, fin);
CREATE INDEX IF NOT EXISTS idx_rutas_vehiculo ON rutas(vehiculo_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_ruta ON pedidos(ruta_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_coordenadas ON pedidos USING GIST(coordenadas);
CREATE INDEX IF NOT EXISTS idx_auditoria_usuario_fecha ON auditoria(usuario_id, creado_en DESC);
