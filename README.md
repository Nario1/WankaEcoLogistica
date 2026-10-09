# WankaEcoLogística Huancayo

Aplicación web para gestionar la logística de última milla en Huancayo. El incremento actual corresponde al Sprint 2 e incorpora optimización de rutas sobre la base operativa segura entregada en el Sprint 1.

## Estado actual

Los Sprints 1 y 2 están implementados para desarrollo local. El sistema gestiona pedidos, vehículos, conductores y rutas; autentica por JWT y RBAC; conserva coordenadas PostGIS; calcula emisiones; optimiza hasta 50 pedidos sobre la ruta manual seleccionada desde el local fijo `-12.07201013486951, -75.20516872975998`; y muestra la salida y sus paradas ordenadas sobre un mapa OpenStreetMap.

Permanecen planificados para sprints posteriores el seguimiento móvil/offline del conductor, la reoptimización por incidencias, los indicadores consolidados y los reportes exportables.

## Arquitectura y tecnologías

- `frontend/`: React 19, Vite 8 y Material UI 9.
- `backend/`: Node.js 20+, Express 5, JWT y bcrypt; módulos, servicios y repositorios.
- Datos: PostgreSQL 15+ con PostGIS y migraciones SQL incrementales.
- Calidad: Node test runner con cobertura, ESLint y Prettier.

El contrato HTTP se encuentra en [backend/openapi.yaml](backend/openapi.yaml).

## Funcionalidades entregadas

| Sprint | Ítem | Funcionalidad |
|---|---|---|
| 1 | US-001 | Crear, listar y actualizar pedidos validados. |
| 1 | US-002 | Administrar vehículos y su disponibilidad. |
| 1 | US-003 | Gestionar conductores y asignaciones sin solapamientos. |
| 1 | EN-002 | Autenticación, RBAC y bloqueo temporal. |
| 1 | EN-006 | Persistencia PostGIS y cálculo reproducible de emisiones. |
| 2 | US-004 | Optimizar rutas para entre 1 y 50 pedidos pendientes. |
| 2 | EN-001 | Medir el rendimiento con 50 puntos y límite P95 de 3,5 s. |
| 2 | EN-007 | Actualizar pruebas, cobertura, migraciones y OpenAPI. |

## Inicio rápido en Windows

Requisitos: Node.js 20+, PostgreSQL 15+ y PostGIS.

```powershell
cd backend
npm install
Copy-Item .env.example .env
# Configure DATABASE_URL, JWT_SECRET y credenciales de seed.
npm run db:migrate
npm run db:seed
npm run dev
```

En otra terminal:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Abra `http://localhost:5173`. La API responde en `http://localhost:3000` y su salud se consulta en `http://localhost:3000/health`.

## Calidad

```powershell
# backend/
npm test
npm run lint
npm run format:check

# frontend/
npm run lint
npm run format:check
npm run build
```

Para ejecutar también la integración PostGIS configure `TEST_DATABASE_URL` con una base aislada y migrada.

## Documentación

### Inicio y planificación

- [Requisitos funcionales](<docs/01 Inicio/06. Requisitos funcionales V_1_0_0.md>)
- [Reglas de negocio](<docs/01 Inicio/09. Reglas de negocio V_1_0_0.md>)
- [Arquitectura C4](<docs/01 Inicio/12. Modelo C4 V_1_0_0.md>)
- [Backlog y planificación de sprints](<docs/02 Planificación/01 Transformando a ágil V_1_0_0.md>)
- [Artefactos Jira](<docs/02 Planificación/02 Artefactos Jira V_1_0_0.md>)
- [Calidad de código](CODE_QUALITY.md)

### Entregables del Sprint 1

- [01 Informe de estado del proyecto](<docs/03 Implementación/Sprint 1/01 Informe de estado del proyecto V_1_0_0.md>)
- [02 Registro de Impedimentos](<docs/03 Implementación/Sprint 1/02 Registro de Impedimentos V_1_0_0.md>)
- [03 Revisión del Sprint](<docs/03 Implementación/Sprint 1/03 Revisión del Sprint V_1_0_0.md>)
- [04 Retrospectiva del Sprint](<docs/03 Implementación/Sprint 1/04 Retrospectiva del Sprint V_1_0_0.md>)

### Entregables del Sprint 2

- [01 Informe de estado del proyecto](<docs/03 Implementación/Sprint 2/01 Informe de estado del proyecto V_1_0_0.md>)
- [02 Registro de Impedimentos](<docs/03 Implementación/Sprint 2/02 Registro de Impedimentos V_1_0_0.md>)
- [03 Revisión del Sprint](<docs/03 Implementación/Sprint 2/03 Revisión del Sprint V_1_0_0.md>)
- [04 Retrospectiva del Sprint](<docs/03 Implementación/Sprint 2/04 Retrospectiva del Sprint V_1_0_0.md>)
