# Good and Bad Practices Analysis

*Findings are based on direct code inspection, not generic statements. Each connects to a rule proposal implemented in `.agents/rules/`.*

## Good practices (5)

### Architecture
**1. Clear separation of concerns in the backend**
`backend/app/routes.py` keeps business logic (`filter_movements`, `summarize_movements`, `build_top_categories`, `calculate_net_value`, `detect_outcome_alerts`) in pure functions, separate from FastAPI route handlers — making them independently unit-testable.
→ Rule: `.agents/rules/pure-business-logic.md`

**2. Strong typing end-to-end with Pydantic**
Every endpoint declares an explicit `response_model`; fixed-value fields use `Literal` (`OperationType`, `Category`, `BusinessType`) instead of generic `str`.
→ Rule: `.agents/rules/strict-typing.md`

### Configuration / Tooling
**3. Thorough, well-segmented `.gitignore`**
Correctly covers Node/frontend, Python/backend, editors, secrets (`.env`), and Docker. Confirmed `__pycache__` never reached the repo (`git status --ignored`).

### Testing
**4. Testing culture present in both layers**
Backend has `pytest` + `httpx` tests; frontend has a real Vitest test (`financial-utils.test.ts`) covering aggregation logic — not just unused test infrastructure.

### Infrastructure / Onboarding
**5. Reproducible environment via Docker Compose**
One command (`docker compose up --build`) starts both services with the proxy pre-configured — low friction for anyone cloning the repo.

---

## Bad practices / risks (5)

### Security
**1. Insecure CORS configuration**
`backend/app/main.py` combines `allow_origins=["*"]` with `allow_credentials=True` — an invalid/risky combination per the CORS spec.
→ Rule: `.agents/rules/cors-security.md`

**Related**: `npm audit` reports 5 vulnerabilities (4 high) in dev dependencies (`@babel/core`, `brace-expansion`, `js-yaml`, `postcss`, `vite`), all with an available fix via `npm audit fix`, not yet applied.

### Architecture / Performance
**2. Unnecessary data regeneration on every request**
`generate_mock_movements(seed=42)` runs from scratch on all 9 endpoints, using a *global* `random.seed()` instead of a local `random.Random(42)` instance — inefficient and potentially inconsistent under concurrent requests.

### Code hygiene
**3. Unremoved dead code**
`frontend/src/lib/mock-data.ts` (7KB, 58 records) is not imported anywhere in the project — confirmed via `grep -rn "mock-data" frontend/src/ --include="*.ts*"` (zero matches).
→ Rule: `.agents/rules/no-dead-code.md`

### UI/data consistency
**4. Label out of sync with real data**
`App.tsx` hardcodes `period="2024 - Full Year"`, but the backend generates data for the actual current year (`date.today()`) — a leftover from when the frontend used the static `mock-data.ts` (all dated 2024) instead of the live backend.
→ Rule: `.agents/rules/no-hardcoded-derived-text.md`

### Documentation / Agent context
**5. `AGENTS.md` points to folders that didn't exist yet**
The file references `.agents/rules`, `.agents/skills`, and `memory-bank/` as if they already existed, but none of the three were present in the repo before this handover work — which is exactly what Phases 3 and 4 of this project address.