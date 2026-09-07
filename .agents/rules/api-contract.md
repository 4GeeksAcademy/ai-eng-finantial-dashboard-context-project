# Rule: Keep the frontend and backend API contract aligned

## Rule
When changing an API path, response field, query parameter, or local proxy configuration, update both sides together:

- frontend fetch calls in [frontend/src/App.tsx](frontend/src/App.tsx)
- Vite proxy configuration in [frontend/vite.config.ts](frontend/vite.config.ts)
- backend route definitions in [backend/app/routes.py](backend/app/routes.py)

Do not change a backend route or field name without checking the corresponding frontend usage and the proxy target.

## Repository evidence
- The frontend fetches financial data from `/api/metrics` in [frontend/src/App.tsx](frontend/src/App.tsx).
- The Vite dev server proxies `/api` to `http://backend:8000` in [frontend/vite.config.ts](frontend/vite.config.ts).
- The backend exposes the matching routes in [backend/app/routes.py](backend/app/routes.py), including:
  - `/health`
  - `/api/metrics`
  - `/api/metrics/facets`
  - `/api/metrics/summary`
  - `/api/metrics/categories/top`
  - `/api/metrics/comparison`
  - `/api/metrics/alerts`
  - `/api/metrics/b2b`
  - `/api/metrics/b2c`
- CORS is enabled in [backend/app/main.py](backend/app/main.py), confirming the browser API is expected to run from the frontend.

## Risk prevented
This prevents a mismatch between the frontend fetch contract and the FastAPI route contract, which would cause silent rendering failures, missing data, or broken local development proxy behavior.
