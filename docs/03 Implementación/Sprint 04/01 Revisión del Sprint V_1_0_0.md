# Revisión del sprint

[← Volver al README principal](../../../README.md) · [Retrospectiva →](<02 Retrospectiva del Sprint V_1_0_0.md>)

**Nombre del Proyecto:** WankaEcoLogística Huancayo

**Líder del Proyecto:** Nario German Reyes Rios

## Historias de Usuario completadas en este Sprint

| Código | Título | Criterios de aceptación verificados | Evidencia de cierre (DoD) |
|---|---|---|---|
| US-006 (EC-10) | Consultar indicadores | Rango con operaciones muestra CO₂, ahorro de distancia y nivel de servicio; periodo vacío no inventa cifras. | **Listo en Jira.** UI **Indicadores**, `GET /api/indicators`. Commit de cierre funcional: [`5759592`](https://github.com/Nario1/WankaEcoLogistica/commit/5759592). |
| US-008 (EC-12) | Exportar reporte | Usuario autorizado descarga CSV/PDF; rangos excesivos se rechazan. | **Listo en Jira.** Botones de exportación y `GET /api/reports/export`. Mismo incremento: [`5759592`](https://github.com/Nario1/WankaEcoLogistica/commit/5759592). |
| EN-003 (EC-15) | Recuperación de servicio | Respaldo restaurable, monitoreo y registro de RTO/RPO. | **Listo en Jira.** Scripts `ops:*` y [05 Recuperación de servicio](<05 Recuperación de servicio EN-003 V_1_0_0.md>). Commit: [`5759592`](https://github.com/Nario1/WankaEcoLogistica/commit/5759592). |
| EP-04 (EC-4) | Sostenibilidad y reportes | Cierre de la épica de indicadores, reportes y recuperación. | **Listo en Jira.** Empaquetado documental/evidencias: [`f3731d1`](https://github.com/Nario1/WankaEcoLogistica/commit/f3731d1). |

### Definición de terminado aplicada

Se consideró terminado un ítem cuando: (1) Jira lo registra como **Listo**; (2) el comportamiento se demuestra en la aplicación o con scripts `ops:*`; (3) existen pruebas automatizadas relevantes; y (4) la documentación del sprint referencia rutas reales del repositorio.

## Demostración del trabajo completado

**Fecha registrada:** 12/11/2026  
**Entorno:** frontend local (Vite/preview) y API Express local; evidencias Green IT en `evidencias/`.

**Funcionalidades exhibidas a stakeholders / equipo:**

1. Administrador consulta **Indicadores** por periodo y observa CO₂, ahorro y nivel de servicio (o aviso sin datos).
2. Administrador/auditor exporta CSV y PDF del mismo periodo.
3. Se ejecuta `npm run ops:simulate` y se verifica RTO/RPO en el reporte de recuperación.

**Retroalimentación recibida:** se validó el cierre de EP-04 en Jira y la coherencia de indicadores con datos reales de operación; se pidió reforzar evidencias de usabilidad y E2E multi-navegador en el paquete de Inspección 5 (este entregable).

**Actas / evidencias adjuntas en el repositorio:**

![Pedidos autenticado (paginación 12)](<../../../evidencias/pantalla-pedidos.png>)

![Lighthouse DESPUÉS desktop](<../../../evidencias/lighthouse-despues-desktop.png>)

## Pendientes

| Ítem | Estado | Tratamiento |
|---|---|---|
| US-007 (EC-11) | Consta como **Listo** en Jira junto al resto del proyecto EC | Fuera del alcance demostrativo prioritario de este informe; se mantiene en el tablero histórico. |
| Evaluación SUS formal (Inspección 5) | En curso en este paquete | Ver [04 Usabilidad](<04 Usabilidad V_1_0_0.md>). |
| Suite Playwright multi-navegador + informe | En curso en este paquete | Ver [03 Analisis PlayWrigth](<03 Analisis PlayWrigth V_1_0_0.md>). |
| CI/CD con `ci.yml`, `tests.yml` y `deploy-production.yml` | En curso en este paquete | Workflows en `.github/workflows/`. |
| Acta firmada de stakeholders | No adjuntada | Se documenta la demo técnica del equipo; el acta formal queda como mejora de cierre académico. |

## Estructura documental del Sprint 04 (Inspección 5)

```text
docs/03 Implementación/Sprint 04/
├── 01 Revisión del Sprint V_1_0_0.md
├── 02 Retrospectiva del Sprint V_1_0_0.md
├── 03 Analisis PlayWrigth V_1_0_0.md
├── 04 Usabilidad V_1_0_0.md
└── 05 Recuperación de servicio EN-003 V_1_0_0.md
```

La Inspección 04 (Green IT) permanece en [`../reduccion del impacto ambiental/`](<../reduccion del impacto ambiental/01 Informe de reduccion del impacto ambiental V_1_0_0.md>).

[← Volver al README principal](../../../README.md)

**Fin del documento**
