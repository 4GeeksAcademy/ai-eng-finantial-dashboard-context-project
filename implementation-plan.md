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

### Fase 1: Exploración Inicial, Validación de Servicios y Alineación ✅ (COMPLETADA)

* ✅ **Perspectiva del Arquitecto:** Inspección y contraste de la arquitectura real de carpetas en `frontend/src` y `backend/app`.
* ✅ **Perspectiva del Auditor:** Validación empírica de servicios activos en sus URLs correspondientes:
  - ✅ Frontend (Vite): `http://localhost:5173` (HTTP 200 OK)
  - ✅ Backend (FastAPI Health): `http://localhost:8000/health` (`{"status":"ok"}`)
  - ✅ API Docs (Swagger): `http://localhost:8000/docs` (Activo)
* ✅ **Perspectiva del Tech Lead:** Refutación crítica del resumen inicial de la IA contra la evidencia del código fuente (confirmando la falta de módulos de autenticación o persistencia relacional).
* ✅ **Entregable de Git:** 
  `git commit -m "(FASE1): validacion de entorno y alineamiento con el codigo base"` (Completado y pusheado a origin/main)

---

### Fase 2: Diagnóstico de Ingeniería y Auditoría de Calidad ✅ (COMPLETADA)

* ✅ **Consenso de Hallazgos - 5 Buenas Prácticas (Preservar):**
  1. ✅ *BP-01 (Arquitecto):* Modularidad de funciones de cálculo en `backend/app/routes.py` (L161-L241).
  2. ✅ *BP-02 (Arquitecto):* Modelado explícito con Pydantic (`FinancialMovement`, `MetricsSummaryItem`).
  3. ✅ *BP-03 (Tech Lead):* Configuración centralizada de proxy `/api` en `frontend/vite.config.ts`.
  4. ✅ *BP-04 (Arquitecto):* Tipado estricto de tipos de dominio en `frontend/src/lib/financial-types.ts`.
  5. ✅ *BP-05 (Auditor):* Separación de cálculos financieros puros en `frontend/src/lib/financial-utils.ts`.

* ✅ **Consenso de Hallazgos - 5 Malas Prácticas / Riesgos (Mitigar):**
  1. ✅ *MP-01 (Auditor):* Generación redundante de datos mock en cada endpoint (`backend/app/routes.py#L255`).
  2. ✅ *MP-02 (Auditor):* Hardcoding del periodo `"2024 - Full Year"` en `frontend/src/App.tsx#L49`.
  3. ✅ *MP-03 (Auditor):* Manejo de errores genérico en el frontend en `App.tsx#L35-L39`.
  4. ✅ *MP-04 (Arquitecto):* Ausencia de `HTTPException` personalizadas para validaciones de query en FastAPI.
  5. ✅ *MP-05 (Tech Lead):* Acoplamiento de Data Fetching y Renderizado en la raíz `App.tsx#L15-L43`.

* ✅ **Categorización y Documentación:** Informe completo redactado en [`AUDIT.md`](./AUDIT.md).
* ✅ **Entregable de Git:**
  `git commit -m "(FASE2): auditoria de calidad y diagnostico de ingenieria completo"`

---

### Fase 3: Institucionalización de Reglas (`.agents/rules/`) ✅ (COMPLETADA)

Sintetizando los requerimientos de gobernanza de los 3 expertos, se han creado e institucionalizado los siguientes estándares:

- ✅ **`.agents/rules/01-api-naming-conventions.md`**: Convenciones RESTful para FastAPI (endpoints en plural, minúsculas, `snake_case` para query parameters y respuestas JSON).
- ✅ **`.agents/rules/02-frontend-structure.md`**: Estándar de separación React: prohibición de `fetch` directo dentro de componentes visuales, aislamiento en `lib/services/` o custom hooks, y prohibición estricta de `any`.
- ✅ **`.agents/rules/03-error-handling.md`**: Protocolo defensivo: `HTTPException` explícitas en FastAPI y manejo de estados de carga/error tipados en React.

* ✅ **Entregable de Git:**
  `git commit -m "(FASE3): institucionalizacion de reglas de gobernanza en .agents/rules"` (Completado y pusheado a origin/main)

---

### Fase 4: Construcción del Banco de Memoria (`memory-bank/`) ✅ (COMPLETADA)

Garantía del Tech Lead para la preservación e institucionalización del conocimiento:

- ✅ **`memory-bank/overview.md`**: Visión del producto y flujo cliente-servidor extraído del comportamiento verificado.
- ✅ **`memory-bank/tech_stack.md`**: Inventario técnico verificado: React 19.2, Vite 8.0, Tailwind CSS 4.2, Recharts 3.8, Vitest 4.1, FastAPI, Uvicorn, Pytest.
- ✅ **`memory-bank/project_status.md`**: Mapa de deuda técnica, estado del repositorio y las 3 prioridades de desarrollo futuras.

* ✅ **Entregable de Git:**
  `git commit -m "(FASE4): construccion del banco de memoria operativa en memory-bank"` (Completado)

---

## 🔍 Plan de Verificación

- **Verificación Automatizada:**
  - Validación de sintaxis y formato Markdown en todos los documentos.
  - Comprobación de existencia de rutas de archivo con script de inspección.
- **Verificación Manual:**
  - Comprobar la presencia del árbol completo de `.agents/rules/` y `memory-bank/`.
  - Inspeccionar `git log --oneline` para verificar los 4 commits atómicos de Git.
