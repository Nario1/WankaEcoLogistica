# Registro de impedimentos

[← Volver al README principal](../../../README.md)

**Nombre del proyecto:** WankaEcoLogística Huancayo

**Líder del proyecto:** Equipo del proyecto

**Versión:** V_1_0_0

| Impedimento # | Fecha de registro | Descripción e impacto | Prioridad | Reportado por | Fecha tope | Estado | Fecha de resolución | Resolución / comentarios |
|---|---|---|---|---|---|---|---|---|
| IMP-S2-001 | 05/10/2026 | La migración ejecutaba únicamente el archivo del Sprint 1 e impedía incorporar campos de optimización. | Alta | Equipo técnico | 06/10/2026 | Resuelto | 06/10/2026 | El ejecutor procesa en orden todos los archivos `.sql` de `backend/migrations/`. |
| IMP-S2-002 | 06/10/2026 | La creación separada de ruta y asignaciones podía dejar un lote parcialmente aplicado ante un error. | Alta | Equipo técnico | 07/10/2026 | Resuelto | 07/10/2026 | Se implementó una transacción con `BEGIN`, `COMMIT`, `ROLLBACK` y liberación garantizada de conexión. |
| IMP-S2-003 | 07/10/2026 | PowerShell bloqueó `npm.ps1`, impidiendo inicialmente ejecutar los controles locales. | Media | Equipo técnico | 07/10/2026 | Resuelto | 07/10/2026 | Se utilizó `npm.cmd`, equivalente en Windows y sin modificar la política del equipo. |
| IMP-S2-004 | 07/10/2026 | La integración PostGIS se omitía cuando faltaba `TEST_DATABASE_URL`; reducía la evidencia de integración. | Media | Equipo técnico | 07/10/2026 | Resuelto localmente | 07/10/2026 | Se ejecutó contra la base local migrada: 19 de 19 pruebas aprobadas. Queda automatizar una base aislada en CI. |

## Historial de control de cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_0 | 07/10/2026 | Registro inicial de impedimentos del Sprint 2. | Equipo del proyecto |
