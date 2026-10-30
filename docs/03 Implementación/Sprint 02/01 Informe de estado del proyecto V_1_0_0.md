# Informe de estado del proyecto

[← Sprint 01](<../Sprint 01/04 Retrospectiva del Sprint V_1_0_0.md>) · [README principal](../../../README.md) · [Siguiente: Impedimentos →](<02 Registro de Impedimentos V_1_0_0.md>)

| Campo | Información |
|---|---|
| Proyecto | WankaEcoLogística Huancayo |
| Líder del proyecto | Equipo del proyecto |
| Versión | V_1_0_10 |
| Fecha | 08/10/2026 |
| Periodo | Cierre del Sprint 02 |

## Resumen ejecutivo

El Sprint 02 entrega la optimización operativa de rutas para hasta 50 pedidos (US-004), la medición reproducible del rendimiento del motor (EN-001) y la actualización del contrato API, pruebas y documentación de calidad (EN-007). El flujo principal integra selección de pedidos identificados, recomendación de vehículo, conductor y horario sugerido; también permite optimizar rutas manuales existentes. Todas parten del local `-12.07201013486951, -75.20516872975998`, aplican prioridad, ventanas y cercanía, y muestran el recorrido sobre la red vial.

## Estado del alcance

| Ítem | Estado | Evidencia verificable |
|---|---|---|
| US-004 — Optimizar rutas | Completado | `POST /api/optimizations`, formulario integrado React, migraciones `002_sprint_2.sql`/`003_order_product.sql` y pruebas de servicio. |
| EN-001 — Rendimiento de ruteo | Completado | Benchmark automatizado con 50 puntos y umbral P95 ≤ 3,5 s. |
| EN-007 — Calidad y API | Completado localmente | OpenAPI 0.3.0, lint, formato, build y cobertura automatizados mediante scripts npm. |
| Extensión visual del incremento | Completado | Mapa interactivo con paradas ordenadas, ajuste automático de vista y consulta persistida de coordenadas. |
| Navegación vial | Completado y configurable | Geometría sobre calles mediante OSRM; integración TomTom habilitable para tráfico actual e histórico. |
| Recomendación de unidad | Completado | Unidades activas filtradas por el 95 % de capacidad, ordenadas por menor capacidad suficiente y validadas nuevamente en el backend. |
| Planificación integrada | Completado | Un formulario reúne pedidos identificados, vehículo recomendado, conductor y horario antes de crear y optimizar. |
| Presentación horaria | Completado | Fechas y horas visibles normalizadas al reloj de 12 horas; formularios con controles separados de hora, minutos y `AM`/`PM`. |
| Sugerencia de horario | Completado | Fecha operativa, inicio y fin recalculados desde las ventanas seleccionadas y limitados a una jornada de ocho horas. |
| Captura geográfica de pedidos | Completado | Selección del punto de entrega por clic o geolocalización, con coordenadas editables y marcador visible. |

## Indicadores de control

| Variable | Estado | Resultado |
|---|---|---|
| Alcance | Verde | Tres ítems planificados implementados y trazados. |
| Cronograma | Verde | Incremento disponible al cierre del Sprint 02. |
| Calidad | Verde | 29 pruebas aprobadas, 0 fallidas y 1 omitida por ausencia de `TEST_DATABASE_URL`; cobertura de líneas: 87,75 %; lint, formato y build aprobados. |
| Seguridad | Verde | Endpoint protegido con JWT y roles `ADMIN`/`OPERATOR`; consultas parametrizadas. |
| Datos | Verde | Conversión de ruta y asignación de todos los pedidos atómica mediante transacción y controles de concurrencia. |
| Riesgo de entorno | Amarillo | La prueba real PostGIS requiere `TEST_DATABASE_URL` y una instancia migrada. |

## Decisiones técnicas

- Se limita cada optimización a 50 pedidos y una jornada máxima de ocho horas.
- Se rechaza el lote completo cuando la ruta no es elegible, falta capacidad, conductor, pedidos pendientes o factibilidad horaria; no se publica una asignación parcial.
- Una ruta manual conserva su conductor y puede adoptar la unidad recomendada; el flujo integral crea la planificación con esos recursos. En ambos casos el peso no supera el 95 % de la capacidad nominal (RN-002).
- La hora de salida se confirma o corrige al optimizar para hacerla compatible con las ventanas de entrega; el frontend anticipa excesos de peso antes de invocar la API.
- El mapa consume `GET /api/routes/{id}/navigation`; sólo dibuja geometría devuelta por un motor vial y declara si el cálculo incorporó tráfico.
- OSRM considera la red OpenStreetMap y los sentidos/restricciones publicados; TomTom se activa con `TOMTOM_API_KEY` para calcular la ruta rápida con tráfico. Sin esa clave no se afirma que exista información de tráfico en tiempo real.
- La interfaz recomienda la unidad activa de menor capacidad suficiente, muestra el margen libre y explica cuando ninguna cumple. El backend valida nuevamente estado, capacidad y solapamiento horario antes de reasignar la ruta.
- Cada pedido exige el nombre del producto o carga y lo presenta en tablas, selectores y mapa; la migración conserva registros anteriores como `Carga general`.
- **Planificar nueva ruta** integra pedidos, recomendación de vehículo, conductor y horario, y encadena creación, asignación y optimización desde una sola acción del usuario.
- Todas las fechas y horas de lectura se muestran en formato de 12 horas con `AM`/`PM`.
- Los formularios de pedidos y rutas sustituyen controles horarios dependientes del navegador por selectores explícitos de hora, minutos y periodo; la API continúa recibiendo valores normalizados de 24 horas.
- Al cambiar los pedidos, el frontend toma la apertura más temprana y el cierre más tardío, propone hoy si la jornada aún no comenzó o el día siguiente en caso contrario, y limita el intervalo sugerido a ocho horas. La propuesta permanece editable y el backend conserva la validación definitiva.
- Todas las rutas parten del local fijo indicado por el negocio y la misma ruta pasa de manual a optimizada.
- La heurística exige prioridad alta dentro del primer 50 % de su ventana (RN-004), luego considera vencimiento y distancia; conserva distancia, peso y orden de entrega.

## Cierre técnico complementario

Se verificó el CRUD completo de pedidos, vehículos, conductores y rutas mediante operaciones de listado, consulta individual, creación, actualización y baja lógica. El contrato `backend/openapi.yaml` versión `0.3.0` documenta estas operaciones. La baja lógica conserva trazabilidad, relaciones históricas y registros de auditoría sin exponer recursos inactivos como disponibles para nuevas planificaciones.

## Historial de control de cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_11 | 09/10/2026 | CRUD operativo completo, bajas lógicas, pruebas de regresión y OpenAPI 0.3.0. | Equipo del proyecto |
| V_1_0_10 | 08/10/2026 | Sugerencia automática de fecha y horario según ventanas y jornada máxima. | Equipo del proyecto |
| V_1_0_9 | 08/10/2026 | Selectores horarios explícitos y accesibles con hora, minutos y AM/PM. | Equipo del proyecto |
| V_1_0_8 | 08/10/2026 | Identificación de carga, horario AM/PM y formulario integral de planificación. | Equipo del proyecto |
| V_1_0_7 | 08/10/2026 | Recomendación inteligente de vehículos y mensajes ante falta de unidades elegibles. | Equipo del proyecto |
| V_1_0_6 | 08/10/2026 | Trazado vial real, soporte configurable de tráfico y eliminación de líneas rectas engañosas. | Equipo del proyecto |
| V_1_0_5 | 08/10/2026 | Corrección guiada de la hora de salida y validación previa de capacidad en la interfaz. | Equipo del proyecto |
| V_1_0_4 | 08/10/2026 | Origen fijo, optimización de ruta manual seleccionada y aplicación estricta de RN-002/RN-004. | Equipo del proyecto |
| V_1_0_1 | 07/10/2026 | Navegación documental y trazabilidad actualizadas según retroalimentación docente. | Equipo del proyecto |
| V_1_0_2 | 08/10/2026 | Incorporación del mapa de planificación y correcciones de compatibilidad MUI. | Equipo del proyecto |
| V_1_0_3 | 08/10/2026 | Mejora de usabilidad y selección cartográfica de pedidos. | Equipo del proyecto |
| V_1_0_0 | 07/10/2026 | Informe de cierre y estado verificable del Sprint 02. | Equipo del proyecto |
