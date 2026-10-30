# Registro de riesgos

[← Anterior: Artefactos Jira](<02 Artefactos Jira V_1_0_0.md>) · [README principal](../../README.md) · [Siguiente: Presupuesto →](<04 Presupuesto del proyecto V_1_0_0.md>)

| Campo | Información |
|---|---|
| Proyecto | WankaEcoLogística Huancayo |
| Versión | V_1_0_1 |
| Fecha de creación | 11/09/2026 |
| Última actualización | 30/10/2026 |

## 1. Método cuantitativo

**Severidad = Probabilidad × Impacto.** La severidad se calcula antes de aplicar las respuestas de riesgo.

| Probabilidad | Descripción | Impacto | Descripción |
|---:|---|---:|---|
| 1 | Muy baja | 1 | Insignificante |
| 2 | Baja | 2 | Menor |
| 3 | Media | 3 | Moderado |
| 4 | Alta | 4 | Mayor |
| 5 | Muy alta | 5 | Catastrófico |

| Rango de severidad | Nivel |
|---|---|
| 1–6 | Baja |
| 8–12 | Media |
| 15–25 | Alta |

## 2. Matriz de riesgos

| ID | Descripción del riesgo | Categoría | Prob. | Impacto | Severidad | Plan de mitigación preventivo | Plan de contingencia reactivo | Responsable |
|---|---|---|---:|---:|---:|---|---|---|
| R-01 | El algoritmo VRP no satisface a tiempo capacidad y ventanas. | Técnico | 4 | 5 | 20 Alta | Prototipo temprano, datos de prueba y límites de alcance. | Usar heurística base y replanificar historias. | Arquitecto / Backend |
| R-02 | Datos de direcciones o coordenadas son incompletos o imprecisos. | Datos | 4 | 4 | 16 Alta | Validaciones, PostGIS y conjunto de datos representativo. | Corregir lote, aislar registros inválidos y comunicar impacto. | Operador / Datos |
| R-03 | Indisponibilidad o cambio del proveedor de mapas/tráfico. | Dependencia externa | 3 | 4 | 12 Media | Adaptador de proveedor, monitoreo de cuotas y pruebas de fallback. | Activar proveedor alterno o modo cacheado. | Arquitecto / DevOps |
| R-04 | Conectividad móvil inestable impide el seguimiento en campo. | Infraestructura | 4 | 3 | 12 Media | PWA, caché y pruebas bajo perfil 3G. | Operar con última ruta cacheada y sincronizar al reconectar. | Frontend |
| R-05 | Acceso no autorizado o exposición de direcciones y datos personales. | Seguridad | 3 | 5 | 15 Alta | RBAC, validación de entradas, análisis OWASP y mínimo privilegio. | Revocar accesos, investigar, restaurar y notificar según protocolo. | Seguridad / Backend |
| R-06 | Integración entre React, API, PostgreSQL/PostGIS y proveedores de ruteo falla. | Integración | 3 | 4 | 12 Media | Contratos API, integración continua y pruebas de extremo a extremo. | Aislar componente, revertir cambio y desplegar corrección. | Arquitecto |
| R-07 | Disponibilidad desigual del equipo por carga académica. | Recursos humanos | 4 | 4 | 16 Alta | Tablero visible, pares de respaldo y alcance priorizado. | Reasignar tareas críticas y reducir alcance no esencial. | Director del Proyecto |
| R-08 | Retraso de hitos por dependencia entre gestión de datos y ruteo. | Cronograma | 4 | 4 | 16 Alta | Refinamiento, entregas verticales y seguimiento semanal. | Reprogramar backlog con aprobación de interesados. | Scrum Master |
| R-09 | Casos BDD, cobertura o revisión insuficientes generan defectos. | Calidad | 3 | 4 | 12 Media | Definition of Done, PR y automatización de pruebas. | Corregir defectos, analizar causa y repetir pruebas. | QA |
| R-10 | El gasto cloud, mapas o herramientas supera el presupuesto. | Presupuesto | 2 | 4 | 8 Media | Alertas de consumo, capas gratuitas y estimación mensual. | Limitar uso no crítico y usar la reserva de contingencia aprobada. | Director / DevOps |
| R-11 | No hay usuarios/interesados disponibles para validar incrementos. | Interesados | 3 | 4 | 12 Media | Agendar revisiones por sprint y preparar demos breves. | Validar con representante alterno y registrar supuesto. | Director del Proyecto |
| R-12 | Métricas de CO₂ o ahorro no son reproducibles. | Datos / Calidad | 3 | 4 | 12 Media | Versionar fórmula, factor y línea base; pruebas de cálculo. | Suspender publicación de indicador y recalcular con datos auditados. | Analista / QA |

### Justificación de los niveles asignados

La **severidad del riesgo** se calcula como probabilidad × impacto antes de aplicar las mitigaciones. Alta significa que se debe reducir o asignar una respuesta prioritaria; media requiere seguimiento planificado y una contingencia; baja puede aceptarse con monitoreo. La escala no es una estimación de “prioridad del impedimento”: ese registro usa prioridad para ordenar bloqueos ya ocurridos. Con probabilidad e impacto enteros de 1 a 5, los puntajes posibles no incluyen 7, 13 ni 14; por eso no aparecen en los rangos.

| ID | Cálculo | Por qué se asignó ese nivel |
|---|---:|---|
| R-01 | 4 × 5 = 20, Alta | El optimizador es el valor central del producto y una falla en capacidad o ventanas puede invalidar la ruta y el incremento; la probabilidad es alta por la complejidad combinatoria. |
| R-02 | 4 × 4 = 16, Alta | Datos incompletos son frecuentes en registros operativos y afectan geocodificación, distancias y orden de visita; el impacto llega a la ejecución de entregas. |
| R-03 | 3 × 4 = 12, Media | La dependencia externa puede fallar, pero la interfaz de adaptador y un proveedor alternativo/stub reducen el impacto y permiten contingencia. |
| R-04 | 4 × 3 = 12, Media | La señal inestable es probable en campo, pero la caché conserva la última ruta y la sincronización puede reanudarse al recuperar red; no sustituye actualizaciones en tiempo real. |
| R-05 | 3 × 5 = 15, Alta | La probabilidad se valora media, pero una exposición de direcciones o datos personales tendría impacto crítico en privacidad y confianza; exige mínimo privilegio y respuesta inmediata. |
| R-06 | 3 × 4 = 12, Media | Las integraciones pueden fallar, aunque contratos, pruebas y rollback permiten aislar el componente afectado y limitar la interrupción. |
| R-07 | 4 × 4 = 16, Alta | La carga académica puede reducir la disponibilidad del equipo y retrasar varios entregables; la reasignación y reducción de alcance deben acordarse temprano. |
| R-08 | 4 × 4 = 16, Alta | La dependencia entre datos y ruteo afecta la ruta crítica del cronograma; retrasar una etapa puede desplazar los hitos siguientes. |
| R-09 | 3 × 4 = 12, Media | La cobertura/revisión insuficiente puede dejar defectos relevantes, pero un ciclo de corrección y repetición de pruebas puede contenerlos antes de liberar. |
| R-10 | 2 × 4 = 8, Media | Se estima menos probable, pero un exceso de gasto puede limitar mapas o infraestructura; alertas tempranas y límites de uso reducen la exposición. |
| R-11 | 3 × 4 = 12, Media | La falta de interesados puede retrasar aceptación, pero un representante alterno y el registro de supuestos permiten continuar con reservas explícitas. |
| R-12 | 3 × 4 = 12, Media | Una métrica de CO₂ no reproducible afecta la credibilidad del resultado; puede contenerse suspendiendo su publicación y recalculando con datos auditables. |

No hay riesgos con nivel bajo en esta matriz: el puntaje mínimo registrado es 8 (R-10), que cae en el rango medio. Los asuntos menores que no amenazan objetivos se gestionan en el backlog ordinario y no se presentan como riesgos activos.

## 3. Seguimiento

Los riesgos altos se revisan semanalmente durante el Sprint Planning y la retrospectiva; los medios, al menos por sprint. Todo cambio de probabilidad, impacto, responsable o respuesta debe registrarse en el tablero y comunicarse al Director del Proyecto. Los riesgos R-01 a R-04 y R-07 se derivan de riesgos y supuestos ya documentados en la Fase 01; esta matriz les añade cuantificación y respuesta operativa.

## Historial de Control de Cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_1 | 30/10/2026 | Se explican los umbrales y la razón del puntaje y nivel para cada riesgo activo. | Equipo del proyecto |
| V_1_0_0 | 11/09/2026 | Creación del registro cuantitativo de riesgos | Equipo |
