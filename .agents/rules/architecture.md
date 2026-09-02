# Architecture rules

## R1 — Keep business logic out of route handlers (backend)

New business rules must live as pure, importable functions in `backend/app/routes.py`
(following `filter_movements`, `summarize_movements`, `build_top_categories`), never
inline inside a `@router.get` handler.

**Fact:** `backend/tests/test_routes.py:6` imports `filter_movements_by_date` and
`generate_mock_movements` directly from `app.routes`, not only via HTTP calls through
the test client.

## R2 — Don't mutate shared global state inside a per-request function

`generate_mock_movements()` must not keep calling `random.seed(seed)` against the
global `random` module on every invocation. Use an isolated `random.Random(seed)`
instance instead.

**Fact:** `backend/app/routes.py:95-96` calls `random.seed(seed)` on the global
module, and this function is invoked on every one of the 8 endpoints in
`routes.py` (lines 255, 264, 277, 295, 311, 350, 369, 385).

## R3 — Keep business calculations out of React components (frontend)

Any computation (KPIs, aggregations) belongs in `frontend/src/lib/financial-utils.ts`
as a pure function, not inside a `.tsx` component.

**Fact:** `computeKPIs`/`computeMonthlyData` in `frontend/src/lib/financial-utils.ts`
import no React and are unit-tested without rendering anything, in
`frontend/src/lib/financial-utils.test.ts`.

## R4 — Declare backend configuration explicitly, don't hardcode it

Values like the mock-data `seed`, categories, or business-type probabilities should
not stay hardcoded in `routes.py`.

**Fact:** `frontend/.env.example` exists for `VITE_API_BASE_URL`, but there is no
equivalent env/config file for the backend — `seed=42` is repeated as a literal in
all 8 route handlers in `backend/app/routes.py`.
