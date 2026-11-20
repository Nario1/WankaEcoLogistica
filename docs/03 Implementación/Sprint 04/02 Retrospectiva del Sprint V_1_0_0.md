# Retrospectiva del sprint

[← Volver al README principal](../../../README.md) · [← Revisión](<01 Revisión del Sprint V_1_0_0.md>) · [Playwright →](<03 Analisis PlayWrigth V_1_0_0.md>) · [Usabilidad →](<04 Usabilidad V_1_0_0.md>)

**Nombre del Proyecto:** WankaEcoLogística Huancayo

**Líder del Proyecto:** Nario German Reyes Rios

**Sprint:** 4 — sostenibilidad operativa, recuperación e Inspección 5  
**Fecha de retrospectiva documentada:** 20/11/2026

## ¿Qué aprendimos?

- EP-04 exige producto (indicadores/reportes) y plataforma (recuperación); conviene cerrarlos juntos para que la épica no quede a medias en el cronograma.
- La Inspección 5 exige evidencia ejecutable (Playwright multi-navegador, SUS cuantitativo y tres workflows CI/CD), no solo narrativa de cierre.
- Un Service Worker en desarrollo puede envenenar el caché de módulos de Vite y provocar pantalla en blanco (doble React); el SW debe limitarse a producción.
- Separar Green IT (Inspección 04) de la carpeta Sprint 04 evita mezclar consignas y facilita la rúbrica del docente.

## ¿Qué estamos haciendo bien?

- US-006, US-008, EN-003 y EP-04 quedaron **Listo** en Jira con implementación verificable en `main`.
- Existen scripts `ops:*` reproducibles para recuperación.
- El repositorio mantiene separación clara `frontend/` / `backend/` y documentación versionada en `docs/`.
- Las evidencias Green IT viven en `evidencias/` (raíz) y se enlazan desde los informes.

## ¿Qué podemos hacer mejor?

### Personas

Asignar con antelación quién captura evidencias PNG/HTML el mismo día de la corrida Playwright/Lighthouse, para no mezclar baselines de builds distintos. Equilibrar carga entre quien documenta SUS y quien mantiene CI.

### Relaciones

Mejorar la sincronización frontend/backend antes de demos (CORS, seed de usuarios E2E y variables `PLAYWRIGHT_*`). Mantener un canal corto con stakeholders para validar tareas SUS antes del cuestionario.

### Procesos

Separar el cierre de sprint (Jira + revisión/retrospectiva) de las carpetas consignadas (Green IT vs Inspección 5). Exigir enlace commit/PR en cada fila de HU de la revisión. Usar ramas `feature/*` → PR hacia `main` con Actions en verde.

### Herramientas

- Playwright con reporter HTML y artefactos en GitHub Actions.
- Tres workflows explícitos (`ci.yml`, `tests.yml`, `deploy-production.yml`) además de `green-audit.yml`.
- Secretos solo vía GitHub Secrets (`DEPLOY_HOOK_URL`, credenciales E2E).

### Acciones a realizar

| Acción | Responsable | Métrica / indicador de cierre | Fecha objetivo |
|---|---|---|---|
| Mantener `tests.yml` en verde en cada push a `main` | Equipo | Workflow **Tests** = success; artefacto `playwright-report` disponible | Continuo |
| Configurar `DEPLOY_HOOK_URL` y verificar URL productiva | Líder / DevOps | Hook 2xx y frontend accesible tras push a `main` | 27/11/2026 |
| Aplicar mejoras UX priorizadas por SUS (copy de formularios densos) | Frontend | Reevaluación SUS spot ≥ 68 tras el cambio | 04/12/2026 |
| Versionar capturas Playwright/SUS en `evidencias/` cuando cambie el build | Documentación | PNG/HTML con fecha alineada al commit de cierre | Cada inspección |

**Fin del documento**
