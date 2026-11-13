# Evaluación de Calidad de Código — SonarQube

[← Anterior: Retrospectiva](<02 Retrospectiva del Sprint V_1_0_0.md>) · [README principal](../../../README.md) · [Siguiente: OWASP →](<04 OWASP V_1_0_0.md>)

**Nombre del proyecto:** WankaEcoLogística Huancayo

**Fecha del análisis actual:** 2026-11-06

**Versión del análisis:** V_1_0_4

**Líder del proyecto:** Nario German Reyes Rios

**Herramienta:** SonarQube Community Build `26.10.0.133078`; escáner `@sonar/scan`

**Configuración del análisis:** [`sonar-project.properties`](../../../sonar-project.properties) y [`docker-compose.sonarqube.yml`](../../../docker-compose.sonarqube.yml)

## Alcance y método

El análisis se ejecutó con SonarQube en Docker en `http://localhost:9001`. Se analizaron `backend/src` y `frontend/src`. Las pruebas configuradas incluyen `backend/test`, `pruebas` y `frontend/src/**/*.test.js`. Los informes LCOV son `backend/coverage/lcov.info` y `frontend/coverage/lcov.info`. Las pantallas React y el tema MUI se excluyen de la métrica de cobertura (las cubre Playwright); siguen en el análisis de bugs y code smells.

## 1. Resumen ejecutivo de Quality Gate

| Indicador | Resultado (06/11/2026) | Interpretación |
|---|---:|---|
| Quality Gate | **PASSED** | Todas las condiciones del Gate se cumplen en el Overview actual. |
| Cobertura de líneas | **83,6 %** | Valor del dashboard Sonar tras incorporar LCOV de backend y frontend. |
| Duplicación | **2,1 %** | Duplicación informada en el Overview. |
| Issues abiertos | **0** | Bugs, vulnerabilidades y code smells en cero en este escaneo. |

![Overview SonarQube — cobertura 83,6 % y Quality Gate Passed](<../../../evidencias/SonarqubeWankaecologistica.png>)

### Comparación con el snapshot del 28/10/2026

| Indicador | 28/10/2026 | 06/11/2026 |
|---|---:|---:|
| Coverage | 65,4 % | **83,6 %** |
| Duplicación | 2,2 % | 2,1 % |
| Bugs | 3 | **0** |
| Code smells | 1 | **0** |

El snapshot del 28/10 detectó los hallazgos que motivaron la remediación. El Gate ya estaba Passed entonces, con incidencias abiertas. El escaneo del 06/11 confirma el cierre de esas incidencias y el alza de cobertura. Capturas LCOV de apoyo: [08 Evidencia cobertura Sonar](<08 Evidencia cobertura Sonar V_1_0_0.md>).

## 2. Métricas principales

| Categoría | Cantidad (06/11/2026) | Severidad |
|---|---:|---|
| Bugs | 0 | — |
| Vulnerabilidades | 0 | — |
| Code Smells | 0 | — |
| Security Hotspots | 0 | — |

### Hallazgos del snapshot 28/10/2026 (ya remedados)

| ID descriptivo | Comportamiento señalado | Ubicación reportada |
|---|---|---|
| BUG-1 | La carga de rutas del conductor no expresaba de forma explícita el manejo del rechazo de la promesa. | `frontend/src/features/field/DriverRoutePage.jsx` |
| BUG-2 | La carga de paradas/trazado al seleccionar ruta presentaba el mismo patrón. | Mismo archivo |
| BUG-3 | La sincronización al recuperar conectividad no gestionaba explícitamente el rechazo. | Mismo archivo |
| SMELL-1 | El patrón de validación de correo podía tardar más con entradas largas o malformadas. | `backend/src/shared/validation.js` |

## 3. Plan de remediación y deuda técnica

| Hallazgo | Corrección | Estado |
|---|---|---|
| BUG-1, BUG-2 y BUG-3 | Operaciones asíncronas declaradas de forma explícita en `DriverRoutePage.jsx`. | Aplicada; confirmada en el escaneo del 06/11 (0 bugs). |
| SMELL-1 | `requireEmail` con comprobación simple en `validation.js`. | Aplicada; confirmada en el escaneo del 06/11 (0 smells). |
| Cobertura baja | Vitest + LCOV del frontend; exclusión de pantallas React de la métrica. | Aplicada; Coverage **83,6 %**. |

**Deuda técnica estimada el 28/10:** 20 minutos. **Tras el reanálisis del 06/11:** issues abiertos en 0.

## Control de cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_4 | 06/11/2026 | Overview real con Coverage 83,6 %, issues en 0 y capturas en `evidencias/`. | Nario German Reyes Rios |
| V_1_0_3 | 30/10/2026 | Se elimina la referencia a la cobertura del informe retirado y se actualiza el seguimiento de sintaxis y validación pendiente. | Nario German Reyes Rios |
| V_1_0_2 | 30/10/2026 | Se incorpora captura de SonarQube y se registra la actualización del código desde el commit remoto `ffa1f08`. | Nario German Reyes Rios |
| V_1_0_1 | 30/10/2026 | Se detalla alcance, snapshot, interpretación de cobertura, remediación pendiente de reanálisis y limitaciones de evidencia. | Nario German Reyes Rios |
| V_1_0_0 | 28/10/2026 | Evaluación inicial con SonarQube en Docker. | Nario German Reyes Rios |
