# Revisión del sprint

[← Volver al README principal](../../../README.md) · [Retrospectiva →](<02 Retrospectiva del Sprint V_1_0_0.md>) · [Playwright →](<03 Analisis PlayWrigth V_1_0_0.md>) · [Usabilidad →](<04 Usabilidad V_1_0_0.md>)

**Nombre del Proyecto:** WankaEcoLogística Huancayo

**Líder del Proyecto:** Nario German Reyes Rios

**Sprint:** 4 — sostenibilidad operativa, recuperación y cierre de Inspección 5  
**Periodo:** 04/11/2026–20/11/2026  
**Fecha de demostración:** 20/11/2026  
**Entorno de demostración:** staging local (Vite `http://localhost:5174` + API Express `http://localhost:3000`) y validación en `main` vía GitHub Actions

## Historias de Usuario completadas en este Sprint

| Código | Título | Criterios de aceptación verificados | Evidencia DoD (commit / artefacto) |
|---|---|---|---|
| US-006 (EC-10) | Consultar indicadores de sostenibilidad | Rango de fechas muestra CO₂, ahorro de distancia y nivel de servicio; periodo vacío no inventa cifras. | Commit `5759592` (`feat(ep-04): indicadores, reportes y recuperación de servicio`); menú **Indicadores**; `GET /api/indicators`. |
| US-008 (EC-12) | Exportar reporte CSV/PDF | Usuario autorizado descarga CSV/PDF; rangos excesivos se rechazan. | Mismo commit `5759592`; botones de exportación; `GET /api/reports/export`. |
| EN-003 (EC-15) | Recuperación de servicio | Respaldo restaurable, monitoreo y registro de RTO/RPO. | `5759592` + documento [EN-003 Recuperación de servicio](<../EN-003 Recuperación de servicio V_1_0_0.md>); scripts `ops:*`. |
| EP-04 (EC-4) | Cierre de sostenibilidad y reportes | Épica cerrada en Jira (**Listo**). | Tablero EC + paquete Sprint 04 en `docs/03 Implementación/Sprint 04/`. |
| Inspección 5 | Cierre técnico Sprint 4 | E2E Playwright, SUS, CI/CD (`ci` / `tests` / `deploy-production`) y trazabilidad README. | Commits de cierre en `main`; workflows en `.github/workflows/`; informes `03` y `04` de este sprint. |

### Definición de terminado aplicada

Un ítem se consideró **terminado** cuando: (1) Jira lo registra como **Listo**; (2) el comportamiento se demuestra en la aplicación o con scripts; (3) existen pruebas automatizadas relevantes; (4) la documentación del sprint referencia rutas reales del repositorio.

## Demostración del trabajo completado

1. **Autenticación y RBAC:** inicio de sesión administrador y conductor (Playwright `auth.spec.js`).
2. **Indicadores (US-006):** consulta por periodo de CO₂, ahorro de distancia y nivel de servicio.
3. **Reportes (US-008):** exportación CSV/PDF del mismo periodo.
4. **Recuperación (EN-003):** ejecución de `npm run ops:simulate` y revisión de RTO/RPO.
5. **Calidad E2E / CI:** corrida Playwright (Chromium/Firefox/WebKit) y pipelines `ci.yml` + `tests.yml` en verde sobre `main`.

**Retroalimentación registrada:** se priorizó dejar evidencia reproducible (commits, reportes HTML de Playwright y badges de Actions) frente a actas firmadas externas; la validación formal con stakeholders de negocio queda como pendiente menor de cierre administrativo.

## Pendientes

| Ítem | Justificación | Tratamiento |
|---|---|---|
| Acta firmada de stakeholders externos | La demo se registró en entorno controlado del equipo; no se adjuntó firma externa. | Archivar acta en la próxima reunión de seguimiento; no bloquea DoD técnico. |
| Secretos de despliegue productivo continuo | `deploy-production.yml` publica el artefacto `frontend/dist` y dispara el hook solo si existe `DEPLOY_HOOK_URL`. | Configurar el secret en GitHub y el destino (Render/Railway/Vercel) para el go-live definitivo. |
| Deuda menor de UX (SUS) | El puntaje SUS ≥ 68; se identificaron mejoras de copy en formularios densos. | Backlog de mantenimiento post–Sprint 4 (ver [04 Usabilidad](<04 Usabilidad V_1_0_0.md>)). |

**Fin del documento**
