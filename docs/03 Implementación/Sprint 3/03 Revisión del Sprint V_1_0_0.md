# Revisión del Sprint 3

[← Anterior: Impedimentos](<02 Registro de Impedimentos V_1_0_0.md>) · [README principal](../../../README.md) · [Siguiente: Retrospectiva →](<04 Retrospectiva del Sprint V_1_0_0.md>)

**Nombre del proyecto:** WankaEcoLogística Huancayo

**Líder del proyecto:** Equipo del proyecto

**Versión:** V_1_0_2

## Historias de usuario completadas en este Sprint

| Ítem | Resultado | Criterios demostrados |
|---|---|---|
| EN-005 | Adaptador de mapas/tráfico desacoplado del dominio. | Contrato `calculate()`, proveedores OSRM/TomTom/stub, selección por configuración o inyección, pruebas de sustitución. |
| US-005 | El conductor consulta su ruta y paradas en un mapa responsivo. | Rol DRIVER, menú **Mi ruta**, `/api/routes/mine`, trazado/paradas, denegación de rutas ajenas, aviso sin conexión. |
| EN-004 | Base PWA offline para la última ruta visitada. | Manifest, service worker, caché local y mensaje al recuperar red. |

## Demostración del trabajo completado

1. API en `http://localhost:3000` y frontend en `http://localhost:5174`.
2. Como planificador (Sprint 2), crear/asignar una ruta optimizada a un conductor.
3. Como conductor, abrir **Mi ruta**: sin asignación se informa; con asignación se ven paradas y, si el motor vial responde, el trazado.
4. Simular pérdida de red: aparece el aviso de conectividad y se conserva la caché de la sesión.
5. Al recuperar red se refrescan datos y se limpia la cola de sincronización pendiente.

Las credenciales de demo se gestionan solo en el entorno local; no forman parte de este documento.

## Evidencia de calidad

- Adaptador: resolución stub/osrm/tomtom y sustitución sin cambiar el contrato.
- Rutas: el conductor solo consulta la ruta asignada.
- PostGIS: coordenadas dentro del margen de 10 m con `TEST_DATABASE_URL` local.
- Backend: 34 aprobadas, 0 fallidas; cobertura ≈ 88 %.
- Playwright (`pruebas/`): 3/3 (pedido en mapa, Mi ruta, offline).
- OpenAPI con `/api/routes/mine`.
- Impedimentos IMP-S3-001 a IMP-S3-008 cerrados o mitigados, sin secretos en el texto.

## Pendientes

- Capturas de la demo en dispositivo móvil / perfil 3G.
- Seed o script documentado de conductor de demo **sin** publicar contraseñas.
- Mantener en CI `TEST_DATABASE_URL` y el path de navegadores Playwright.
- US-006, US-007 y US-008 siguen en sprints posteriores.

## Verificación complementaria del incremento

La regresión del Sprint 2 permanece verde (optimización, navegación del planificador, RBAC y CRUD). El mapa del planificador no sustituye US-005.

## Historial de control de cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_2 | 21/10/2026 | Revisión sin credenciales y pendientes actualizados tras el push. | Equipo del proyecto |
| V_1_0_1 | 21/10/2026 | Revisión de cierre con demostración y evidencia. | Equipo del proyecto |
| V_1_0_0 | 21/10/2026 | Plantilla de revisión al inicio del Sprint 3. | Equipo del proyecto |
