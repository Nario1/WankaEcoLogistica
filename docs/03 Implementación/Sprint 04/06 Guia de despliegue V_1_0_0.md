# Guía de despliegue (listo para producción)

[← Volver al README principal](../../../README.md) · [← Usabilidad](<04 Usabilidad V_1_0_0.md>) · [CI/CD badges](../../../README.md#estado-de-cicd-inspección-5)

**Proyecto:** WankaEcoLogística Huancayo  
**Workflow:** `.github/workflows/deploy-production.yml`  
**Estado actual:** build + artefacto `frontend-dist` en cada push a `main`; el go-live espera secrets.

## 1. Qué ya está automatizado

1. Push a `main` (o `workflow_dispatch`) dispara **Deploy Production**.
2. Se construye el frontend (`npm run build`) y se valida `npm ci` del backend.
3. Se publica el artefacto **frontend-dist** (30 días).
4. Si existe `DEPLOY_HOOK_URL`, se invoca el webhook del hosting.

## 2. Secrets a configurar después (GitHub → Settings → Secrets and variables → Actions)

| Secret | Uso |
|---|---|
| `DEPLOY_HOOK_URL` | URL del deploy hook (Render / Railway / Vercel deploy hook). |
| `PRODUCTION_URL` | URL pública final (aparece en el environment `production` y en el resumen del workflow). |
| `VITE_API_URL` | Origen de la API en producción, p. ej. `https://api.tudominio.com/api`. |

## 3. Pasos recomendados cuando tenga hosting

1. Desplegar backend (Node + PostgreSQL/PostGIS) y anotar su URL HTTPS.
2. Crear el secret `VITE_API_URL` con esa URL + `/api`.
3. Crear el frontend en el proveedor y copiar el **Deploy Hook**.
4. Guardar `DEPLOY_HOOK_URL` y `PRODUCTION_URL`.
5. En Actions → **Deploy Production** → Run workflow (o hacer push a `main`).
6. Verificar login y `/health` en la URL productiva.

## 4. Checklist de go-live

- [ ] Base PostGIS migrada (`npm run db:migrate`) y admin sembrado (`npm run db:seed`)
- [ ] `CORS_ORIGIN` del backend apunta al dominio del frontend
- [ ] `JWT_SECRET` fuerte (≥ 32) solo en el hosting (nunca en Git)
- [ ] Workflow **Deploy Production** en verde
- [ ] Smoke Playwright contra `PLAYWRIGHT_BASE_URL` de producción (opcional)

**Fin del documento**
