# Informe de estado del proyecto

[← Índice del Sprint 1](README.md) · [Implementación](../README.md) · [README principal](../../../README.md) · [Siguiente: Impedimentos →](<02 Registro de Impedimentos V_1_0_0.md>)

| Campo | Información |
|---|---|
| Nombre del proyecto | WankaEcoLogística Huancayo |
| Líder del proyecto | Equipo del proyecto |
| Versión | V_1_0_1 |
| Fecha | 02/10/2026 |
| Periodo | Cierre del Sprint 1 |

## Resumen ejecutivo

El Sprint 1 entregó una base operativa segura para gestionar pedidos, vehículos, conductores y rutas manuales. El incremento incorporó autenticación, autorización por roles, auditoría, validación geoespacial y cálculo reproducible de emisiones.

## Estado del alcance

| Ítem | Estado | Evidencia verificable |
|---|---|---|
| US-001 — Registrar y actualizar pedidos | Completado | API, formulario y pruebas de datos válidos, inválidos y límites. |
| US-002 — Administrar vehículos | Completado | Alta, actualización, placa única y estado operativo. |
| US-003 — Asignar conductores | Completado | Asignación y rechazo de solapamientos o jornadas mayores a ocho horas. |
| EN-002 — Autenticación y RBAC | Completado | JWT, permisos por rol y bloqueo temporal de acceso. |
| EN-006 — Integridad geoespacial | Completado | PostGIS, SRID 4326 y prueba de precisión geográfica. |

## Indicadores de control

| Variable | Estado | Resultado |
|---|---|---|
| Alcance | Verde | Cinco ítems planificados completados. |
| Cronograma | Verde | Flujos comprometidos verificados al cierre. |
| Calidad | Verde | 16 pruebas aprobadas, cobertura de líneas de 87,75 %, lint, formato y build aprobados. |
| Seguridad | Verde | Credenciales fuera del repositorio y operaciones protegidas en servidor. |
| Riesgos técnicos | Controlados | Guía de configuración, validaciones y migraciones repetibles disponibles. |

## Riesgos y mitigación

| Riesgo | Responsable | Mitigación preventiva |
|---|---|---|
| Diferencias entre entornos PostgreSQL/PostGIS | Equipo técnico | Versionar requisitos, migraciones repetibles y procedimiento de verificación. |
| Datos operativos no representativos | Equipo y stakeholder operativo | Validar datos de demostración antes de la revisión del sprint. |
| Exposición accidental de credenciales | Equipo técnico | Excluir `.env`, publicar sólo ejemplos y usar secretos por entorno. |

## Próximos avances

1. Optimizar rutas respetando capacidad, prioridad y ventanas.
2. Medir el rendimiento con 50 puntos.
3. Mantener OpenAPI, pruebas y documentación sincronizados.

## Historial de control de cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_1 | 07/10/2026 | Mejora de navegación, trazabilidad y enfoque preventivo según retroalimentación docente. | Equipo del proyecto |
| V_1_0_0 | 02/10/2026 | Informe final del Sprint 1. | Equipo del proyecto |
