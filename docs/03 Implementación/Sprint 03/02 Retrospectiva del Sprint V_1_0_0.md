# Retrospectiva del sprint

[← Anterior: Revisión](<01 Revisión del Sprint V_1_0_0.md>) · [README principal](../../../README.md) · [Siguiente: Calidad →](<03 Calidad de código V_1_0_0.md>)

**Nombre del Proyecto:** WankaEcoLogística Huancayo

**Líder del Proyecto:** Nario German Reyes Rios

## ¿Qué aprendimos?

El seguimiento en campo exige tres entregas distintas: un adaptador de mapas sustituible, una vista propia del conductor y una estrategia offline explícita. El mapa del planificador no cumple US-005. Los bloqueos del sprint fueron de entorno y de alcance en Jira. La documentación de impedimentos es útil solo si no incluye contraseñas ni cadenas de conexión.

## ¿Qué estamos haciendo bien?

- El orden de construcción respetó EN-005, luego US-005 y después EN-004.
- El sprint de Jira se limpió antes de implementar y los tres ítems quedaron en Listo.
- El conductor solo consulta la ruta que tiene asignada; el control está en el servicio, no solo en el menú.
- Las pruebas de adaptador, API y Playwright cubren el flujo que se demostró.
- Los secretos permanecen en el entorno local y fuera del repositorio.

## ¿Qué podemos hacer mejor?

### Personas

Preparar, al iniciar el sprint, un usuario conductor de demostración mediante un script de seed. La contraseña se entrega por un canal del equipo y no se escribe en Markdown.

### Relaciones

Repetir la demostración offline con el responsable operativo, en un teléfono, antes del cierre formal ante el docente de esta consigna. La demostración del 21/10/2026 cubrió el incremento en escritorio.

### Procesos

Redactar el impedimento el mismo día y revisar el texto antes de publicarlo. La carpeta del sprint debe usar desde el inicio los nombres que pide la consigna (`Sprint 03` y el orden 01 a 05), para no reordenar documentos al cierre.

### Herramientas

Dejar fijos en la guía local el puerto `5174`, la ruta de navegadores de Playwright y `TEST_DATABASE_URL`. Si falla la instalación de un plugin, como ocurrió con `vite-plugin-pwa`, aplicar de inmediato el plan alternativo ya usado: service worker propio. El análisis de calidad de esta consigna se ejecutó con SonarQube en Docker y quedó en los documentos de calidad y de OWASP.

### Acciones a realizar

| Acción | Responsable | Prioridad | Fecha objetivo | Indicador de cierre |
|---|---|---|---|---|
| Integrar SonarQube con Docker y publicar `03 Calidad de código` y `04 OWASP` con métricas del análisis | Nario German Reyes Rios | Alta | Cierre de esta consigna | Quality Gate y matriz OWASP 2025 citan el análisis ejecutado, sin cifras estimadas. |
| Evaluar WCAG 2.2 AA con Lighthouse o axe y publicar `05 WCAG` con correcciones aplicadas | Equipo frontend | Alta | Cierre de esta consigna | Los cuatro principios y la tabla de hallazgos remiten a componentes reales. |
| Enlazar `Sprint 03` de ida y vuelta desde el README y el índice | Equipo del proyecto | Alta | Mismo cierre | Cada documento oficial abre el README y el README abre cada documento. |
| Añadir un seed de conductor sin publicar la contraseña | Equipo técnico | Media | Inicio del siguiente sprint | Un compañero crea el usuario con variables de entorno. |
| Validar Mi ruta sin red en un dispositivo móvil con Operaciones | Henry Rolando Lozano Porta | Media | Antes de la sustentación | Registro breve del resultado en la revisión, sin sustituir la demostración ya hecha. |

## Historial de control de cambios

| Versión | Fecha | Cambio | Responsable |
|---|---|---|---|
| V_1_0_4 | 28/10/2026 | La acción de SonarQube quedó registrada como ejecutada, porque el análisis ya está en los documentos de calidad y OWASP. | Nario German Reyes Rios |
| V_1_0_3 | 27/10/2026 | Retrospectiva alineada a la plantilla oficial y a la consigna del Sprint 3. | Nario German Reyes Rios |
| V_1_0_2 | 21/10/2026 | Retrospectiva de cierre sin secretos. | Equipo del proyecto |
| V_1_0_0 | 21/10/2026 | Plantilla de retrospectiva al inicio del sprint. | Equipo del proyecto |
