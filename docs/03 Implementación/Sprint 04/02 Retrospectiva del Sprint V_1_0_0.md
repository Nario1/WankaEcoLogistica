# Retrospectiva del sprint

[← Anterior: Revisión](<01 Revisión del Sprint V_1_0_0.md>) · [README principal](../../../README.md) · [Siguiente: Recuperación EN-003 →](<03 Recuperación de servicio EN-003 V_1_0_0.md>)

**Nombre del proyecto:** WankaEcoLogística Huancayo

**Líder del proyecto:** Nario German Reyes Rios

**Sprint:** 4 — sostenibilidad operativa y recuperación (EP-04)

**Periodo informado:** 04/11/2026–12/11/2026

**Fecha de retrospectiva documentada:** 12/11/2026

## ¿Qué aprendimos?

- EP-04 exige producto (indicadores/reportes) y plataforma (recuperación); conviene cerrarlos juntos para que la épica no quede “plomo” en el cronograma.
- La Inspección 04 (Green IT) es una entrega documental **paralela** a los sprints: vive en `docs/03 Implementación/reduccion del impacto ambiental/`, no dentro de Sprint 04.
- Traducir la plantilla MERN a PERN (PostgreSQL) evita copiar `.lean()`/Mongoose y mantiene trazabilidad real al código del repo.

## ¿Qué estamos haciendo bien?

- US-006, US-008, EN-003 y EP-04 quedaron **Listo** en Jira con implementación verificable.
- Existen scripts `ops:*` reproducibles para recuperación.
- Las evidencias Green IT (Lighthouse/SWDM) quedaron versionadas junto a los informes de la consigna.

## ¿Qué podemos hacer mejor?

### Personas

Asignar con antelación quién captura evidencias PNG/HTML el mismo día del drill Lighthouse, para no mezclar baselines de builds distintos.

### Procesos

Separar el cierre de sprint (Jira + revisión/retrospectiva) de la carpeta consignada de Green IT, y actualizar el índice en ambos.

### Tecnología

Repetir Lighthouse en desktop y móvil con el mismo commit hasheado; versionar `metricas-consolidadas.json` en cada inspección.

## Acciones

| Acción | Responsable | Prioridad | Indicador de cierre |
|---|---|---|---|
| Publicar commit del Sprint 04 + carpeta Green IT | Equipo | Alta | Cambios visibles en `main` |
| Ejecutar `db:migrate` (005 índices) en entornos de demo | Backend | Media | Migración aplicada sin error |
| Ampliar muestra Lighthouse a dashboard autenticado | Frontend | Media | Nueva evidencia en `reduccion del impacto ambiental/evidencias/` |

**Fin del documento**
