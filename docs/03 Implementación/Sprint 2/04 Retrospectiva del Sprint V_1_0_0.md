# Retrospectiva del Sprint 2

[← Anterior: Revisión](<03 Revisión del Sprint V_1_0_0.md>) · [Índice del Sprint 2](README.md) · [README principal](../../../README.md)

**Nombre del proyecto:** WankaEcoLogística Huancayo

**Líder del proyecto:** Equipo del proyecto

**Versión:** V_1_0_1

**Fecha de cierre:** 07/10/2026

## ¿Qué aprendimos?

La optimización no termina en ordenar coordenadas: debe rechazar resultados parciales, reservar recursos sin carreras y demostrar restricciones operativas. Separar la heurística pura de la persistencia permitió medirla y probar casos límite sin depender de PostgreSQL.

## ¿Qué estamos haciendo bien?

- Las reglas permanecen en servicios y la persistencia en repositorios.
- Cada operación de optimización queda auditada sin exponer información sensible.
- Los errores de capacidad, disponibilidad y ventanas son explícitos.
- El contrato, la interfaz, la migración, las pruebas y la documentación avanzan juntos.

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

| Acción | Responsable | Prioridad | Fecha objetivo | Indicador de cierre |
|---|---|---|---|---|
| Configurar `TEST_DATABASE_URL` en CI | Equipo técnico | Alta | Inicio del Sprint 3 | Prueba PostGIS ejecutada sin omisiones. |
| Validar depósito y tiempo de servicio con Operaciones | Líder y stakeholder operativo | Alta | Refinamiento del Sprint 3 | Parámetros aprobados y versionados. |
| Incorporar prueba de concurrencia de optimización | Equipo técnico | Media | Sprint 3 | Dos solicitudes no pueden reservar el mismo pedido. |
| Adjuntar evidencia de staging al cierre | Responsable de calidad | Alta | Próxima revisión | URL y ejecución del pipeline registradas. |

## Historial de control de cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_1 | 07/10/2026 | Mejora de procesos y navegación según retroalimentación docente. | Equipo del proyecto |
| V_1_0_0 | 07/10/2026 | Retrospectiva y plan de acción del Sprint 2. | Equipo del proyecto |
