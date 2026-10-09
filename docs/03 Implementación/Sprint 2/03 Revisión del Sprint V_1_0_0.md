# Revisión del Sprint 2

[← Anterior: Impedimentos](<02 Registro de Impedimentos V_1_0_0.md>) · [README principal](../../../README.md) · [Siguiente: Retrospectiva →](<04 Retrospectiva del Sprint V_1_0_0.md>)

**Nombre del proyecto:** WankaEcoLogística Huancayo

**Líder del proyecto:** Equipo del proyecto

**Versión:** V_1_0_8

## Historias de usuario completadas en este Sprint

| Ítem | Resultado | Criterios demostrados |
|---|---|---|
| US-004 | Optimización de hasta 50 pedidos pendientes sobre la ruta manual seleccionada. | Salida desde local fijo, conservación de vehículo/conductor, 95 % de capacidad, prioridad alta en primera mitad de ventana, jornada máxima y rechazo total de lotes inviables. |
| EN-001 | Benchmark automatizado del algoritmo con 50 puntos. | Medición repetida de latencia y aserción de P95 ≤ 3,5 s. |
| EN-007 | Contrato OpenAPI 0.2.0, migración incremental y controles de calidad. | Pruebas con cobertura mínima, lint, formato y build reproducibles. |

## Demostración del trabajo completado

La demostración reproducible consiste en iniciar sesión como administrador u operador, registrar un pedido indicando obligatoriamente el producto o carga y seleccionando su destino sobre el mapa. En **Planificar nueva ruta**, un único formulario reúne los pedidos, recomienda la unidad activa de menor capacidad suficiente, permite elegir una alternativa, solicita conductor y horario, y ejecuta creación, asignación y optimización. Las tablas y ventanas muestran horas en formato `AM`/`PM`. Si ninguna unidad cumple, explica que se debe registrar una unidad, reducir el lote o reprogramarlo. El backend valida nuevamente estado, 95 % de capacidad y solapamientos. **Ver mapa** consulta el motor vial, muestra primero el local y recorre calles transitables hasta las paradas; informa proveedor, distancia, duración y si se consideró tráfico. Nunca presenta una diagonal como ruta navegable.

## Evidencia de calidad

- Pruebas de origen fijo, reutilización de ruta, prioridad, secuencia, duplicados, estado pendiente, límite de capacidad al 95 %, recursos, ventanas y rendimiento.
- Pruebas de transformación de geometría OSRM, selección de TomTom Traffic y navegación desde el local.
- Pruebas de selección de vehículo, estado, capacidad segura y conflicto horario de la unidad.
- Pruebas de API y RBAC para operaciones existentes; el endpoint nuevo usa el mismo middleware probado.
- Persistencia parametrizada y transaccional.
- Contrato `backend/openapi.yaml` y migraciones actualizados.
- Ejecución local final: 28 de 28 pruebas aprobadas, incluida PostGIS; 90,00 % de cobertura de líneas; lint, formato y build aprobados.

## Pendientes

- Configurar `TEST_DATABASE_URL` en integración continua para que la prueba PostGIS deje de depender del entorno local.
- El seguimiento móvil/offline y navegación vial del conductor (alcance completo de US-005), reoptimización por incidencias (US-007), indicadores (US-006) y reportes (US-008) conservan su lugar en sprints posteriores.
- La evidencia de despliegue en staging requiere infraestructura y credenciales externas al repositorio.

## Historial de control de cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_8 | 08/10/2026 | Evidencia del nombre de carga, presentación AM/PM y planificación integral. | Equipo del proyecto |
| V_1_0_7 | 08/10/2026 | Demostración de recomendación de unidades y rechazo explícito cuando ninguna cumple. | Equipo del proyecto |
| V_1_0_6 | 08/10/2026 | Evidencia de geometría vial, sentidos de circulación y tráfico configurable. | Equipo del proyecto |
| V_1_0_5 | 08/10/2026 | Hora de salida editable y validación preventiva de peso para evitar solicitudes inviables. | Equipo del proyecto |
| V_1_0_4 | 08/10/2026 | Validación de origen fijo, optimización desde la fila y reglas RN-002/RN-004. | Equipo del proyecto |
| V_1_0_1 | 07/10/2026 | Navegación bidireccional incorporada. | Equipo del proyecto |
| V_1_0_2 | 08/10/2026 | Evidencia del mapa de planificación y mensajes de conflicto mejorados. | Equipo del proyecto |
| V_1_0_3 | 08/10/2026 | Evidencia de selección cartográfica y mejoras de experiencia de usuario. | Equipo del proyecto |
| V_1_0_0 | 07/10/2026 | Revisión y demostración verificable del Sprint 2. | Equipo del proyecto |
