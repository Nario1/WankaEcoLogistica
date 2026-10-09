# WankaEcoLogística Huancayo

Aplicación web para gestionar la logística de última milla en Huancayo. El sistema administra pedidos, vehículos, conductores y rutas, y optimiza entregas desde el local de WankaEcoLogística ubicado en `-12.07201013486951, -75.20516872975998`.

Este es el único README general del proyecto. Los entregables específicos se encuentran organizados por sprint dentro de [`docs/03 Implementación/`](<docs/03 Implementación/>).

Para recorrer toda la documentación en orden, consulte el [índice central de documentación](<docs/00 Índice de documentación.md>).

## Estado actual

Los Sprints 1 y 2 están implementados para desarrollo local:

- CRUD completo de pedidos, vehículos, conductores y rutas.
- Bajas lógicas para conservar historial y auditoría.
- Autenticación JWT, control RBAC y bloqueo temporal por intentos fallidos.
- Coordenadas geográficas almacenadas con PostgreSQL/PostGIS.
- Selección de la ubicación de los pedidos directamente en el mapa.
- Identificación del producto o carga, peso, prioridad y ventana horaria.
- Fechas y horas presentadas con controles AM/PM.
- Planificación integrada de pedidos, vehículo, conductor y horario.
- Recomendación del vehículo activo de menor capacidad suficiente.
- Optimización de entre 1 y 50 pedidos usando como máximo el 95 % de la capacidad nominal.
- Validación de prioridad, ventanas de entrega, solapamientos y jornada máxima de ocho horas.
- Trazado por calles reales mediante TomTom Routing o OSRM/OpenStreetMap.
- Cálculo reproducible de emisiones.

Permanecen planificados para sprints posteriores el seguimiento móvil/offline del conductor, la reoptimización por incidencias, los indicadores consolidados y los reportes exportables.

## Historias implementadas

| Sprint | Ítem | Resultado |
|---|---|---|
| 1 | US-001 | Registrar, consultar, editar y cancelar pedidos validados. |
| 1 | US-002 | Registrar, consultar, editar y dar de baja vehículos. |
| 1 | US-003 | Gestionar conductores y asignaciones sin solapamientos. |
| 1 | EN-002 | Autenticación, RBAC y bloqueo temporal. |
| 1 | EN-006 | Persistencia PostGIS y cálculo reproducible de emisiones. |
| 2 | US-004 | Optimizar hasta 50 pedidos respetando capacidad, prioridad, ventanas y disponibilidad. |
| 2 | EN-001 | Medir el rendimiento con 50 puntos y objetivo P95 máximo de 3,5 segundos. |
| 2 | EN-007 | Mantener pruebas, cobertura, migraciones, OpenAPI y documentación sincronizados. |

US-005 a US-008 pertenecen a sprints posteriores y no se declaran como terminadas.

## Arquitectura y tecnologías

- `frontend/`: React 19, Vite 8, Material UI 9, Leaflet y React Leaflet.
- `backend/`: Node.js 20+, Express 5, JWT y bcrypt, organizado en rutas, servicios y repositorios.
- `backend/migrations/`: migraciones incrementales de PostgreSQL/PostGIS.
- `backend/test/`: pruebas de API, servicios, optimización, navegación y PostGIS.
- `docs/`: documentación de inicio, planificación e implementación.

El contrato HTTP está disponible en [backend/openapi.yaml](backend/openapi.yaml) y corresponde a OpenAPI `3.1.0`, versión documental `0.3.0`.

## Estructura del proyecto

```text
WankaEcoLogistica/
├── README.md                    # Guía general, estado e instalación
├── CODE_QUALITY.md              # Estándares técnicos y de calidad
├── docs/
│   ├── 00 Índice de documentación.md
│   ├── 01 Inicio/               # Alcance, requisitos, usuarios y arquitectura
│   ├── 02 Planificación/        # Backlog, Jira, riesgos y presupuesto
│   └── 03 Implementación/
│       ├── Sprint 1/            # Base operativa y seguridad
│       └── Sprint 2/            # Optimización, evidencia y retrospectiva
├── backend/
│   ├── migrations/              # Migraciones SQL incrementales
│   ├── scripts/                 # Migración y creación del administrador
│   ├── src/
│   │   ├── config/              # Entorno y conexión PostgreSQL
│   │   ├── infrastructure/      # Repositorios PostgreSQL y proveedores viales
│   │   ├── modules/             # Auth, pedidos, flota, rutas y optimización
│   │   └── shared/              # Errores, validación y utilidades HTTP
│   ├── test/                    # Pruebas unitarias, API e integración
│   └── openapi.yaml             # Contrato HTTP OpenAPI 3.1
└── frontend/
    └── src/
        ├── api/                 # Cliente HTTP
        ├── auth/                # Sesión e inicio de sesión
        ├── dashboard/           # Navegación y estructura visual
        ├── features/            # Pedidos, vehículos, conductores y rutas
        ├── shared-theme/        # Tema y componentes visuales MUI
        └── utils/               # Formatos de fecha y hora
```

### Responsabilidad de las carpetas

| Ruta | Responsabilidad |
|---|---|
| `docs/01 Inicio/` | Define el proyecto y sus requisitos. |
| `docs/02 Planificación/` | Organiza backlog, riesgos, presupuesto y sprints. |
| `docs/03 Implementación/Sprint N/` | Conserva la evidencia documental de cada sprint. |
| `backend/src/modules/` | Implementa casos de uso y endpoints por dominio. |
| `backend/src/infrastructure/` | Conecta servicios con PostgreSQL, OSRM y TomTom. |
| `backend/test/` | Verifica reglas, permisos, rendimiento e integraciones. |
| `frontend/src/features/` | Implementa las pantallas funcionales del sistema. |

## Requisitos

- Node.js 20 o superior.
- npm.
- PostgreSQL 15 o superior.
- Extensión PostGIS habilitada.
- Una clave TomTom opcional para rutas con tráfico.

## Inicio rápido en Windows

El flujo resumido del README anterior se conserva. Después de configurar las variables descritas en las siguientes secciones, ejecute:

```powershell
# Terminal 1
cd backend
npm install
Copy-Item .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

```powershell
# Terminal 2
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Abra `http://localhost:5173`. La API responde en `http://localhost:3000` y su estado se consulta en `http://localhost:3000/health`.

## Configuración del backend

Desde la raíz del proyecto:

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Configure `backend/.env`:

```dotenv
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:TU_PASSWORD@localhost:5432/wanka_ecologistica
DATABASE_SSL=false
JWT_SECRET=reemplace-por-un-secreto-de-al-menos-32-caracteres
JWT_EXPIRES_IN=15m
CORS_ORIGIN=http://localhost:5173
OSRM_BASE_URL=https://router.project-osrm.org
TOMTOM_API_KEY=
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=reemplace-por-una-contrasena-segura
```

`ADMIN_PASSWORD` debe tener al menos 12 caracteres. `JWT_SECRET` debe tener al menos 32. No suba `backend/.env` ni claves reales a Git.

Prepare la base y el usuario administrador:

```powershell
npm run db:migrate
npm run db:seed
```

Inicie la API:

```powershell
npm run dev
```

La API estará disponible en `http://localhost:3000` y su verificación de salud en `http://localhost:3000/health`.

## Configuración del frontend

En otra terminal:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

La variable esperada es:

```dotenv
VITE_API_URL=http://localhost:3000/api
```

Abra `http://localhost:5173` e inicie sesión con el administrador configurado en el backend.

## Navegación y tráfico

El backend selecciona el proveedor automáticamente:

- Con `TOMTOM_API_KEY`, utiliza TomTom Routing con tráfico actual o histórico, según la hora de salida.
- Sin `TOMTOM_API_KEY`, utiliza OSRM/OpenStreetMap como respaldo para respetar la red vial y sentidos de circulación, sin afirmar tráfico en tiempo real.

Después de modificar `TOMTOM_API_KEY`, reinicie el backend y optimice una ruta nueva. El mapa indicará el proveedor empleado. Las credenciales y coordenadas de la operación se envían al proveedor configurado; use infraestructura propia si la política de privacidad lo exige.

## Flujo principal del Sprint 2

1. Registrar pedidos con producto, dirección, ubicación, peso, prioridad y ventana.
2. Registrar vehículos y conductores activos.
3. Abrir **Planificación de rutas** y seleccionar entre 1 y 50 pedidos pendientes.
4. Revisar el vehículo recomendado, el conductor y el horario sugerido.
5. Confirmar la creación y optimización.
6. Abrir **Ver mapa** para consultar origen, paradas, geometría vial, distancia, duración y tráfico.

Si ninguna unidad cumple el 95 % de capacidad segura, el sistema rechaza el lote completo y solicita reducirlo, reprogramarlo o registrar otra unidad.

## CRUD operativo

| Recurso | Operaciones | Baja lógica |
|---|---|---|
| Pedidos | Listar, consultar, crear, editar y eliminar | `CANCELLED` |
| Vehículos | Listar, consultar, crear, editar y eliminar | `OUT_OF_SERVICE` |
| Conductores | Listar, consultar, crear, editar y eliminar | `INACTIVE` |
| Rutas | Listar, consultar, crear, editar, asignar conductor y eliminar | `CANCELLED` |

La eliminación física no se utiliza porque estos recursos participan en relaciones históricas y registros de auditoría.

## Calidad y pruebas

Backend:

```powershell
cd backend
npm test
npm run lint
npm run format:check
```

Frontend:

```powershell
cd frontend
npm run lint
npm run format:check
npm run build
```

Última verificación local:

- 30 pruebas detectadas.
- 29 aprobadas.
- 0 fallidas.
- 1 omitida porque `TEST_DATABASE_URL` no estaba configurada.
- 87,75 % de cobertura de líneas; el mínimo exigido es 80 %.
- Lint, formato y compilación del frontend aprobados.

La prueba omitida necesita una base PostgreSQL/PostGIS aislada y migrada:

```dotenv
TEST_DATABASE_URL=postgresql://postgres:TU_PASSWORD@localhost:5432/wanka_ecologistica_test
```

No utilice la base de desarrollo o producción como base de pruebas.

## Estructura de documentación

También puede utilizar el [índice documental central](<docs/00 Índice de documentación.md>) para seguir el recorrido completo entre fases y sprints.

### Inicio

1. [Selección del enfoque](<docs/01 Inicio/01. Selección del enfoque del proyecto V_1_0_0.md>)
2. [Acta de Constitución](<docs/01 Inicio/02. Acta de Constitución V_1_0_0.md>)
3. [Declaración de la visión](<docs/01 Inicio/03. Declaración de la visión V_1_0_0.md>)
4. [Supuestos y restricciones](<docs/01 Inicio/04. Registro de supuestos y restricciones V_1_0_0.md>)
5. [Registro de interesados](<docs/01 Inicio/05. Registro de interesados V_1_0_0.md>)
6. [Requisitos funcionales](<docs/01 Inicio/06. Requisitos funcionales V_1_0_0.md>)
7. [Requisitos no funcionales](<docs/01 Inicio/07. Requisitos no funcionales V_1_0_0.md>)
8. [Usuarios](<docs/01 Inicio/08. Usuarios V_1_0_0.md>)
9. [Reglas de negocio](<docs/01 Inicio/09. Reglas de negocio V_1_0_0.md>)
10. [Stack tecnológico](<docs/01 Inicio/10. Stack tecnológico V_1_0_0.md>)
11. [Base de datos](<docs/01 Inicio/11. Base de datos V_1_0_0.md>)
12. [Arquitectura C4](<docs/01 Inicio/12. Modelo C4 V_1_0_0.md>)
13. [Restricciones](<docs/01 Inicio/13. Restricciones V_1_0_0.md>)

### Planificación

1. [Transformación a ágil y backlog](<docs/02 Planificación/01 Transformando a ágil V_1_0_0.md>)
2. [Artefactos Jira](<docs/02 Planificación/02 Artefactos Jira V_1_0_0.md>)
3. [Registro de riesgos](<docs/02 Planificación/03 Registro de riesgos V_1_0_0.md>)
4. [Presupuesto](<docs/02 Planificación/04 Presupuesto del proyecto V_1_0_0.md>)

### Estándares del repositorio

- [Estándares de calidad](CODE_QUALITY.md)

### Sprint 1

- [Informe de estado](<docs/03 Implementación/Sprint 1/01 Informe de estado del proyecto V_1_0_0.md>)
- [Registro de impedimentos](<docs/03 Implementación/Sprint 1/02 Registro de Impedimentos V_1_0_0.md>)
- [Revisión del Sprint](<docs/03 Implementación/Sprint 1/03 Revisión del Sprint V_1_0_0.md>)
- [Retrospectiva](<docs/03 Implementación/Sprint 1/04 Retrospectiva del Sprint V_1_0_0.md>)

### Sprint 2

- [Informe de estado](<docs/03 Implementación/Sprint 2/01 Informe de estado del proyecto V_1_0_0.md>)
- [Registro de impedimentos](<docs/03 Implementación/Sprint 2/02 Registro de Impedimentos V_1_0_0.md>)
- [Revisión del Sprint](<docs/03 Implementación/Sprint 2/03 Revisión del Sprint V_1_0_0.md>)
- [Retrospectiva](<docs/03 Implementación/Sprint 2/04 Retrospectiva del Sprint V_1_0_0.md>)
