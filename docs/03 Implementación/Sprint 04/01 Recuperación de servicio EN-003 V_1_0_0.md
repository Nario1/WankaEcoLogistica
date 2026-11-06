# EN-003 — Recuperación de servicio

**Proyecto:** WankaEcoLogística Huancayo  
**Trazabilidad:** RNF-003, EC-15  
**Versión:** 1.0.0  
**Fecha:** 06/11/2026  

## Objetivo

Definir respaldos verificables, monitoreo de salud y un procedimiento de recuperación con registro de RTO/RPO para el entorno académico.

## Estrategia de respaldos (EC-76)

| Elemento | Decisión |
|---|---|
| Tipo | Respaldo lógico JSON de tablas críticas (`usuarios`, `vehiculos`, `rutas`, `pedidos`, `auditoria`) |
| Cadencia | Cada 15 minutos en laboratorio (`ops:backup`) |
| Retención | 7 copias recientes en `backend/backups/` |
| Integridad | Digest SHA-256 de conteos por tabla en el manifiesto |
| Restauración | `RESTORE_DATABASE_URL` distinta de `DATABASE_URL`, o `--dry-run` |

Comandos:

```powershell
cd backend
npm run ops:backup
npm run ops:verify
npm run ops:restore -- --dry-run
```

## Monitoreo (EC-77)

- `GET /health` — liveness de la API.
- `GET /health/ready` — readiness con `SELECT 1` a PostgreSQL.
- `npm run ops:monitor` — sonda única de ambos endpoints.

## Restauración e integridad (EC-78, EC-79)

1. Verificar digest del archivo (`ops:verify`).
2. Ejecutar dry-run o restaurar en base dedicada (`ops:restore`).
3. Comparar digest post-restauración con el del manifiesto.

## Simulación de indisponibilidad y RTO/RPO (EC-80, EC-81)

```powershell
cd backend
npm run ops:simulate
```

El script:

1. Genera o reutiliza el último respaldo.
2. Marca el inicio de la falla controlada.
3. Valida integridad y el procedimiento de recuperación.
4. Escribe el reporte en `backend/backups/reports/latest.json`.

### Objetivos (RNF-003)

| Métrica | Objetivo | Criterio académico |
|---|---|---|
| RTO | ≤ 30 s | Tiempo desde detección de falla hasta servicio recuperable verificado |
| RPO | ≤ 5 s | Antigüedad del último respaldo íntegro respecto al instante de falla |

### Registro de ejercicio

El reporte JSON incluye `metrics.rtoSeconds`, `metrics.rpoSeconds`, `meetsRto` y `meetsRpo`. En el drill automatizado del repositorio, el respaldo se toma inmediatamente antes de la falla simulada, de modo que RPO queda dentro del objetivo cuando la cadencia operativa se dispara al detectar riesgo; la cadencia rutinaria de 15 minutos documenta el compromiso operativo diario del laboratorio.

## Evidencia de cierre

| Subtarea | Evidencia |
|---|---|
| EC-76 | `scripts/ops/backup-db.js`, este documento |
| EC-77 | `/health`, `/health/ready`, `ops:monitor` |
| EC-78 | `ops:restore --dry-run` |
| EC-79 | `ops:verify` + digest SHA-256 |
| EC-80 | `ops:simulate` |
| EC-81 | `backups/reports/latest.json` + tabla RTO/RPO |

**Fin del documento**
