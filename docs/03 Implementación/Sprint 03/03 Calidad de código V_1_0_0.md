# Evaluación de Calidad de Código — SonarQube

[← Anterior: Retrospectiva](<02 Retrospectiva del Sprint V_1_0_0.md>) · [README principal](../../../README.md) · [Siguiente: OWASP →](<04 OWASP V_1_0_0.md>)

**Nombre del Proyecto:** WankaEcoLogística Huancayo  
**Fecha de Análisis:** 2026-10-28  
**Versión del Análisis:** V_1_0_0  
**Líder del Proyecto:** Nario German Reyes Rios

## 1. Resumen Ejecutivo de Quality Gate

Análisis ejecutado con SonarQube Community Build `26.10.0.133078`, levantado con Docker mediante `docker-compose.sonarqube.yml` en `http://localhost:9001`. El puerto 9000 estaba ocupado por otra instancia local, por eso esta usa el 9001. El escáner fue `@sonar/scan` desde el repositorio, con el informe LCOV del backend en `backend/coverage/lcov.info`.

Este es el análisis que se expone: el que detectó los bugs y el code smell. El Quality Gate ya estaba en PASSED con esos hallazgos abiertos.

- **Estado del Quality Gate:** PASSED
- **Porcentaje de Cobertura de Pruebas (Coverage):** 65,4 %
- **Duplicación de Código:** 2,2 %

La cobertura de SonarQube considera frontend y backend juntos. El backend, medido con el test runner de Node, queda en 88 % de líneas. El frontend no tiene pruebas unitarias, y por eso la cifra combinada baja a 65,4 %. SonarQube reportó 6 638 líneas de código.

## 2. Métricas Principales

| Categoría | Cantidad Detectada | Severidad (Bloqueante / Alta / Media / Baja) |
|---|---|---|
| **Bugs** | 3 | Alta (MAJOR) |
| **Vulnerabilidades** | 0 | — |
| **Code Smells** | 1 | Alta (MAJOR) |
| **Security Hotspots** | 0 | — |

Los tres bugs son el mismo problema, en la pantalla **Mi ruta** del conductor: la vista donde, después de iniciar sesión, ve la ruta que le asignaron, las paradas y el mapa.

| Hallazgo | En palabras simples | Dónde ocurre | Archivo, al costado |
|---|---|---|---|
| Bug 1 | Al abrir **Mi ruta**, el sistema pide las rutas del conductor y no dejaba claro qué hacer si esa consulta falla. | Pantalla Mi ruta, al entrar | `frontend/src/features/field/DriverRoutePage.jsx`, línea 91 |
| Bug 2 | Al elegir una ruta, pide las paradas y el trazado del mapa con el mismo descuido. | Pantalla Mi ruta, al seleccionar la ruta | El mismo archivo, línea 105 |
| Bug 3 | Cuando el celular recupera la señal, intenta enviar lo que quedó pendiente sin atender el fallo de esa operación. | Pantalla Mi ruta, al volver la conexión | El mismo archivo, línea 149 |
| Code smell | Al iniciar sesión o registrar a una persona, la revisión del correo podía tardar demasiado si alguien escribía un texto muy largo o mal armado. | Formulario de correo | `backend/src/shared/validation.js` |

SonarQube llama a los tres bugs «promesa flotante»: la pantalla dispara la consulta al servidor y sigue adelante, sin declarar que, si falla, el conductor ya ve el aviso en la misma pantalla. El code smell no es un fallo visible para el usuario; es una forma frágil de revisar el formato del correo.

La deuda técnica estimada por SonarQube fue de 20 minutos.

## 3. Plan de Remediación y Deuda Técnica

- **Deuda Técnica Estimada:** 20 minutos en el análisis del 2026-10-28.
- **Principales hallazgos y acciones correctivas:**
  1. En **Mi ruta**, las tres consultas (rutas al entrar, paradas y mapa al elegir una ruta, y sincronización al volver la señal) quedaron declaradas de forma explícita. Si el servidor no responde, el conductor sigue viendo el mensaje de error en la pantalla. El archivo de esa vista es `frontend/src/features/field/DriverRoutePage.jsx`.
  2. La revisión del correo ya no usa el patrón que podía demorarse. Ahora comprueba algo simple: una sola arroba, texto antes y después, y un punto en el dominio. Eso vive en la validación del servidor, `backend/src/shared/validation.js`.

Las correcciones quedaron en el repositorio. La tabla de cantidad detectada conserva los 3 bugs y el code smell, que es lo que se explica en la exposición.

## Historial de control de cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_0 | 28/10/2026 | Evaluación con el análisis SonarQube en Docker. Los hallazgos se redactaron en lenguaje de la pantalla Mi ruta y del correo, para la exposición. | Nario German Reyes Rios |
