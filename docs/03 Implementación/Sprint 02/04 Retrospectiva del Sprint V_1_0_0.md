# Retrospectiva del Sprint 02

[← Anterior: Revisión](<03 Revisión del Sprint V_1_0_0.md>) · [README principal](../../../README.md) · [Siguiente: Sprint 03 →](<../Sprint 03/01 Revisión del Sprint V_1_0_0.md>)

**Nombre del proyecto:** WankaEcoLogística Huancayo

**Líder del proyecto:** Equipo del proyecto

**Versión:** V_1_0_10

**Fecha de cierre:** 08/10/2026

## ¿Qué aprendimos?

La optimización no termina en ordenar coordenadas: debe identificar la carga, recomendar recursos, sugerir horarios comprensibles, rechazar resultados parciales y representar calles transitables sin confundir una línea recta con navegación. Separar heurística, persistencia, proveedor vial y presentación permitió probar cada responsabilidad.

## ¿Qué estamos haciendo bien?

- Las reglas permanecen en servicios y la persistencia en repositorios.
- Cada operación de optimización queda auditada sin exponer información sensible.
- Los errores de capacidad, disponibilidad y ventanas son explícitos.
- El contrato, la interfaz, la migración, las pruebas y la documentación avanzan juntos.
- El formulario integrado reduce pasos y conserva validaciones defensivas en el backend.

## ¿Qué podemos hacer mejor?

### Personas

Asignar responsables explícitos para validación funcional, revisión técnica y preparación de datos antes de iniciar el sprint.

### Relaciones

Realizar la demostración con el responsable operativo para contrastar prioridades, tiempos de servicio y ubicación real del depósito.

### Procesos

Mantener la planificación y la evidencia de aceptación sincronizadas durante el sprint mediante una revisión intermedia de trazabilidad.

### Herramientas

Proveer PostgreSQL/PostGIS aislado en CI y publicar los resultados de cobertura y benchmark como artefactos del pipeline.

### Acciones a realizar

| Acción | Responsable | Prioridad | Fecha objetivo | Indicador de cierre | Seguimiento documentado al 30/10/2026 |
|---|---|---|---|---|---|
| Configurar `TEST_DATABASE_URL` en CI | Equipo técnico | Alta | Inicio del Sprint 03 | Prueba PostGIS ejecutada sin omisiones. | **Configuración implementada:** `.github/workflows/quality.yml` define PostGIS y `TEST_DATABASE_URL`. Falta adjuntar un resultado de ejecución de CI para acreditar el indicador de cierre. |
| Revisar periódicamente depósito y tiempo de servicio con Operaciones | Líder y stakeholder operativo | Media | Refinamiento del Sprint 03 | Parámetros ratificados o actualizados y versionados. | **Pendiente de evidencia:** los documentos de Sprint 03 no incluyen acta o registro de ratificación por Operaciones. |
| Incorporar prueba de concurrencia de optimización | Equipo técnico | Media | Sprint 03 | Dos solicitudes no pueden reservar el mismo pedido. | **Pendiente de verificación:** no se identificó un resultado de prueba de concurrencia vinculado a esta acción. Registrar test y ejecución cuando exista. |
| Adjuntar evidencia de staging al cierre | Responsable de calidad | Alta | Próxima revisión | URL y ejecución del pipeline registradas. | **Pendiente:** no se documenta URL ni resultado de despliegue en staging. |

## Historial de control de cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_11 | 30/10/2026 | Se documenta el seguimiento de las acciones heredadas por el Sprint 03 y la evidencia disponible. | Nario German Reyes Rios |
| V_1_0_10 | 08/10/2026 | Aprendizajes y acciones sincronizados con la planificación integral y navegación vial. | Equipo del proyecto |
| V_1_0_1 | 07/10/2026 | Mejora de procesos y navegación según retroalimentación docente. | Equipo del proyecto |
| V_1_0_0 | 07/10/2026 | Retrospectiva y plan de acción del Sprint 02. | Equipo del proyecto |
