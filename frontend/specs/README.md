# Frontend Phase 2 Specs

## Scope

This document defines the contract-first frontend scope for three capabilities:

1. Date range filtering for the main dashboard.
2. Anomaly alerts table.
3. B2B vs B2C comparison view.

API claims in this file are based on live OpenAPI served from /docs and /openapi.json.

## Shared API and type references

- OpenAPI source (live): http://localhost:8000/openapi.json
- Response types: [api-types.ts](api-types.ts)
- Query parameter types: [param-types.ts](param-types.ts)
- Component contracts: [components.ts](components.ts)

---

## Functionality 1: Date range filtering

### Endpoints consumed

1. VERIFIED /docs: GET /api/metrics/facets
2. VERIFIED /docs: GET /api/metrics

### Request TypeScript contracts

1. GET /api/metrics/facets
- Query params: none
- TS request type: none

2. GET /api/metrics
- TS request type: DateRangeFilter from [param-types.ts](param-types.ts)
- Supported params:
  - start_date?: ApiDateString
  - end_date?: ApiDateString

### Response TypeScript contracts

1. GET /api/metrics/facets
- TS response type: FacetsResponse from [api-types.ts](api-types.ts)
- Fields:
  - operation_types: ("income" | "outcome")[]
  - business_types: ("B2B" | "B2C")[]
  - categories: ("suppliers" | "sales" | "operational" | "administrative" | "others")[]
  - min_date: string (OpenAPI format: date)
  - max_date: string (OpenAPI format: date)

2. GET /api/metrics
- Response schema in OpenAPI: FinancialMovement[]
- Existing app domain type already used in app code: FinancialMovement in [frontend/src/lib/financial-types.ts](../src/lib/financial-types.ts)
- Required API fields:
  - create_date: string (date)
  - amount: number
  - operation_type: "income" | "outcome"
  - category: "suppliers" | "sales" | "operational" | "administrative" | "others"
  - business_type: "B2B" | "B2C"

### Valid values and parameter restrictions

1. start_date
- Optional.
- Must follow date format (YYYY-MM-DD) as required by OpenAPI date format.

2. end_date
- Optional.
- Must follow date format (YYYY-MM-DD) as required by OpenAPI date format.

### Edge cases and expected UI behavior

1. Edge case: start_date is after end_date.
- Expected UI:
  - Disable Apply or show inline validation message.
  - Do not send request.

2. Edge case: selected dates are outside facets bounds (before min_date or after max_date).
- Expected UI:
  - Clamp selection to valid range or block invalid selection.
  - Show helper message explaining valid bounds.

3. Edge case: request returns 422 due to invalid date format.
- Expected UI:
  - Keep existing dashboard data visible.
  - Show non-blocking error state for filter input.

---

## Functionality 2: Anomaly alerts table

### Endpoints consumed

1. VERIFIED /docs: GET /api/metrics/alerts

### Request TypeScript contracts

1. GET /api/metrics/alerts
- TS request type: AlertsParams from [param-types.ts](param-types.ts)
- Supported params:
  - threshold?: number
  - group_by?: "day" | "week" | "month"
  - start_date?: ApiDateString
  - end_date?: ApiDateString
  - business_type?: "B2B" | "B2C"

### Response TypeScript contracts

1. GET /api/metrics/alerts
- TS response type: AlertsResponse from [api-types.ts](api-types.ts)
- Row type: AlertEntry
- Required fields per row:
  - period: string
  - outcome_total: number
  - baseline_average: number
  - increase_ratio: number

### Valid values and parameter restrictions

1. threshold
- Optional.
- Default in OpenAPI: 0.3.
- Minimum in OpenAPI: 0.

2. group_by
- Optional.
- Default in OpenAPI: month.
- Valid values: day, week, month.

3. business_type
- Optional.
- Valid values: B2B, B2C.

4. start_date and end_date
- Optional.
- Must follow date format (YYYY-MM-DD).

### Edge cases and expected UI behavior

1. Edge case: threshold < 0.
- Expected UI:
  - Block submission client-side.
  - Show field-level error and keep previous results.

2. Edge case: API returns empty alert list.
- Expected UI:
  - Render empty-state row or message: no anomalies for selected filters.
  - Keep table headers visible for context.

3. Edge case: group_by changed to day causing many rows.
- Expected UI:
  - Preserve readability with fixed headers and scrollable body.
  - Keep sorting or default ordering stable.

---

## Functionality 3: B2B vs B2C comparison view

### Endpoints consumed

1. VERIFIED /docs: GET /api/metrics/facets
2. VERIFIED /docs: GET /api/metrics/categories/top

### Request TypeScript contracts

1. GET /api/metrics/facets
- Query params: none
- TS request type: none

2. GET /api/metrics/categories/top
- TS request type: TopCategoriesParams from [param-types.ts](param-types.ts)
- For this functionality, each side query extends with business_type using BusinessSliceQuery from [components.ts](components.ts)
- Supported params:
  - operation_type?: "income" | "outcome"
  - limit?: number
  - start_date?: ApiDateString
  - end_date?: ApiDateString
  - business_type?: "B2B" | "B2C"

### Response TypeScript contracts

1. GET /api/metrics/facets
- TS response type: FacetsResponse

2. GET /api/metrics/categories/top
- TS response type: TopCategoriesResponse from [api-types.ts](api-types.ts)
- Row type: CategoryEntry
- Required fields per row:
  - category: "suppliers" | "sales" | "operational" | "administrative" | "others"
  - operation_type: "income" | "outcome"
  - total_amount: number

### Valid values and parameter restrictions

1. operation_type
- Optional.
- Default in OpenAPI: outcome.
- Valid values: income, outcome.

2. limit
- Optional.
- Default in OpenAPI: 5.
- Minimum in OpenAPI: 1.
- Maximum in OpenAPI: 20.

3. business_type
- Optional in endpoint, but required by comparison view per side request.
- Valid values: B2B, B2C.

4. start_date and end_date
- Optional.
- Must follow date format (YYYY-MM-DD).

### Edge cases and expected UI behavior

1. Edge case: limit is out of range (0 or > 20).
- Expected UI:
  - Block submission or clamp input into [1, 20].
  - Show helper text with allowed range.

2. Edge case: one side (B2B or B2C) returns rows while the other returns empty.
- Expected UI:
  - Render both panels independently.
  - Show empty state only in the side without data.

3. Edge case: facets request fails but top-categories request is available from prior state.
- Expected UI:
  - Keep previous valid facets and comparison rows visible.
  - Show retry affordance for facets load.

---

## OpenAPI verification summary

1. VERIFIED /docs: /api/metrics exists and accepts optional start_date, end_date, category, operation_type.
2. VERIFIED /docs: /api/metrics/facets exists and returns MetricsFacets.
3. VERIFIED /docs: /api/metrics/alerts exists with threshold minimum 0 and group_by enum day|week|month.
4. VERIFIED /docs: /api/metrics/categories/top exists with limit constraints min 1 and max 20.

## Non-goals

1. No React component implementation in this folder.
2. No backend API changes.
3. No inferred fields beyond OpenAPI schemas.
