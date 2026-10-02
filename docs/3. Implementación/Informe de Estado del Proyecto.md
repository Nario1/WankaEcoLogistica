# Informe de estado del proyecto

**Proyecto:** WankaEcoLogística Huancayo  
**Responsable:** Equipo del proyecto  
**Fecha del informe:** 02/10/2026  
**Periodo:** cierre del Sprint 1

## Estado general

El Sprint 1 se encuentra completado y validado en entorno local. Se entregó la base operativa para pedidos, vehículos, conductores y asignación manual de rutas, protegida con autenticación, control de roles y validaciones geoespaciales.

| Variable de control | Estado | Descripción |
|---|---|---|
| Alcance | Verde | Se completaron los cinco ítems planificados: US-001, US-002, US-003, EN-002 y EN-006. |
| Cronograma | Verde | Los flujos comprometidos fueron implementados y verificados al cierre del sprint. |
| Costos | Sin línea base ejecutada | No existe en el repositorio evidencia de costos reales del sprint; no se declara una variación no comprobada. |
| Calidad | Verde | 16 pruebas aprobadas, cobertura de líneas de 87.75 %, lint, formato y build aprobados. |
| Riesgos técnicos | Amarillo | El entorno local requiere PostgreSQL con PostGIS y una configuración de seguridad compatible. |

## Riesgos y mitigación

| Riesgo | Responsable | Mitigación |
|---|---|---|
| Diferencias entre equipos al instalar PostgreSQL/PostGIS | Equipo de desarrollo | Mantener una guía de arranque y ejecutar migración, seed y prueba PostGIS al configurar cada entorno. |
| Exposición de credenciales de desarrollo | Equipo de desarrollo | Mantener `.env` fuera del control de versiones, usar secretos por entorno y rotar credenciales antes de cualquier despliegue. |
| Datos inválidos que afecten la planificación futura | Equipo de desarrollo y operación | Conservar validaciones de API, restricciones de base de datos y mensajes de error específicos en los formularios. |

## Próximos avances

1. Refinar el Sprint 2 para la optimización de rutas y las reglas de capacidad/prioridad.
2. Definir el adaptador cartográfico y preparar la visualización de rutas.
3. Configurar una base de pruebas PostGIS en integración continua.
4. Preparar configuración segura para un entorno de staging.

## Notas

El alcance de mapa, optimización automática, reoptimización, indicadores agregados y reportes no se declara completado: corresponde a historias programadas para sprints posteriores. Los datos demostrativos creados durante la validación permanecen únicamente en la base de desarrollo local.
