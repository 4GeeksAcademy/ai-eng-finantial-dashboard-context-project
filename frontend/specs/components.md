# Component Contracts (Phase 2)

This file defines component-level contracts by functionality for Phase 2.

## Shared Type References

- API response and enum types: [api-types.ts](api-types.ts)
- API query parameter types: [param-types.ts](param-types.ts)

## Shared UI Request State

- `AsyncState = "idle" | "loading" | "success" | "error"`

---

## Functionality 1: Date Range Filtering

### DateRangeFilterControlsProps

- `value: DateRangeFilter`
  - Current filter model for `/api/metrics`.
- `min_date: ApiDateString`
  - Earliest selectable date from `/api/metrics/facets.min_date`.
- `max_date: ApiDateString`
  - Latest selectable date from `/api/metrics/facets.max_date`.
- `is_loading: boolean`
  - Indicates active metrics request.
- `on_change: (next: DateRangeFilter) => void`
  - Updates local filter state.
- `on_apply: () => void`
  - Applies current filter and refreshes data.
- `on_reset: () => void`
  - Clears date range and refreshes unfiltered data.

### MainDashboardDateRangeIntegrationProps

- `facets: FacetsResponse | null`
  - Facets payload used to initialize valid bounds and options.
- `date_range: DateRangeFilter`
  - Current `/api/metrics` date filter.
- `metrics_state: AsyncState`
  - Request lifecycle for dashboard metrics.
- `metrics_error: string | null`
  - Error message for failed metrics requests.
- `on_date_range_change: (next: DateRangeFilter) => void`
  - Local date-range updates.
- `on_date_range_apply: () => void`
  - Triggers filtered metrics request.
- `on_date_range_reset: () => void`
  - Resets filter and requests baseline metrics.

---

## Functionality 2: Anomaly Alerts Table

### AlertsTableRowProps

- `entry: AlertEntry`
  - One alert row from `/api/metrics/alerts`.
- `threshold: number`
  - Threshold used in current query context.

### AlertsTableSectionProps

- `params: AlertsParams`
  - Query model for `/api/metrics/alerts`.
- `rows: AlertsResponse`
  - Current alert rows.
- `request_state: AsyncState`
  - Alerts request lifecycle.
- `error_message: string | null`
  - Error message when fetch fails.
- `on_params_change: (next: AlertsParams) => void`
  - Updates filters for alerts query.
- `on_refresh: () => void`
  - Executes alerts request with current params.

---

## Functionality 3: B2B vs B2C Comparison

### BusinessSliceQuery

Extends `TopCategoriesParams` and adds:

- `business_type: BusinessTypeApi`
  - Required business segment for one side (`B2B` or `B2C`).

### BusinessTopCategoriesPanelProps

- `title: string`
  - Panel title for current segment.
- `query: BusinessSliceQuery`
  - Query for `/api/metrics/categories/top`.
- `rows: TopCategoriesResponse`
  - Category rows for the selected segment.
- `request_state: AsyncState`
  - Panel request lifecycle.
- `error_message: string | null`
  - Error message when panel request fails.

### B2BVsB2CComparisonViewProps

- `facets: FacetsResponse`
  - Available filters and date bounds.
- `date_range: DateRangeFilter`
  - Shared date range for both B2B and B2C queries.
- `operation_type: OperationTypeApi`
  - Shared operation type for both sides.
- `limit: number`
  - Shared row limit (OpenAPI constraint: 1..20).
- `b2b_rows: TopCategoriesResponse`
  - Rows for `business_type=B2B`.
- `b2c_rows: TopCategoriesResponse`
  - Rows for `business_type=B2C`.
- `request_state: AsyncState`
  - Shared request lifecycle for the comparison view.
- `error_message: string | null`
  - Error when either side fetch fails.
- `on_date_range_change: (next: DateRangeFilter) => void`
  - Updates shared date range.
- `on_operation_type_change: (next: OperationTypeApi) => void`
  - Updates shared operation type.
- `on_limit_change: (next: number) => void`
  - Updates shared top-categories limit.
- `on_refresh: () => void`
  - Triggers both side requests.

---

## Cross-Feature Validation Contract

### DateRangeValidationResult

- `is_valid: boolean`
  - True when query is safe to send.
- `reason: "missing_range" | "start_after_end" | "out_of_bounds" | null`
  - Machine-readable validation outcome.
- `normalized_start_date: ApiDateString | null`
  - Normalized start date for API dispatch.
- `normalized_end_date: ApiDateString | null`
  - Normalized end date for API dispatch.
