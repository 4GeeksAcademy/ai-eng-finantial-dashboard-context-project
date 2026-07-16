# System Patterns

## 1. Monorepo Split by Service Boundary
The repository uses a clear boundary between backend and frontend, with each service owning its own manifest files, Dockerfile, and test setup.

Pattern impact:
- Improves onboarding clarity.
- Keeps service-specific dependencies isolated.

## 2. API-First Backend with Typed Contracts
Endpoints are implemented with FastAPI and response_model declarations backed by Pydantic models.

Pattern impact:
- Contract shape is explicit and self-documented.
- API docs are generated automatically via FastAPI.

## 3. Deterministic Synthetic Data Generation
Financial movement generation supports deterministic output through seeded randomness (seed=42) used across endpoints.

Pattern impact:
- Stable behavior in development and tests.
- Easier reproducibility while iterating UI and API features.

## 4. Thin Frontend Orchestration + Pure Computation Utilities
Frontend App component orchestrates fetch/state/render, while financial computations are in standalone utility functions.

Pattern impact:
- Better separation of concerns.
- Pure functions are straightforward to unit test.

## 5. Componentized Dashboard Presentation
Dashboard is split into focused components (header, KPI row/cards, chart cards, shared UI primitives).

Pattern impact:
- Promotes reusability and incremental UI changes.
- Keeps App-level component from becoming overly presentational.

## 6. Current Structural Constraint: Backend Module Monolith
Route handlers, data models, data generation, filtering, aggregation, and analytics logic are concentrated in one backend module.

Pattern impact:
- Faster to bootstrap initially.
- Increases coupling and maintenance overhead as feature set grows.
- Suggests future refactor into modules such as domain models, services, and routers.

## 7. Testing Pattern: Backend Endpoint Coverage + Frontend Utility Coverage
Backend includes API-level tests for endpoint behavior and filters. Frontend tests currently emphasize pure utility logic.

Pattern impact:
- Good confidence in backend API basics and transform functions.
- Gaps remain in frontend component and integration-level verification.

---
Evidence sources:
- /workspaces/ai-en2-Ven-financial-dashboard-context-project/backend/app/routes.py
- /workspaces/ai-en2-Ven-financial-dashboard-context-project/backend/tests/test_routes.py
- /workspaces/ai-en2-Ven-financial-dashboard-context-project/frontend/src/App.tsx
- /workspaces/ai-en2-Ven-financial-dashboard-context-project/frontend/src/lib/financial-utils.ts
- /workspaces/ai-en2-Ven-financial-dashboard-context-project/frontend/src/components/dashboard/kpi-row.tsx
