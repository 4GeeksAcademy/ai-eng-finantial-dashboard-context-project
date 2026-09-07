# Project memory bank

This memory bank captures only repository-grounded facts about the current state of the project.

## 1) Product overview verified

This repository is a financial metrics dashboard with a React + TypeScript frontend and a FastAPI backend.

Verified by:
- [README.md](../README.md): "Financial metrics dashboard with a React + TypeScript frontend and a FastAPI backend."
- [backend/app/main.py](../backend/app/main.py): creates a FastAPI app titled "Financial Metrics API"
- [frontend/src/App.tsx](../frontend/src/App.tsx): renders KPI cards and financial charts
- [frontend/src/lib/financial-utils.ts](../frontend/src/lib/financial-utils.ts): calculates income, outcome, profit, percentage, and monthly aggregates

The application displays financial KPIs and charts, and the backend serves generated mock financial data through HTTP endpoints.

## 2) Verified technology stack

### Frontend
- Language: TypeScript
- Framework: React
- Build/runtime tooling: Vite
- Styling/tooling: Tailwind via Vite plugin and React UI patterns

Verified by:
- [frontend/package.json](../frontend/package.json)
- [frontend/vite.config.ts](../frontend/vite.config.ts)
- [frontend/src/App.tsx](../frontend/src/App.tsx)

### Backend
- Language: Python
- Framework: FastAPI
- Runtime server: Uvicorn
- Debugging tooling: debugpy
- Testing: pytest

Verified by:
- [backend/Dockerfile](../backend/Dockerfile)
- [backend/requirements.txt](../backend/requirements.txt)
- [backend/app/main.py](../backend/app/main.py)
- [backend/tests/test_routes.py](../backend/tests/test_routes.py)

### Orchestration
- Docker Compose defines the application services in [docker-compose.yml](../docker-compose.yml)

## 3) Current state of the project

Current verified state:
- The repo is structured as a two-service app: frontend and backend.
- The backend exposes financial metrics routes.
- The frontend fetches those routes and renders dashboard charts.
- Financial data is generated in code as mock data, not read from a database.
- There is no verified database, ORM, or external service integration in the repository as inspected.

Verified by:
- [docker-compose.yml](../docker-compose.yml)
- [backend/app/routes.py](../backend/app/routes.py)
- [frontend/src/App.tsx](../frontend/src/App.tsx)
- [backend/requirements.txt](../backend/requirements.txt)

## 4) Rule for future agents

Reject unsupported product claims.

An agent must not claim any of the following unless they are explicitly present and verified in the repository:
- database persistence
- external APIs or integrations
- production deployment setup
- planned roadmap items not implemented in code
- claimed business workflows not represented in the current codebase

For anything not directly supported by the repository, the correct status is: "not evidenced in the current repository."

## 5) Evidence-based repository facts only

This memory bank intentionally excludes:
- invented roadmaps
- assumed future architecture
- generic product claims not directly supported by the codebase
- unverified deployment claims
- speculative service integrations

If a future change introduces a real database, external service, or new product requirement, that change must be evidenced in the repository before it is treated as established fact.
