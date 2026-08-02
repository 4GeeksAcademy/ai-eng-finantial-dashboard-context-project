# Project Summary — Financial Metrics Dashboard

*AI-generated summary, verified against the repository by a human reviewer. Corrections are noted inline.*

## What it does
Educational financial metrics dashboard (4Geeks Academy) — also designed as a practice exercise for AI-agent context generation (see `AGENTS.md`, which points to `.agents/` and `memory-bank/`).

Shows:
- 4 KPIs (total income, total outcome, profit, profit margin %)
- 2 charts (income vs. outcome by month, profit % by month)

Data is mock financial movements generated **in the backend** (no real database): 360 records (12 months × 30), fixed `seed=42`, categories (`sales`, `suppliers`, `operational`, `administrative`, `others`) and business type (`B2B`/`B2C`).

## Stack (verified against `package.json` and `requirements.txt`)
| Layer | Technologies |
|---|---|
| Frontend | React 19.2.4, TypeScript, Vite 8.0.4, Tailwind CSS 4.2.2, Recharts 3.8.1, shadcn/ui, Vitest 4.1.4 |
| Backend | FastAPI, Uvicorn, Pydantic, debugpy, pytest + httpx |
| Infra | Docker Compose (frontend :5173, backend :8000) |

## Backend endpoints (verified against `routes.py` — 9 total; frontend only consumes the first one)
`/health`, `/api/metrics`, `/api/metrics/facets`, `/api/metrics/summary`, `/api/metrics/categories/top`, `/api/metrics/comparison`, `/api/metrics/alerts`, `/api/metrics/b2b`, `/api/metrics/b2c`

*Correction: the initial AI-generated draft only listed 5 of these; `/health` and `/api/metrics/facets` were found by direct code inspection.*

## Data flow
`App.tsx` fetches `/api/metrics` → Vite proxy (`/api → backend:8000`) → FastAPI generates 360 mock movements (`seed=42`) → JSON response → frontend computes KPIs and monthly series client-side (`computeKPIs`, `computeMonthlyData`) → renders with Recharts. On failure, shows an error message; while loading, passes a `loading` prop down to child components.

## Technical debt identified (verified with concrete evidence — see `docs/good-bad-practices.md` for full analysis)
- Insecure CORS (`allow_origins=["*"]` + `allow_credentials=True`)
- Mock data regenerated from scratch on every request, using global `random.seed()`
- Dead code (`frontend/src/lib/mock-data.ts`) + a stale hardcoded label (`"2024 - Full Year"`) — both are remnants of an incomplete migration from static to dynamic data

## Correctly implemented
- Root `.gitignore` is thorough and well-segmented (Node, Python, editors, secrets, Docker)
- `__pycache__` is correctly excluded from version control (verified with `git status --ignored`)