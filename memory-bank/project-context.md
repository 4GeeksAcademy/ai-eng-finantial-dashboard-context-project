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
