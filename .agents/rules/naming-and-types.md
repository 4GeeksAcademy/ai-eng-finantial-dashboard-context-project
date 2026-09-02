# Naming & typing rules

## R5 — Register new categories/operation types in the backend `Literal`s first

Don't introduce new category/operation-type strings directly in an endpoint or in
the frontend without first registering them in `backend/app/routes.py`.

**Fact:** `Category`, `OperationType`, `BusinessType`, and `GroupBy` are defined as
`Literal[...]` in `backend/app/routes.py:11-15`, and FastAPI validates query params
against them automatically (422 on mismatch).

## R6 — Use the `@/` alias for internal frontend imports

Prefer the alias over relative paths (`../../lib/...`) when one is available.

**Fact:** the `@` → `./src` alias is declared both in `frontend/vite.config.ts:18-22`
and in `frontend/tsconfig.app.json`, and is already used in `frontend/src/App.tsx`
and `frontend/src/components/dashboard/kpi-row.tsx`.
