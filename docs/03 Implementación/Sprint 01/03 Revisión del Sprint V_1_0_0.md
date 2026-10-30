# Revisión del Sprint 01

[← Anterior: Impedimentos](<02 Registro de Impedimentos V_1_0_0.md>) · [README principal](../../../README.md) · [Siguiente: Retrospectiva →](<04 Retrospectiva del Sprint V_1_0_0.md>)

**Nombre del proyecto:** WankaEcoLogística Huancayo

**Líder del proyecto:** Equipo del proyecto

**Versión:** V_1_0_1

## Historias de usuario completadas en este Sprint

| Ítem | Resultado entregado |
|---|---|
| US-001 — Gestionar pedidos | Alta, listado y actualización de dirección, coordenadas, peso, prioridad y ventana horaria. |
| US-002 — Administrar vehículos | Registro y actualización de placa, capacidad, consumo, factor de emisión y estado. |
| US-003 — Asignar conductores | Registro, asignación y reasignación con control de solapamientos y jornada máxima. |
| EN-002 — Autenticación y RBAC | JWT, permisos por rol y bloqueo temporal tras tres intentos fallidos. |
| EN-006 — Integridad geoespacial | PostGIS, puntos SRID 4326 y cálculo reproducible de emisiones. |

## Demostración del trabajo completado

Se presentó el flujo de inicio de sesión, creación de vehículo activo, registro de pedido en Huancayo, alta de conductor, creación de ruta manual, asignación sin conflictos y cálculo de emisiones. También se demostraron rechazos por datos inválidos, placa duplicada, permisos insuficientes y conflicto horario.

## Evidencia de calidad

- 16 de 16 pruebas aprobadas, incluida la integración PostGIS.
- Cobertura de líneas de 87,75 %.
- Lint, formato y build aprobados en backend y frontend.
- Migración repetible, contrato OpenAPI y variables de ejemplo disponibles.

## Pendientes

- Optimización automática de rutas y benchmark de 50 puntos: Sprint 02.
- Mapa, reoptimización, indicadores y reportes: backlog posterior.
- Despliegue en staging: condicionado a infraestructura y secretos del entorno.

## Historial de control de cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_1 | 07/10/2026 | Incorporación de navegación completa y trazabilidad de la revisión. | Equipo del proyecto |
| V_1_0_0 | 02/10/2026 | Revisión y evidencia del Sprint 01. | Equipo del proyecto |
