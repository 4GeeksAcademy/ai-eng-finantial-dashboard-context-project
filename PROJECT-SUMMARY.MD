# Financial Dashboard - Project Summary

## Overview

This repository is a financial metrics dashboard composed of a React + TypeScript frontend and a FastAPI backend.

The application renders KPI cards and financial charts, and the backend exposes mocked financial data over HTTP endpoints. This project state is based on repository evidence only and does not claim any database or external service that is not present in the codebase.

## Verified architecture

The project is divided into two main services defined in [docker-compose.yml](docker-compose.yml):

- `frontend`: Vite/React app on port 5173
- `backend`: FastAPI app on port 8000, with debugpy exposed on port 5678

## Verified stack

### Frontend
- TypeScript
- React
- Vite
- Tailwind-based UI patterns

Evidence:
- [frontend/package.json](frontend/package.json)
- [frontend/vite.config.ts](frontend/vite.config.ts)
- [frontend/src/App.tsx](frontend/src/App.tsx)

### Backend
- Python
- FastAPI
- Uvicorn
- debugpy
- pytest

Evidence:
- [backend/Dockerfile](backend/Dockerfile)
- [backend/requirements.txt](backend/requirements.txt)
- [backend/app/main.py](backend/app/main.py)
- [backend/tests/test_routes.py](backend/tests/test_routes.py)

## Verified flow

```text
User
  │
  ▼
Frontend (React + Vite)
  │
  │ fetches /api/metrics
  ▼
Backend (FastAPI)
  │
  │ generates mock financial movements in code
  ▼
JSON response with financial records
  │
  ▼
Frontend computes KPIs and monthly aggregates
  │
  ▼
Dashboard renders values and charts
```

## What was prepared for future coding agents

We verified and documented the repository-specific evidence needed to avoid unsupported assumptions:

- frontend structure and component layer separation: [frontend/src/App.tsx](frontend/src/App.tsx), [frontend/src/components](frontend/src/components), [frontend/src/lib](frontend/src/lib)
- API contract between frontend and backend: [frontend/src/App.tsx](frontend/src/App.tsx), [frontend/vite.config.ts](frontend/vite.config.ts), [backend/app/routes.py](backend/app/routes.py)
- financial data model and transformations: [backend/app/routes.py](backend/app/routes.py), [frontend/src/lib/financial-types.ts](frontend/src/lib/financial-types.ts), [frontend/src/lib/financial-utils.ts](frontend/src/lib/financial-utils.ts)
- testing conventions: [frontend/src/lib/financial-utils.test.ts](frontend/src/lib/financial-utils.test.ts), [backend/tests/test_routes.py](backend/tests/test_routes.py)
- architecture assumption boundaries: [backend/app/routes.py](backend/app/routes.py), [backend/requirements.txt](backend/requirements.txt), [docker-compose.yml](docker-compose.yml)

## Repository boundary

This project currently has evidence for:
- mock financial data generated in code
- a frontend dashboard
- a FastAPI backend
- local Docker Compose orchestration

This project does not currently present repository evidence for:
- a database
- an external service integration
- an implemented production deployment pipeline
- an inventoried roadmap beyond the code currently present

The repository status should therefore be treated as a verified mock-data dashboard implementation, not as a platform with hidden infrastructure assumptions.
