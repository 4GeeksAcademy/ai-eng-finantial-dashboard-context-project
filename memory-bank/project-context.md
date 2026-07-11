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
