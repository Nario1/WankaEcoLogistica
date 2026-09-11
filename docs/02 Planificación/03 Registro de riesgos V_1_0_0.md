# Registro de riesgos

[← Volver al README Principal](../../README.md)

| Campo | Información |
|---|---|
| Proyecto | WankaEcoLogística Huancayo |
| Versión | V_1_0_0 |
| Fecha | 11/09/2026 |

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
| R-06 | Integración entre React, API, PostGIS, Redis y ruteo falla. | Integración | 3 | 4 | 12 Media | Contratos API, integración continua y pruebas de extremo a extremo. | Aislar componente, revertir cambio y desplegar corrección. | Arquitecto |
| R-07 | Disponibilidad desigual del equipo por carga académica. | Recursos humanos | 4 | 4 | 16 Alta | Tablero visible, pares de respaldo y alcance priorizado. | Reasignar tareas críticas y reducir alcance no esencial. | Director del Proyecto |
| R-08 | Retraso de hitos por dependencia entre gestión de datos y ruteo. | Cronograma | 4 | 4 | 16 Alta | Refinamiento, entregas verticales y seguimiento semanal. | Reprogramar backlog con aprobación de interesados. | Scrum Master |
| R-09 | Casos BDD, cobertura o revisión insuficientes generan defectos. | Calidad | 3 | 4 | 12 Media | Definition of Done, PR y automatización de pruebas. | Corregir defectos, analizar causa y repetir pruebas. | QA |
| R-10 | El gasto cloud, mapas o herramientas supera el presupuesto. | Presupuesto | 2 | 4 | 8 Media | Alertas de consumo, capas gratuitas y estimación mensual. | Limitar uso no crítico y usar la reserva de contingencia aprobada. | Director / DevOps |
| R-11 | No hay usuarios/interesados disponibles para validar incrementos. | Interesados | 3 | 4 | 12 Media | Agendar revisiones por sprint y preparar demos breves. | Validar con representante alterno y registrar supuesto. | Director del Proyecto |
| R-12 | Métricas de CO₂ o ahorro no son reproducibles. | Datos / Calidad | 3 | 4 | 12 Media | Versionar fórmula, factor y línea base; pruebas de cálculo. | Suspender publicación de indicador y recalcular con datos auditados. | Analista / QA |

## 3. Seguimiento

Los riesgos altos se revisan semanalmente durante el Sprint Planning y la retrospectiva; los medios, al menos por sprint. Todo cambio de probabilidad, impacto, responsable o respuesta debe registrarse en el tablero y comunicarse al Director del Proyecto. Los riesgos R-01 a R-04 y R-07 se derivan de riesgos y supuestos ya documentados en la Fase 01; esta matriz les añade cuantificación y respuesta operativa.

## Historial de Control de Cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_0 | 11/09/2026 | Creación del registro cuantitativo de riesgos | Equipo |
