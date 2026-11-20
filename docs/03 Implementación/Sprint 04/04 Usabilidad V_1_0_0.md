# Usabilidad — Evaluación cuantitativa SUS (Sprint 4)

[← Volver al README principal](../../../README.md) · [← Playwright](<03 Analisis PlayWrigth V_1_0_0.md>) · [EN-003 →](<05 Recuperación de servicio EN-003 V_1_0_0.md>)

**Nombre del Proyecto:** WankaEcoLogística Huancayo  
**Líder del Proyecto:** Nario German Reyes Rios  
**Instrumento:** System Usability Scale (SUS)  
**Escala:** Likert 1–5 (1 = totalmente en desacuerdo, 5 = totalmente de acuerdo)

## 1. Ficha técnica de la evaluación

| Campo | Valor |
|---|---|
| Instrumento | SUS (10 ítems estándar de Brooke) |
| Escala | Likert 1–5 |
| Tamaño de muestra objetivo | n ≥ 5 (usuarios finales / stakeholders / roles del sistema) |
| Entorno evaluado | Aplicación web WankaEcoLogística |
| Material de tareas | Capturas en [`evidencias/sprint-04/`](../../../evidencias/sprint-04/) |

### Tareas ejecutadas antes de responder

1. Abrir la pantalla de acceso e identificar campos de correo y contraseña.  
2. (Con API activa) Iniciar sesión como administrador.  
3. Consultar **Pedidos** / **Indicadores** según el rol.  
4. Revisar el formulario de nuevo pedido o la exportación de reportes.  
5. (Opcional) Abrir **Mi ruta** como conductor.

### Evidencias visuales de las tareas

**Tarea 1 — Acceso (login vivo capturado 20/11/2026):**

![Login vivo](<../../../evidencias/sprint-04/04-login-vivo.png>)

**Tarea 3 — Pedidos (captura operativa del repositorio):**

![Pedidos](<../../../evidencias/sprint-04/02-pedidos.png>)

**Referencia de calidad percibida (Lighthouse desktop):**

![Lighthouse desktop](<../../../evidencias/sprint-04/03-lighthouse-desktop.png>)

### Ítems SUS aplicados

1. Creo que me gustaría usar este sistema con frecuencia.  
2. Encontré el sistema innecesariamente complejo.  
3. Pensé que el sistema era fácil de usar.  
4. Creo que necesitaría el apoyo de una persona técnica para poder usar este sistema.  
5. Encontré que las diversas funciones del sistema estaban bien integradas.  
6. Pensé que había demasiada inconsistencia en este sistema.  
7. Imagino que la mayoría de las personas aprenderían a usar este sistema muy rápidamente.  
8. Encontré el sistema muy engorroso de usar.  
9. Me sentí muy confiado usando el sistema.  
10. Necesité aprender muchas cosas antes de poder empezar con este sistema.

## 2. Resultados cuantitativos

### Matriz de respuestas brutas (1–5)

> Completar con los valores reales de la sesión SUS del equipo (n ≥ 5). Las capturas de tareas ya están listas arriba para la demo a evaluadores.

| Participante | Rol / perfil | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| P1 | Por capturar en sesión |  |  |  |  |  |  |  |  |  |  |
| P2 | Por capturar en sesión |  |  |  |  |  |  |  |  |  |  |
| P3 | Por capturar en sesión |  |  |  |  |  |  |  |  |  |  |
| P4 | Por capturar en sesión |  |  |  |  |  |  |  |  |  |  |
| P5 | Por capturar en sesión |  |  |  |  |  |  |  |  |  |  |

### Cálculo SUS individual (paso a paso)

Para cada participante:

1. Ítems impares (1, 3, 5, 7, 9): contribución = `respuesta − 1`.
2. Ítems pares (2, 4, 6, 8, 10): contribución = `5 − respuesta`.
3. Sumar las 10 contribuciones (rango 0–40).
4. Multiplicar por **2,5** → puntaje SUS 0–100.

| Participante | Suma contribuciones (0–40) | SUS (= suma × 2,5) |
|---|---|---|
| P1 |  |  |
| P2 |  |  |
| P3 |  |  |
| P4 |  |  |
| P5 |  |  |
| **Promedio global** | — | **SUS̄ =** |

## 3. Análisis e interpretación

### Umbral de industria

- Estándar de aceptación de referencia: **SUS ≥ 68**.
- Clasificación orientativa: A (≥80,3), B (≥74), C (≥68), D (≥51), F (&lt;51).

### Lectura provisional (antes de cerrar la encuesta)

Con las capturas actuales se observa un acceso claro y un panel de pedidos legible; el cuello de botella más probable a validar en SUS es la complejidad de planificación de rutas y el mensaje cuando Indicadores no tiene datos en el periodo.

**Mejoras ya aplicadas en producto:**

- Textos de ayuda en Indicadores/exportación (US-006/US-008).
- Corrección PWA/caché en Rutas (`8d954cc`).

[← Volver al README principal](../../../README.md)

**Fin del documento**
