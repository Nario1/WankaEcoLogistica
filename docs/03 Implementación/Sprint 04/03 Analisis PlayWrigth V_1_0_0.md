# Análisis Playwright — Sprint 4

[← Volver al README principal](../../../README.md) · [← Retrospectiva](<02 Retrospectiva del Sprint V_1_0_0.md>) · [Usabilidad →](<04 Usabilidad V_1_0_0.md>)

**Nombre del Proyecto:** WankaEcoLogística Huancayo  
**Líder del Proyecto:** Nario German Reyes Rios  
**Alcance:** Inspección 5 / cierre Sprint 4  
**Suite:** carpeta `pruebas/` (Playwright)  
**Fecha de evidencias capturadas:** 20/11/2026

## 1. Configuración del entorno de pruebas

### Arquitectura de carpetas

```text
pruebas/
├── playwright.config.js
├── package.json
├── helpers/auth.js
├── smoke-login.spec.js
├── performance-availability.spec.js
├── auth.spec.js
├── flujo-operativo.spec.js
├── pedido-en-mapa.spec.js
├── vehiculos.spec.js
├── conductores.spec.js
├── conductor-mi-ruta.spec.js
└── capture-sprint04-evidence.mjs
```

### Navegadores evaluados

| Proyecto | Motor | Estado en captura del 20/11/2026 |
|---|---|---|
| `chromium` | Desktop Chrome | Ejecutado (smoke login OK) |
| `firefox` | Desktop Firefox | Ejecutado (smoke login OK) |
| `webkit` | Desktop Safari (WebKit) | Ejecutado (smoke login OK) |

### Configuración relevante (`playwright.config.js`)

- `baseURL`: `PLAYWRIGHT_BASE_URL` o `http://localhost:5174`
- Reporter: `list` + `html` → `pruebas/playwright-report/`
- Workers: 1
- Trace: `on-first-retry`; screenshot: `only-on-failure`

### Cómo ejecutar

```powershell
cd pruebas
npm ci
npx playwright install chromium firefox webkit
$env:PLAYWRIGHT_BASE_URL="http://127.0.0.1:5174"
npm test
node capture-sprint04-evidence.mjs
```

## 2. Pruebas End-to-End (E2E)

### Casos críticos cubiertos

| Spec | Qué valida |
|---|---|
| `smoke-login.spec.js` | Pantalla de acceso visible (multi-navegador) — **3/3 OK** en esta captura |
| `auth.spec.js` | Login admin, error de credenciales, menú del conductor |
| `flujo-operativo.spec.js` | Flujo principal de negocio |
| `pedido-en-mapa.spec.js` | Formulario/ubicación de pedidos |
| `vehiculos.spec.js` / `conductores.spec.js` | CRUD operativo |
| `conductor-mi-ruta.spec.js` | Vista de campo |
| `performance-availability.spec.js` | Health HTTP y métricas de carga |

### Resultados de ejecución (captura documentada)

| Navegador | Resultado | Evidencia |
|---|---|---|
| Chromium | **OK** — smoke login | ![Login Chromium](<../../../evidencias/sprint-04/05-login-chromium.png>) |
| Firefox | **OK** — smoke login | ![Login Firefox](<../../../evidencias/sprint-04/05-login-firefox.png>) |
| WebKit | **OK** — smoke login | ![Login WebKit](<../../../evidencias/sprint-04/05-login-webkit.png>) |

**Reporte HTML de Playwright (3 passed):**

![Reporte HTML Playwright](<../../../evidencias/sprint-04/07-playwright-report-html.png>)

**Nota de alcance:** en esta captura el frontend estuvo en `vite preview` (`127.0.0.1:5174`). La suite completa autenticada (`auth.spec.js` y flujos de negocio) requiere API + PostgreSQL/PostGIS con seed; se mantiene en `pruebas/` y se ejecuta en CI (`tests.yml`) cuando el servicio de base está disponible.

## 3. Monitoreo de rendimiento

Valores medidos el 20/11/2026 sobre la pantalla de login (fuente: `evidencias/sprint-04/metricas-login.json`):

| Métrica | Chromium | Firefox | WebKit |
|---|---|---|---|
| TTFB (ms) | 2 | 2 | 2 |
| FCP (ms) | 152 | 248 | 164 |
| Tiempo de captura (ms) | 604 | 898 | 628 |

Umbral de referencia de la rúbrica para APIs (&lt; 500 ms): aplicable a `GET /health` cuando el backend está levantado (`performance-availability.spec.js`).

## 4. Disponibilidad y resiliencia

Evidencia de manejo de error de red (API no disponible): la UI muestra alerta y no rompe el formulario.

![Error sin API](<../../../evidencias/sprint-04/06-error-sin-api.png>)

- Código HTTP de `GET /health`: se valida en `performance-availability.spec.js` y en el job `e2e-playwright` de [`tests.yml`](../../../.github/workflows/tests.yml).
- Uptime productivo: documentar URL tras configurar el Secret `DEPLOY_HOOK_URL` en [`deploy-production.yml`](../../../.github/workflows/deploy-production.yml).

### Evidencias en repositorio

Carpeta: [`evidencias/sprint-04/`](../../../evidencias/sprint-04/)

| Archivo | Contenido |
|---|---|
| `05-login-chromium.png` / `firefox` / `webkit` | Login en 3 navegadores |
| `06-error-sin-api.png` | Resiliencia ante fallo de API |
| `07-playwright-report-html.png` | Reporte HTML 3/3 passed |
| `metricas-login.json` | TTFB/FCP por navegador |
| `01-login.png` / `02-pedidos.png` | Capturas operativas previas reutilizadas |

## 5. Conclusión

Se demostró ejecución Playwright en **Chromium, Firefox y WebKit** con reporte HTML y métricas de carga del acceso. Queda como siguiente refuerzo: correr la suite autenticada completa contra API+PostGIS (local o CI) y adjuntar esa salida al mismo directorio de evidencias.

[← Volver al README principal](../../../README.md)

**Fin del documento**
