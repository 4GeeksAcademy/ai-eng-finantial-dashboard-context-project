# Tech Stack

## Frontend

- Framework: React 19 with TypeScript, configured as a Vite app.
- Entry points: [frontend/src/main.tsx](../frontend/src/main.tsx) and [frontend/src/App.tsx](../frontend/src/App.tsx).
- UI and visualization: Recharts for charts, Lucide React for icons.
- Styling/tooling: Tailwind CSS via `@tailwindcss/vite`, utility helpers from `clsx`, `class-variance-authority` and `tailwind-merge`.
- Testing: Vitest.
- Lint/build scripts: defined in [frontend/package.json](../frontend/package.json).

### Key frontend dependencies

- `react`
- `react-dom`
- `vite`
- `typescript`
- `recharts`
- `lucide-react`
- `vitest`
- `eslint`

## Backend

- Framework: FastAPI.
- Server/runtime: `uvicorn[standard]`.
- Debugging: `debugpy` is included in backend requirements.
- Testing: `pytest`, `pytest-cov`, `httpx`.
- API contracts: Pydantic response models and `Literal`-based enums in [backend/app/routes.py](../backend/app/routes.py).

### Key backend dependencies

- `fastapi`
- `uvicorn[standard]`
- `debugpy`
- `pytest`
- `pytest-cov`
- `httpx`

## Infrastructure and local development

- Container orchestration: Docker Compose in [docker-compose.yml](../docker-compose.yml).
- Frontend container: [frontend/Dockerfile](../frontend/Dockerfile).
- Backend container: [backend/Dockerfile](../backend/Dockerfile).
- Local URLs:
  - Frontend on port `5173`
  - Backend on port `8000`
  - Backend debug port `5678`

## Tooling conventions already observed

- Frontend uses the Vite proxy for `/api` in [frontend/vite.config.ts](../frontend/vite.config.ts).
- TypeScript config for the app lives in [frontend/tsconfig.app.json](../frontend/tsconfig.app.json).
- Backend tests now use `httpx.AsyncClient` with `ASGITransport` in [backend/tests/test_routes.py](../backend/tests/test_routes.py).

## Operational notes

- Local editor health can diverge from container runtime if frontend dependencies are missing or `node_modules` permissions are wrong.
- The repository already has rule files under [../.agents/rules](../.agents/rules) to guide future changes.