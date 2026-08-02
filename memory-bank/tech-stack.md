# Tech Stack

## Frontend
| Item | Value |
|---|---|
| Framework | React 19.2.4 |
| Language | TypeScript |
| Build tool | Vite 8.0.4 |
| Styling | Tailwind CSS 4.2.2 |
| Charts | Recharts 3.8.1 |
| Icons | Lucide React |
| UI components | shadcn/ui style (components copied into `src/components/ui/`, not installed as a package) |
| Testing | Vitest 4.1.4 (only `src/lib/financial-utils.test.ts` exists; no component tests yet) |
| Linting | ESLint 9 + typescript-eslint |

## Backend
| Item | Value |
|---|---|
| Framework | FastAPI |
| Server | Uvicorn (with `--reload`, watches `/app` for changes) |
| Language | Python 3.13 |
| Validation | Pydantic (via FastAPI's `BaseModel`) |
| Debugging | debugpy |
| Testing | pytest + pytest-cov + httpx |

## Infrastructure / Execution model
- **Docker Compose** orchestrates two services: `frontend` (port 5173) and `backend` (port 8000).
- The frontend's Vite dev server proxies `/api/*` requests to `http://backend:8000` (see `vite.config.ts`) — so in development, the frontend never needs `VITE_API_BASE_URL` set explicitly; it falls back to relative paths.
- No database, no persistence layer, no auth layer — backend generates mock data in-memory per request (see `current-status.md`).
- `AGENTS.md` at the repo root instructs any AI agent working on this repo to check `.agents/rules`, `.agents/skills`, and `memory-bank/` before acting — this file (and its siblings) exist to satisfy that contract.

## Key dependencies worth knowing about
- `class-variance-authority`, `clsx`, `tailwind-merge` — standard shadcn/ui styling utilities.
- CORS is enabled on the backend but currently misconfigured (`allow_origins=["*"]` + `allow_credentials=True`) — see `.agents/rules/cors-security.md`.