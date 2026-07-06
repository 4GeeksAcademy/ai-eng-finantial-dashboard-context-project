# Overview del producto

## Resumen

Proyecto full stack de dashboard financiero con frontend React + TypeScript y backend FastAPI. El objetivo observable es visualizar metricas financieras (KPIs y series mensuales) a partir de datos mock servidos por API.

## Alcance funcional verificable

- Visualizacion de KPIs: ingreso total, egreso total, ganancia y margen.
- Visualizacion de graficas de evolucion mensual de ingresos/egresos y porcentaje de ganancia.
- Carga inicial de datos desde API con estado de loading y manejo de error.
- API con endpoints de metricas, facets, summary, top categorias, comparacion, alertas, y vistas por B2B/B2C.

## Arquitectura verificable

- Arquitectura separada en dos aplicaciones: frontend y backend.
- El frontend consume /api/metrics y transforma datos para vista.
- En desarrollo local, Vite proxya /api hacia backend en red de Docker.

## Flujo de datos de alto nivel

1. Frontend inicia y solicita datos a /api/metrics.
2. Backend genera movimientos mock deterministas con seed fija.
3. Frontend calcula KPIs y agregacion mensual.
4. Frontend renderiza tarjetas y graficas.

## Evidencia principal

- [README.md](../README.md)
- [frontend/src/App.tsx](../frontend/src/App.tsx)
- [frontend/src/lib/financial-utils.ts](../frontend/src/lib/financial-utils.ts)
- [backend/app/routes.py](../backend/app/routes.py)
- [frontend/vite.config.ts](../frontend/vite.config.ts)

## Limites de verificacion

No hay evidencia directa en el repo de autenticacion, base de datos persistente, ni despliegue productivo con CI/CD.
