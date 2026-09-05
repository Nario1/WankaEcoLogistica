# WankaEcoLogística Huancayo

Sistema web de optimización de rutas sostenibles de última milla para operaciones logísticas en Huancayo, Junín, Perú.

---

## 1. Descripción del Proyecto

**WankaEcoLogística Huancayo** es una plataforma web desarrollada como Proyecto Final de Asignatura (PFA) del Taller de Proyectos. El sistema está orientado a optimizar rutas sostenibles de última milla para empresas logísticas que operan en la ciudad de **Huancayo - Junín - Perú**.

La necesidad del proyecto surge por la complejidad de coordinar la distribución de mercancías en una ciudad con crecimiento comercial, tránsito variable, calles con distinta accesibilidad y condiciones climáticas propias de la sierra central. En ese contexto, contar con rutas optimizadas y visibles en un mapa aporta valor operativo y ambiental a las empresas logísticas del entorno local.

El proyecto integra módulos para la gestión de pedidos, flota, conductores, cálculo de rutas, visualización en mapa, indicadores de sostenibilidad y reportes operativos, construidos bajo un enfoque **Ágil / Adaptativo** alineado con el PMBOK 7.ª edición.

---

## 2. Objetivo

Diseñar, desarrollar y validar una versión funcional de **WankaEcoLogística Huancayo** durante el periodo académico 2026, implementando las funcionalidades prioritarias para la gestión y optimización de rutas logísticas sostenibles, con entregas incrementales, control de calidad y retroalimentación de los interesados.

### Objetivos Específicos (Criterios SMART)

| ID | Dimensión | Meta |
|---|---|---|
| OBJ-01 | Alcance | Implementar el 100% de las funcionalidades prioritarias definidas. |
| OBJ-02 | Cronograma | Cumplir al menos el 90% de los hitos en fecha planificada. |
| OBJ-03 | Costo | No superar una desviación del 10% respecto al presupuesto aprobado. |
| OBJ-04 | Calidad | Alcanzar al menos el 90% de casos de prueba funcional aprobados. |
| OBJ-05 | Sostenibilidad | Reducir la distancia total recorrida en al menos el 15% respecto a la línea base. |
| OBJ-06 | Aceptación | Obtener al menos el 80% de valoración favorable en pruebas de aceptación. |

---

## 3. Características Principales

- Registro y gestión de pedidos con dirección, coordenadas, peso, prioridad y ventana de tiempo.
- Gestión de flota: registro de vehículos con capacidad, consumo y factor de emisión.
- Registro y asignación de conductores respetando disponibilidad y restricciones operativas.
- Motor de optimización de rutas (VRP) considerando distancia, tiempo, congestión y ventanas de entrega.
- Visualización de rutas en mapa interactivo con soporte para conectividad inestable (PWA).
- Dashboard de indicadores de sostenibilidad: reducción de CO₂, ahorro de distancia y nivel de servicio.
- Reoptimización dinámica ante cambios operativos (bloqueos viales, cancelaciones de pedido).
- Generación de reportes operativos exportables (PDF / CSV).
- Control de acceso basado en roles (RBAC): Administrador, Operador, Usuario Final y Auditor Externo.

---

## 4. Tecnologías Utilizadas

| Capa | Tecnología | Justificación |
|---|---|---|
| **Frontend** | React (PWA) | Interfaz reactiva con soporte offline para conductores en campo. |
| **Backend / API** | Python + FastAPI | Alto rendimiento asíncrono, bajo consumo de recursos y ecosistema de optimización (OR-Tools). |
| **Base de Datos** | PostgreSQL + PostGIS | Modelo relacional con capacidades geoespaciales nativas para consultas de coordenadas y distancias. |
| **Caché** | Redis | Almacenamiento de sesiones y rutas temporales calculadas. |
| **Optimización** | Google OR-Tools | Librería matemática para resolución de problemas de enrutamiento de vehículos (VRP). |
| **Control de Versiones** | Git + GitHub | Gestión del código fuente y documentación del proyecto. |
| **Documentación** | Markdown | Formato estricto y versionado semánticamente. |

---

## 5. Arquitectura del Proyecto

El sistema sigue una arquitectura de capas limpias organizada en tres niveles principales (Modelo C4):

- **Nivel 1 (Contexto):** Los usuarios acceden al sistema a través de HTTPS. El sistema se integra con un proveedor externo de mapas, un servicio OAuth2 para autenticación y un servicio SMTP para notificaciones.
- **Nivel 2 (Contenedores):** La plataforma se compone de una Single Page Application (React PWA), una API Backend (Python / FastAPI), una base de datos relacional (PostgreSQL + PostGIS) y una capa de caché (Redis).
- **Nivel 3 (Componentes):** La API se organiza internamente en Controladores / Endpoints, Middleware de Seguridad y Autenticación, Servicio de Optimización y Ruteo, Servicios Transaccionales Core y una Capa de Repositorios / ORM.

Para el diagrama completo del Modelo C4, consultar el documento [Arquitectura de Software - Modelo C4](docs/01%20Inicio/12.%20Modelo%20C4%20V_1_0_0.md).

---

## 6. Estructura del Proyecto

```
WankaEcoLogística/
├── docs/
│   └── 01 Inicio/
│       ├── 01. Selección del enfoque del proyecto V_1_0_0.md
│       ├── 02. Acta de constitución V_1_0_0.md
│       ├── 03. Declaración de la visión V_1_0_0.md
│       ├── 04. Registro de supuestos y restricciones V_1_0_0.md
│       ├── 05. Registro de interesados V_1_0_0.md
│       ├── 06. Requisitos funcionales V_1_0_0.md
│       ├── 07. Requisitos no funcionales V_1_0_0.md
│       ├── 08. Usuarios V_1_0_0.md
│       ├── 09. Reglas de negocio V_1_0_0.md
│       ├── 10. Stack tecnológico V_1_0_0.md
│       ├── 11. Base de datos V_1_0_0.md
│       ├── 12. Modelo C4 V_1_0_0.md
│       └── 13. Restricciones V_1_0_0.md
└── README.md
```

---

## 7. Instalación y Configuración

A continuación se presentan los pasos necesarios para configurar el entorno de desarrollo del proyecto.

**Requisitos previos:**

- Python 3.11 o superior
- Node.js 20 o superior
- PostgreSQL 15 con extensión PostGIS habilitada
- Redis 7

**Pasos de instalación:**

1. Clonar el repositorio:

```bash
git clone https://github.com/Nario1/WankaEcoLog-stica.git
cd WankaEcoLog-stica
```

2. Configurar el entorno del backend:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Configurar la base de datos:

```sql
CREATE DATABASE wanka_ecologistica;
\c wanka_ecologistica;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
```

4. Configurar las variables de entorno (crear archivo `.env` en la raíz del backend):

```
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/wanka_ecologistica
REDIS_URL=redis://localhost:6379
SECRET_KEY=clave_secreta_segura
```

5. Ejecutar las migraciones y el servidor de desarrollo del backend:

```bash
python -m uvicorn main:app --reload
```

6. Configurar e iniciar el frontend:

```bash
cd frontend
npm install
npm run dev
```

---

## 8. Uso del Sistema

Una vez iniciados tanto el backend como el frontend, el sistema estará disponible en `http://localhost:5173` (o el puerto configurado por el servidor de desarrollo).

**Flujo principal de uso:**

1. Iniciar sesión con las credenciales del rol asignado (Administrador, Operador, Conductor o Auditor).
2. Registrar los pedidos del día con dirección, coordenadas, peso y ventana de tiempo.
3. Verificar la disponibilidad de vehículos y conductores.
4. Invocar al motor de optimización de rutas para generar la planificación diaria.
5. Visualizar las rutas generadas en el mapa interactivo.
6. Monitorear el progreso de las entregas a través del dashboard.
7. Generar reportes operativos al cierre de la jornada.

---

## 9. Documentación

A continuación se presenta el índice completo de los artefactos generados durante la Fase 01 del proyecto, organizados en formato versionado.

| N° | Documento | Descripción | Versión |
|:---:|---|---|:---:|
| 01 | [Selección del enfoque del proyecto](<docs/01 Inicio/01. Selección del enfoque del proyecto V_1_0_0.md>) | Justificación del enfoque Ágil / Adaptativo. | `1.0.0` |
| 02 | [Acta de constitución](<docs/01 Inicio/02. Acta de constitución V_1_0_0.md>) | Objetivos SMART, hitos, presupuesto y gobernanza. | `1.0.0` |
| 03 | [Declaración de la visión](<docs/01 Inicio/03. Declaración de la visión V_1_0_0.md>) | Propuesta de valor, módulos y KPIs priorizados. | `1.0.0` |
| 04 | [Registro de supuestos y restricciones](<docs/01 Inicio/04. Registro de supuestos y restricciones V_1_0_0.md>) | Condiciones previas, técnicas y operativas. | `1.0.0` |
| 05 | [Registro de interesados](<docs/01 Inicio/05. Registro de interesados V_1_0_0.md>) | Stakeholders y matriz de poder e impacto. | `1.0.0` |
| 06 | [Requisitos funcionales](<docs/01 Inicio/06. Requisitos funcionales V_1_0_0.md>) | Catálogo atómico con criterios de aceptación BDD. | `1.0.0` |
| 07 | [Requisitos no funcionales](<docs/01 Inicio/07. Requisitos no funcionales V_1_0_0.md>) | Escenarios de calidad ISO/IEC 25010 con métricas SMART. | `1.0.0` |
| 08 | [Identificación y perfiles de usuarios](<docs/01 Inicio/08. Usuarios V_1_0_0.md>) | Roles, historias de uso y control de acceso RBAC. | `1.0.0` |
| 09 | [Reglas de negocio y trazabilidad](<docs/01 Inicio/09. Reglas de negocio V_1_0_0.md>) | Reglas codificadas y trazabilidad cruzada RN / RF / RNF. | `1.0.0` |
| 10 | [Evaluación del stack tecnológico](<docs/01 Inicio/10. Stack tecnológico V_1_0_0.md>) | Comparación de alternativas y justificación técnica. | `1.0.0` |
| 11 | [Diseño e ingeniería de base de datos](<docs/01 Inicio/11. Base de datos V_1_0_0.md>) | Modelos conceptual, lógico (3FN) y físico DDL SQL. | `1.0.0` |
| 12 | [Arquitectura de software - Modelo C4](<docs/01 Inicio/12. Modelo C4 V_1_0_0.md>) | Diagramas de Contexto, Contenedores y Componentes. | `1.0.0` |
| 13 | [Análisis multidimensional de restricciones](<docs/01 Inicio/13. Restricciones V_1_0_0.md>) | Impacto, mitigación y cumplimiento normativo (LCC). | `1.0.0` |

---

## 10. Pruebas

La estrategia de calidad del proyecto contempla las siguientes categorías de pruebas:

| Tipo de Prueba | Descripción | Meta |
|---|---|---|
| **Pruebas Funcionales** | Validación de los criterios de aceptación BDD definidos por requisito (RF-001 al RF-008). | Aprobación de al menos el 90% de los casos. |
| **Pruebas de Rendimiento** | Verificación de la latencia del motor de optimización con 50 puntos de entrega. | Latencia P95 menor o igual a 3.5 segundos. |
| **Pruebas de Seguridad** | Revisión de vulnerabilidades según el estándar OWASP Top 10. | 0% de vulnerabilidades críticas o altas ejecutables. |
| **Pruebas de Aceptación de Usuario (UAT)** | Validación con usuarios representativos (operadores y conductores). | Valoración favorable mayor o igual al 80%. |
| **Pruebas de Precisión** | Verificación del ahorro de distancia respecto a la ruta base secuencial. | Reducción verificable mayor o igual al 15%. |

---

## 11. Equipo de Desarrollo

| Rol | Nombre |
|---|---|
| **Director del Proyecto** | Nario German Reyes Rios |
| **Integrante** | Michel Frederik Ccente Quispe |
| **Integrante** | Henry Lozano Porta |
| **Integrante** | Jhon Espinoza Mendoza |
| **Integrante** | Gimena Salazar Espinoza |

**Institución:** Taller de Proyectos - Periodo Académico 2026
