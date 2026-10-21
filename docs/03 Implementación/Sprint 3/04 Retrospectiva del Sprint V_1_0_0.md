# Retrospectiva del Sprint 3

[← Anterior: Revisión](<03 Revisión del Sprint V_1_0_0.md>) · [README principal](../../../README.md) · [Volver al inicio →](../../../README.md)

**Nombre del proyecto:** WankaEcoLogística Huancayo

**Líder del proyecto:** Equipo del proyecto

**Versión:** V_1_0_2

**Fecha de cierre técnico:** 21/10/2026

## ¿Qué aprendimos?

El seguimiento en campo requiere tres entregables distintos: adaptador vial, vista del conductor y estrategia offline. El mapa del planificador no cierra US-005. Los bloqueos del sprint fueron sobre todo de entorno y de alcance en Jira; documentarlos ayuda, pero **nunca** deben incluir contraseñas ni cadenas de conexión.

## ¿Qué estamos haciendo bien?

- Orden EN-005 → US-005 → EN-004.
- Limpieza del sprint en Jira antes de codificar.
- Control de acceso del conductor en el servicio, no solo en el menú.
- Pruebas de adaptador, API y Playwright alineadas a la aceptación.
- Secretos fuera del código fuente (`.env` local).

## ¿Qué podemos hacer mejor?

### Personas

Preparar un seed de conductor de demo al inicio del sprint de campo, con credenciales solo en el entorno local.

### Relaciones

Validar offline en un dispositivo real con Operaciones, no solo con `setOffline` de escritorio.

### Procesos

Redactar impedimentos el mismo día, con el rigor del Sprint 2, y revisar el texto antes del push para excluir secretos.

### Herramientas

Dejar en la guía local el puerto `5174`, `PLAYWRIGHT_BROWSERS_PATH` y `TEST_DATABASE_URL`, más un plan B si falla un plugin npm (como con la PWA).

### Acciones a realizar

| Acción | Responsable | Prioridad | Fecha objetivo | Indicador de cierre |
|---|---|---|---|---|
| Rotar la contraseña local de PostgreSQL si quedó expuesta en un commit previo | Responsable del entorno | Alta | Inmediato | Credencial nueva solo en `.env`; búsqueda sin coincidencias en `main`. |
| Documentar puerto `5174` y variables E2E en README sin secretos | Equipo técnico | Alta | Inicio del siguiente sprint | Arranque reproducible por un compañero nuevo. |
| Capturas móviles / 3G de Mi ruta offline | Calidad / Henry | Media | Cierre ante stakeholders | Evidencia adjunta a la revisión o a EC-16. |
| PostGIS + Playwright browsers en CI | Equipo técnico | Alta | Próximo sprint | Pipeline sin omisiones PostGIS ni fallos de Chromium por path. |
| Extender cola offline a mutaciones reales del conductor | Frontend | Media | Cuando exista US de actualización en campo | Sync más allá de la caché de consulta. |

## Historial de control de cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_2 | 21/10/2026 | Retrospectiva con acción de rotación de credenciales y sin secretos. | Equipo del proyecto |
| V_1_0_1 | 21/10/2026 | Retrospectiva de cierre con aprendizajes y plan de acción. | Equipo del proyecto |
| V_1_0_0 | 21/10/2026 | Plantilla de retrospectiva al inicio del Sprint 3. | Equipo del proyecto |
