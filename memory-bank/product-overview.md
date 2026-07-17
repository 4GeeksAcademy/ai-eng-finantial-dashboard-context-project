# Product Overview

## Product summary

This repository implements a financial metrics dashboard with a React + TypeScript frontend and a FastAPI backend. The frontend fetches financial movements from the backend and renders KPI cards plus time-series charts for income, outcome and profit margin.

## What the product does today

- Loads financial movement data from `/api/metrics` and derives KPI totals in the frontend.
- Shows dashboard cards for total income, total outcome, profit and profit margin.
- Renders monthly charts for income vs outcome and profit percentage.
- Exposes backend endpoints for health, raw metrics, facets, grouped summaries, top categories, period comparison, alerts and B2B/B2C filtered views.

## Primary user flow

1. The frontend boots from [frontend/src/App.tsx](../frontend/src/App.tsx).
2. It requests backend data from `/api/metrics` using the Vite proxy or `VITE_API_BASE_URL`.
3. It computes KPI metrics and monthly aggregates with [frontend/src/lib/financial-utils.ts](../frontend/src/lib/financial-utils.ts).
4. It renders the dashboard header, KPI row and charts.

## Backend behavior

- The API app is created in [backend/app/main.py](../backend/app/main.py).
- Business responses are exposed in [backend/app/routes.py](../backend/app/routes.py).
- Current data is generated as deterministic mock data with a fixed seed, but it still depends on the current date.

## Known product constraints

- There is no persistent database yet; data is generated on request.
- The backend root path `/` is not a product endpoint and returns 404; health is exposed at `/health`.
- The dashboard header currently shows a hardcoded period that can drift from the actual generated data period.
- The UI mixes English and Spanish text in visible user-facing areas.

## Verified local endpoints

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:8000/health`
- API docs: `http://localhost:8000/docs`

## Evidence sources

- [README.md](../README.md)
- [backend/app/main.py](../backend/app/main.py)
- [backend/app/routes.py](../backend/app/routes.py)
- [frontend/src/App.tsx](../frontend/src/App.tsx)
- [PHASE1_HANDOVER_EVIDENCE.md](../PHASE1_HANDOVER_EVIDENCE.md)