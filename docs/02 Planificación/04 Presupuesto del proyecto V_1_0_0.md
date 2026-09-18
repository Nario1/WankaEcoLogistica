# Presupuesto del proyecto

[← Volver al README Principal](../../README.md)

| Campo | Información |
|---|---|
| Proyecto | WankaEcoLogística Huancayo |
| Versión | V_1_0_0 |
| Fecha | 11/09/2026 |
| Moneda | PEN (S/) |
| Tipo de cambio referencial | 1 USD = 3.75 PEN |
| Horizonte estimado | 4 meses académicos de construcción y pruebas |

## 1. Supuestos de estimación

El repositorio documenta un equipo académico de cinco integrantes, pero no asigna cargos técnicos ni tarifas. Para hacer verificable el presupuesto se usa una **estimación referencial** de esfuerzo por rol, no una afirmación de remuneración real. Las tarifas por hora son supuestos de planificación para servicios profesionales de un MVP; deberán validarse por el equipo y la institución antes de contratar o desembolsar. Se evita incluir hardware porque Fase 01 establece ese supuesto. Los montos están expresados en **soles peruanos (S/)** con un tipo de cambio referencial de 3.75 PEN/USD.

### Recursos humanos — CAPEX

**Fórmula: Costo = horas asignadas × tarifa por hora.**

| Rol | Horas | Tarifa/hora (S/) | Cálculo | Costo (S/) |
|---|---:|---:|---|---:|
| Project Manager / Scrum Master | 80 | 67.50 | 80 × 67.50 | 5,400.00 |
| Software Architect | 48 | 82.50 | 48 × 82.50 | 3,960.00 |
| Backend Developer | 160 | 60.00 | 160 × 60.00 | 9,600.00 |
| Frontend Developer | 144 | 60.00 | 144 × 60.00 | 8,640.00 |
| QA Engineer | 96 | 48.75 | 96 × 48.75 | 4,680.00 |
| UI/UX Designer | 48 | 48.75 | 48 × 48.75 | 2,340.00 |
| DevOps Engineer | 32 | 67.50 | 32 × 67.50 | 2,160.00 |
| **Total CAPEX** | **608** |  |  | **36,780.00** |

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

Los valores representan cuatro meses de desarrollo, staging y pruebas; producción sostenida requiere una reestimación. Se considera el stack documentado: Node.js/Express, PostgreSQL/PostGIS, Redis, PWA y un proveedor externo de mapas.

| Concepto | Cálculo | Costo (S/) |
|---|---|---:|
| Hosting de API / staging | 4 meses × 168.75 | 675.00 |
| PostgreSQL administrado con PostGIS | 4 meses × 225.00 | 900.00 |
| Redis gestionado | 4 meses × 56.25 | 225.00 |
| Almacenamiento y respaldo | 4 meses × 37.50 | 150.00 |
| Dominio | Estimación anual | 67.50 |
| Créditos de mapas/geocodificación | Bolsa inicial de pruebas | 375.00 |
| SMTP y CI/CD adicional | Capa gratuita proyectada | 0.00 |
| **Total OPEX** |  | **2,392.50** |

## 4. Reserva de contingencia

**Subtotal = 36,780.00 + 0.00 + 2,392.50 = 39,172.50 S/.**  
**Reserva = Subtotal × 12% = 39,172.50 × 0.12 = 4,700.70 S/.**

La reserva cubre principalmente los riesgos de replanificación técnica, consumo de servicios externos y retrasos académicos identificados en el registro de riesgos. Su uso debe aprobarse y registrarse.

## 5. Resumen financiero

Los porcentajes de categorías se calculan sobre el subtotal: CAPEX 36,780.00 / 39,172.50 = 93.9%; Licenciamiento 0.0%; OPEX 2,392.50 / 39,172.50 = 6.1%.

| Categoría | Costo Subtotal (S/) | Porcentaje |
|---|---:|---:|
| Recursos Humanos (CAPEX) | S/ 36,780.00 | 93.9% |
| Licenciamiento | S/ 0.00 | 0.0% |
| Infraestructura Cloud (OPEX) | S/ 2,392.50 | 6.1% |
| **SUBTOTAL** | **S/ 39,172.50** | **100.0%** |
| Reserva de Contingencia (12%) | S/ 4,700.70 | N/A |
| **PRESUPUESTO TOTAL** | **S/ 43,873.20** | **100.0%** |

## 6. Control presupuestal

Al cierre de cada sprint se comparará costo previsto, costo comprometido y costo real contra este presupuesto. Una variación acumulada superior al 10% activa revisión con el Director del Proyecto, de acuerdo con OBJ-03 de Fase 01. Los precios de proveedor no se han consultado en línea y deben confirmarse al provisionar servicios.

## Historial de Control de Cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_0 | 11/09/2026 | Creación del presupuesto referencial del MVP en soles (PEN) | Equipo |
