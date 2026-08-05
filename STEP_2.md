# Phase 2 – Engineering Practices Analysis

## Good Engineering Practices

### 1. Strong domain typing and schema-driven API contracts

**Category:** API design and type safety

The backend models financial entities and API responses with explicit Pydantic models and constrained literal values. This reduces ambiguous payloads and helps enforce consistent API contracts.

**Evidence:** `backend/app/routes.py`

---

### 2. Request validation at the API boundary

**Category:** Validation

The API uses query parameter constraints for inputs such as limits and non-negative thresholds. Invalid values are rejected before reaching the business logic.

**Evidence:** `backend/app/routes.py`

---

### 3. Deterministic test data

**Category:** Testing and reproducibility

Mock financial movement generation accepts a seed, and the endpoints use a fixed seed. This makes local behavior and automated tests repeatable and reduces flaky results.

**Evidence:**
- `backend/app/routes.py`
- `backend/tests/test_routes.py`

---

### 4. Automated test coverage across frontend and backend

**Category:** Testing

The backend tests API routes and filtering behavior. The frontend tests KPI calculations, monthly aggregation, and formatting utilities.

**Evidence:**
- `backend/tests/test_routes.py`
- `frontend/src/lib/financial-utils.test.ts`

---

### 5. Separation of concerns and static checks

**Category:** Frontend maintainability and code quality

The frontend separates financial calculations from UI components, uses TypeScript types, and enables compiler and linting checks such as unused variable detection and fallthrough prevention.

**Evidence:**
- `frontend/src/lib/financial-utils.ts`
- `frontend/src/components/dashboard/kpi-row.tsx`
- `frontend/tsconfig.app.json`
- `frontend/eslint.config.js`

---

## Bad, Risky, or Improvable Practices

### 1. Overly permissive CORS configuration

**Category:** Security

The backend allows wildcard origins, methods, and headers while also enabling credentials. This is acceptable for local development but risky in shared or production environments.

**Evidence:** `backend/app/main.py`

**Recommended improvement:**

Restrict allowed origins to trusted frontend addresses using environment variables. Allow only required methods and headers, and disable credentials unless they are necessary.

---

### 2. Unpinned Python dependencies

**Category:** Dependency management and reproducibility

Python dependency versions are not pinned. Future package updates could cause builds or tests to behave differently.

**Evidence:** `backend/requirements.txt`

**Recommended improvement:**

Pin dependency versions or use a dependency lock file. Update dependencies through a controlled process that includes automated testing.

---

### 3. Development debugging enabled in the default container setup

**Category:** Runtime and production safety

The backend container runs with `debugpy` and automatic reload, while Docker Compose exposes the debugger port. This is useful in development but unsafe if the same configuration is used in staging or production.

**Evidence:**
- `backend/Dockerfile`
- `docker-compose.yml`

**Recommended improvement:**

Separate development and production configurations. Enable debugging and reload only in development, and do not expose debugging ports in production.

---

### 4. Missing date-range business validation

**Category:** Input validation

The comparison endpoint requires start and end dates but does not verify that the start date occurs before or on the end date. Invalid ranges may produce misleading results.

**Evidence:** `backend/app/routes.py`

**Recommended improvement:**

Add validation that rejects requests where `start_date` is after `end_date`, using an appropriate validation error response.

---

### 5. Global random-state mutation

**Category:** Reliability and concurrency safety

The mock-data generator reseeds Python’s global random state. This can introduce hidden coupling between tests, requests, or other code using randomness.

**Evidence:** `backend/app/routes.py`

**Recommended improvement:**

Create a local `random.Random(seed)` instance and use it inside the generation functions instead of modifying the global random state.

---

## Repository Rules Derived from the Analysis

Based on these findings, the repository should follow these rules:

1. API inputs and outputs must use explicit validated schemas.
2. New business logic must include automated tests.
3. Frontend calculations should remain separated from presentation components.
4. Production configurations must not enable debug mode, auto-reload, or exposed debugger ports.
5. CORS settings must use explicit trusted origins outside local development.
6. Dependencies should be pinned or locked for reproducible builds.
7. Date-range endpoints must validate chronological order.
8. Random test-data generation must use isolated random-number generators.