# Pure Business Logic

## Purpose
Keep business logic testable and reusable by separating it from the HTTP layer (FastAPI route handlers).

## Scope
Applies to any new function in `backend/app/` that computes, filters, aggregates, or transforms data.

## Rule
- Business logic (calculations, filtering, aggregation) MUST live in standalone functions that take plain data in and return plain data out — no dependency on `Request`, `Query`, or FastAPI internals.
- Route handlers (`@router.get(...)`) should only: parse query params, call the business logic function(s), and return the result.

## Good example (already in the repo)
`backend/app/routes.py` — `filter_movements`, `summarize_movements`, `build_top_categories`, `calculate_net_value`, and `detect_outcome_alerts` are all pure functions that take `movements: list[FinancialMovement]` and return typed results. The route handler `get_metrics_summary` just orchestrates: generate movements → filter → summarize → return.

## Why this matters
Pure functions can be unit-tested directly (see `backend/app/tests/test_routes.py`) without spinning up a test client or mocking HTTP internals.

## Validation task
Applied when reviewing the `/api/metrics/facets` logic: confirmed `build_metrics_facets` follows the same pattern (pure function, no FastAPI dependency) — rule holds without modification.