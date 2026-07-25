# Product Context

## Purpose
This project is a financial metrics dashboard that combines a FastAPI backend with a React + TypeScript frontend. The backend provides synthetic but deterministic financial movement data and aggregated analytics endpoints. The frontend consumes those endpoints to display KPI cards and financial charts.

## Intended Outcome
The repository enables developers and students to:
- Run a full-stack dashboard quickly in local or Codespaces environments.
- Inspect API design, filtering capabilities, and derived metrics behavior.
- Practice engineering workflows involving AI agents, project rules, and repository memory-bank documentation.

## Core User Flow
1. User opens the frontend dashboard.
2. Frontend fetches financial movement data from /api/metrics.
3. Frontend computes KPI and monthly chart datasets.
4. UI renders KPI cards, income vs outcome chart, and profit percentage chart.

## Backend Functional Scope
- Health check endpoint.
- Raw metrics endpoint with date/category/operation filtering.
- Facets endpoint for filter dimensions and min/max dates.
- Summary endpoint with day/week/month grouping.
- Top categories endpoint with operation type and limit.
- Period comparison endpoint.
- Alerts endpoint for anomaly-like outcome increases.
- B2B and B2C scoped metrics endpoints.

## Frontend Functional Scope
- API data fetch with loading and error handling.
- KPI computation from raw movement records.
- Monthly aggregation for charting.
- Dashboard composition into reusable presentational components.

## Current Positioning
The project is suitable as an educational baseline and handover exercise, with enough structure to demonstrate architecture and testing practices, but not yet hardened for production operations.

---
Evidence sources:
- /workspaces/ai-en2-Ven-financial-dashboard-context-project/README.md
- /workspaces/ai-en2-Ven-financial-dashboard-context-project/frontend/src/App.tsx
- /workspaces/ai-en2-Ven-financial-dashboard-context-project/backend/app/routes.py
