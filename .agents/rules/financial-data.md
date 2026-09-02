# Rule: Keep financial data models and transformations consistent across backend and frontend

## Rule
When changing the financial domain model, update all of the following together:

- backend Pydantic models in [backend/app/routes.py](backend/app/routes.py)
- frontend TypeScript interfaces in [frontend/src/lib/financial-types.ts](frontend/src/lib/financial-types.ts)
- frontend transformation functions in [frontend/src/lib/financial-utils.ts](frontend/src/lib/financial-utils.ts)

Do not rename fields such as `create_date`, `amount`, `operation_type`, `category`, or `business_type` on only one side.

## Repository evidence
- Backend models are defined in [backend/app/routes.py](backend/app/routes.py):
  - `FinancialMovement`
  - `MetricsFacets`
  - `MetricsSummaryItem`
  - `TopCategoryItem`
  - `MetricsComparison`
  - `MetricsAlert`
- Frontend types mirror the model in [frontend/src/lib/financial-types.ts](frontend/src/lib/financial-types.ts):
  - `FinancialMovement`
  - `KPIMetrics`
  - `MonthlyDataPoint`
- The frontend computes KPI and monthly aggregates from those objects in [frontend/src/lib/financial-utils.ts](frontend/src/lib/financial-utils.ts):
  - `computeKPIs`
  - `computeMonthlyData`
  - `formatCurrency`
  - `formatPercent`
- The backend generates mock movement data in [backend/app/routes.py](backend/app/routes.py) using `generate_mock_movements` and the helper functions that build each movement.

## Risk prevented
This prevents mismatches between the backend response payload and the frontend type assumptions, which would break KPI calculations, chart generation, and field access at runtime.
