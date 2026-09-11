# Transformando requisitos a ágil

[← Volver al README Principal](../../README.md)

| Campo | Información |
|---|---|
| Proyecto | WankaEcoLogística Huancayo |
| Versión | V_1_0_0 |
| Fecha | 11/09/2026 |
| Estado | Planificación del MVP |

## 1. Criterio de transformación y alcance

Este artefacto convierte el catálogo de Fase 01 en un Product Backlog inicial. La trazabilidad sigue `RF → Épica → Historia de Usuario`; los RNF se convierten en enablers y, cuando procede, en criterios de calidad transversales. No se declara ninguna historia como implementada: el repositorio disponible contiene especificaciones y diseño, no código fuente.

| Fuente | Transformación |
|---|---|
| RF-001, RF-002, RF-003 | EP-01 y US-001 a US-003 |
| RF-004, RF-007 | EP-02 y US-004, US-007 |
| RF-005 | EP-03 y US-005 |
| RF-006, RF-008 | EP-04 y US-006, US-008 |
| RNF-001 a RNF-007 | EN-001 a EN-007 y Definition of Done |

## 2. Épicas

### EP-01 — Gestión de la operación logística

**Objetivo:** disponer de pedidos, flota y conductores válidos para planificar la jornada. **Valor:** reduce registros dispersos y evita asignaciones inviables. **Requisitos:** RF-001, RF-002 y RF-003; reglas RN-002 y RN-003. **Agrupa:** US-001, US-002 y US-003.

### EP-02 — Planificación y adaptación de rutas sostenibles

**Objetivo:** generar y ajustar rutas considerando restricciones operativas. **Valor:** soporta la reducción de distancia y atención a incidencias. **Requisitos:** RF-004, RF-007; RN-002, RN-004; RNF-001 y RNF-007. **Agrupa:** US-004 y US-007.

### EP-03 — Seguimiento de rutas en campo

**Objetivo:** presentar rutas y paradas en un mapa utilizable desde móviles. **Valor:** facilita la ejecución por el conductor. **Requisitos:** RF-005 y RNF-004/RNF-006. **Agrupa:** US-005.

### EP-04 — Sostenibilidad, auditoría y reportes

**Objetivo:** comunicar resultados operativos y ambientales exportables. **Valor:** habilita decisiones y auditoría. **Requisitos:** RF-006, RF-008, RN-005 y RNF-007. **Agrupa:** US-006 y US-008.

## 3. Historias de usuario

### US-001 — Registrar y actualizar pedidos

**Épica relacionada:** EP-01 — Gestión de la operación logística  
Como **operador logístico**, quiero **registrar y actualizar pedidos con dirección, coordenadas, peso, prioridad y ventana de tiempo**, para **disponer de datos válidos para la planificación**.

### Escenario 1: Registro válido
**Dado** un operador autenticado con permiso de gestión, **cuando** registra todos los campos obligatorios válidos, **entonces** el pedido queda persistido y el sistema confirma la operación.

### Escenario 2: Validación de datos
**Dado** el formulario de pedido, **cuando** se ingresa peso negativo o coordenadas fuera de rango, **entonces** el sistema rechaza el registro e identifica los campos inválidos.

### US-002 — Administrar vehículos de la flota

**Épica relacionada:** EP-01 — Gestión de la operación logística  
Como **administrador**, quiero **registrar y cambiar el estado de vehículos con su capacidad, consumo y factor de emisión**, para **usar únicamente recursos aptos en las rutas**.

### Escenario 1: Alta de vehículo
**Dado** un administrador autenticado, **cuando** registra una placa única y métricas operativas válidas, **entonces** el vehículo queda disponible en la flota.

### Escenario 2: Exclusión por mantenimiento
**Dado** un vehículo registrado, **cuando** su estado cambia a “Fuera de servicio”, **entonces** el planificador no lo considera para nuevas asignaciones.

### US-003 — Asignar conductores disponibles

**Épica relacionada:** EP-01 — Gestión de la operación logística  
Como **planificador logístico**, quiero **asignar un conductor disponible a una ruta**, para **ejecutar la entrega respetando su disponibilidad y descanso**.

### Escenario 1: Asignación permitida
**Dado** una ruta generada y un conductor disponible, **cuando** el planificador confirma la asignación, **entonces** la ruta queda vinculada al conductor.

### Escenario 2: Conflicto de disponibilidad
**Dado** un conductor con ruta en el mismo horario o cuya conducción excedería ocho horas sin descanso, **cuando** se intenta asignarlo, **entonces** el sistema bloquea la operación e informa el conflicto.

### US-004 — Optimizar rutas de la jornada

**Épica relacionada:** EP-02 — Planificación y adaptación de rutas sostenibles  
Como **planificador logístico**, quiero **calcular rutas para pedidos aprobados y flota disponible**, para **reducir distancia sin incumplir capacidad, prioridad y ventanas de entrega**.

### Escenario 1: Optimización factible
**Dado** pedidos, vehículos y conductores elegibles, **cuando** solicito la optimización, **entonces** se generan secuencias que respetan capacidad máxima operativa y ventanas de tiempo.

### Escenario 2: Capacidad insuficiente
**Dado** un lote cuyo peso supera la capacidad disponible, **cuando** solicito la optimización, **entonces** no se publica una ruta incompleta y se indica la necesidad de más capacidad o reprogramación.

### US-005 — Consultar una ruta en el mapa

**Épica relacionada:** EP-03 — Seguimiento de rutas en campo  
Como **conductor**, quiero **ver mi ruta y sus puntos de entrega en un mapa responsivo**, para **seguir la secuencia prevista durante la jornada**.

### Escenario 1: Visualización de ruta
**Dado** una ruta asignada y acceso autorizado, **cuando** abro el módulo de seguimiento, **entonces** se muestran el trazado y las paradas ordenadas.

### Escenario 2: Conectividad interrumpida
**Dado** una vista previamente cargada, **cuando** se pierde la conexión, **entonces** se conserva la información cacheada disponible y se comunica el estado de conectividad.

### US-006 — Consultar indicadores de sostenibilidad

**Épica relacionada:** EP-04 — Sostenibilidad, auditoría y reportes  
Como **administrador**, quiero **consultar CO₂, ahorro de distancia y nivel de servicio por periodo**, para **evaluar el desempeño sostenible de la operación**.

### Escenario 1: Métricas disponibles
**Dado** operaciones procesadas en un rango de fechas, **cuando** selecciono dicho rango, **entonces** el dashboard muestra indicadores consolidados con el factor de emisión configurado.

### Escenario 2: Periodo sin operaciones
**Dado** un rango sin datos, **cuando** lo consulto, **entonces** el sistema informa que no existen datos y no muestra cálculos engañosos.

### US-007 — Reoptimizar ante una incidencia

**Épica relacionada:** EP-02 — Planificación y adaptación de rutas sostenibles  
Como **operador logístico**, quiero **recalcular una ruta ante un bloqueo vial o cancelación**, para **reducir el impacto en las entregas pendientes**.

### Escenario 1: Bloqueo vial
**Dado** una ruta en ejecución, **cuando** registro un bloqueo y solicito reoptimización, **entonces** se obtiene una secuencia alternativa que evita el punto reportado.

### Escenario 2: Pedido cancelado
**Dado** una parada pendiente cancelada, **cuando** confirmo su retiro, **entonces** la nueva ruta excluye ese pedido y conserva las restricciones restantes.

### US-008 — Exportar reporte operativo

**Épica relacionada:** EP-04 — Sostenibilidad, auditoría y reportes  
Como **administrador o auditor externo autorizado**, quiero **exportar reportes de la operación**, para **analizar y sustentar los resultados del sistema**.

### Escenario 1: Exportación solicitada
**Dado** un usuario autorizado y un rango válido, **cuando** solicita un reporte PDF o CSV, **entonces** se descarga un archivo con los datos operativos del periodo.

### Escenario 2: Rango excesivo
**Dado** el módulo de reportes, **cuando** el rango supera el límite configurado, **entonces** el sistema impide la descarga e indica cómo acotar la consulta.

## 4. Enablers e historias técnicas

### EN-001 — Medir el rendimiento del motor de ruteo

**Tipo:** Historia técnica / Enabler. **Trazabilidad:** RNF-001.  
Como **equipo técnico**, quiero **medir y optimizar el cálculo con 50 puntos**, para **cumplir una latencia P95 no mayor a 3.5 segundos**.

### Escenario 1: Prueba de carga
**Dado** un conjunto representativo de 50 entregas, **cuando** se ejecuta la prueba de rendimiento, **entonces** se registra el P95 y se verifica el umbral de 3.5 segundos.

### Escenario 2: Umbral incumplido
**Dado** un P95 superior al objetivo, **cuando** finaliza la medición, **entonces** el resultado se reporta como defecto de rendimiento y no se aprueba el incremento.

### EN-002 — Implementar autenticación y RBAC seguro

**Tipo:** Historia técnica / Enabler. **Trazabilidad:** RNF-002, RN-001.  
Como **equipo técnico**, quiero **proteger API y pantallas por autenticación, roles y bloqueo de intentos**, para **reducir el acceso no autorizado**.

### Escenario 1: Acceso autorizado
**Dado** un usuario autenticado con permiso correspondiente, **cuando** consume una operación permitida, **entonces** el sistema concede acceso y registra la acción relevante.

### Escenario 2: Intentos fallidos
**Dado** una cuenta con tres intentos fallidos, **cuando** intenta autenticarse nuevamente antes de 15 minutos, **entonces** el sistema bloquea temporalmente el acceso.

### EN-003 — Asegurar recuperación de datos y servicio

**Tipo:** Historia técnica / Enabler. **Trazabilidad:** RNF-003.  
Como **DevOps**, quiero **definir respaldos, monitoreo y recuperación de la plataforma**, para **preservar la continuidad e integridad de datos**.

### Escenario 1: Respaldo verificable
**Dado** el entorno de pruebas, **cuando** se ejecuta un respaldo programado, **entonces** puede restaurarse una copia y verificarse su integridad.

### Escenario 2: Indisponibilidad simulada
**Dado** una falla controlada de un servicio, **cuando** se activa el procedimiento de recuperación, **entonces** se registra el RTO/RPO alcanzado y las incidencias.

### EN-004 — Habilitar comportamiento PWA offline

**Tipo:** Historia técnica / Enabler. **Trazabilidad:** RNF-006.  
Como **desarrollador frontend**, quiero **cachear recursos y sincronizar cambios pendientes**, para **mantener útil el mapa en conectividad inestable**.

### Escenario 1: Uso sin red
**Dado** una ruta visitada previamente, **cuando** el conductor pierde conexión, **entonces** la última información cacheada continúa disponible.

### Escenario 2: Reconexión
**Dado** actualizaciones pendientes locales, **cuando** se restablece la red, **entonces** el sistema las sincroniza e informa el resultado.

### EN-005 — Abstraer la integración cartográfica

**Tipo:** Historia técnica / Enabler. **Trazabilidad:** RNF-005.  
Como **arquitecto de software**, quiero **aislar el proveedor de mapas y tráfico detrás de una interfaz**, para **permitir su sustitución sin modificar el núcleo de ruteo**.

### Escenario 1: Uso del adaptador
**Dado** una solicitud de trazado, **cuando** el backend necesita datos cartográficos, **entonces** los obtiene mediante la interfaz de integración definida.

### Escenario 2: Cambio de proveedor
**Dado** un proveedor alternativo de pruebas, **cuando** se reemplaza el adaptador, **entonces** las pruebas del dominio permanecen sin cambios y la integración se valida en staging.

### EN-006 — Validar datos geoespaciales y cálculos sostenibles

**Tipo:** Historia técnica / Enabler. **Trazabilidad:** RNF-007, RN-005.  
Como **equipo de datos**, quiero **validar coordenadas y la fórmula de emisiones**, para **producir resultados geográficos y ambientales confiables**.

### Escenario 1: Precisión geográfica
**Dado** coordenadas de prueba conocidas, **cuando** se almacenan y consultan mediante PostGIS, **entonces** el error de aproximación se mantiene dentro de 10 metros.

### Escenario 2: Emisiones calculadas
**Dado** distancia y factor de emisión configurado para el contexto definido, **cuando** se calcula el indicador, **entonces** el reporte conserva los valores fuente y el resultado reproducible.

### EN-007 — Automatizar calidad, API y despliegue de staging

**Tipo:** Historia técnica / Enabler. **Trazabilidad:** RNF-002, RNF-005.  
Como **equipo de desarrollo**, quiero **automatizar pruebas, análisis estático, documentación OpenAPI y despliegue de pruebas**, para **entregar incrementos verificables**.

### Escenario 1: Pipeline correcto
**Dado** una propuesta de cambio, **cuando** se abre un Pull Request, **entonces** se ejecutan pruebas, análisis estático y la revisión requerida antes de integrar.

### Escenario 2: Documentación de API
**Dado** un endpoint modificado, **cuando** se integra el cambio, **entonces** el contrato OpenAPI se actualiza y queda disponible en staging.

## 5. Backlog consolidado y estimación

La estimación usa la serie Fibonacci (1, 2, 3, 5, 8, 13) considerando complejidad, esfuerzo, incertidumbre y dependencias. La prioridad resulta de valor, impacto, dependencia y riesgo técnico.

| ID | Tipo | Épica | Descripción | Story Points | Prioridad |
|---|---|---|---|---:|---|
| US-001 | Story | EP-01 | Gestionar pedidos | 5 | Alta |
| US-002 | Story | EP-01 | Gestionar flota | 3 | Alta |
| US-003 | Story | EP-01 | Asignar conductores | 5 | Alta |
| US-004 | Story | EP-02 | Optimizar rutas | 13 | Alta |
| US-005 | Story | EP-03 | Visualizar ruta | 8 | Alta |
| US-006 | Story | EP-04 | Dashboard sostenible | 5 | Alta |
| US-007 | Story | EP-02 | Reoptimizar ruta | 8 | Alta |
| US-008 | Story | EP-04 | Exportar reportes | 3 | Media |
| EN-001 | Enabler | EP-02 | Rendimiento de ruteo | 5 | Alta |
| EN-002 | Enabler | Transversal | Seguridad y RBAC | 8 | Alta |
| EN-003 | Enabler | Transversal | Recuperación | 5 | Media |
| EN-004 | Enabler | EP-03 | PWA offline | 5 | Media |
| EN-005 | Enabler | Transversal | Adaptador de mapas | 3 | Media |
| EN-006 | Enabler | EP-02 | Integridad geoespacial | 5 | Alta |
| EN-007 | Enabler | Transversal | Calidad y staging | 8 | Alta |

## 6. Definition of Done global

Un ítem sólo estará en **Done** cuando: sus criterios de aceptación y pruebas funcionales estén aprobados; código integrado mediante Pull Request con revisión; pruebas unitarias del cambio y cobertura global objetivo de al menos 80%; análisis estático en SonarQube o CodeQL sin vulnerabilidades críticas; integración validada y sin errores críticos; pipeline de despliegue automatizado ejecutable en Staging/Pruebas; contrato OpenAPI/Swagger y documentación técnica actualizados; evidencia de funcionamiento disponible; y cambios integrados en la rama definida por el equipo. Para historias geográficas se validan además restricciones de datos y ruta; para cambios externos, la integración se prueba contra un entorno controlado.

## 7. Decisiones de consistencia heredada

| Hallazgo | Documentos afectados | Decisión registrada para Fase 02 |
|---|---|---|
| El README enumera al Conductor como rol de uso; el documento de Usuarios lo agrupa bajo Operador / Técnico en su matriz RBAC. | README, `08. Usuarios V_1_0_0.md` | Se conserva el Conductor como persona operativa de US-005 y se valida su permiso específico al configurar Jira y RBAC. No se modifica la fuente sin aprobación del equipo. |
| El acta fija una latencia inicial de hasta 5 s, mientras RNF-001 establece P95 ≤ 3.5 s para 50 puntos. | `02. Acta de constitución V_1_0_0.md`, `07. Requisitos no funcionales V_1_0_0.md` | Se planifica el objetivo más específico y exigente: P95 ≤ 3.5 s, trazado en EN-001. |
| RNF-003 menciona clúster K8s, pero Restricciones propone serverless y contenedores con autoescalado. | `07. Requisitos no funcionales V_1_0_0.md`, `13. Restricciones V_1_0_0.md` | EN-003 exige objetivos de recuperación, no una tecnología de despliegue. La arquitectura de alta disponibilidad queda pendiente de decisión técnica validada. |

No se alteraron los requisitos de Fase 01 porque los hallazgos no constituyen una aprobación de cambio de alcance. Cualquier modificación posterior debe versionar el documento fuente correspondiente.

## Historial de Control de Cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_0 | 11/09/2026 | Creación del documento de transformación ágil | Equipo |
