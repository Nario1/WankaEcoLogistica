# Retrospectiva del sprint

[← Anterior: Revisión](<01 Revisión del Sprint V_1_0_0.md>) · [README principal](../../../README.md) · [Siguiente: Calidad →](<03 Calidad de código V_1_0_0.md>)

**Nombre del proyecto:** WankaEcoLogística Huancayo

**Líder del proyecto:** Nario German Reyes Rios

**Sprint:** 3 — seguimiento de entregas en campo (EP-03)

**Periodo informado:** 20/10/2026–03/11/2026

**Fecha de retrospectiva documentada:** 30/10/2026

## ¿Qué aprendimos?

- El seguimiento en campo requiere una experiencia específica para el conductor; el mapa del planificador por sí solo no satisface US-005.
- Conviene separar el contrato de ruteo del proveedor cartográfico. Así se pueden probar las reglas del dominio con un stub y cambiar OSRM/TomTom mediante configuración.
- Una estrategia offline debe indicar qué datos conserva, cuándo los obtuvo y qué ocurre al restablecer la conexión. No debe sugerir que toda la aplicación opera sin red si solo se conserva una vista de consulta.
- Los impedimentos de entorno y de alcance en Jira deben registrarse con su impacto, responsable y resolución. El registro debe excluir contraseñas, tokens y cadenas de conexión.
- La evidencia técnica automatizada y la aceptación de stakeholders son comprobaciones diferentes: las pruebas no reemplazan una demostración ni una validación operativa en móvil.

## ¿Qué estamos haciendo bien?

- Se ordenó el trabajo como adaptador (EN-005), vista del conductor (US-005) y soporte offline (EN-004), manteniendo la dependencia entre entregables.
- Se limpió el sprint de Jira y el equipo informa EN-005, US-005 y EN-004 en estado **Listo**; la revisión usa los IDs de backlog que también figuran en Artefactos Jira.
- El acceso a rutas ajenas se controla en el servicio backend además de restringir la navegación de la interfaz.
- Hay pruebas automatizadas para adaptador, API y flujos Playwright; [la revisión del Sprint 3](<01 Revisión del Sprint V_1_0_0.md>) conserva los resultados históricos informados y aclara que no se adjuntó la salida del runner.
- Los archivos de entorno y credenciales se mantienen fuera del repositorio.

## ¿Qué podemos hacer mejor?

### Personas

Preparar antes de la demostración una cuenta de conductor reproducible mediante un seed seguro. El seed debe leer credenciales desde variables de entorno, no incluir contraseñas predeterminadas en el código, documentación ni historial de Git. Designar a una persona para verificar que la cuenta solo ve los recursos de su rol.

### Relaciones

Realizar una validación de **Mi ruta** con Operaciones en un teléfono. La revisión registrada cubrió el incremento en escritorio; se debe recoger retroalimentación de la persona operadora, navegador/dispositivo y resultado de la prueba offline. Registrar también quiénes participan en la demostración formal y los acuerdos que generen.

### Procesos

- Abrir el sprint con objetivo, capacidad, dependencias y criterios de aceptación acordados; limpiar Jira antes de empezar y comprobar el estado de cada ítem al cierre.
- Registrar impedimentos el día que ocurren, con impacto verificable, responsable, fecha objetivo y resolución. Revisar el texto para quitar secretos antes de publicarlo.
- Mantener una lista de evidencias por entregable: enlace al código, prueba asociada, resultado y fecha. Diferenciar estado histórico de ejecución y estado actual.
- Aplicar control de cambios coherente: conservar el nombre oficial del archivo solicitado por la consigna y actualizar el historial de versión dentro del documento.

### Herramientas

- Documentar los puertos de frontend/backend, `CORS_ORIGIN`, `TEST_DATABASE_URL` y la configuración de `PLAYWRIGHT_BROWSERS_PATH` como valores de ejemplo, nunca con credenciales reales.
- Mantener el service worker propio como alternativa documentada cuando no sea posible instalar `vite-plugin-pwa`; validar la caché y la actualización del cliente después de cada cambio.
- Para SonarQube, conservar versión de servidor/escáner, fecha, commit o snapshot analizado, parámetros, informe de cobertura y exportación o captura del Quality Gate. Repetir el análisis después de corregir hallazgos.
- Para accesibilidad, combinar Lighthouse con comprobaciones manuales de teclado, foco y lector de pantalla; indicar las páginas y estados incluidos en la muestra.

### Acciones a realizar

| Acción | Responsable | Prioridad | Por qué recibe esta prioridad | Fecha objetivo | Estado y criterio de cierre |
|---|---|---:|---|---|---|
| Ejecutar SonarQube y publicar los resultados de calidad/OWASP con métricas trazables | Nario German Reyes Rios | Alta | Entregable obligatorio; sin gate, métricas y hallazgos no se pueden evaluar calidad ni justificar remediaciones. | Cierre documental del Sprint 3 | **Ejecutada para el snapshot del 28/10/2026.** La captura del Gate está adjunta en [Calidad](<03 Calidad de código V_1_0_0.md>) y el análisis en [OWASP](<04 OWASP V_1_0_0.md>). Falta reanalizar el estado corregido. |
| Evaluar accesibilidad con Lighthouse y registrar remediaciones | Equipo frontend | Alta | Entregable obligatorio; problemas de teclado o contraste pueden impedir el uso de funciones principales. | Cierre documental del Sprint 3 | **Ejecutada parcialmente.** Lighthouse se reporta en login; falta ampliar la muestra y dejar evidencia reproducible en otras vistas/estados. Ver [WCAG](<05 WCAG V_1_0_0.md>). |
| Enlazar los cinco entregables oficiales del Sprint 3 desde README y volver al README desde cada documento | Equipo del proyecto | Alta | La consigna exige enlaces bidireccionales; una entrega sin navegación completa no cumple el criterio aunque existan los archivos. | Cierre documental del Sprint 3 | **Ejecutada en esta actualización.** Los cinco documentos oficiales figuran en el índice y contienen enlace al README; se retiraron las referencias a los documentos opcionales 06 y 07. |
| Añadir un seed de conductor sin secretos | Equipo técnico | Media | Facilita repetir la demo y E2E, pero el equipo pudo crear una cuenta local manualmente como solución temporal. | Inicio del siguiente sprint | **Pendiente.** Cierre: otro integrante crea la cuenta con variables de entorno y el repositorio no contiene credenciales. |
| Validar **Mi ruta** offline en móvil con Operaciones | Henry Rolando Lozano Porta | Media | La demo en escritorio cubre el flujo básico, pero no confirma caché, red móvil y legibilidad en dispositivo de campo. No bloqueó la demo técnica. | Antes de la sustentación | **Pendiente.** Cierre: registrar dispositivo, navegador, pasos, resultado al perder/recuperar red y observaciones de Operaciones. |
| Registrar asistentes y acuerdos de la demostración formal | Líder del proyecto | Media | Aporta trazabilidad de aceptación; su ausencia no cambia la función técnica, pero deja sin registro quién validó y qué observó. | Durante la sustentación | **Pendiente.** Cierre: acta breve con fecha, roles participantes, comentarios y acuerdos; sin datos personales innecesarios. |

## Seguimiento de acciones

Las acciones de SonarQube, evaluación WCAG y enlaces se registran como realizadas en esta versión porque ya existen los informes y enlaces correspondientes. “Realizada” no significa que la evaluación cubra todos los componentes ni que el análisis de calidad se haya repetido tras la remediación. Los pendientes de seed, validación móvil y registro de stakeholders permanecen abiertos hasta que se adjunte su evidencia. No se asignaron acciones de prioridad baja: las tareas abiertas afectan reproducibilidad, validación de campo o trazabilidad y se mantienen como prioridad media. Las acciones heredadas del Sprint 2 se actualizaron en su [retrospectiva](<../Sprint 2/04 Retrospectiva del Sprint V_1_0_0.md>).

## Control de cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_6 | 30/10/2026 | Se justifica la prioridad de cada acción y se separan evidencias adjuntas de validaciones pendientes. | Nario German Reyes Rios |
| V_1_0_5 | 30/10/2026 | Se detallan aprendizajes, acciones con estado y criterios verificables; se separa ejecución histórica de evidencia pendiente. | Nario German Reyes Rios |
| V_1_0_4 | 28/10/2026 | La acción de SonarQube quedó registrada como ejecutada con el informe publicado. | Nario German Reyes Rios |
| V_1_0_3 | 27/10/2026 | Retrospectiva alineada a la plantilla oficial y a la consigna del Sprint 3. | Nario German Reyes Rios |
| V_1_0_2 | 21/10/2026 | Retrospectiva de cierre sin secretos. | Equipo del proyecto |
| V_1_0_0 | 21/10/2026 | Retrospectiva inicial del sprint. | Equipo del proyecto |
