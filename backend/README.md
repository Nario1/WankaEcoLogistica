# API — Sprint 1

API Express con PostgreSQL/PostGIS para US-001, US-002, US-003, EN-002 y EN-006.

## Configuración

1. Copiar `.env.example` a `.env` y reemplazar secretos.
2. Crear una base PostgreSQL 15+ con PostGIS.
3. Ejecutar:

```powershell
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

No se incluyen credenciales predeterminadas. `ADMIN_EMAIL` y `ADMIN_PASSWORD` se usan únicamente al ejecutar el seed. El contrato HTTP está en `openapi.yaml`.

## Validación

```powershell
npm test
npm run lint
npm run format:check
```
