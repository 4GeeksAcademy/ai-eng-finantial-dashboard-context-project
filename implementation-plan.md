# Plan de Implementación Detallado - Método de los Tres Expertos

Este Plan de Implementación ha sido elaborado utilizando el **Método de los Tres Expertos** (*Three Experts Method* del Agentic Coding Handbook), integrando y sintetizando los análisis de tres perfiles de ingeniería especializados para auditar, gobernar y documentar la base de código del Financial Dashboard según [`STRATEGY.md`](./STRATEGY.md).

---

## 🏛️ Perspectivas de los 3 Expertos

### 1. 🏗️ Arquitecto de Software (Focus: Estructura, Abstracciones y Diseño)
> *"El sistema actual presenta un acoplamiento directo entre la vista principal (`App.tsx`) y las llamadas HTTP a la API, además de una generación de mock data in-memory sin capa de repositorio o datos aislada en FastAPI. Mi prioridad es garantizar contratos de API estandarizados en `snake_case`, un desacople estricto entre UI y la lógica de consumo de datos en el frontend (`lib/services/`), y abstracciones modulares que permitan a los agentes de IA procesar componentes pequeños sin agotar la ventana de contexto."*

### 2. 🛡️ Auditor de Calidad y Seguridad / QA (Focus: Riesgos, Excepciones y Deuda Técnica)
> *"He detectado vulnerabilidades operativas en el frontend debido a bloques `.catch()` genéricos que ocultan la causa raíz de las fallas, así como la falta de manejo de `HTTPException` en FastAPI que genera respuestas 500 no estructuradas ante parámetros Query inválidos. Mi prioridad es exigir un protocolo de manejo defensivo de excepciones, eliminar valores hardcodeados de periodos y asegurar que las reglas en `.agents/rules/` prevengan fallas silenciosas en producción."*

### 3. ⏱️ Tech Lead & Mantenedor de Producto (Focus: Gobernanza, DX y Entrega de Handover)
> *"Mi principal objetivo es erradicar el ciclo de handover incompleto y reducir al mínimo la carga cognitiva del próximo desarrollador. Exijo un cumplimiento estricto de las 4 Fases de `STRATEGY.md`, respaldadas por commits atómicos e independientes en Git por cada fase, y la creación de una memoria operativa viva de alta fidelidad en `memory-bank/` basada exclusivamente en la auditoría real del código."*

---

## 🤝 Consenso de los 3 Expertos: Plan Unificado de 4 Fases

---

### Fase 1: Exploración Inicial, Validación de Servicios y Alineación

* **Perspectiva del Arquitecto:** Inspección y contraste de la arquitectura real de carpetas en `frontend/src` y `backend/app`.
* **Perspectiva del Auditor:** Validación empírica de servicios activos en sus URLs correspondientes:
  - Frontend (Vite): `http://localhost:5173`
  - Backend (FastAPI Health): `http://localhost:8000/health`
  - API Docs (Swagger): `http://localhost:8000/docs`
* **Perspectiva del Tech Lead:** Refutación crítica del resumen inicial de la IA contra la evidencia del código fuente (confirmando la falta de módulos de autenticación o persistencia relacional).
* **Entregable de Git:** 
  `git commit -m "feat(phase-1): environment validation and codebase alignment"`

---

### Fase 2: Diagnóstico de Ingeniería y Auditoría de Calidad

* **Consenso de Hallazgos - 5 Buenas Prácticas (Preservar):**
  1. *BP-01 (Arquitecto):* Modularidad de funciones de cálculo en `backend/app/routes.py` (L160-L240). *¿So what?:* Permite procesar funciones aisladas dentro de la ventana de contexto de los agentes de IA.
  2. *BP-02 (Arquitecto):* Modelado explícito con Pydantic (`FinancialMovement`, `MetricsSummaryItem`). *¿So what?:* Autodocumenta la API y previene respuestas JSON malformadas.
  3. *BP-03 (Tech Lead):* Configuración centralizada de proxy `/api` en `frontend/vite.config.ts`. *¿So what?:* Evita bloqueos de CORS en desarrollo local y GitHub Codespaces.
  4. *BP-04 (Arquitecto):* Tipado estricto de tipos de dominio en `frontend/src/lib/financial-types.ts`. *¿So what?:* Garantiza autocompletado y seguridad de tipos en la UI.
  5. *BP-05 (Auditor):* Separación de cálculos financieros puros en `frontend/src/lib/financial-utils.ts`. *¿So what?:* Facilita la ejecución de pruebas unitarias sin dependencia de componentes React.

* **Consenso de Hallazgos - 5 Malas Prácticas / Riesgos (Mitigar):**
  1. *MP-01 (Auditor):* Invocación repetida de `generate_mock_movements(seed=42)` en `routes.py#L255`. *¿So what?:* Causa ineficiencia en memoria al recalcular el dataset mock en cada request HTTP.
  2. *MP-02 (Auditor):* Hardcoding de periodo `"2024 - Full Year"` en `frontend/src/App.tsx#L49`. *¿So what?:* Desalineación cuando la API calcula fechas dinámicas con `date.today()`.
  3. *MP-03 (Auditor):* Manejo de errores genérico en el frontend (`.catch()` en `App.tsx#L35-L39`). *¿So what?:* Oculta el origen real del error tanto al usuario como en los logs de desarrollo.
  4. *MP-04 (Arquitecto):* Ausencia de `HTTPException` personalizadas para parámetros Query fuera de rango en FastAPI. *¿So what?:* Provoca errores 500 no controlados en lugar de respuestas 400 amigables.
  5. *MP-05 (Tech Lead):* Mezcla de Data Fetching y Renderizado directamente en `App.tsx`. *¿So what?:* Impide la reutilización de datos y dificulta la creación de pruebas de componentes.

* **Categorización de Hallazgos:** Clasificación formal en Arquitectura, Naming, DX y Testing.
* **Entregable de Git:**
  `git commit -m "docs(phase-2): complete engineering quality audit and findings"`

---

### Fase 3: Institucionalización de Reglas (`.agents/rules/`)

Sintetizando los requerimientos de gobernanza de los 3 expertos, se crearán los siguientes estándares:

- **`.agents/rules/01-api-naming-conventions.md`**
  - Estándar RESTful obligatorio para FastAPI: endpoints en plural, nombres en minúsculas, `snake_case` para parámetros query y respuestas JSON.
  - Reutilización obligatoria de funciones de filtrado.

- **`.agents/rules/02-frontend-structure.md`**
  - Separación estricta en React: prohibición de `fetch` o llamadas HTTP dentro de componentes de UI (`App.tsx`).
  - Encapsulamiento obligatorio en la capa `lib/services/` o Custom Hooks. Prohibición total del uso de `any` en TypeScript.

- **`.agents/rules/03-error-handling.md`**
  - Manejo unificado de excepciones: uso obligatorio de `HTTPException` estructuradas en FastAPI.
  - Gestión explícita de estados de carga (`loading`) y errores visuales con opción de reintento en React.

* **Entregable de Git:**
  `git commit -m "feat(phase-3): establish agent governance rules in .agents/rules"`

---

### Fase 4: Construcción de la Memoria Operativa (`memory-bank/`)

Garantía del Tech Lead para institucionalizar el conocimiento del repositorio:

- **`memory-bank/overview.md`**
  - Documentación de la arquitectura del producto y los flujos cliente-servidor verificados empíricamente.

- **`memory-bank/tech_stack.md`**
  - Inventario auditado con versiones exactas extraídas de `frontend/package.json` (React 19.2, Vite 8.0, Tailwind CSS 4.2, Recharts 3.8, Vitest 4.1) y `backend/requirements.txt` (FastAPI, Uvicorn, Pytest).

- **`memory-bank/project_status.md`**
  - Mapa del estado actual, deuda técnica identificada y las 3 prioridades inmediatas de ingeniería.

* **Entregable de Git:**
  `git commit -m "docs(phase-4): establish project memory-bank"`

---

## 🔍 Plan de Verificación

- **Verificación Automatizada:**
  - Validación de sintaxis y formato Markdown en todos los documentos.
  - Comprobación de existencia de rutas de archivo con script de inspección.
- **Verificación Manual:**
  - Comprobar la presencia del árbol completo de `.agents/rules/` y `memory-bank/`.
  - Inspeccionar `git log --oneline` para verificar los 4 commits atómicos de Git.
