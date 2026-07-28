# Estado Actual del Proyecto

## Features implementadas

### API de métricas financieras

Implementado en [backend/app/routes.py](../backend/app/routes.py):

- `GET /health`
- `GET /api/metrics`
- `GET /api/metrics/b2b`
- `GET /api/metrics/b2c`
- `GET /api/metrics/facets`
- `GET /api/metrics/summary`
- `GET /api/metrics/categories/top`
- `GET /api/metrics/comparison`
- `GET /api/metrics/alerts`

También existen funciones de dominio para:

- Filtrado por fecha/categoría/tipo
- Agregación por periodo
- Cálculo de net/comparativas
- Detección de alertas por aumento de outcome

### Dashboard frontend

Implementado en [frontend/src/App.tsx](../frontend/src/App.tsx) y componentes:

- Carga de datos desde API
- Cálculo de KPIs y serie mensual
- Tarjetas KPI
- Gráfico Income vs Outcome
- Gráfico Profit Margin %
- Estados de loading y error

### Pruebas

- Backend con cobertura funcional de endpoints y filtros en [backend/tests/test_routes.py](../backend/tests/test_routes.py)
- Frontend con pruebas de utilidades financieras en [frontend/src/lib/financial-utils.test.ts](../frontend/src/lib/financial-utils.test.ts)

## Gaps conocidos

### 1) Seguridad de configuración API

- CORS abierto (`allow_origins=["*"]`) y credentials habilitadas en [backend/app/main.py](../backend/app/main.py).
- Riesgo si se usa sin endurecimiento fuera de modo demo/local.

### 2) Fuente de datos

- Los endpoints dependen de generación mock en runtime dentro de handlers.
- Falta capa de persistencia/servicio desacoplado para entorno productivo.

### 3) Duplicación de rutas

- Endpoints B2B/B2C tienen lógica muy parecida y pueden converger en filtros unificados.

### 4) Consistencia UX e i18n

- Hay mezcla de copy ES/EN y locale fijo en utilidades de formato.

### 5) Cobertura de integración

- No hay evidencia de pruebas de integración frontend-backend para contratos end-to-end.

## Siguientes prioridades recomendadas

### Prioridad 1: Hardening y base de arquitectura

- Parametrizar CORS por entorno.
- Introducir capa de proveedor de datos (mock vs persistente).
- Documentar claramente comportamiento demo vs real.

### Prioridad 2: Unificación funcional

- Consolidar segmentación B2B/B2C en filtros reutilizables.
- Preservar compatibilidad de rutas existentes mientras se migra.

### Prioridad 3: Evolución de producto en frontend

- Exponer en UI endpoints avanzados ya disponibles:
  - Summary
  - Comparison
  - Alerts
  - Top categories
- Añadir controles de filtros (periodo, categoría, tipo de operación, business type).

### Prioridad 4: Calidad y gobernanza

- Aumentar pruebas de integración y contratos.
- Aplicar reglas operativas de [../.agents/rules](../.agents/rules).
- Mantener actualización sincronizada de README.md y README.es.md ante cambios de flujo.

## Indicador de madurez actual

El proyecto está en una fase sólida de prototipo funcional con buena base de testing y estructura full-stack, listo para una Fase 3 enfocada en hardening, coherencia de producto y expansión de capacidades visibles en UI.