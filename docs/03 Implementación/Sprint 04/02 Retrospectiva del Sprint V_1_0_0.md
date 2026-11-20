# Retrospectiva del sprint

[← Volver al README principal](../../../README.md) · [← Revisión](<01 Revisión del Sprint V_1_0_0.md>) · [Playwright →](<03 Analisis PlayWrigth V_1_0_0.md>)

**Nombre del Proyecto:** WankaEcoLogística Huancayo

**Líder del Proyecto:** Nario German Reyes Rios

## ¿Qué aprendimos?

- EP-04 exige producto (indicadores/reportes) y plataforma (recuperación); conviene cerrarlos juntos para que la épica no quede “plomo” en el cronograma.
- La Inspección 04 (Green IT) es una entrega documental **paralela** a los sprints; la Inspección 5 exige además E2E, SUS y CI/CD explícitos en Sprint 4.
- Traducir plantillas genéricas (MERN) a PERN evita copiar APIs inexistentes y mantiene trazabilidad real al código del repo.
- Un workflow `quality.yml` no sustituye los tres archivos nombrados por la consigna (`ci.yml`, `tests.yml`, `deploy-production.yml`); hay que alinear nombres y artefactos.

## ¿Qué estamos haciendo bien?

- US-006, US-008, EN-003 y EP-04 quedaron **Listo** en Jira con implementación verificable.
- Existen scripts `ops:*` reproducibles para recuperación.
- Las evidencias Green IT (Lighthouse/SWDM) quedaron versionadas en `evidencias/` y enlazadas desde los informes.
- Hay suite Playwright previa en `pruebas/` que cubre autenticación y flujos operativos; se amplía a multi-navegador y métricas.

## ¿Qué podemos hacer mejor?

### Personas

Asignar con antelación quién captura evidencias PNG/HTML el mismo día de demos y drills, y quién aplica el cuestionario SUS a stakeholders.

### Relaciones

Coordinar frontend/backend antes de demos para que indicadores y exportación usen el mismo periodo de datos; avisar a stakeholders con URL y credenciales de demo.

### Procesos

Separar el cierre de sprint (Jira + revisión/retrospectiva) de Green IT, y actualizar el índice cuando se renumeran documentos (p. ej. EN-003 → `05`).

### Herramientas

Ejecutar Playwright en Chromium, Firefox y WebKit; publicar reportes HTML como artifacts de GitHub Actions; versionar métricas Web Vitals junto al informe.

### Acciones a realizar

| Acción | Responsable | Métrica de seguimiento | Indicador de cierre |
|---|---|---|---|
| Completar informe Playwright multi-navegador | Frontend / QA | 3 proyectos Playwright en verde | [03 Analisis PlayWrigth](<03 Analisis PlayWrigth V_1_0_0.md>) con evidencias |
| Aplicar SUS (n ≥ 5) y documentar | Equipo + stakeholders | Puntaje SUS global | [04 Usabilidad](<04 Usabilidad V_1_0_0.md>) sin marcadores vacíos |
| Publicar `ci.yml`, `tests.yml`, `deploy-production.yml` | DevOps / líder | Badges verdes en README | Workflows passing en Actions |
| Despliegue productivo con Secrets | Líder técnico | URL pública operativa | Job de deploy exitoso en `main` |

[← Volver al README principal](../../../README.md)

**Fin del documento**
