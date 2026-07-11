# Fullstack Workflow Rules

## Scope
Apply these rules to every task in this repository unless a task explicitly says otherwise.

## Core behavior
1. Start each task by inspecting both sides of the app:
- Backend in `backend/app`
- Frontend in `frontend/src`
2. Prefer minimal, targeted edits and preserve existing API shapes and component props.
3. Keep generated mock financial data deterministic when tests depend on it (`seed=42`).
4. Preserve chronological ordering guarantees for movements and summaries.

## Backend conventions
1. Keep endpoints in `backend/app/routes.py` typed with Pydantic response models.
2. When adding filters, apply them through `filter_movements` or `filter_movements_by_date` to avoid divergent logic.
3. Keep endpoint responses stable for existing tests under `backend/tests`.

## Frontend conventions
1. Keep domain types in `frontend/src/lib/financial-types.ts` as single source of truth.
2. Put financial computation logic in `frontend/src/lib/financial-utils.ts` and cover changes with Vitest.
3. Keep dashboard components in `frontend/src/components/dashboard` focused on presentation, not data contracts.

## Validation before finishing
Run only what is needed for touched areas:
- Backend tests: `cd backend && pytest -q`
- Frontend tests: `cd frontend && npm test`
- Frontend lint: `cd frontend && npm run lint`

If you cannot run checks, explicitly report what was skipped and why.
