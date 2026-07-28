# Resumen del proyecto

Este proyecto es un dashboard financiero full-stack para visualizar métricas de ingresos, egresos y rentabilidad.
Está pensado como base de trabajo para seguir agregando funcionalidades de análisis y mejoras de producto.

## Qué hace hoy

- Expone una API en FastAPI con datos financieros simulados (mock).
- Permite filtros por fecha, categoría, tipo de operación y segmento (B2B/B2C).
- Consume la API desde un frontend en React + TypeScript.
- Calcula KPIs y series mensuales en el frontend.
- Muestra tarjetas KPI y gráficos de evolución.

## Arquitectura

- Backend: `backend/app/main.py`, `backend/app/routes.py`
- Frontend: `frontend/src/App.tsx`
- Tipos y utilidades financieras: `frontend/src/lib/financial-types.ts`, `frontend/src/lib/financial-utils.ts`
- Tests backend: `backend/tests/test_routes.py`
- Tests frontend: `frontend/src/lib/financial-utils.test.ts`

## Endpoints principales del backend

Definidos en `backend/app/routes.py`:

- `GET /health`
- `GET /api/metrics`
- `GET /api/metrics/b2b`
- `GET /api/metrics/b2c`
- `GET /api/metrics/facets`
- `GET /api/metrics/summary`
- `GET /api/metrics/categories/top`
- `GET /api/metrics/comparison`
- `GET /api/metrics/alerts`

## Flujo actual del frontend

En `frontend/src/App.tsx`:

1. Hace `fetch` a `GET /api/metrics`.
2. Calcula:
   - total de ingresos
   - total de egresos
   - profit
   - profit margin %
   - serie mensual para gráficos
3. Renderiza:
   - encabezado del dashboard
   - fila de KPIs
   - gráfico de ingresos vs egresos
   - gráfico de margen de ganancia

## Stack técnico

- Backend: FastAPI + Pydantic + Pytest
- Frontend: React 19 + TypeScript + Vite + Recharts + Tailwind
- Infra local: Docker Compose

## Estado funcional actual (clave para continuar)

- El backend ya incluye funcionalidades analíticas avanzadas (facetas, resumen agrupado, top categorías, comparación de periodos y alertas).
- El frontend actual todavía consume solo `GET /api/metrics`.
- Esto significa que ya existe capacidad en la API para construir más vistas y filtros en la interfaz sin reescribir la base.

## Cómo ejecutar el proyecto

Desde la raíz:

```bash
docker compose up --build
```

Servicios esperados:

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Swagger/OpenAPI: http://localhost:8000/docs
