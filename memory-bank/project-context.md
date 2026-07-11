# Project Context

## Stack
- Backend: FastAPI + Pydantic + Pytest
- Frontend: React + TypeScript + Vite + Vitest + ESLint

## Important paths
- Backend app: `backend/app/main.py`, `backend/app/routes.py`
- Backend tests: `backend/tests`
- Frontend utils: `frontend/src/lib/financial-utils.ts`
- Frontend dashboard UI: `frontend/src/components/dashboard`

## Domain model
`FinancialMovement` fields used across backend and frontend:
- `create_date`
- `amount`
- `operation_type` (`income` | `outcome`)
- `category` (`suppliers` | `sales` | `operational` | `administrative` | `others`)
- `business_type` (`B2B` | `B2C`)

## Key API endpoints
- `/health`
- `/api/metrics`
- `/api/metrics/facets`
- `/api/metrics/summary`
- `/api/metrics/categories/top`
- `/api/metrics/comparison`
- `/api/metrics/alerts`
- `/api/metrics/b2b`
- `/api/metrics/b2c`

## Latest verification snapshot
- Automated checks completed:
  - `cd backend && pytest -q` -> 15 passed.
  - `cd frontend && npm test` -> 5 passed.
  - `cd frontend && npm run lint` -> passing.
- Functional validation focus to keep iterating:
  - Confirm KPI values rendered by the dashboard header and KPI cards match the `/api/metrics` payload.
  - Confirm timeline charts preserve chronological month ordering.
  - Confirm advanced analytics endpoints remain available and consistent while not yet integrated in main UI flow.

## Functional verification log (2026-07-11)
- UI/API integration evidence:
  - Main fetch uses `/api/metrics` in `frontend/src/App.tsx`.
  - Dashboard composes `DashboardHeader`, `KPIRow`, `IncomeOutcomeChart`, and `ProfitPercentChart` in `frontend/src/App.tsx`.
- Frontend runtime readiness:
  - `cd frontend && npm run build` -> build successful.
  - Note: build reports a chunk-size warning (>500kB), not a blocking failure.
- API smoke checks (FastAPI TestClient):
  - Verified `GET /health`, `GET /api/metrics`, `GET /api/metrics/facets`, `GET /api/metrics/summary`, `GET /api/metrics/categories/top`, `GET /api/metrics/comparison`, `GET /api/metrics/alerts`, `GET /api/metrics/b2b`, and `GET /api/metrics/b2c`.
  - Result: 9/9 checks passed using response contracts defined in backend models.
- Observed product gap:
  - Header period in `frontend/src/App.tsx` is currently hardcoded as `2024 - Full Year`; backend data year is dynamic.
