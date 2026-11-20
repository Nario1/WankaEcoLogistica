# Evaluación cuantitativa de usabilidad (SUS)

[← Volver al README principal](../../../README.md) · [← Playwright](<03 Analisis PlayWrigth V_1_0_0.md>) · [← Revisión del sprint](<01 Revisión del Sprint V_1_0_0.md>)

**Proyecto:** WankaEcoLogística Huancayo  
**Sprint:** 4 / Inspección 5  
**Fecha de aplicación:** 18/11/2026–20/11/2026  
**Responsable del análisis:** Nario German Reyes Rios

## 1. Ficha técnica de la evaluación

| Campo | Detalle |
|---|---|
| Instrumento | System Usability Scale (SUS) — Brooke (1996) |
| Escala | Likert 1–5 (1 = totalmente en desacuerdo … 5 = totalmente de acuerdo) |
| Ítems | 10 (impares con wording positivo; pares con wording negativo) |
| Muestra (**n**) | 5 evaluadores (stakeholders / usuarios representativos del panel operativo) |
| Umbral de aceptación industria | SUS promedio **≥ 68** |
| Entorno evaluado | Frontend local `http://localhost:5174` + API `http://localhost:3000` (build alineado a `main`) |

### 1.1 Perfil de la muestra

| ID | Rol / perfil | Experiencia previa con el sistema |
|---|---|---|
| P1 | Administrador operativo (planificación) | Usuario frecuente Sprint 3–4 |
| P2 | Auditor / sostenibilidad | Consulta indicadores y reportes |
| P3 | Conductor de última milla | Usa **Mi ruta** |
| P4 | Stakeholder académico (docente/pares) | Demo guiada |
| P5 | Analista de soporte | Primer uso supervisado |

### 1.2 Tareas ejecutadas antes del cuestionario

1. Iniciar sesión con el rol asignado.
2. Localizar el módulo principal de su rol (Pedidos/Rutas/Indicadores o Mi ruta).
3. Completar una consulta o acción corta (abrir listado, ver indicadores o mapa).
4. Cerrar sesión o volver al inicio.

## 2. Resultados cuantitativos

### 2.1 Matriz de respuestas brutas (Likert 1–5)

| Participante | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| P1 | 5 | 2 | 5 | 2 | 4 | 2 | 5 | 1 | 4 | 2 |
| P2 | 4 | 2 | 5 | 1 | 5 | 2 | 4 | 2 | 5 | 2 |
| P3 | 4 | 1 | 4 | 2 | 4 | 1 | 5 | 2 | 4 | 1 |
| P4 | 5 | 2 | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 2 |
| P5 | 4 | 2 | 4 | 3 | 4 | 2 | 4 | 2 | 4 | 2 |

### 2.2 Cálculo paso a paso del SUS individual

Fórmula estándar:

- Para ítems **impares** (1,3,5,7,9): aporte = `valor − 1`
- Para ítems **pares** (2,4,6,8,10): aporte = `5 − valor`
- Suma de aportes ∈ [0, 40] → **SUS = suma × 2.5** ∈ [0, 100]

#### Ejemplo detallado — P1

| Ítem | Valor | Aporte |
|---|---:|---:|
| Q1 | 5 | 4 |
| Q2 | 2 | 3 |
| Q3 | 5 | 4 |
| Q4 | 2 | 3 |
| Q5 | 4 | 3 |
| Q6 | 2 | 3 |
| Q7 | 5 | 4 |
| Q8 | 1 | 4 |
| Q9 | 4 | 3 |
| Q10 | 2 | 3 |
| **Suma** |  | **34** |
| **SUS P1** |  | **34 × 2.5 = 85.0** |

#### Resumen por participante

| Participante | Suma aportes | SUS (0–100) |
|---|---:|---:|
| P1 | 34 | 85.0 |
| P2 | 34 | 85.0 |
| P3 | 35 | 87.5 |
| P4 | 31 | 77.5 |
| P5 | 29 | 72.5 |

### 2.3 Puntaje SUS promedio global

\[
\overline{SUS} = \frac{85.0 + 85.0 + 87.5 + 77.5 + 72.5}{5} = \frac{407.5}{5} = \mathbf{81.5}
\]

## 3. Análisis e interpretación

### 3.1 Comparación con el estándar (≥ 68)

El promedio **81.5** supera el umbral de aceptación de la industria (**68**) por **+13.5 puntos**.

### 3.2 Clasificación por adjetivos / grados

Según bandas habituales de interpretación SUS (Bangor et al. / Sauro):

| Rango aproximado | Grado / adjetivo |
|---|---|
| ≥ 80.3 | **A** — Excelente |
| 68–80.2 | B/C — Bueno / Aceptable |
| &lt; 68 | D/F — Bajo aceptación |

**Resultado del equipo:** grado **A (Excelente)** a nivel de promedio muestral. P5 (72.5) permanece por encima de 68 pero señala fricción en el primer uso.

### 3.3 Cuellos de botella de interfaz identificados

1. Formularios densos de pedidos/rutas (muchos campos visibles a la vez) — afecta a P4/P5.
2. Distinción inicial entre **Indicadores** y **Reportes** no siempre evidente para perfiles no planificadores.
3. Conductores (P3) valoran **Mi ruta**, pero el resto del menú admin genera ruido si se prueba con cuenta equivocada (mitigado por RBAC).

### 3.4 Mejoras aplicadas o propuestas

| Mejora | Estado |
|---|---|
| Corrección pantalla en blanco en **Rutas** (SW/dev + Leaflet) | **Aplicada** (`8d954cc`) |
| Mensajes vacíos claros en Indicadores sin datos | Ya presente en US-006 |
| Acortar copy de ayudas en formularios de pedido/ruta | **Propuesta** — backlog post–Sprint 4 |
| Tour corto “primer ingreso” para perfiles P5 | **Propuesta** |

**Fin del documento**
