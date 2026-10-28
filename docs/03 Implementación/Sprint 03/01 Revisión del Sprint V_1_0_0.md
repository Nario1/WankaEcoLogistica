# Revisión del sprint

[← Sprint 2](<../Sprint 2/04 Retrospectiva del Sprint V_1_0_0.md>) · [README principal](../../../README.md) · [Siguiente: Retrospectiva →](<02 Retrospectiva del Sprint V_1_0_0.md>)

**Nombre del Proyecto:** WankaEcoLogística Huancayo

**Líder del Proyecto:** Nario German Reyes Rios

## Historias de Usuario completadas en este Sprint

Definición de terminado aplicada: la historia está en Jira en estado Listo, el criterio de aceptación se demuestra en la aplicación y existe prueba automatizada del comportamiento principal.

| Ítem | Definición de terminado | Resultado |
|---|---|---|
| EN-005 — Adaptador de mapas | El dominio obtiene el trazado por una interfaz sustituible, sin depender de un proveedor concreto. | Terminado. `RoutingAdapter` resuelve OSRM, TomTom o stub. EC-17 en Listo. |
| US-005 — Consultar ruta en mapa | El conductor autenticado ve solo su ruta, con paradas ordenadas y trazado en un mapa responsivo. | Terminado. Menú **Mi ruta**, `GET /api/routes/mine` y denegación de rutas ajenas. EC-9 en Listo. |
| EN-004 — PWA offline | Tras visitar la ruta, la pérdida de red conserva la última información y comunica el estado de conectividad. | Terminado. Manifest, service worker, caché local y aviso al reconectar. EC-16 en Listo. |

## Demostración del trabajo completado

Demostración a los stakeholders de las funcionalidades implementadas el 21/10/2026, sobre la API local y el frontend en `http://localhost:5174`.

1. El planificador inicia sesión, registra un pedido sobre el mapa y planifica una ruta optimizada con vehículo y conductor.
2. El conductor inicia sesión. El menú muestra **Inicio** y **Mi ruta**. No accede a pedidos, flota ni planificación.
3. En **Mi ruta** se listan las rutas asignadas. Con una ruta optimizada se ven las paradas y el trazado. Sin asignación, el sistema lo informa de forma explícita.
4. Al interrumpir la conexión aparece el aviso de estado offline y permanece la última información cargada. Al recuperar la red se refrescan los datos.

La verificación repetible de esa demostración está en `pruebas/`: autenticación, vehículos, conductores, pedido en mapa, flujo de planificación y mapa del conductor, además del aviso offline. La revisión de esta consigna documental ante el docente todavía no se realizó.

## Pendientes

- US-006, US-007 y US-008 permanecen para sprints posteriores.
- Validar el comportamiento offline con Operaciones en un dispositivo móvil real.
- La consigna documental de calidad, OWASP y WCAG ya tiene sus archivos `03`, `04` y `05`.

## Historial de control de cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_3 | 27/10/2026 | Revisión alineada a la plantilla oficial, sin capturas, con líder del proyecto. | Nario German Reyes Rios |
| V_1_0_2 | 21/10/2026 | Revisión sin credenciales y pendientes actualizados. | Equipo del proyecto |
| V_1_0_0 | 21/10/2026 | Plantilla de revisión al inicio del sprint. | Equipo del proyecto |
