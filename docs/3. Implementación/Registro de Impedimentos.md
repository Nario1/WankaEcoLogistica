# Registro de impedimentos

**Proyecto:** WankaEcoLogística Huancayo  
**Responsable:** Equipo del proyecto

| ID | Fecha de registro | Impedimento e impacto | Prioridad | Estado | Resolución / comentarios |
|---|---|---|---|---|---|
| IMP-001 | 01/10/2026 | PostgreSQL 18 no iniciaba porque Smart App Control bloqueaba `libxml2.dll`. Impedía crear el clúster, aplicar migraciones y probar la API. | Alta | Resuelto | Se identificó el bloqueo mediante el registro Code Integrity de Windows. Se ajustó la configuración local, se verificó `postgres --version` y se completó la instalación. |
| IMP-002 | 01/10/2026 | PostGIS no estaba disponible en la instalación inicial, por lo que la migración no podía crear las columnas geográficas. | Alta | Resuelto | Se instaló PostGIS compatible mediante Stack Builder, se creó la extensión y se validó la prueba geoespacial. |
| IMP-003 | 02/10/2026 | La migración repetida intentaba crear de nuevo la restricción de exclusión de horarios de conductor. | Media | Resuelto | La migración ahora consulta `pg_constraint` antes de crear la restricción, permitiendo ejecuciones repetibles. |
| IMP-004 | 02/10/2026 | Los errores `400` de formularios no indicaban el campo inválido, dificultando corregir pedidos o vehículos. | Media | Resuelto | El frontend muestra el detalle seguro devuelto por la API y valida longitudes y formato antes del envío. |

No se registran impedimentos abiertos al cierre del Sprint 1. La configuración productiva de secretos y la automatización de la base PostGIS en CI permanecen como trabajo planificado para el siguiente sprint.
