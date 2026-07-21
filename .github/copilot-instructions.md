# Copilot Instructions for This Repository

## Project Overview
- This is a full-stack financial dashboard with:
  - Backend: FastAPI + Pydantic in `backend/`
  - Frontend: React + TypeScript + Vite in `frontend/`
- Keep changes scoped to the relevant service unless a cross-service change is explicitly needed.

## Architectural Expectations
- Keep API contracts explicit and typed.
- Preserve business calculations in pure reusable functions, not inside UI rendering.
- Keep deterministic behavior for synthetic/mock data used by tests.
- Avoid expanding monolithic backend files; prefer modular separation for new features.

## Backend Guidelines
- Define or update request/response schemas when endpoint behavior changes.
- Use `response_model` and input validation for query/path parameters.
- Keep routing, domain logic, and data generation separated when adding new functionality.
- Do not introduce permissive production CORS defaults; use explicit allow-lists.

## Frontend Guidelines
- Keep heavy financial logic in `frontend/src/lib/` utilities.
- Keep dashboard components presentational and focused.
- Preserve strict TypeScript typing and avoid `any` unless strongly justified.
- Follow existing UI component patterns under `frontend/src/components/`.

## Testing Expectations
- Backend changes should include or update pytest coverage in `backend/tests/`.
- Frontend behavior changes (loading/error/render states) should include component/integration tests.
- Utility changes should include or update unit tests in `frontend/src/lib/`.

## Code Quality
- Prefer small, targeted changes over broad refactors unless requested.
- Preserve existing naming, file organization, and style conventions.
- Avoid adding new dependencies unless needed and justified.
- Ensure lint/type checks pass for touched code.

## Common Commands
- Backend tests: `cd backend && pytest -q`
- Frontend checks: `cd frontend && npm run lint && npm run test`
- Frontend build: `cd frontend && npm run build`

## External Standards & Agent Skills
Always adhere to the specific rules defined by the following Agent Skills standards:

1. **Vercel React Best Practices** (`vercel-react-best-practices`):
   - Prioritize server-side optimization and enforce strict React Server Component (RSC) vs. Client Component boundaries.
   - Actively eliminate data-fetching waterfalls, minimize heavy client-side imports, and prevent unnecessary component re-renders.
   - Follow Vercel Engineering performance guidelines for bundle size reduction and Core Web Vitals optimization.

2. **Accessibility Guidelines** (`accessibility`):
   - Enforce semantic HTML over generic containers (e.g., `<main>`, `<nav>`, `<article>`).
   - Ensure complete keyboard navigability for all interactive elements and focus state visibility.
   - Properly implement WAI-ARIA roles, states, and properties (`aria-expanded`, `aria-live`, etc.) where native elements fall short.
