# Reporte de Seguridad OWASP Top 10 (2025)

[← Anterior: Calidad](<03 Calidad de código V_1_0_0.md>) · [README principal](../../../README.md) · [Siguiente: WCAG →](<05 WCAG V_1_0_0.md>)

**Nombre del Proyecto:** WankaEcoLogística Huancayo  
**Herramienta de Escaneo:** SonarQube Community Build 26.10.0.133078  
**Fecha de Análisis:** 2026-10-28  
**Líder del Proyecto:** Nario German Reyes Rios

El mismo análisis del documento de calidad dejó 0 vulnerabilidades y 0 security hotspots. La dependencia automática (SCA) fue omitida por el escáner, así que las categorías que dependen de ese inventario quedan en revisión y no se declaran limpias.

## 1. Matriz de Cumplimiento OWASP Top 10 2025

| Categoría OWASP 2025 | Estado en Proyecto (Limpio / Vulnerable / Bajo Revisión) | Hallazgos de SonarQube |
|---|---|---|
| A01:2025-Broken Access Control | Limpio | 0 hallazgos. El conductor solo consulta su ruta mediante `assertRouteAccess` y el rol DRIVER. |
| A02:2025-Cryptographic Failures | Limpio | 0 hallazgos. Contraseñas con bcrypt y sesión JWT. Los secretos permanecen en `.env`, fuera de Git. |
| A03:2025-Injection | Limpio | 0 vulnerabilidades de inyección. Las consultas SQL del repositorio van parametrizadas. |
| A04:2025-Insecure Design | Bajo Revisión | SonarQube no evaluó el diseño. El control de propiedad de la ruta está implementado y probado. |
| A05:2025-Security Misconfiguration | Bajo Revisión | 0 hallazgos en código. El entorno local no termina TLS; eso queda para el despliegue. |
| A06:2025-Vulnerable and Outdated Components | Bajo Revisión | El escáner omitió el análisis de dependencias. No hay inventario SCA en este reporte. |
| A07:2025-Identification and Authentication Failures | Limpio | 0 hallazgos. Login con bloqueo temporal tras intentos fallidos y contraseñas no devueltas en la respuesta. |
| A08:2025-Software and Data Integrity Failures | Bajo Revisión | 0 hotspots. Sin análisis de integridad de dependencias en este escaneo. |
| A09:2025-Security Logging and Monitoring Failures | Bajo Revisión | 0 hallazgos de la regla. Existe auditoría de acciones de negocio; el monitoreo productivo no forma parte de este análisis. |
| A10:2025-Server-Side Request Forgery (SSRF) | Limpio | 0 hotspots. OSRM y TomTom se invocan con la URL configurada en el entorno, no con una dirección enviada por el usuario. |

## 2. Detalles de Security Hotspots y Vulnerabilidades Críticas

- **Hotspot #1:** No aplica. SonarQube reportó 0 security hotspots en el proyecto `wanka-ecologistica`.
- **Hotspot #2:** No aplica. Tampoco hubo vulnerabilidades. Lo más cercano fue la revisión del correo al iniciar sesión: un texto muy largo podía hacer trabajar de más al servidor. SonarQube lo clasificó como un problema de mantenimiento, no como una vulnerabilidad. El detalle está en [Calidad de código](<03 Calidad de código V_1_0_0.md>).

## Historial de control de cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_0 | 28/10/2026 | Matriz OWASP Top 10 2025 con el análisis SonarQube del Sprint 3. | Nario German Reyes Rios |
