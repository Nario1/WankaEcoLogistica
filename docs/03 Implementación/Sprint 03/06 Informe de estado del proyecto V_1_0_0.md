# Informe de estado del proyecto

[← Anterior: Retrospectiva](<02 Retrospectiva del Sprint V_1_0_0.md>) · [README principal](../../../README.md) · [Siguiente: Impedimentos →](<07 Registro de Impedimentos V_1_0_0.md>)

| Campo | Información |
|---|---|
| Proyecto | WankaEcoLogística Huancayo |
| Líder del proyecto | Nario German Reyes Rios |
| Versión | V_1_0_2 |
| Fecha | 21/10/2026 |
| Periodo | Cierre técnico del Sprint 3 (20/10/2026 – 03/11/2026) |

## Resumen ejecutivo

El Sprint 3 entrega el seguimiento en campo (EP-03): adaptador cartográfico sustituible (EN-005), consulta de la ruta asignada por el conductor (US-005) y base PWA offline (EN-004). El conductor autenticado abre **Mi ruta**, obtiene sus rutas con `GET /api/routes/mine` y visualiza paradas y trazado; sin red conserva la última información cacheada e informa el estado de conectividad.

## Estado del alcance

| Ítem | Estado | Evidencia verificable |
|---|---|---|
| EN-005 — Adaptador de mapas | Completado | `RoutingAdapter` con proveedores OSRM, TomTom y stub; `ROUTING_PROVIDER`; pruebas de resolución y sustitución del contrato `calculate()`. |
| US-005 — Consultar ruta en mapa | Completado | `GET /api/routes/mine`, RBAC DRIVER por propiedad, `DriverRoutePage`, menú **Mi ruta** y mapa de paradas/trazado. |
| EN-004 — PWA Offline | Completado | Manifest, service worker, caché de última ruta y sincronización al recuperar red. |
| Contrato HTTP | Completado localmente | OpenAPI documenta `/api/routes/mine`. |
| Pruebas de campo | Completado localmente | Backend 34/34 con PostGIS; Playwright 3/3 (pedido en mapa, Mi ruta, offline). |

## Indicadores de control

| Variable | Estado | Resultado |
|---|---|---|
| Alcance | Verde | EC-17, EC-9 y EC-16 en estado Listo en Jira. |
| Cronograma | Verde | Incremento dentro del periodo 20/10–03/11. |
| Calidad | Verde | 34 pruebas backend aprobadas; cobertura ≈ 88 %; Playwright 3/3. |
| Seguridad | Verde | JWT/RBAC; conductor limitado a rutas propias; secretos solo en `.env` local. |
| Datos | Verde | PostgreSQL/PostGIS operativo en desarrollo; seed local de roles sin versionar credenciales. |
| Riesgo de entorno | Amarillo | E2E depende del cache de navegadores Playwright del equipo; Vite en `5174` para evitar choques de puerto. |

## Decisiones técnicas

- El dominio de ruteo solo habla con el adaptador; el proveedor se elige por configuración o inyección en pruebas.
- Sin clave TomTom se usa OSRM; no se afirma tráfico en tiempo real.
- US-005 es una vista del conductor, no el mapa del planificador del Sprint 2.
- EN-004 se resolvió con PWA manual tras fallar la instalación de `vite-plugin-pwa` por red.
- El frontend de desarrollo usa el puerto `5174` de forma fija para alinear CORS y Playwright.
- La documentación de impedimentos no registra contraseñas ni cadenas de conexión.

## Cierre técnico complementario

Se limpió el backlog de Jira antes de implementar, se cerraron los tres ítems del objetivo y se publicó el incremento en el repositorio. Quedan como mejora residual las capturas en dispositivo móvil y el seed documentado de conductor sin secretos.

## Historial de control de cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_2 | 21/10/2026 | Ajuste de coherencia y política de no publicar secretos. | Equipo del proyecto |
| V_1_0_1 | 21/10/2026 | Informe de cierre técnico con alcance, indicadores y decisiones. | Equipo del proyecto |
| V_1_0_0 | 21/10/2026 | Informe de arranque del Sprint 3. | Equipo del proyecto |
