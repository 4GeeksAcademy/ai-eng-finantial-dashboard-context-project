# Product Overview

## Propósito del producto

Este repositorio implementa un dashboard financiero full-stack para visualizar métricas de ingresos, egresos y rentabilidad a partir de movimientos financieros.

La evidencia principal del comportamiento del producto está en:

- API FastAPI con endpoints de métricas en [backend/app/routes.py](../backend/app/routes.py)
- Aplicación React que consume la API y renderiza KPIs/charts en [frontend/src/App.tsx](../frontend/src/App.tsx)
- Documentación de ejecución local en [README.md](../README.md) y [README.es.md](../README.es.md)

## Qué problema resuelve

Permite consolidar movimientos financieros en indicadores ejecutivos para seguimiento rápido:

- Total Income
- Total Outcome
- Profit
- Profit Margin
- Tendencias mensuales de ingresos/egresos y margen

Evidencia de KPIs y visualización en:

- [frontend/src/components/dashboard/kpi-row.tsx](../frontend/src/components/dashboard/kpi-row.tsx)
- [frontend/src/components/dashboard/income-outcome-chart.tsx](../frontend/src/components/dashboard/income-outcome-chart.tsx)
- [frontend/src/components/dashboard/profit-percent-chart.tsx](../frontend/src/components/dashboard/profit-percent-chart.tsx)

## Alcance funcional actual

### Backend

La API incluye:

- Health check
- Listado de movimientos con filtros por fecha/categoría/tipo
- Segmentación B2B y B2C
- Facetas para filtros
- Resumen por periodo (day/week/month)
- Top categorías
- Comparación de periodos
- Alertas por incremento de egresos

Endpoints y modelos definidos en [backend/app/routes.py](../backend/app/routes.py).

### Frontend

La app:

- Hace fetch de datos financieros desde /api/metrics
- Calcula KPIs y agregaciones mensuales
- Renderiza estado loading, error y dashboard principal

Evidencia en:

- [frontend/src/App.tsx](../frontend/src/App.tsx)
- [frontend/src/lib/financial-utils.ts](../frontend/src/lib/financial-utils.ts)

## Flujo de uso actual

1. Levantar stack con Docker Compose (ver [README.md](../README.md)).
2. Abrir frontend en http://localhost:5173.
3. Frontend consulta /api/metrics (proxy de Vite o base URL configurada).
4. Usuario visualiza KPIs y gráficos mensuales.

## Supuestos operativos del repositorio

- La fuente de datos actual es mock y determinística (seed fija) en backend.
- El proyecto está preparado para iteraciones de producto y hardening técnico.
- Existe cobertura de pruebas en backend y utilidades de frontend como base de regresión.
