# Revisión del Sprint 2

[← Anterior: Impedimentos](<02 Registro de Impedimentos V_1_0_0.md>) · [Índice del Sprint 2](README.md) · [README principal](../../../README.md) · [Siguiente: Retrospectiva →](<04 Retrospectiva del Sprint V_1_0_0.md>)

**Nombre del proyecto:** WankaEcoLogística Huancayo

**Líder del proyecto:** Equipo del proyecto

**Versión:** V_1_0_2

## Historias de usuario completadas en este Sprint

| Ítem | Resultado | Criterios demostrados |
|---|---|---|
| US-004 | Optimización de hasta 50 pedidos pendientes y generación de una ruta secuenciada. | Capacidad suficiente, prioridad alta, ventanas horarias, jornada máxima, conductor disponible y rechazo total de lotes inviables. |
| EN-001 | Benchmark automatizado del algoritmo con 50 puntos. | Medición repetida de latencia y aserción de P95 ≤ 3,5 s. |
| EN-007 | Contrato OpenAPI 0.2.0, migración incremental y controles de calidad. | Pruebas con cobertura mínima, lint, formato y build reproducibles. |

## Demostración del trabajo completado

La demostración reproducible consiste en iniciar sesión como administrador u operador, abrir **Planificación de rutas**, seleccionar **Optimizar pedidos**, indicar el inicio de jornada y elegir los pedidos pendientes. El sistema crea una ruta sólo si encuentra vehículo y conductor elegibles y todas las restricciones son factibles. La tabla presenta vehículo, conductor, horario, distancia y peso; **Ver mapa** carga las coordenadas persistidas, ajusta la vista y conecta las paradas en el orden calculado. Los casos negativos muestran el motivo del conflicto y no dejan asignaciones parciales.

## Evidencia de calidad

- Pruebas de prioridad, secuencia, duplicados, estado pendiente, capacidad, ventanas y rendimiento.
- Pruebas de API y RBAC para operaciones existentes; el endpoint nuevo usa el mismo middleware probado.
- Persistencia parametrizada y transaccional.
- Contrato `backend/openapi.yaml` y migraciones actualizados.
- Ejecución local final: 19 de 19 pruebas aprobadas, incluida la integración PostGIS; cobertura de líneas: 89,19 %.

## Pendientes

- Configurar `TEST_DATABASE_URL` en integración continua para que la prueba PostGIS deje de depender del entorno local.
- El seguimiento móvil/offline y navegación vial del conductor (alcance completo de US-005), reoptimización por incidencias (US-007), indicadores (US-006) y reportes (US-008) conservan su lugar en sprints posteriores.
- La evidencia de despliegue en staging requiere infraestructura y credenciales externas al repositorio.

## Historial de control de cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_1 | 07/10/2026 | Navegación bidireccional incorporada. | Equipo del proyecto |
| V_1_0_2 | 08/10/2026 | Evidencia del mapa de planificación y mensajes de conflicto mejorados. | Equipo del proyecto |
| V_1_0_0 | 07/10/2026 | Revisión y demostración verificable del Sprint 2. | Equipo del proyecto |
