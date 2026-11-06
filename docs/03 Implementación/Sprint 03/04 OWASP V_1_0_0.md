# Reporte de Seguridad — OWASP Top 10 2025

[← Anterior: Calidad](<03 Calidad de código V_1_0_0.md>) · [README principal](../../../README.md) · [Siguiente: WCAG →](<05 WCAG V_1_0_0.md>)

**Nombre del proyecto:** WankaEcoLogística Huancayo

**Herramienta informada:** SonarQube Community Build `26.10.0.133078`

**Fecha del análisis SonarQube:** 2026-10-28

**Fecha de cierre Bajo revisión:** 2026-11-06

**Líder del proyecto:** Nario German Reyes Rios

**Referencia de resultados generales:** [Evaluación de Calidad de Código](<03 Calidad de código V_1_0_0.md>)

## Alcance y criterio de lectura

Este documento clasifica los riesgos frente a las diez categorías OWASP Top 10 2025. El análisis estático consignó **0 vulnerabilidades y 0 Security Hotspots**. Las categorías que en la versión del 30/10 quedaron en Bajo revisión se cerraron el 06/11 con evidencia de diseño, configuración, inventario SCA (`npm audit`), integridad de dependencias en CI y auditoría de negocio. El estado **Completado** indica que el control concreto está implementado y verificable en el repositorio; no equivale a una certificación formal de seguridad de terceros.

## 1. Matriz de revisión OWASP Top 10 2025

| Categoría OWASP 2025 | Estado en el proyecto | Hallazgos y evidencia |
|---|---|---|
| A01:2025 — Broken Access Control | Completado | 0 hallazgos. El conductor solo consulta su ruta mediante `assertRouteAccess` y el rol DRIVER. Prueba: `backend/test/route.service.test.js`. |
| A02:2025 — Cryptographic Failures | Completado | 0 hallazgos. Contraseñas con bcrypt y sesión JWT. Los secretos permanecen en `.env`, fuera de Git. |
| A03:2025 — Injection | Completado | 0 vulnerabilidades de inyección. Las consultas SQL del repositorio van parametrizadas. |
| A04:2025 — Insecure Design | Completado | Autorización por rol (`authorize` + `ROLES`) en pedidos, vehículos, conductores, rutas y optimización. Propiedad de ruta validada en el servicio. Prueba de denegación FORBIDDEN a ruta ajena. |
| A05:2025 — Security Misconfiguration | Completado | Helmet en `backend/src/app.js` (CSP, `nosniff`, sin `X-Powered-By`). CORS restringido. JSON limitado a 100 kb. Desarrollo local usa HTTP a propósito; staging/producción termina TLS en el proxy (`backend/.env.example`). Prueba de encabezados en `backend/test/api.test.js`. |
| A06:2025 — Vulnerable and Outdated Components | Completado | `npm audit --audit-level=high` en backend y frontend (2026-11-06): 0 vulnerabilidades. El mismo umbral corre en CI (`.github/workflows/quality.yml`). Scripts: `npm run security:audit`. |
| A07:2025 — Identification and Authentication Failures | Completado | 0 hallazgos. Login con bloqueo temporal tras intentos fallidos y contraseñas no devueltas en la respuesta. |
| A08:2025 — Software and Data Integrity Failures | Completado | `package-lock.json` versionado en backend, frontend y pruebas. CI instala con `npm ci`. |
| A09:2025 — Security Logging and Monitoring Failures | Completado | Auditoría de negocio (`AUTH_LOGIN_*`, pedidos, flota, rutas, `ROUTE_OPTIMIZED`) y `GET /health`. El APM productivo ampliado queda fuera del MVP académico (EN-003). |
| A10:2025 — Server-Side Request Forgery (SSRF) | Completado | 0 hotspots. OSRM y TomTom usan URL de entorno, no una dirección enviada por el usuario. |

## 2. Security Hotspots y vulnerabilidades críticas

- **Vulnerabilidades críticas reportadas:** ninguna.
- **Security Hotspots reportados:** ninguno.
- **Hallazgo de mantenimiento relacionado:** el smell de validación de correo del informe de calidad se clasificó como Code Smell, no como vulnerabilidad; quedó remedado y el reanálisis del 06/11 no lo reporta.

## 3. Evidencia del cierre de Bajo revisión

| Categoría | Acción de cierre | Cómo reproducirla |
|---|---|---|
| A04 | Documentar RBAC y prueba de propiedad de ruta | `npm test` en `backend/` (caso del conductor con ruta ajena) |
| A05 | Helmet + prueba de encabezados + nota TLS | `npm test` en `backend/`; revisar `app.js` y `.env.example` |
| A06 | SCA con npm audit sin hallazgos | `npm run security:audit` en `backend/` y `frontend/` |
| A08 | Locks en Git e instalación con `npm ci` en CI | Workflow `Quality` en `.github/workflows/quality.yml` |
| A09 | Inventario de acciones auditadas y `/health` | Revisar `auth.service.js` y servicios de operación |

**Conclusión:** las diez categorías quedan en **Completado** con evidencia en código, pruebas y CI. El APM de producción y el TLS de despliegue siguen documentados como alcance de staging/EN-003, no como deuda abierta del snapshot académico.

## Control de cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_2 | 06/11/2026 | Cierre de Bajo revisión: estado Completado en las diez categorías con evidencia SCA, Helmet, locks/CI, RBAC y auditoría. | Nario German Reyes Rios |
| V_1_0_1 | 30/10/2026 | Se distingue resultado general de SonarQube de evaluación por categoría; se detallan evidencias, brechas y plan de verificación. | Nario German Reyes Rios |
| V_1_0_0 | 28/10/2026 | Matriz inicial OWASP Top 10 2025 basada en el análisis SonarQube del Sprint 03. | Nario German Reyes Rios |
