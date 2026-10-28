# Evaluación de Calidad de Código — SonarQube

[← Anterior: Retrospectiva](<02 Retrospectiva del Sprint V_1_0_0.md>) · [README principal](../../../README.md) · [Siguiente: OWASP →](<04 OWASP V_1_0_0.md>)

**Nombre del Proyecto:** WankaEcoLogística Huancayo  
**Fecha de Análisis:** 2026-10-28  
**Versión del Análisis:** V_1_0_0  
**Líder del Proyecto:** Nario German Reyes Rios

## 1. Resumen Ejecutivo de Quality Gate

Análisis ejecutado con SonarQube Community Build `26.10.0.133078`, levantado con Docker mediante `docker-compose.sonarqube.yml` en `http://localhost:9001`. El puerto 9000 estaba ocupado por otra instancia local, por eso esta usa el 9001. El escáner fue `@sonar/scan` desde el repositorio, con el informe LCOV del backend en `backend/coverage/lcov.info`.

- **Estado del Quality Gate:** PASSED
- **Porcentaje de Cobertura de Pruebas (Coverage):** 65,4 %
- **Duplicación de Código:** 2,2 %

La cobertura de SonarQube considera frontend y backend juntos. El backend, medido con el test runner de Node, queda en 88 % de líneas. El frontend no tiene pruebas unitarias, y por eso la cifra combinada baja a 65,4 %. SonarQube reportó 6 638 líneas de código.

## 2. Métricas Principales

| Categoría | Cantidad Detectada | Severidad (Bloqueante / Alta / Media / Baja) |
|---|---|---|
| **Bugs** | 3 | Alta (MAJOR) |
| **Vulnerabilidades** | 0 | — |
| **Code Smells** | 1 | Alta (MAJOR) |
| **Security Hotspots** | 0 | — |

Los tres bugs son la regla `javascript:S9383` en `frontend/src/features/field/DriverRoutePage.jsx`, líneas 91, 105 y 149: promesas de carga y sincronización invocadas sin `await`, `.catch` o `void`. El code smell es `javascript:S8786` en `backend/src/shared/validation.js`: la expresión regular del correo podía retroceder de forma superlineal. La deuda técnica estimada por SonarQube (`sqale_index`) fue de 20 minutos.

## 3. Plan de Remediación y Deuda Técnica

- **Deuda Técnica Estimada:** 20 minutos en el análisis del 2026-10-28.
- **Principales hallazgos y acciones correctivas:**
  1. Promesas flotantes en `DriverRoutePage.jsx`. Se marcaron con el operador `void` la carga inicial, la consulta de paradas y la sincronización al recuperar red, para que el rechazo quede explícitamente ignorado donde la interfaz ya muestra el error.
  2. Expresión regular de `requireEmail` en `validation.js`. Se reemplazó por una validación de una sola arroba, parte local, dominio y punto, sin cuantificadores anidados.

El Quality Gate ya estaba en PASSED antes de estas correcciones. El tablero muestra el análisis previo hasta que se publique uno nuevo.

## Historial de control de cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_0 | 28/10/2026 | Evaluación con el análisis SonarQube en Docker y corrección de los hallazgos. | Nario German Reyes Rios |
