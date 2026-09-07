# Rule: Follow the repository’s existing testing conventions by stack

## Rule
When changing behavior related to the frontend or backend, add or update tests using the conventions already in use in each stack:

- frontend: Vitest with `describe`, `it`, and `expect` in [frontend/src/lib/financial-utils.test.ts](frontend/src/lib/financial-utils.test.ts)
- backend: pytest with `TestClient` in [backend/tests/test_routes.py](backend/tests/test_routes.py)

Do not replace one test style with a different framework without updating the repo conventions and verifying the intended toolchain.

## Repository evidence
- Frontend tests use Vitest in [frontend/src/lib/financial-utils.test.ts](frontend/src/lib/financial-utils.test.ts):
  - `describe("computeKPIs", ...)`
  - `it("calculates totals and profit values", ...)`
  - `expect(...)`
- Backend tests use pytest and FastAPI `TestClient` in [backend/tests/test_routes.py](backend/tests/test_routes.py):
  - `client = TestClient(app)`
  - assertions against HTTP status codes and JSON payloads
- The backend test import setup in [backend/tests/conftest.py](backend/tests/conftest.py) adds the project root to `sys.path`, which is part of the current testing pattern.

## Risk prevented
This prevents test files from using an inconsistent framework or import style, which could make the relevant validation path fail to run or hide regressions in the code that the existing project already verifies.
