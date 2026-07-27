# Estado del Proyecto y Mapa de Deuda Técnica (Memory Bank - Project Status)

Este documento contiene la **radiografía del estado actual** del repositorio Financial Dashboard, el mapa de calor de deuda técnica heredada y las **3 prioridades técnicas inmediatas** para los siguientes desarrolladores o agentes de IA.

---

## 🚦 Estado Actual del Repositorio

* **Estabilidad del Entorno:** ✅ Contenedores Docker de Frontend y Backend desplegables y operativos sin errores mediante `docker compose up --build`.
* **Auditoría de Calidad:** ✅ Diagnóstico de ingeniería completo documentado en [`AUDIT.md`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/AUDIT.md) (5 buenas prácticas y 5 malas prácticas categorizadas).
* **Gobernanza de Agentes:** ✅ Sistema de reglas activo en [`.agents/rules/`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/.agents/rules/):
  - `01-api-naming-conventions.md` (API RESTful y Pydantic)
  - `02-frontend-structure.md` (Arquitectura React desacoplada)
  - `03-error-handling.md` (Manejo global de excepciones)
* **Memoria Operativa:** ✅ Estructura `memory-bank/` activa e institucionalizada.

---

## 🔥 Mapa de Calor de Deuda Técnica y Riesgos Identificados

| ID | Riesgo / Deuda Técnica | Componente Afectado | Nivel de Riesgo | Regla de Mitigación |
| :--- | :--- | :--- | :--- | :--- |
| **MP-01** | Regeneración redundante de 360 objetos mock en memoria por request | `backend/app/routes.py` | 🟡 Medio | `01-api-naming-conventions.md` |
| **MP-02** | Periodo de fecha `"2024 - Full Year"` hardcodeado en la UI | `frontend/src/App.tsx` | 🔴 Alto | `02-frontend-structure.md` |
| **MP-03** | Bloque `.catch()` genérico descartando la causa raíz de errores | `frontend/src/App.tsx` | 🔴 Alto | `03-error-handling.md` |
| **MP-04** | Falta de `HTTPException` en backend ante fechas Query invertidas | `backend/app/routes.py` | 🟡 Medio | `03-error-handling.md` |
| **MP-05** | `fetch` y `useEffect` directo en componente de vista principal | `frontend/src/App.tsx` | 🔴 Alto | `02-frontend-structure.md` |

---

## 🎯 Las 3 Prioridades Técnicas Inmediatas

### 1. Refactorización de la Capa de Cliente Frontend (Prioridad 1)
- Extraer las llamadas HTTP de [`App.tsx`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/frontend/src/App.tsx) hacia un módulo dedicado `frontend/src/lib/services/financial-api.ts`.
- Crear el Custom Hook `useFinancialMetrics()` para gestionar los estados `data`, `loading` y `error`.
- Hacer dinámico el encabezado de periodo en `<DashboardHeader />` utilizando las facetas recibidas de `/api/metrics/facets`.

### 2. Optimización del Generador de Datos en Backend (Prioridad 2)
- Implementar un patrón de Repositorio o Caché Singleton en `backend/app/services/` para evitar invocar `generate_mock_movements(seed=42)` en cada llamada HTTP.
- Reducir el consumo de CPU y memoria en endpoints de agregación (`/summary`, `/categories/top`).

### 3. Cobertura de Pruebas y Validación Estructurada de Excepciones (Prioridad 3)
- Incorporar validaciones explícitas con `fastapi.HTTPException(status_code=400, detail=...)` en `routes.py` para verificar que `start_date <= end_date`.
- Implementar pruebas unitarias aisladas en `frontend/src/lib/financial-utils.test.ts` (Vitest) y `backend/tests/test_routes.py` (Pytest).
