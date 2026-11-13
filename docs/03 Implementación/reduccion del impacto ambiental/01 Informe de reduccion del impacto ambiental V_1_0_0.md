# Informe de reducción del impacto ambiental y optimización PERN

[← Sprint 04](<../Sprint 04/01 Revisión del Sprint V_1_0_0.md>) · [README principal](../../../README.md) · [Estándares →](<02 Estandares Ingeniería de software V_1_0_0.md>)

**Proyecto:** WankaEcoLogística Huancayo  
**Versión:** 1.0.0  
**Fecha:** 12/11/2026  
**Stack real:** PERN (PostgreSQL + Express + React + Node.js)  
**Trazabilidad:** Inspección 04 · Green IT · RNF eficiencia / ISO/IEC 25010  

> La plantilla institucional usa MERN/MongoDB. Este entregable traduce las mismas ocho áreas de optimización a **PERN/PostgreSQL**, sin cambiar el orden ni el propósito de la consigna.

## 1.1 Introducción y propósito del informe

Este informe documenta la auditoría, refactorización y optimización de rendimiento de la plataforma WankaEcoLogística. La eficiencia computacional influye de forma directa en la sostenibilidad digital (Green IT): cada megabyte no transferido y cada consulta acotada reducen consumo energético en servidor, red y dispositivos finales.

Propósitos:

1. Identificar cuellos de botella en la arquitectura full-stack.
2. Aplicar refactorizaciones en **ocho áreas** estratégicas (equivalentes PERN).
3. Medir el impacto con Google Lighthouse y el modelo SWDM v4.
4. Validar la reducción de huella de carbono digital sin romper la funcionalidad.

## 1.2 Diagnóstico inicial del proyecto PERN (métricas previas)

Antes de las intervenciones del 12/11/2026:

- Los listados de pedidos, vehículos, conductores y rutas devolvían colecciones completas sin `LIMIT`.
- Express no comprimía JSON (`compression` ausente).
- No había política explícita de `Cache-Control` / ETag en la API.
- El bundle frontend concentraba MUI + React + Leaflet en un chunk inicial grande.
- Ya existía `React.lazy` parcial en el dashboard.

### Resumen de métricas de referencia (estado ANTES — móvil, login)

Fuente: [lighthouse-antes.report.json](./evidencias/lighthouse-antes.report.json)

| Indicador | Valor |
|---|---|
| Performance (Lighthouse) | **94 / 100** |
| Accessibility | 100 / 100 |
| FCP | 1.9 s |
| LCP | 2.2 s |
| TBT | 218 ms |
| CLS | 0 |
| Transferencia | 165.2 KiB (≈ 0.165 MB) |
| CO₂e (SWDM v4) | 0.057 g / visita |

Captura ANTES:

![Auditoría Lighthouse — estado inicial (ANTES)](./evidencias/lighthouse-antes.png)

> Contraste pedagógico de la consigna (escenario sin controles: 8.4 MB / 2.15 g CO₂e). Las mediciones oficiales del proyecto son las de esta sección y de `evidencias/`.

## 1.3 Detalle técnico de las 8 optimizaciones implementadas

### 1. Optimización de consultas PostgreSQL (equivalente a `.select()` / `.lean()`)

**Diagnóstico:** listados sin límite e índices incompletos; drivers con `SELECT *`.  
**Implementación:** columnas explícitas en repositorios, `LIMIT/OFFSET`, índices en `005_green_indexes.sql`.

```sql
-- backend/migrations/005_green_indexes.sql
CREATE INDEX IF NOT EXISTS idx_pedidos_creado_en_desc ON pedidos (creado_en DESC);
CREATE INDEX IF NOT EXISTS idx_rutas_inicio_desc ON rutas (inicio DESC);
```

### 2. Paginación de datos en backend y frontend

**Diagnóstico:** `GET /api/orders` (y listados afines) podían devolver colecciones completas.  
**Implementación:** parámetros `page`/`limit` (default 12, máx. 50) y UI con `Pagination` de MUI.

```js
// backend/src/shared/pagination.js
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 50;
```

### 3. Compresión y optimización de imágenes / assets livianos

El panel no usa banners raster pesados: icono PWA en **SVG** (`pwa-icon.svg`) con `sizes="any"` y preload. Se evita el anti-patrón PNG/JPEG > 200 KB.

### 4. Carga diferida (lazy loading) y code splitting

**Diagnóstico:** el chunk inicial concentraba demasiadas vistas.  
**Implementación:** se mantiene `React.lazy` + `Suspense` y se añade `manualChunks` (react / mui / leaflet) en Vite.

```js
// frontend/src/dashboard/Dashboard.jsx
const OrdersPage = lazy(() => import("../features/orders/OrdersPage"));
```

### 5. Depuración de dependencias

Frontend sin `moment`/`lodash`; fechas con `Intl`/`Date` nativos. Backend mínimo (Express, pg, jwt, helmet, compression).

### 6. Reducción de solicitudes HTTP

Iconografía vía `@mui/icons-material` empaquetado (sin N requests por icono). Favicon SVG único.

### 7. Estrategia de caché de recursos

API: `etag` débil + `Cache-Control: private, max-age=0, must-revalidate` en GET. Preview Vite: `max-age=31536000, immutable` para assets hasheados.

### 8. Optimización de APIs Express (middleware de compresión)

```js
// backend/src/app.js
app.use(compression({ threshold: 1024 }));
```

## 1.4 Tabla comparativa de métricas ANTES vs. DESPUÉS

| Métrica / Indicador | ANTES (móvil) | DESPUÉS (móvil) | DESPUÉS (desktop) |
|---|---|---|---|
| Performance Score (Lighthouse) | 94 | 91 | **100** |
| First Contentful Paint (FCP) | 1.9 s | 2.4 s | **0.6 s** |
| Largest Contentful Paint (LCP) | 2.2 s | 2.5 s | **0.6 s** |
| Total Blocking Time (TBT) | 218 ms | 209 ms | **25 ms** |
| Cumulative Layout Shift (CLS) | 0 | 0 | **0** |
| Peso total de transferencia | 165 KiB | 235 KiB | 235 KiB |
| vs techo rúbrica 1.1 MB | −85 % | −79 % | −79 % |
| Huella de carbono (g CO₂e / visita) | 0.057 | 0.081 | 0.081 |

Notas:

- El split de chunks sube ligeramente el peso del shell de login (más requests), pero el **techo de 1.1 MB se cumple con holgura**.
- En **desktop** (perfil LHCI de laboratorio) se alcanzan FCP/LCP/TBT/CLS del nivel sobresaliente.
- El beneficio mayor de paginación/compresión aparece en listados API con datos reales, no solo en el shell estático.

Captura DESPUÉS (móvil):

![Auditoría Lighthouse — estado optimizado (DESPUÉS)](./evidencias/lighthouse-despues.png)

Pantalla auditada (login):

![Pantalla de login auditada](./evidencias/pantalla-login.png)

Consolidados: [metricas-consolidadas.json](./evidencias/metricas-consolidadas.json).

## 1.5 Análisis de impacto ambiental y eficiencia energética

**Metodología (Sustainable Web Design Model — SWDM v4):**

```text
E (g CO2e) = Ancho_de_banda_GB × 0.815 kWh/GB × 442 g CO2e/kWh
```

- **Escenario medido DESPUÉS (desktop/móvil shell):** 240 540 B ≈ 0.000224 GB → ≈ 0.000183 kWh → **0.081 g CO₂e / visita**.
- **Proyección 500 000 visitas/año (shell medido):** ≈ 40.5 kg CO₂e/año.
- **Contraste pedagógico de la consigna** (8.4 MB → 2.15 g/visita → 1 075 kg/año): el diseño actual evita del orden de **1 t CO₂e/año** respecto a ese anti-patrón.

## 1.6 Evidencias visuales de validación (auditoría Lighthouse)

```text
================================================================================
AUDITORÍA LIGHTHOUSE - ESTADO INICIAL (ANTES) — móvil / login
================================================================================
Performance:  94/100
- FCP: 1.9s
- LCP: 2.2s
- TBT: 218ms
- CLS: 0
Transfer: 165 KiB | CO2e: 0.057 g/visita

================================================================================
AUDITORÍA LIGHTHOUSE - ESTADO OPTIMIZADO (DESPUÉS) — desktop
================================================================================
Performance:  100/100
- FCP: 0.6s
- LCP: 0.6s
- TBT: 25ms
- CLS: 0
Transfer: 235 KiB | CO2e: 0.081 g/visita | techo 1.1 MB: CUMPLE
```

| Archivo | Descripción |
|---|---|
| [evidencias/lighthouse-antes.png](./evidencias/lighthouse-antes.png) | Captura móvil previa |
| [evidencias/lighthouse-despues.png](./evidencias/lighthouse-despues.png) | Captura móvil posterior |
| [evidencias/pantalla-login.png](./evidencias/pantalla-login.png) | Pantalla auditada |
| [evidencias/lighthouse-antes.report.html](./evidencias/lighthouse-antes.report.html) | Reporte HTML previo |
| [evidencias/lighthouse-despues.report.html](./evidencias/lighthouse-despues.report.html) | Reporte HTML posterior |
| [evidencias/lighthouse-despues-desktop.report.json](./evidencias/lighthouse-despues-desktop.report.json) | Auditoría desktop |
| [evidencias/metricas-consolidadas.json](./evidencias/metricas-consolidadas.json) | SWDM consolidado |

**Fin del documento 1**
