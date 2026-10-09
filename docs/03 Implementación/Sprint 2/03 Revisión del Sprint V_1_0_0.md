# Revisión del Sprint 2

[← Anterior: Impedimentos](<02 Registro de Impedimentos V_1_0_0.md>) · [README principal](../../../README.md) · [Siguiente: Retrospectiva →](<04 Retrospectiva del Sprint V_1_0_0.md>)

**Nombre del proyecto:** WankaEcoLogística Huancayo

**Líder del proyecto:** Equipo del proyecto

**Versión:** V_1_0_5

## Historias de usuario completadas en este Sprint

| Ítem | Resultado | Criterios demostrados |
|---|---|---|
| US-004 | Optimización de hasta 50 pedidos pendientes sobre la ruta manual seleccionada. | Salida desde local fijo, conservación de vehículo/conductor, 95 % de capacidad, prioridad alta en primera mitad de ventana, jornada máxima y rechazo total de lotes inviables. |
| EN-001 | Benchmark automatizado del algoritmo con 50 puntos. | Medición repetida de latencia y aserción de P95 ≤ 3,5 s. |
| EN-007 | Contrato OpenAPI 0.2.0, migración incremental y controles de calidad. | Pruebas con cobertura mínima, lint, formato y build reproducibles. |

## Demostración del trabajo completado

La demostración reproducible consiste en iniciar sesión como administrador u operador, registrar pedidos seleccionando su destino sobre el mapa, crear una ruta manual con vehículo y horario, asignarle un conductor y pulsar **Optimizar** en esa fila. Luego se eligen hasta 50 pedidos pendientes y se confirma o corrige la hora de salida para hacerla compatible con sus ventanas. La interfaz presenta el peso acumulado y la capacidad segura antes del envío. El sistema conserva vehículo y conductor, valida todas las restricciones y convierte esa misma ruta en optimizada. **Ver mapa** muestra primero el local de despacho y conecta las paradas en el orden calculado. Los casos negativos explican el conflicto y no dejan asignaciones parciales.

## Evidencia de calidad

- Pruebas de origen fijo, reutilización de ruta, prioridad, secuencia, duplicados, estado pendiente, límite de capacidad al 95 %, recursos, ventanas y rendimiento.
- Pruebas de API y RBAC para operaciones existentes; el endpoint nuevo usa el mismo middleware probado.
- Persistencia parametrizada y transaccional.
- Contrato `backend/openapi.yaml` y migraciones actualizados.
- Ejecución local final: 24 de 24 pruebas aprobadas, incluida PostGIS; 90,19 % de cobertura de líneas; lint, formato y build aprobados.

## Pendientes

- Configurar `TEST_DATABASE_URL` en integración continua para que la prueba PostGIS deje de depender del entorno local.
- El seguimiento móvil/offline y navegación vial del conductor (alcance completo de US-005), reoptimización por incidencias (US-007), indicadores (US-006) y reportes (US-008) conservan su lugar en sprints posteriores.
- La evidencia de despliegue en staging requiere infraestructura y credenciales externas al repositorio.

## Historial de control de cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_5 | 08/10/2026 | Hora de salida editable y validación preventiva de peso para evitar solicitudes inviables. | Equipo del proyecto |
| V_1_0_4 | 08/10/2026 | Validación de origen fijo, optimización desde la fila y reglas RN-002/RN-004. | Equipo del proyecto |
| V_1_0_1 | 07/10/2026 | Navegación bidireccional incorporada. | Equipo del proyecto |
| V_1_0_2 | 08/10/2026 | Evidencia del mapa de planificación y mensajes de conflicto mejorados. | Equipo del proyecto |
| V_1_0_3 | 08/10/2026 | Evidencia de selección cartográfica y mejoras de experiencia de usuario. | Equipo del proyecto |
| V_1_0_0 | 07/10/2026 | Revisión y demostración verificable del Sprint 2. | Equipo del proyecto |
