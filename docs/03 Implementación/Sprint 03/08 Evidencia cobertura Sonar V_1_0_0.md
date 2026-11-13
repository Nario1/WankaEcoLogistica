# Evidencia de cobertura — 2026-11-06

[← Calidad de código](<03 Calidad de código V_1_0_0.md>) · [README principal](../../../README.md)

Complemento del documento [03 Calidad de código](<03 Calidad de código V_1_0_0.md>). La captura oficial del Overview de SonarQube (Quality Gate Passed · Coverage 83,6 %) está en [../../../evidencias/SonarqubeWankaecologistica.png](<../../../evidencias/SonarqubeWankaecologistica.png>).

Aquí solo quedan las capturas LCOV que alimentaron ese escaneo (carpeta `evidencias/` en la raíz del repositorio).

## Frontend (Vitest)

![Cobertura frontend 97,53 % líneas](<../../../evidencias/evidencia-cobertura-frontend-2026-11-06.png>)

- `npm run test:coverage` en `frontend/` → `frontend/coverage/lcov.info`
- Pruebas: 18/18 · líneas de módulos medidos: **97,53 %**

## Backend (Node test runner)

![Cobertura backend 88,9 % líneas](<../../../evidencias/evidencia-cobertura-backend-2026-11-06.png>)

- `npm run test:coverage` en `backend/` → `backend/coverage/lcov.info`
- Líneas (promedio ponderado LCOV): **88,9 %**

## Historial

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_1 | 06/11/2026 | Se deja el Overview oficial en `03 Calidad`; aquí solo LCOV de apoyo. | Equipo |
| V_1_0_0 | 06/11/2026 | Capturas LCOV frontend/backend. | Equipo |
