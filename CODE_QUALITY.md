# Estándares de calidad de código

Estas reglas aplican a WankaEcoLogística y toman ISO/IEC 25010 como referencia de calidad; no implican certificación.

## Calidad del código

- Priorizar soluciones simples, cohesivas y con una sola responsabilidad. Aplicar SOLID, DRY y KISS sin crear abstracciones sin un caso real.
- Usar `camelCase` para variables y funciones, `PascalCase` para componentes React y clases, `UPPER_SNAKE_CASE` para constantes, y nombres de archivos orientados al módulo (`order.service.js`, `OrderForm.jsx`).
- Mantener funciones pequeñas y enfocadas. Extraer lógica cuando mezcle validación, persistencia y presentación o cuando la complejidad dificulte probarla.
- Validar datos en el límite del sistema y mantener invariantes también en la base de datos. No confiar en datos del cliente.
- Lanzar errores explícitos y tipados por código. El middleware HTTP traduce errores conocidos; los detalles internos nunca llegan al cliente.
- Evitar comentarios que repitan el código. Documentar decisiones, reglas de negocio, contratos públicos y motivos no evidentes.
- El proyecto usa JavaScript ESM. Documentar contratos con JSDoc cuando los datos o retornos no sean evidentes; no usar objetos sin forma estable entre capas.

## Arquitectura

El frontend organiza vistas y componentes por capacidad. La API usa el flujo `route → middleware → controller → service → repository → PostgreSQL/PostGIS`.

- Las rutas declaran URL, autorización y validación; no contienen reglas de negocio.
- Los controladores traducen HTTP y delegan. No ejecutan SQL.
- Los servicios aplican reglas y dependen de contratos inyectados, no de Express ni de PostgreSQL.
- Los repositorios encapsulan consultas parametrizadas y mapean registros a objetos del dominio.
- Los componentes no conocen credenciales ni SQL. El cliente HTTP centraliza token, JSON y errores.
- Un módulo nuevo vive en `backend/src/modules/<modulo>/` o `frontend/src/features/<modulo>/`. No se importan detalles internos de otro módulo; se usa su servicio o contrato público.
- Las dependencias apuntan hacia el dominio. Evitar estado global mutable, dependencias circulares y utilidades genéricas sin propósito definido.

## Testing

- Probar reglas de servicios con unit tests y repositorios controlados; probar middleware, contratos, códigos HTTP y RBAC mediante tests de API.
- Cubrir caminos exitosos, validaciones, límites, duplicados, recursos inexistentes y permisos insuficientes.
- Los tests deben observar comportamiento, no copiar la implementación. Cada defecto corregido debe incorporar una regresión.
- Una funcionalidad requiere todos sus criterios de aceptación aprobados y cobertura global mínima de 80%. Las pruebas que dependan de PostGIS deben ejecutarse contra una instancia aislada y migrada.

## Seguridad

- Aceptar únicamente campos conocidos; normalizar email y placa, limitar longitudes y validar rangos, fechas y coordenadas.
- Usar consultas SQL parametrizadas. Renderizar texto como texto; no introducir HTML recibido del usuario.
- Contraseñas siempre con hash adaptativo. Tokens breves, firmados con secreto externo y sin datos sensibles.
- Guardar configuración en variables de entorno y publicar solo `.env.example`. Nunca versionar secretos o credenciales reales.
- Aplicar autenticación y autorización en servidor para cada operación; la protección visual del frontend no reemplaza RBAC.
- Responder errores con código y mensaje seguro. No registrar contraseñas, tokens, direcciones completas ni trazas en producción.
- Mantener cabeceras seguras, límite de tamaño del body y bloqueo temporal de autenticación. Revisar dependencias y OWASP Top 10.

## Performance

- Seleccionar solo columnas necesarias, paginar listados y crear índices según patrones medidos.
- Evitar N+1 mediante joins o consultas por lote. Liberar conexiones en `finally` y usar transacciones para cambios relacionados.
- Usar caché solo con estrategia de invalidación, TTL y evidencia de beneficio. No optimizar antes de medir.
- Evitar renders y peticiones duplicadas; cargar capacidades pesadas bajo demanda cuando exista una ruta real.

## Git y Pull Requests

- Ramas: `feature/US-001-pedidos`, `fix/auth-lockout` o `docs/calidad`.
- Commits: Conventional Commits en español, por ejemplo `feat(pedidos): validar coordenadas y peso`.
- Mantener cambios pequeños y trazables. Una PR debe indicar historia, alcance, pruebas, riesgos, migraciones y capturas cuando cambie la UI.
- Toda PR requiere revisión; quien revisa comprueba correctitud, legibilidad, seguridad, tests, arquitectura, performance, errores y compatibilidad.

## Checklist de Code Review

- [ ] Cumple criterios positivos, negativos y límites.
- [ ] Nombres y flujo son legibles; no hay duplicación ni código muerto.
- [ ] Respeta capas, contratos y dependencias existentes.
- [ ] Entradas, permisos, secretos y errores se manejan de forma segura.
- [ ] Pruebas relevantes pasan y previenen regresiones.
- [ ] Consultas, renders y recursos no presentan costes evitables.
- [ ] API, migraciones y documentación son compatibles y están actualizadas.

## Definition of Done

- [ ] Criterios de aceptación y reglas trazables están implementados.
- [ ] Unit tests y tests de integración/API pasan con cobertura mínima del 80%.
- [ ] Lint, formato, validación estática y build pasan sin errores.
- [ ] No hay vulnerabilidades críticas/altas conocidas ni secretos expuestos.
- [ ] Migraciones, contrato OpenAPI, variables de ejemplo y documentación están actualizados.
- [ ] El cambio fue revisado mediante PR y existe evidencia reproducible en staging.
