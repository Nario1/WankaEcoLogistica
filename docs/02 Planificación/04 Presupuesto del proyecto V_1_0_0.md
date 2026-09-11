# Presupuesto del proyecto

[← Volver al README Principal](../../README.md)

| Campo | Información |
|---|---|
| Proyecto | WankaEcoLogística Huancayo |
| Versión | V_1_0_0 |
| Fecha | 11/09/2026 |
| Moneda | USD |
| Horizonte estimado | 4 meses académicos de construcción y pruebas |

## 1. Supuestos de estimación

El repositorio documenta un equipo académico de cinco integrantes, pero no asigna cargos técnicos ni tarifas. Para hacer verificable el presupuesto se usa una **estimación referencial** de esfuerzo por rol, no una afirmación de remuneración real. Las tarifas por hora son supuestos de planificación para servicios profesionales de un MVP; deberán validarse por el equipo y la institución antes de contratar o desembolsar. Se evita incluir hardware porque Fase 01 establece ese supuesto.

### Recursos humanos — CAPEX

**Fórmula: Costo = horas asignadas × tarifa por hora.**

| Rol | Horas | Tarifa/hora (USD) | Cálculo | Costo (USD) |
|---|---:|---:|---|---:|
| Project Manager / Scrum Master | 80 | 18.00 | 80 × 18.00 | 1,440.00 |
| Software Architect | 48 | 22.00 | 48 × 22.00 | 1,056.00 |
| Backend Developer | 160 | 16.00 | 160 × 16.00 | 2,560.00 |
| Frontend Developer | 144 | 16.00 | 144 × 16.00 | 2,304.00 |
| QA Engineer | 96 | 13.00 | 96 × 13.00 | 1,248.00 |
| UI/UX Designer | 48 | 13.00 | 48 × 13.00 | 624.00 |
| DevOps Engineer | 32 | 18.00 | 32 × 18.00 | 576.00 |
| **Total CAPEX** | **608** |  |  | **9,808.00** |

## 2. Licenciamiento y herramientas

Se planifica con herramientas sin costo directo para el MVP: GitHub/Git, Markdown, VS Code, GitHub Actions con cuota disponible y CodeQL; Jira y Figma se consideran en plan gratuito o académico, sujeto a elegibilidad. No se presupuestan licencias comerciales inexistentes en el alcance actual.

| Herramienta | Uso | Supuesto | Costo (USD) |
|---|---|---|---:|
| Jira Software | Backlog y sprints | Plan gratuito/académico | 0.00 |
| Figma | Diseño UI/UX | Plan gratuito | 0.00 |
| GitHub, CodeQL y Actions | Repositorio, análisis y CI/CD | Cuota gratuita suficiente para MVP | 0.00 |
| OpenAPI/Swagger y VS Code | API y desarrollo | Software sin costo | 0.00 |
| **Total licenciamiento** |  |  | **0.00** |

## 3. Infraestructura cloud — OPEX

Los valores representan cuatro meses de desarrollo, staging y pruebas; producción sostenida requiere una reestimación. Se considera el stack documentado: Node.js/Express, PostgreSQL/PostGIS, Redis, PWA y un proveedor externo de mapas.

| Concepto | Cálculo | Costo (USD) |
|---|---|---:|
| Hosting de API / staging | 4 meses × 45.00 | 180.00 |
| PostgreSQL administrado con PostGIS | 4 meses × 60.00 | 240.00 |
| Redis gestionado | 4 meses × 15.00 | 60.00 |
| Almacenamiento y respaldo | 4 meses × 10.00 | 40.00 |
| Dominio | Estimación anual | 18.00 |
| Créditos de mapas/geocodificación | Bolsa inicial de pruebas | 100.00 |
| SMTP y CI/CD adicional | Capa gratuita proyectada | 0.00 |
| **Total OPEX** |  | **638.00** |

## 4. Reserva de contingencia

**Subtotal = 9,808.00 + 0.00 + 638.00 = 10,446.00 USD.**  
**Reserva = Subtotal × 12% = 10,446.00 × 0.12 = 1,253.52 USD.**

La reserva cubre principalmente los riesgos de replanificación técnica, consumo de servicios externos y retrasos académicos identificados en el registro de riesgos. Su uso debe aprobarse y registrarse.

## 5. Resumen financiero

Los porcentajes de categorías se calculan sobre el subtotal: CAPEX 9,808.00 / 10,446.00 = 93.9%; Licenciamiento 0.0%; OPEX 638.00 / 10,446.00 = 6.1%.

| Categoría | Costo Subtotal (USD) | Porcentaje |
|---|---:|---:|
| Recursos Humanos (CAPEX) | $9,808.00 | 93.9% |
| Licenciamiento | $0.00 | 0.0% |
| Infraestructura Cloud (OPEX) | $638.00 | 6.1% |
| **SUBTOTAL** | **$10,446.00** | **100.0%** |
| Reserva de Contingencia (12%) | $1,253.52 | N/A |
| **PRESUPUESTO TOTAL** | **$11,699.52** | **100.0%** |

## 6. Control presupuestal

Al cierre de cada sprint se comparará costo previsto, costo comprometido y costo real contra este presupuesto. Una variación acumulada superior al 10% activa revisión con el Director del Proyecto, de acuerdo con OBJ-03 de Fase 01. Los precios de proveedor no se han consultado en línea y deben confirmarse al provisionar servicios.

## Historial de Control de Cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_0 | 11/09/2026 | Creación del presupuesto referencial del MVP | Equipo |
