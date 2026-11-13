# Revisión del sprint

[← Sprint 03](<../Sprint 03/02 Retrospectiva del Sprint V_1_0_0.md>) · [README principal](../../../README.md) · [Siguiente: Retrospectiva →](<02 Retrospectiva del Sprint V_1_0_0.md>)

**Nombre del proyecto:** WankaEcoLogística Huancayo

**Líder del proyecto:** Nario German Reyes Rios

**Sprint:** 4 — sostenibilidad operativa y recuperación (EP-04)

**Periodo informado:** 04/11/2026–12/11/2026

**Fecha de demostración técnica registrada:** 12/11/2026

**Entorno de demostración registrado:** frontend local (Vite/preview) y API Express local

## Objetivo del sprint

Entregar el incremento de sostenibilidad operativa (indicadores y exportación) y asegurar la recuperación de servicio (respaldos/monitoreo/RTO-RPO), cerrando EP-04 en Jira.

## Historias y habilitadores completados

| ID del backlog | Tipo | Criterio de aceptación | Estado informado y evidencia |
|---|---|---|---|
| US-006 | Historia — consultar indicadores | Rango de fechas con operaciones muestra CO₂, ahorro de distancia y nivel de servicio; periodo vacío no inventa cifras. | **Listo en Jira (EC-10).** Menú **Indicadores**, `GET /api/indicators`. |
| US-008 | Historia — exportar reporte | Usuario autorizado descarga CSV/PDF; rangos excesivos se rechazan. | **Listo en Jira (EC-12).** Botones de exportación y `GET /api/reports/export`. |
| EN-003 | Habilitador — recuperación de servicio | Respaldo restaurable, monitoreo y registro de RTO/RPO. | **Listo en Jira (EC-15).** Ver [03 Recuperación de servicio](<03 Recuperación de servicio EN-003 V_1_0_0.md>). |
| EP-04 | Épica | Cierre de sostenibilidad y reportes. | **Listo en Jira (EC-4).** |

### Definición de terminado aplicada

Se consideró terminado un ítem cuando: (1) Jira lo registra como **Listo**; (2) el comportamiento se demuestra en la aplicación o con scripts `ops:*`; (3) existen pruebas automatizadas relevantes; y (4) la documentación del sprint referencia rutas reales del repositorio.

## Demostración del incremento

1. Administrador consulta **Indicadores** por periodo y observa CO₂, ahorro y nivel de servicio (o aviso sin datos).
2. Administrador/auditor exporta CSV y PDF del mismo periodo.
3. Se ejecuta `npm run ops:simulate` y se verifica RTO/RPO en el reporte.

## Estructura documental del Sprint 04

```text
docs/03 Implementación/Sprint 04/
├── 01 Revisión del Sprint V_1_0_0.md
├── 02 Retrospectiva del Sprint V_1_0_0.md
└── 03 Recuperación de servicio EN-003 V_1_0_0.md
```

La Inspección 04 (Green IT) se entrega **fuera** de esta carpeta, en la ruta consignada por el docente: [`../reduccion del impacto ambiental/`](<../reduccion del impacto ambiental/01 Informe de reduccion del impacto ambiental V_1_0_0.md>).

## Estado del tablero al cierre

- US-007 (EC-11) consta como **Listo** en Jira junto al resto del proyecto EC.
- Validación formal de stakeholders con acta firmada no se adjunta aquí.

**Fin del documento**
