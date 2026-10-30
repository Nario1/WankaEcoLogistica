# Reporte de Seguridad — OWASP Top 10 2025

[← Anterior: Calidad](<03 Calidad de código V_1_0_0.md>) · [README principal](../../../README.md) · [Siguiente: WCAG →](<05 WCAG V_1_0_0.md>)

**Nombre del proyecto:** WankaEcoLogística Huancayo

**Herramienta informada:** SonarQube Community Build `26.10.0.133078`

**Fecha del análisis informado:** 2026-10-28

**Líder del proyecto:** Nario German Reyes Rios

**Referencia de resultados generales:** [Evaluación de Calidad de Código](<03 Calidad de código V_1_0_0.md>)

## Alcance y criterio de lectura

Este documento clasifica los riesgos revisados frente a las diez categorías OWASP Top 10 2025. El análisis estático consignado reportó **0 vulnerabilidades y 0 Security Hotspots** en su snapshot. La configuración y el resultado resumido no demuestran que SonarQube haya asignado cada incidencia a una categoría OWASP: los “0 hallazgos de SonarQube” de la matriz indican ausencia de incidencias de ese tipo en el reporte general, no una certificación automática de cada categoría.

El equipo informa que no se ejecutó análisis SCA de dependencias y que no se adjuntó exportación de issues ni evidencia de pruebas de penetración. Por ello, los estados “Bajo revisión” describen categorías que requieren verificación adicional; “Limpio” solo se usa cuando el control concreto se apoya en una implementación indicada en los artefactos del proyecto. Ninguno de estos estados equivale a una certificación de seguridad.

## 1. Matriz de revisión OWASP Top 10 2025

| Categoría OWASP 2025 | Estado en el proyecto | Hallazgos del snapshot SonarQube | Controles/evidencia consignados y brecha pendiente |
|---|---|---|---|
| **A01:2025 — Broken Access Control** | Bajo revisión | 0 vulnerabilidades reportadas en el análisis general; no hay desglose OWASP adjunto. | El servicio de rutas aplica `assertRouteAccess` y el rol DRIVER para restringir acceso a la ruta propia. Falta una matriz de pruebas negativas para recursos ajenos y revisión de todos los endpoints protegidos. |
| **A02:2025 — Cryptographic Failures** | Bajo revisión | 0 vulnerabilidades reportadas; SonarQube no reemplaza una revisión criptográfica. | Se informa uso de bcrypt para contraseñas, JWT para sesión y secretos en `.env` fuera de Git. Falta revisar configuración y rotación de secretos, algoritmo/caducidad/validación de JWT, almacenamiento del token y TLS del entorno de despliegue. |
| **A03:2025 — Injection** | Bajo revisión | 0 vulnerabilidades de inyección reportadas en el snapshot; no hay salida detallada adjunta. | El repositorio PostgreSQL mostrado usa parámetros en consultas (por ejemplo, `user.repository.js`). Falta revisar la totalidad de consultas y entradas, además de probar casos de inyección en rutas, filtros y formularios. |
| **A04:2025 — Insecure Design** | Bajo revisión | No es una conclusión que se obtenga del conteo general de vulnerabilidades. | Se documentó autorización por propiedad de ruta y una estrategia de acceso por rol. Falta modelado de amenazas y revisión de abuso de flujos, límites de negocio y escenarios de abuso. |
| **A05:2025 — Security Misconfiguration** | Bajo revisión | 0 issues de configuración reportados por el análisis estático consignado. | El entorno local se describe sin terminación TLS. Falta revisar encabezados, CORS, cookies, políticas de despliegue, variables y configuración de producción. No exponer archivos `.env` ni valores secretos en la evidencia. |
| **A06:2025 — Vulnerable and Outdated Components** | Bajo revisión | SonarQube no incluyó SCA en el snapshot. El workflow [`quality.yml`](../../../.github/workflows/quality.yml) configura `npm audit` para backend y frontend, pero no se adjunta el resultado de esa ejecución. | No hay inventario SBOM ni reporte de auditoría de dependencias adjunto. Falta conservar los resultados del workflow y cubrir también `pruebas/package-lock.json`, registrando fecha y resolución de cada aviso. |
| **A07:2025 — Identification and Authentication Failures** | Bajo revisión | 0 vulnerabilidades reportadas en el snapshot; no hay resultado de pruebas de autenticación adjunto. | Se informa bloqueo temporal tras intentos fallidos y que la respuesta no devuelve contraseñas. Falta verificar límites de intentos, recuperación de cuenta, expiración/revocación de sesión y controles de fuerza bruta. |
| **A08:2025 — Software and Data Integrity Failures** | Bajo revisión | 0 hotspots informados; no se evaluó integridad de dependencias en este escaneo. | No se adjunta evidencia de firma/verificación de artefactos, controles de pipeline o protección de actualización de dependencias. Revisar cadena de suministro y validar service worker/caché frente a versiones publicadas. |
| **A09:2025 — Security Logging and Monitoring Failures** | Bajo revisión | El conteo general no acredita suficiencia de logging ni monitoreo. | Se informa auditoría de acciones de negocio. Falta revisar eventos de seguridad, datos sensibles en logs, retención, alertas y procedimiento de respuesta en producción. |
| **A10:2025 — Server-Side Request Forgery (SSRF)** | Bajo revisión | 0 vulnerabilidades/hotspots asociados en el resultado general; no se adjunta análisis específico. | La integración OSRM/TomTom se describe con URL configurada por entorno y no directamente por el usuario. Falta validar allowlist de hosts, redirecciones, DNS/IP privados, tiempos de espera y comportamiento ante respuestas maliciosas. |

## 2. Security Hotspots y vulnerabilidades críticas

- **Vulnerabilidades críticas reportadas:** ninguna en el snapshot del 28/10/2026; SonarQube informó cero vulnerabilidades en total. No se adjunta exportación de issues para verificar severidad, reglas o ubicación.
- **Security Hotspots reportados:** ninguno en el snapshot. Por esa razón no se atribuyen descripciones ficticias a “Hotspot #1” o “Hotspot #2”. La cifra cero no sustituye una revisión manual de seguridad.
- **Hallazgo de mantenimiento relacionado:** el smell de validación de correo descrito en el informe de calidad se clasificó como Code Smell, no como vulnerabilidad ni hotspot. No se presenta como hallazgo OWASP.

## 3. Plan de verificación y tratamiento

| Prioridad | Actividad | Evidencia de cierre requerida |
|---|---|---|
| Alta | Validar en runtime la API después de incorporar la corrección de sintaxis publicada en el commit `ffa1f08`. `node --check` pasó, pero no se inició el servidor. | Salida de arranque correcta y pruebas de rutas/autorización aprobadas. Este error es posterior al análisis del 28/10 y no está cubierto por sus resultados. |
| Alta | Ejecutar SCA sobre los tres archivos de lock y revisar versiones directas/transitivas. | Reporte fechado, alcance, vulnerabilidades encontradas y decisión documentada para cada aviso. |
| Alta | Probar autorización negativa para rutas ajenas y endpoints de otros roles. | Casos automatizados con resultado esperado (401/403 o respuesta definida) y vínculo al test. |
| Media | Revisar autenticación, JWT, gestión de secretos y TLS con configuración de despliegue. | Lista de controles aplicada, sin publicar tokens ni secretos. |
| Media | Revisar SSRF en clientes de mapas y registro/monitoreo de eventos de seguridad. | Casos límite probados y configuración relevante documentada. |
| Media | Repetir análisis SonarQube/SCA después de remediar. | ID del análisis, commit, exportación de resultados y estado actualizado del Quality Gate. |

**Conclusión:** el escaneo estático consignado no detectó vulnerabilidades ni hotspots en el snapshot revisado. La evaluación por categorías sigue **bajo revisión** porque no hay análisis SCA, reporte OWASP por regla ni pruebas manuales completas adjuntas. No se declara cumplimiento total OWASP.

## Control de cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_1 | 30/10/2026 | Se distingue resultado general de SonarQube de evaluación por categoría; se detallan evidencias, brechas y plan de verificación. | Nario German Reyes Rios |
| V_1_0_0 | 28/10/2026 | Matriz inicial OWASP Top 10 2025 basada en el análisis SonarQube del Sprint 3. | Nario German Reyes Rios |
