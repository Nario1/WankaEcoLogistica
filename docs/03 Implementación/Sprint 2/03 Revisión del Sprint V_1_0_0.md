# Revisión del Sprint 2

[← Anterior: Impedimentos](<02 Registro de Impedimentos V_1_0_0.md>) · [README principal](../../../README.md) · [Siguiente: Retrospectiva →](<04 Retrospectiva del Sprint V_1_0_0.md>)

**Nombre del proyecto:** WankaEcoLogística Huancayo

**Líder del proyecto:** Equipo del proyecto

**Versión:** V_1_0_10

## Historias de usuario completadas en este Sprint

| Ítem | Resultado | Criterios demostrados |
|---|---|---|
| US-004 | Planificación integral y optimización de hasta 50 pedidos pendientes, incluida una ruta manual existente. | Salida desde local fijo, carga identificada, recomendación de unidad, conductor, horario sugerido, 95 % de capacidad, prioridad alta en primera mitad de ventana, jornada máxima y rechazo total de lotes inviables. |
| EN-001 | Benchmark automatizado del algoritmo con 50 puntos. | Medición repetida de latencia y aserción de P95 ≤ 3,5 s. |
| EN-007 | Contrato OpenAPI 0.3.0, migración incremental y controles de calidad. | Pruebas con cobertura mínima, lint, formato y build reproducibles. |

## Demostración del trabajo completado

La demostración reproducible consiste en iniciar sesión como administrador u operador, registrar un pedido indicando obligatoriamente el producto o carga y seleccionando su destino sobre el mapa. Las ventanas se ingresan mediante selectores separados de hora, minutos y `AM`/`PM`. En **Planificar nueva ruta**, al elegir pedidos el sistema recomienda la unidad y también calcula fecha, inicio y fin desde sus ventanas; usa el día siguiente cuando la apertura de hoy ya pasó y nunca propone más de ocho horas. La propuesta es editable antes de confirmar. El mismo formulario solicita conductor y ejecuta creación, asignación y optimización. Si ninguna unidad cumple, explica que se debe registrar una unidad, reducir el lote o reprogramarlo. El backend valida nuevamente estado, 95 % de capacidad y solapamientos. **Ver mapa** consulta el motor vial, muestra primero el local y recorre calles transitables hasta las paradas; informa proveedor, distancia, duración y si se consideró tráfico. Nunca presenta una diagonal como ruta navegable.

## Evidencia de calidad

- Pruebas de origen fijo, reutilización de ruta, prioridad, secuencia, duplicados, estado pendiente, límite de capacidad al 95 %, recursos, ventanas y rendimiento.
- Pruebas de transformación de geometría OSRM, selección de TomTom Traffic y navegación desde el local.
- Pruebas de selección de vehículo, estado, capacidad segura y conflicto horario de la unidad.
- Pruebas de API y RBAC para operaciones existentes; el endpoint nuevo usa el mismo middleware probado.
- Persistencia parametrizada y transaccional.
- Contrato `backend/openapi.yaml` y migraciones actualizados.
- Ejecución local final: 29 pruebas aprobadas, 0 fallidas y 1 omitida porque `TEST_DATABASE_URL` no está configurada; 87,75 % de cobertura de líneas; lint, formato y build aprobados.

## Pendientes

- Configurar `TEST_DATABASE_URL` en integración continua para que la prueba PostGIS deje de depender del entorno local.
- El seguimiento móvil/offline y navegación vial del conductor (alcance completo de US-005), reoptimización por incidencias (US-007), indicadores (US-006) y reportes (US-008) conservan su lugar en sprints posteriores.
- La evidencia de despliegue en staging requiere infraestructura y credenciales externas al repositorio.

## Verificación complementaria del incremento

Además de los escenarios de US-004, la regresión cubre consulta, edición y baja lógica de los recursos operativos heredados del Sprint 1. Pedidos se cancelan, vehículos pasan a fuera de servicio, conductores quedan inactivos y rutas se cancelan; no se realiza borrado físico porque los cuatro recursos participan en trazabilidad y auditoría. OpenAPI `0.3.0` conserva sincronía con estas operaciones.

## Historial de control de cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_11 | 09/10/2026 | Evidencia de CRUD completo, bajas lógicas, regresión y contrato OpenAPI 0.3.0. | Equipo del proyecto |
| V_1_0_10 | 08/10/2026 | Evidencia de fecha e intervalo sugeridos desde las ventanas seleccionadas. | Equipo del proyecto |
| V_1_0_9 | 08/10/2026 | Evidencia de selección simple de horarios mediante hora, minutos y AM/PM. | Equipo del proyecto |
| V_1_0_8 | 08/10/2026 | Evidencia del nombre de carga, presentación AM/PM y planificación integral. | Equipo del proyecto |
| V_1_0_7 | 08/10/2026 | Demostración de recomendación de unidades y rechazo explícito cuando ninguna cumple. | Equipo del proyecto |
| V_1_0_6 | 08/10/2026 | Evidencia de geometría vial, sentidos de circulación y tráfico configurable. | Equipo del proyecto |
| V_1_0_5 | 08/10/2026 | Hora de salida editable y validación preventiva de peso para evitar solicitudes inviables. | Equipo del proyecto |
| V_1_0_4 | 08/10/2026 | Validación de origen fijo, optimización desde la fila y reglas RN-002/RN-004. | Equipo del proyecto |
| V_1_0_1 | 07/10/2026 | Navegación bidireccional incorporada. | Equipo del proyecto |
| V_1_0_2 | 08/10/2026 | Evidencia del mapa de planificación y mensajes de conflicto mejorados. | Equipo del proyecto |
| V_1_0_3 | 08/10/2026 | Evidencia de selección cartográfica y mejoras de experiencia de usuario. | Equipo del proyecto |
| V_1_0_0 | 07/10/2026 | Revisión y demostración verificable del Sprint 2. | Equipo del proyecto |
