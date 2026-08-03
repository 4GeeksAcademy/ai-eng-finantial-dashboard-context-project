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

## ✅ Mejoras Implementadas Recientemente

* **Accesibilidad y Rendimiento (Vercel React Best Practices)**:
  - Se agregaron etiquetas `<meta description>` y `<title>` actualizados en `frontend/index.html` para SEO.
  - Se implementó *lazy loading* (`React.lazy` y `<Suspense>`) para los gráficos pesados de `recharts` en `App.tsx`, reduciendo el *bundle size* inicial.
  - Se integró un `AbortController` en el `useEffect` de carga de datos en `App.tsx` (optimizando las peticiones de cliente).
  - Se aplicó `aria-hidden="true"` a los iconos decorativos (`dashboard-header.tsx`, `kpi-card.tsx`) para mejorar la compatibilidad con lectores de pantalla.
  - **Auditoría WCAG 2.2**: Se ejecutó la skill `accessibility` generando un reporte (`accessibility_audit_report.md`) que confirma el cumplimiento en navegabilidad por teclado, contraste semántico y roles ARIA.

---

## ♿ Auditoría de Accesibilidad (WCAG 2.2)

Se ha realizado una auditoría formal del Frontend utilizando la skill `accessibility` para garantizar el cumplimiento de accesibilidad:
* **`aria-label` y `role`**: ✅ **Cumple**. Los contenedores principales (ej. gráficas y KPIs) usan tags semánticos (`<section>`) y atributos `aria-label` descriptivos. No existen roles simulados indebidamente.
* **Navegabilidad por Teclado**: ✅ **Cumple**. La vista actual es ejecutiva (solo lectura) y no secuestra el teclado (sin *keyboard traps*).
* **Texto `alt` e Iconos**: ✅ **Cumple**. Todos los iconos decorativos (Lucide) cuentan correctamente con el atributo `aria-hidden="true"` para no interferir con lectores de pantalla.
* **Contraste de Color**: ⚠️ **Aceptable (Requiere Verificación)**. Los estilos emplean el sistema de colores semánticos (ej. `bg-primary/10 text-primary`), pero se sugiere una verificación manual para garantizar el ratio de contraste 4.5:1 (AA).

---

## 🚀 Auditoría de React Best Practices (Vercel)

Se ejecutó una auditoría basada en las directrices de `vercel-react-best-practices` (adaptadas para Vite):
* **Imágenes Optimizadas**: ✅ **Adaptado**. El dashboard emplea renderizado SVG para gráficas e iconos, por lo que no requiere optimización rasterizada (como `next/image`).
* **SEO (Title y Meta)**: ✅ **Cumple**. Corregido a nivel nativo en el `index.html` de Vite, asegurando un `<title>` descriptivo y etiqueta `<meta description>`.
* **Rendimiento (Waterfalls & Memory Leaks)**: ✅ **Corregido**. Las llamadas asíncronas en `App.tsx` ahora cuentan con un `AbortController` previniendo fugas de memoria o *race conditions*.
* **Optimización de Bundle Size**: ✅ **Cumple**. La carga de dependencias pesadas (`recharts`) se particionó (code-splitting) utilizando `React.lazy()` y `<Suspense>`.
* **Construcción Local**: ✅ **Exitoso**. La validación mediante `npm run build` confirmó la división correcta de *chunks* optimizados.

---

## 🔍 Auditoría de Skills Relacionados (SEO)

Se analizó la sección `Related Skills` de la skill `seo-audit` para evaluar su aplicabilidad estratégica en el contexto de este **Financial Dashboard**:
* **`ai-seo` (Optimización AEO/GEO)**: ⚪ **No aplicable**. Al ser una herramienta interna o B2B privada, no es objetivo posicionarse como respuesta directa en LLMs o motores de IA públicos.
* **`programmatic-seo`**: ⚪ **No aplicable**. La arquitectura actual es una Single Page Application (SPA) centralizada; no requiere generación masiva de páginas.
* **`site-architecture`**: 🟡 **Evaluación futura**. Actualmente es una sola vista. Si el dashboard escala a múltiples rutas (ej. `/reports`, `/settings`), será vital estructurar una jerarquía lógica de URLs.
* **`schema` (Datos Estructurados)**: ⚪ **No aplicable**. No se requiere inyectar JSON-LD para resultados enriquecidos de Google en datos financieros protegidos.
* **`cro` (Optimización de Conversión)**: 🟡 **Relevante (Adaptado a UX)**. En este producto, la "conversión" equivale a la "adopción de usuarios". Mejorar la claridad visual y la disposición de los KPIs impactará directamente en su uso.
* **`analytics`**: 🟢 **Alta Prioridad**. Recomendado implementar analítica de producto (ej. PostHog, Mixpanel, o GA4) para rastrear interacciones, clics en gráficos y tiempos de sesión.

---

## 💵 Auditoría de Custom Skill: Financial Formatting (`financial-formatting`)

Se creó y ejecutó la skill personalizada `.agents/skills/financial-formatting/SKILL.md`:
* **Prohibición de Concatenación Manual**: ✅ **Corregido**. Se detectó que `formatPercent` en `financial-utils.ts` utilizaba una plantilla de texto manual (`${value.toFixed(1)}%`). Se refactorizó para emplear `Intl.NumberFormat` con estilo porcentual.
* **Internacionalización y Formato Monetario**: ✅ **Cumple**. Todas las llamadas a moneda usan `formatCurrency` basado en `Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })`.
* **Semántica de Color**: ✅ **Cumple**. Los componentes `<KPICard>` emplean clases de badge semánticamente diferenciadas por variante (`income`, `outcome`, `profit`).

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
