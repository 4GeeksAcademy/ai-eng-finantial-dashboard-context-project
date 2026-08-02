# Current Status

## What's implemented
- Backend: 9 working endpoints (`/health`, `/api/metrics`, `/api/metrics/facets`, `/api/metrics/summary`, `/api/metrics/categories/top`, `/api/metrics/comparison`, `/api/metrics/alerts`, `/api/metrics/b2b`, `/api/metrics/b2c`), all backed by 360 mock movements (12 months × 30 records, fixed `seed=42`).
- Frontend: dashboard page ("Financial Overview") that fetches `/api/metrics`, computes 4 KPIs and monthly aggregates client-side, and renders them via `KPIRow` and two Recharts-based charts.
- Docker Compose setup that runs both services with one command (`docker compose up --build`).
- A root `.gitignore` covering Node, Python, editor files, secrets, and Docker artifacts.
- A basic test suite: backend has `pytest` tests in `backend/app/tests/`; frontend has one Vitest test (`financial-utils.test.ts`) covering aggregation logic.
- `.agents/rules/` (added as part of this handover) with 5 rules validated against real findings in this repo.
- `memory-bank/` (this folder) documenting product, stack, and status.

## Known limitations
- **Frontend only consumes 1 of 9 backend endpoints** (`/api/metrics`). The richer endpoints (`summary`, `categories/top`, `comparison`, `alerts`, `b2b`, `b2c`, `facets`) exist and work but have no UI yet.
- **No real database** — every request regenerates the same 360 mock movements from scratch, server-side, using a global `random.seed(42)` call. This is inefficient and not safe under concurrent requests (see `.agents/rules/`... this specific issue does not yet have a dedicated rule file — candidate for a future `deterministic-mock-data.md`).
- **CORS is misconfigured** (`allow_origins=["*"]` + `allow_credentials=True`) — flagged in `.agents/rules/cors-security.md`, not yet fixed in code.
- **Dead code**: `frontend/src/lib/mock-data.ts` (58 hardcoded 2024 records) is unused and should be removed — flagged in `.agents/rules/no-dead-code.md`.
- **Stale hardcoded label**: the dashboard header shows `"2024 - Full Year"` regardless of the actual (dynamic, current-year) data being displayed — flagged in `.agents/rules/no-hardcoded-derived-text.md`.
- **No component-level frontend tests** — only the aggregation utilities (`financial-utils.ts`) are covered.
- **5 npm audit vulnerabilities** (4 high) in dev dependencies (`@babel/core`, `brace-expansion`, `js-yaml`, `postcss`, `vite`) — all have an available fix via `npm audit fix`, not yet applied.
- **No authentication/authorization** on any endpoint — acceptable for this educational scope, but worth noting explicitly so it isn't mistaken for an oversight.

## Next priorities (suggested, not yet scheduled)
1. Fix the CORS configuration (quick, low-risk).
2. Remove `mock-data.ts` and fix the hardcoded `"2024 - Full Year"` label together, since they're the same root cause.
3. Run `npm audit fix` and re-verify the app still builds and tests pass.
4. Extend the UI to consume at least one more backend endpoint (e.g. `/api/metrics/summary` for a cleaner monthly breakdown, since the frontend currently recomputes this client-side from raw movements).
5. Cache or memoize `generate_mock_movements(seed=42)` so it isn't recomputed on every single request.