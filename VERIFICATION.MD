# Verification Notes

This file records relevant claims made during the repository handover and how they were verified against the codebase.

## 1. Project execution

### Agent/repository claim

The project can be started using Docker Compose.

### Verification

✅ Verified.

Evidence:

- `docker-compose.yml` defines two services: `frontend` and `backend`.
- `README.es.md` documents the command:

```bash
docker compose up --build

# Verification Notes

This file records how the repository handover was verified against the actual codebase.

## 1. Project services

### Initial understanding

The repository appeared to contain a frontend and backend, but this needed verification.

### Evidence checked

- `docker-compose.yml`
- `frontend/Dockerfile`
- `backend/Dockerfile`

### Result

✅ Verified.

The repository defines two services:

- `frontend`
- `backend`

No additional database, cache, broker, or external service is defined in Docker Compose.

---

## 2. Frontend and backend communication

### Initial understanding

The frontend was believed to communicate with the backend through `/api`, but the exact endpoint and proxy behavior had not been verified.

### Evidence checked

- `frontend/src/App.tsx`
- `frontend/vite.config.ts`
- `backend/app/main.py`
- `backend/app/routes.py`

### Result

✅ Verified.

The frontend requests:

```text
/api/metrics


La conclusión general del agent queda bastante sólida: **React/Vite en frontend, FastAPI en backend, comunicación HTTP mediante `/api/metrics`, y datos financieros mock generados en memoria, sin persistencia ni servicios externos evidenciados en el repositorio actual**. :contentReference[oaicite:4]{index=4}


## Phase 2 – Existing Conventions and Agent Rules

### Finding 1: Frontend structure

**Agent claim**

Dashboard-specific components and reusable UI components are separated in the frontend.

**Verification**

✅ Verified.

**Evidence**

- `frontend/src/components/dashboard/`
- `frontend/src/components/ui/`

**Conclusion**

Future agents should preserve this separation instead of placing dashboard-specific logic inside shared UI components.

---

### Finding 2: API communication

**Agent claim**

The frontend and backend communicate through the `/api/*` path and the current Vite proxy configuration.

**Verification**

✅ Verified.

**Evidence**

- `frontend/src/App.tsx`
- `frontend/vite.config.ts`
- `backend/app/routes.py`

**Risk identified**

Changing an endpoint, response field, or proxy configuration on only one side could break frontend data loading.

**Conclusion**

The API contract should be changed across all affected frontend and backend consumers.

---

### Finding 3: Financial data contract

**Agent claim**

Backend financial models, frontend types, and transformation utilities depend on consistent field names.

**Verification**

✅ Verified.

**Evidence**

- `backend/app/routes.py`
- `frontend/src/lib/financial-utils.ts`
- frontend financial type definitions

**Risk identified**

Renaming fields such as domain-specific financial properties without updating consumers could break KPI calculations or chart rendering.

---

### Finding 4: Testing conventions

**Agent claim**

The frontend uses Vitest-style tests and the backend uses pytest with FastAPI `TestClient`.

**Verification**

✅ Verified.

**Evidence**

- Frontend test files using `describe`, `it`, and `expect`
- `backend/tests/test_routes.py`
- `backend/tests/conftest.py`

**Conclusion**

New tests should follow the existing test setup rather than introducing a different testing pattern without a repository-level reason.

---

### Finding 5: Runtime architecture

**Agent claim**

The current application does not depend on a database or external service for its financial data.

**Verification**

✅ Verified.

**Evidence**

- `backend/app/routes.py`
- `docker-compose.yml`
- `backend/requirements.txt`

**Correction**

❌ A future agent must not assume persistent storage exists.

✅ The current implementation uses financial data generated in code.

---

## Phase 2 Result

The proposed rules for `.agents/rules/` are based on verified repository conventions and identified risks rather than generic coding preferences.