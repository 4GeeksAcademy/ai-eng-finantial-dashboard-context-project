# Tech Stack

## Runtime and Infrastructure
- Container orchestration: Docker Compose (frontend + backend services).
- Frontend runtime port: 5173.
- Backend runtime port: 8000.
- Backend debug port: 5678.

## Backend Stack
- Language: Python.
- API framework: FastAPI.
- Validation/models: Pydantic.
- ASGI server: Uvicorn.
- Debugging support: debugpy.
- Testing: pytest, pytest-cov, httpx (for API test client scenarios).

## Frontend Stack
- Language: TypeScript.
- UI library: React 19.
- Build/dev server: Vite 8.
- Charting: Recharts.
- Utility libraries: clsx, class-variance-authority, tailwind-merge.
- Icons: lucide-react.

## Styling and Frontend Tooling
- Tailwind CSS v4 toolchain via @tailwindcss/vite.
- PostCSS and Autoprefixer.
- ESLint 9 flat config with:
  - @eslint/js
  - typescript-eslint
  - eslint-plugin-react-hooks
  - eslint-plugin-react-refresh

## Type Checking and Quality
- TypeScript strictness-related options include:
  - noUnusedLocals
  - noUnusedParameters
  - noFallthroughCasesInSwitch
- Scripted tasks:
  - dev
  - build
  - lint
  - test
  - test:watch
  - test:coverage

## Local Integration Pattern
- Vite dev server proxies /api requests to backend service at http://backend:8000 in containerized development.
- Optional VITE_API_BASE_URL allows overriding backend origin.

---
Evidence sources:
- /workspaces/ai-en2-Ven-financial-dashboard-context-project/docker-compose.yml
- /workspaces/ai-en2-Ven-financial-dashboard-context-project/backend/requirements.txt
- /workspaces/ai-en2-Ven-financial-dashboard-context-project/frontend/package.json
- /workspaces/ai-en2-Ven-financial-dashboard-context-project/frontend/vite.config.ts
- /workspaces/ai-en2-Ven-financial-dashboard-context-project/frontend/tsconfig.app.json
- /workspaces/ai-en2-Ven-financial-dashboard-context-project/frontend/eslint.config.js
