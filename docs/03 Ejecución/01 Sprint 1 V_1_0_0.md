# Sprint 1 — Base de operación segura

| Campo | Valor |
|---|---|
| Duración | 2 semanas |
| Capacidad | 26 Story Points |
| Estado | Implementado para desarrollo local |
| Objetivo | Disponer de una base segura para registrar pedidos, vehículos y conductores, con reglas operativas y datos geográficos validados. |

## Incremento entregado

| Ítem Jira | Entrega | Prueba automatizada |
|---|---|---|
| EN-002 | Inicio de sesión y autorización por rol para Administrador, Operador y Planificador. | `backend/tests/auth.test.js` |
| US-001 | Registro de pedidos, prioridad, peso, ventana horaria y coordenadas. | `backend/tests/orders.test.js` |
| EN-006 | Validación de rango geográfico de latitud y longitud. | `backend/tests/orders.test.js` |
| US-002 | Registro de flota, métricas ambientales y control de placa única. | `backend/tests/vehicles.test.js` |
| US-003 | Registro, disponibilidad y asignación de conductores; límite de 8 horas. | `backend/tests/drivers.test.js` |

## Diseño

El layout inicial está en `frontend/`. Presenta la pantalla **Operación**, navegación para los cuatro módulos del Sprint 1, métricas de contexto y priorización de pedidos. Es adaptable para escritorio y móvil.

## Ejecución de calidad

```bash
cd backend
npm.cmd test
```

Resultado de la verificación inicial: **8 pruebas aprobadas, 0 fallos**.

## Alcance técnico actual

La API se ejecuta sin dependencias externas mediante Node.js y mantiene datos en memoria; esto permite validar las reglas del Sprint 1 de forma inmediata. La persistencia PostgreSQL/PostGIS, hash de contraseñas y tokens durables quedan preparados para el siguiente incremento antes de usarla en un ambiente productivo.
