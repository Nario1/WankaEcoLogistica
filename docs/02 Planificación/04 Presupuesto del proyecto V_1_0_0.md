# Presupuesto del proyecto

[← Volver al README Principal](../../README.md)

| Campo | Información |
|---|---|
| Proyecto | WankaEcoLogística Huancayo |
| Versión | V_1_0_0 |
| Fecha | 11/09/2026 |
| Moneda | PEN (S/) |
| Horizonte estimado | 4 meses académicos de construcción y pruebas |

## 1. Supuestos de estimación

El repositorio documenta un equipo académico de cinco integrantes, pero no asigna cargos técnicos ni tarifas. Para hacer verificable el presupuesto se usa una **estimación referencial** de esfuerzo por rol, no una afirmación de remuneración real. Las tarifas por hora reflejan valores competitivos del mercado peruano para perfiles junior y académicos orientados a un MVP; deberán validarse por el equipo y la institución antes de contratar o desembolsar. Se evita incluir hardware porque Fase 01 establece ese supuesto. Los montos están expresados en **soles peruanos (S/)**.

### Recursos humanos — CAPEX

**Fórmula: Costo = horas asignadas × tarifa por hora.**

| Rol | Horas | Tarifa/hora (S/) | Cálculo | Costo (S/) |
|---|---:|---:|---|---:|
| Project Manager / Scrum Master | 72 | 35.00 | 72 × 35.00 | 2,520.00 |
| Software Architect | 40 | 40.00 | 40 × 40.00 | 1,600.00 |
| Backend Developer | 140 | 30.00 | 140 × 30.00 | 4,200.00 |
| Frontend Developer | 120 | 30.00 | 120 × 30.00 | 3,600.00 |
| QA Engineer | 80 | 25.00 | 80 × 25.00 | 2,000.00 |
| UI/UX Designer | 40 | 25.00 | 40 × 25.00 | 1,000.00 |
| DevOps Engineer | 28 | 35.00 | 28 × 35.00 | 980.00 |
| **Total CAPEX** | **520** |  |  | **15,900.00** |

## 2. Licenciamiento y herramientas

Se planifica con herramientas sin costo directo para el MVP: GitHub/Git, Markdown, VS Code, GitHub Actions con cuota disponible y CodeQL; Jira y Figma se consideran en plan gratuito o académico, sujeto a elegibilidad. No se presupuestan licencias comerciales inexistentes en el alcance actual.

| Herramienta | Uso | Supuesto | Costo (S/) |
|---|---|---|---:|
| Jira Software | Backlog y sprints | Plan gratuito/académico | 0.00 |
| Figma | Diseño UI/UX | Plan gratuito | 0.00 |
| GitHub, CodeQL y Actions | Repositorio, análisis y CI/CD | Cuota gratuita suficiente para MVP | 0.00 |
| OpenAPI/Swagger y VS Code | API y desarrollo | Software sin costo | 0.00 |
| **Total licenciamiento** |  |  | **0.00** |

## 3. Infraestructura cloud — OPEX

Los valores representan cuatro meses de desarrollo, staging y pruebas aprovechando capas gratuitas y planes económicos; producción sostenida requiere una reestimación. Se considera el stack documentado: Node.js/Express, PostgreSQL/PostGIS, Redis, PWA y un proveedor externo de mapas.

| Concepto | Cálculo | Costo (S/) |
|---|---|---:|
| Hosting de API / staging | 4 meses × 75.00 | 300.00 |
| PostgreSQL administrado con PostGIS | 4 meses × 100.00 | 400.00 |
| Redis gestionado | 4 meses × 25.00 | 100.00 |
| Almacenamiento y respaldo | 4 meses × 15.00 | 60.00 |
| Dominio | Estimación anual | 50.00 |
| Créditos de mapas/geocodificación | Bolsa inicial de pruebas | 150.00 |
| SMTP y CI/CD adicional | Capa gratuita proyectada | 0.00 |
| **Total OPEX** |  | **1,060.00** |

## 4. Reserva de contingencia

**Subtotal = 15,900.00 + 0.00 + 1,060.00 = 16,960.00 S/.**  
**Reserva = Subtotal × 10% = 16,960.00 × 0.10 = 1,696.00 S/.**

La reserva cubre principalmente los riesgos de replanificación técnica, consumo de servicios externos y retrasos académicos identificados en el registro de riesgos. Su uso debe aprobarse y registrarse.

## 5. Resumen financiero

Los porcentajes de categorías se calculan sobre el subtotal: CAPEX 15,900.00 / 16,960.00 = 93.7%; Licenciamiento 0.0%; OPEX 1,060.00 / 16,960.00 = 6.3%.

| Categoría | Costo Subtotal (S/) | Porcentaje |
|---|---:|---:|
| Recursos Humanos (CAPEX) | S/ 15,900.00 | 93.7% |
| Licenciamiento | S/ 0.00 | 0.0% |
| Infraestructura Cloud (OPEX) | S/ 1,060.00 | 6.3% |
| **SUBTOTAL** | **S/ 16,960.00** | **100.0%** |
| Reserva de Contingencia (10%) | S/ 1,696.00 | N/A |
| **PRESUPUESTO TOTAL** | **S/ 18,656.00** | **100.0%** |

## 6. Control presupuestal

Al cierre de cada sprint se comparará costo previsto, costo comprometido y costo real contra este presupuesto. Una variación acumulada superior al 10% activa revisión con el Director del Proyecto, de acuerdo con OBJ-03 de Fase 01. Los precios de proveedor no se han consultado en línea y deben confirmarse al provisionar servicios.

## Historial de Control de Cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_0 | 11/09/2026 | Creación del presupuesto referencial del MVP en soles (PEN) | Equipo |
