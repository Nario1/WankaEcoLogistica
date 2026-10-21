# Registro de impedimentos

[← Anterior: Informe](<01 Informe de estado del proyecto V_1_0_0.md>) · [README principal](../../../README.md) · [Siguiente: Revisión →](<03 Revisión del Sprint V_1_0_0.md>)

**Nombre del proyecto:** WankaEcoLogística Huancayo

**Líder del proyecto:** Equipo del proyecto

**Versión:** V_1_0_2

| Impedimento # | Fecha de registro | Descripción del impedimento e impacto | Prioridad | Reportado por | Fecha tope de resolución | Estado | Fecha de resolución | Resolución / comentarios |
|---|---|---|---|---|---|---|---|---|
| IMP-S3-001 | 20/10/2026 | El `DATABASE_URL` local no coincidía con la instancia PostgreSQL del equipo; la API no iniciaba y se retrasaba la validación de EN-005/US-005. | Alta | Equipo técnico | 20/10/2026 | Resuelto | 20/10/2026 | Se alineó `backend/.env` (fuera de Git) con la base local y se verificó `/health`. Las credenciales no se documentan ni se versionan. |
| IMP-S3-002 | 20/10/2026 | La prueba PostGIS del entorno local fallaba u omitía resultados si la extensión no estaba disponible, debilitando la evidencia de calidad del sprint. | Media | Equipo técnico | 21/10/2026 | Resuelto | 21/10/2026 | Se confirmó PostGIS en la base de desarrollo, se configuró `TEST_DATABASE_URL` solo en el entorno local y la suite ejecutó la integración sin omisiones. |
| IMP-S3-003 | 20/10/2026 | El backlog del Sprint 3 en Jira incluía ítems ajenos a EP-03 y no reflejaba el orden EN-005 → US-005 → EN-004. | Alta | Líder del proyecto | 21/10/2026 | Resuelto | 21/10/2026 | Se limpió el sprint activo, se asignaron responsables y se dejaron solo los tres ítems del objetivo (EC-17, EC-9, EC-16). |
| IMP-S3-004 | 21/10/2026 | El mapa del planificador podía interpretarse como cumplimiento de US-005, generando falsa completitud del seguimiento en campo. | Alta | Equipo / producto | 21/10/2026 | Resuelto | 21/10/2026 | Se entregó la vista **Mi ruta** del conductor, `GET /api/routes/mine` y control de acceso por propiedad de la ruta. |
| IMP-S3-005 | 21/10/2026 | El puerto por defecto de Vite coincidía con otra aplicación local; CORS y Playwright apuntaban a orígenes distintos. | Media | Equipo frontend | 21/10/2026 | Resuelto | 21/10/2026 | Frontend fijado a `5174` (`strictPort`); `CORS_ORIGIN` y la base URL de Playwright alineados a ese puerto. |
| IMP-S3-006 | 21/10/2026 | Playwright no encontraba Chromium en la ruta de cache del entorno de ejecución; las pruebas E2E del conductor no arrancaban. | Alta | Equipo de calidad | 21/10/2026 | Resuelto | 21/10/2026 | Se apuntó `PLAYWRIGHT_BROWSERS_PATH` al cache de usuario de Playwright y se revalidó la suite `pruebas/`. |
| IMP-S3-007 | 21/10/2026 | La instalación de `vite-plugin-pwa` falló por interrupción de red con el registro npm; EN-004 quedaba bloqueada si dependía de ese plugin. | Media | Equipo frontend | 21/10/2026 | Mitigado | 21/10/2026 | Se implementó PWA con `manifest.webmanifest`, `public/sw.js` y registro en la SPA, sin añadir la dependencia fallida. |
| IMP-S3-008 | 21/10/2026 | No había un usuario DRIVER de demo en la base local para aceptar US-005 ni automatizar el flujo Playwright. | Media | Equipo técnico | 21/10/2026 | Resuelto | 21/10/2026 | Se creó un conductor de demo solo en la base local (credenciales fuera de Git) y se añadieron pruebas E2E de **Mi ruta** y aviso offline. |

No quedaron impedimentos que bloqueen el incremento. Las mejoras residuales (CI, capturas móviles y seed documentado sin secretos) tienen responsable e indicador en la retrospectiva.

**Nota de seguridad:** este registro no incluye contraseñas, tokens ni cadenas de conexión completas. Cualquier filtración accidental debe corregirse de inmediato y rotar la credencial afectada.

## Historial de control de cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_2 | 21/10/2026 | Eliminación de credenciales del texto y reformulación coherente de impedimentos. | Equipo del proyecto |
| V_1_0_1 | 21/10/2026 | Registro completo de impedimentos del Sprint 3 con resolución. | Equipo del proyecto |
| V_1_0_0 | 21/10/2026 | Registro inicial vacío al arranque del Sprint 3. | Equipo del proyecto |
