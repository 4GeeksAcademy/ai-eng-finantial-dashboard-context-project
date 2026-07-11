# Product Description and Current Status

## Product description
Financial Metrics Dashboard is a fullstack educational project used to visualize financial performance indicators from simulated movement data.

The frontend displays KPIs and charts for income, outcome, and profit trends. The backend provides financial movement records and additional analytics endpoints.

## Current status
- Data persistence: No database. Data is generated on demand using deterministic mock generation (`seed=42`).
- Frontend-backend integration: Main UI consumes `GET /api/metrics`.
- Advanced backend analytics endpoints exist (`summary`, `comparison`, `alerts`, `categories/top`) but are not yet consumed by the main frontend flow.
- Type contracts: Frontend TypeScript types and backend models are manually mirrored; there is no OpenAPI-based type generation yet.
- Testing and quality checks:
  - Frontend unit tests: passing.
  - Frontend lint: passing.
  - Backend tests: require Python dependencies installed in the active environment.
