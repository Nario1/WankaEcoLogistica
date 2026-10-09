# Informe de estado del proyecto

[← Sprint 1](<../Sprint 1/04 Retrospectiva del Sprint V_1_0_0.md>) · [README principal](../../../README.md) · [Siguiente: Impedimentos →](<02 Registro de Impedimentos V_1_0_0.md>)

| Campo | Información |
|---|---|
| Proyecto | WankaEcoLogística Huancayo |
| Líder del proyecto | Equipo del proyecto |
| Versión | V_1_0_4 |
| Fecha | 08/10/2026 |
| Periodo | Cierre del Sprint 2 |

## Resumen ejecutivo

El Sprint 2 entrega la optimización operativa de rutas para hasta 50 pedidos (US-004), la medición reproducible del rendimiento del motor (EN-001) y la actualización del contrato API, pruebas y documentación de calidad (EN-007). El flujo permite seleccionar una ruta manual y sus pedidos pendientes desde React, conservar el vehículo y conductor asignados, partir siempre del local `-12.07201013486951, -75.20516872975998`, ordenar las paradas por prioridad, ventana y cercanía, convertir la misma ruta dentro de una transacción y visualizar la secuencia sobre OpenStreetMap.

## Estado del alcance

| Ítem | Estado | Evidencia verificable |
|---|---|---|
| US-004 — Optimizar rutas | Completado | `POST /api/optimizations`, módulo React de rutas, migración `002_sprint_2.sql` y pruebas de servicio. |
| EN-001 — Rendimiento de ruteo | Completado | Benchmark automatizado con 50 puntos y umbral P95 ≤ 3,5 s. |
| EN-007 — Calidad y API | Completado localmente | OpenAPI 0.2.0, lint, formato, build y cobertura automatizados mediante scripts npm. |
| Extensión visual del incremento | Completado | Mapa interactivo con paradas ordenadas, ajuste automático de vista y consulta persistida de coordenadas. |
| Captura geográfica de pedidos | Completado | Selección del punto de entrega por clic o geolocalización, con coordenadas editables y marcador visible. |

## Indicadores de control

| Variable | Estado | Resultado |
|---|---|---|
| Alcance | Verde | Tres ítems planificados implementados y trazados. |
| Cronograma | Verde | Incremento disponible al cierre del Sprint 2. |
| Calidad | Verde | 24 de 24 pruebas aprobadas, incluida PostGIS; cobertura de líneas: 90,16 %; lint, formato y build aprobados. |
| Seguridad | Verde | Endpoint protegido con JWT y roles `ADMIN`/`OPERATOR`; consultas parametrizadas. |
| Datos | Verde | Creación de ruta y asignación de pedidos atómica mediante transacción. |
| Riesgo de entorno | Amarillo | La prueba real PostGIS requiere `TEST_DATABASE_URL` y una instancia migrada. |

## Decisiones técnicas

- Se limita cada optimización a 50 pedidos y una jornada máxima de ocho horas.
- Se rechaza el lote completo cuando la ruta no es elegible, falta capacidad, conductor, pedidos pendientes o factibilidad horaria; no se publica una asignación parcial.
- La ruta manual seleccionada conserva su vehículo y conductor; el peso no supera el 95 % de la capacidad nominal (RN-002).
- Todas las rutas parten del local fijo indicado por el negocio y la misma ruta pasa de manual a optimizada.
- La heurística exige prioridad alta dentro del primer 50 % de su ventana (RN-004), luego considera vencimiento y distancia; conserva distancia, peso y orden de entrega.

## Historial de control de cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_4 | 08/10/2026 | Origen fijo, optimización de ruta manual seleccionada y aplicación estricta de RN-002/RN-004. | Equipo del proyecto |
| V_1_0_1 | 07/10/2026 | Navegación documental y trazabilidad actualizadas según retroalimentación docente. | Equipo del proyecto |
| V_1_0_2 | 08/10/2026 | Incorporación del mapa de planificación y correcciones de compatibilidad MUI. | Equipo del proyecto |
| V_1_0_3 | 08/10/2026 | Mejora de usabilidad y selección cartográfica de pedidos. | Equipo del proyecto |
| V_1_0_0 | 07/10/2026 | Informe de cierre y estado verificable del Sprint 2. | Equipo del proyecto |
