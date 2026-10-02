# Revisión del Sprint 1

**Proyecto:** WankaEcoLogística Huancayo  
**Responsable:** Equipo del proyecto  
**Sprint goal:** disponer de una base segura para registrar pedidos, vehículos y conductores, con datos geográficos válidos y reglas operativas verificables.

## Historias y enablers completados

| Ítem | Resultado entregado |
|---|---|
| US-001 — Gestionar pedidos | Alta, listado y actualización de dirección, coordenadas, peso, prioridad y ventana horaria. Se rechazan coordenadas, pesos o ventanas inválidas. |
| US-002 — Administrar vehículos | Registro y actualización de placa, capacidad, consumo, factor de emisión y estado. Las placas duplicadas se bloquean. |
| US-003 — Asignar conductores | Registro de conductores, creación de rutas operativas y asignación o reasignación, con control de solapamientos y jornadas de hasta ocho horas. |
| EN-002 — Autenticación y RBAC | Inicio de sesión con JWT, permisos por rol y bloqueo temporal después de tres intentos fallidos. |
| EN-006 — Integridad geoespacial | PostgreSQL/PostGIS, almacenamiento de puntos con SRID 4326 y prueba de precisión para coordenadas conocidas. |

## Demostración realizada

Se verificó en el entorno local el flujo completo: inicio de sesión de administrador, creación de un vehículo activo, registro de un pedido en Huancayo, alta de un conductor, creación de una ruta de cuatro horas, asignación del conductor y cálculo de emisiones. La API devolvió respuestas exitosas para cada operación válida y muestra los campos específicos cuando una validación devuelve `400`.

## Evidencia de calidad

- Migración de base de datos ejecutada de forma repetible.
- `npm test`: 16 de 16 pruebas aprobadas, incluida la integración PostGIS; cobertura de líneas: 87.75 %.
- `npm run lint` y `npm run format:check`: aprobados en backend y frontend.
- `npm run build`: bundle del frontend generado correctamente.

## Pendientes para el siguiente sprint

La optimización automática de rutas, el mapa interactivo, la reoptimización por incidencias, los indicadores consolidados y los reportes pertenecen a los sprints posteriores definidos en el backlog. Para el despliegue fuera de desarrollo se deben reemplazar las credenciales locales y configurar secretos, HTTPS y una base de datos administrada.
