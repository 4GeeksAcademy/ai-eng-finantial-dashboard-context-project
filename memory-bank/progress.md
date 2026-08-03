# Historial de Progreso (Memory Bank - Progress)

Este documento mantiene un registro cronológico de los hitos alcanzados, las tareas completadas y el avance general del proyecto **Financial Dashboard**. Sirve como bitácora para que cualquier desarrollador o agente de IA pueda entender rápidamente qué se ha hecho y qué falta por hacer.

## 📊 Estado Actual
- **Fase**: Optimización de Cliente y Accesibilidad Inicial
- **Progreso General**: En curso. Se ha comenzado a abordar la deuda técnica mapeada en `project_status.md`.

---

## 📅 Hitos Completados

### [02/08/2026] - Auditoría y Refactorización Inicial de Frontend
- **Auditoría de Accesibilidad (WCAG 2.2)**: 
  - Se analizó el dashboard con la skill `accessibility`.
  - Se corrigió la accesibilidad de iconos puramente decorativos (añadiendo `aria-hidden="true"` en `dashboard-header.tsx` y `kpi-card.tsx`).
- **Mejores Prácticas de React (Vercel)**:
  - **Optimización de SEO**: Se corrigió el `<title>` e incluyó un `<meta description>` en `index.html`.
  - **Performance / Code-splitting**: Implementación de `React.lazy()` y `<Suspense>` en `App.tsx` para particionar el *bundle* aislando el paquete pesado de `recharts`.
  - **Data Fetching Eficiente**: Inclusión de un `AbortController` en el `useEffect` para cancelar peticiones HTTP obsoletas y prevenir fugas de memoria (*memory leaks*).
- **Auditoría SEO (seo-audit)**:
  - Se evaluaron las áreas de la skill `seo-audit`, determinando que las tácticas de generación pública de SEO no aplican.
  - Se definieron como siguientes pasos estratégicos la implementación de **Analytics** y optimizaciones UX (**CRO**) orientadas a la adopción interna de la herramienta.
- **Creación de Custom Skill ([`financial-formatting`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/.agents/skills/financial-formatting/SKILL.md))**:
  - Se diseñó y creó la skill personalizada en [`/.agents/skills/financial-formatting/SKILL.md`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/.agents/skills/financial-formatting/SKILL.md) (aplicando el método de 3 expertos y refinamiento iterativo).
- **Resolución Deuda Técnica [MP-01](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/AUDIT.md#L106-L118) (Optimización Generador Mock Data en Backend - Prioridad 2)**:
  - Se creó el módulo de repositorio dedicado [`financial_repository.py`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/backend/app/services/financial_repository.py) aislando la generación de mock data del archivo de rutas.
  - Se implementó la caché con `@lru_cache(maxsize=1)` en `get_cached_mock_movements()`, optimizando las 8 rutas de agregación y reduciendo el consumo de CPU/memoria.
- **Resolución Deuda Técnica [MP-02](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/AUDIT.md#L121-L130) (Periodo Dinámico)**:
  - Se creó la función helper [`computePeriodLabel(movements)`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/frontend/src/lib/financial-utils.ts#L86-L107) en [`financial-utils.ts`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/frontend/src/lib/financial-utils.ts) que deduce automáticamente el periodo o rango de años presente en las fechas de los datos.
  - Se vinculó en [`App.tsx`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/frontend/src/App.tsx#L55) enviando la prop calculada `<DashboardHeader period={period} />`, eliminando el valor estático hardcodeado `"2024 - Full Year"`.
- **Resolución Deuda Técnica [MP-03](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/AUDIT.md#L133-L146) (Manejo Transparente de Errores)**:
  - Se refactorizó la llamada API y el bloque de captura de excepciones en [`App.tsx`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/frontend/src/App.tsx#L41) extrayendo el mensaje de error `detail` retornado por FastAPI e imprimiendo `console.error('[Financial Dashboard API Failure]:', err)` en cumplimiento con la Regla 03 (`03-error-handling.md`).
- **Resolución Deuda Técnica [MP-05](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/AUDIT.md#L167-L184) (Refactorización Capa Cliente Frontend - Prioridad 1)**:
  - Se creó la capa aislada de servicios HTTP en [`financial-api.ts`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/frontend/src/lib/services/financial-api.ts).
  - Se creó el Custom Hook [`useFinancialMetrics()`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/frontend/src/hooks/use-financial-metrics.ts) para la gestión desacoplada de estados y lógica de red.
  - Se refactorizó [`App.tsx`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/frontend/src/App.tsx) reduciendo sus responsabilidades a la capa puramente de vista en cumplimiento con la Regla 02 (`02-frontend-structure.md`).

- **Resolución Deuda Técnica [MP-04](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/AUDIT.md#L149-L164) (Excepciones HTTP Estructuradas en Backend - Prioridad 3)**:
  - Se implementó la validación estricta del rango de fechas `start_date <= end_date` lanzando `HTTPException(status_code=400, detail="start_date must be before or equal to end_date")` en [`routes.py`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/backend/app/routes.py#L83).
  - Se añadió la prueba unitaria `test_inverted_date_range_raises_http_400` en [`test_routes.py`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/backend/tests/test_routes.py#L191-L197), completando 16 pruebas automatizadas aprobadas.

---

## 🔜 Próximos Pasos (Deuda Técnica Pendiente)
De acuerdo a las prioridades técnicas del proyecto:
1. Todas las deudas técnicas críticas (**MP-01**, **MP-02**, **MP-03**, **MP-04**, **MP-05**) han sido completamente **mitigadas y validadas con tests automatizados**.
2. Mantener la suite de pruebas activas ante nuevos requerimientos de negocio.
