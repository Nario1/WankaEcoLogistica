ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS nombre_producto VARCHAR(160);

UPDATE pedidos
SET nombre_producto = 'Carga general'
WHERE nombre_producto IS NULL OR BTRIM(nombre_producto) = '';

ALTER TABLE pedidos ALTER COLUMN nombre_producto SET NOT NULL;
