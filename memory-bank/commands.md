# Commands

## Local run
- `docker compose up --build`

## Backend
- Install deps: `cd backend && pip install -r requirements.txt`
- Run API: `cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
- Tests: `cd backend && pytest -q`

## Frontend
- Install deps: `cd frontend && npm install`
- Dev server: `cd frontend && npm run dev -- --host 0.0.0.0 --port 5173`
- Lint: `cd frontend && npm run lint`
- Unit tests: `cd frontend && npm test`
- Coverage: `cd frontend && npm run test:coverage`
