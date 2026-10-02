# Retrospectiva del Sprint 1

**Proyecto:** WankaEcoLogística Huancayo  
**Responsable:** Equipo del proyecto  
**Fecha de cierre:** 02/10/2026

## ¿Qué aprendimos?

La instalación local debe validarse desde el ejecutable de PostgreSQL, el servicio, PostGIS y las migraciones antes de probar el frontend. También se comprobó que la validación del navegador no sustituye a la validación del servidor: la API debe proteger siempre sus contratos y devolver errores comprensibles.

## ¿Qué estamos haciendo bien?

- Se mantuvo una arquitectura por rutas, servicios y repositorios, que separa HTTP, reglas de negocio y persistencia.
- Se utilizaron PostgreSQL y PostGIS para conservar datos geográficos con restricciones explícitas.
- Las validaciones de roles, autenticación, horarios, placas y datos numéricos se ejecutan en el backend.
- Se automatizaron pruebas, análisis estático, formato y build antes del cierre.

## ¿Qué podemos mejorar?

### Personas

Registrar desde el inicio quién asume la validación funcional y quién mantiene las credenciales y variables de cada entorno.

### Relaciones

Revisar con usuarios de operación los mensajes y valores de ejemplo antes de la demostración, especialmente coordenadas y ventanas horarias.

### Procesos

Incorporar una lista de arranque del entorno —PostgreSQL, PostGIS, `.env`, migración, seed, backend y frontend— en cada sesión de desarrollo. Mantener las migraciones repetibles desde su primera versión.

### Herramientas

Configurar una base `TEST_DATABASE_URL` en integración continua para ejecutar siempre la prueba PostGIS, sin depender de la máquina local.

## Acciones acordadas

| Acción | Responsable | Prioridad | Momento |
|---|---|---|---|
| Documentar el arranque local y las credenciales de prueba seguras | Equipo | Alta | Inicio del Sprint 2 |
| Añadir una prueba de integración con base PostGIS en CI | Equipo | Alta | Sprint 2 |
| Revisar datos de muestra y mensajes de validación con el usuario operativo | Equipo | Media | Refinamiento del Sprint 2 |
