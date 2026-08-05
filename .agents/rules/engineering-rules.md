# Engineering Rules for This Repository

These rules apply to all future changes in this project. Every rule includes:

- Trigger: when the rule applies
- Required action: what must be done
- Verification: how to confirm it was done

## Rule 1: Use the Documented Local Runtime

- Trigger: Any task that needs local end-to-end validation.
- Required action: Run the stack with Docker Compose from repository root.
- Verification: `docker compose up --build` starts frontend and backend; frontend is available on port 5173 and backend on port 8000.

## Rule 2: Frontend Changes Must Pass Frontend Gates

- Trigger: Any change under `frontend/`.
- Required action: Run lint and tests before considering the task complete.
- Verification:
	- `cd frontend && npm run lint`
	- `cd frontend && npm run test`

## Rule 3: Backend Changes Must Pass Backend Tests

- Trigger: Any change under `backend/`.
- Required action: Run backend tests before considering the task complete.
- Verification: `cd backend && pytest`

## Rule 4: API Contract Changes Require Frontend Alignment

- Trigger: Any change to endpoint paths, request params, response fields, or response models in backend routes.
- Required action:
	- Update frontend data types and usage to match backend changes.
	- Update or add tests for changed behavior.
- Verification:
	- Frontend TypeScript builds successfully.
	- Relevant frontend and backend tests pass.

## Rule 5: Endpoint Work Requires Endpoint Tests

- Trigger: Adding or modifying any FastAPI endpoint.
- Required action:
	- Add or update route tests for success path and at least one filter/validation behavior.
	- Keep responses deterministic in tests.
- Verification: `cd backend && pytest` includes assertions covering the changed endpoint behavior.

## Rule 6: Preserve Deterministic Behavior in Test Scenarios

- Trigger: Changes involving mock financial data generation or calculations consumed by tests.
- Required action:
	- Use deterministic inputs (for example, seeded generation or fixed fixtures).
	- Avoid introducing flaky expectations based on non-deterministic ordering or randomness.
- Verification: Re-running test suites produces stable results.

## Rule 7: Keep Dev-Only Settings Explicitly Dev-Only

- Trigger: Changes touching CORS, debug ports, or debugger/runtime launch settings.
- Required action:
	- Ensure permissive settings are limited to development workflows.
	- Document any production-safe alternative if behavior could be reused outside local dev.
- Verification: Compose/dev files remain explicit about dev behavior; no unintended production assumptions are introduced.

## Rule 8: Do Not Introduce Silent Dependency Risk

- Trigger: Adding or updating frontend or backend dependencies.
- Required action:
	- Justify why the dependency is needed.
	- Run relevant tests after dependency changes.
	- Prefer predictable versioning practices when updating backend Python dependencies.
- Verification:
	- `frontend` lint/tests pass for frontend dependency changes.
	- `backend` tests pass for backend dependency changes.

## Rule 9: Definition of Done for Code Changes

- Trigger: Any pull request or completion of a coding task.
- Required action:
	- Confirm relevant tests pass.
	- Confirm relevant lint checks pass.
	- Update docs or rules when behavior/workflow changes.
- Verification: Task summary includes exact commands executed and outcomes.

## Rule 10: Rules Must Stay Concrete

- Trigger: Creating or editing rule files.
- Required action:
	- Avoid vague language such as "write clean code" without measurable checks.
	- Every rule must include trigger, required action, and verification.
- Verification: Rule reviewers can execute the verification steps without guessing.
