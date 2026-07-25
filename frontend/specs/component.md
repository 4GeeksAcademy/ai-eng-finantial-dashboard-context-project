# Frontend Component Specification

This document defines the component-level plan for the three requested dashboard features.
All endpoint contracts and parameter rules are aligned with the current backend OpenAPI.

## 1) Home Date Range Filter

### Purpose
Allow users to filter all home dashboard data by optional start and end dates.
When both are empty, the dashboard shows the full available dataset.

### API dependencies
- GET /api/metrics/facets
- GET /api/metrics
- GET /api/metrics/summary
- GET /api/metrics/categories/top
- GET /api/metrics/alerts

### New component: DateRangeFilterBar

#### Responsibilities
- Render two date inputs: start date and end date.
- Render available range reference from facets: min_date and max_date.
- Validate local date order (start_date <= end_date).
- Emit filter changes to parent container.

#### Props
- value: DateRangeFilter
- minDate: ISODateString
- maxDate: ISODateString
- isLoading: boolean
- onChange: (next: DateRangeFilter) => void

#### UI behavior
- Inputs are optional.
- If one input is empty, only the other bound is applied.
- If start date is greater than end date, show inline validation message and block apply.
- Show helper text with available backend range.

#### Data rules
- API query keys must use snake_case: start_date, end_date.
- UI state can use camelCase: startDate, endDate.

### Integration points
- Home container fetches facets once on mount.
- Home container stores the active DateRangeFilter.
- Home container passes start_date and end_date to all home data requests.

## 2) Anomaly Alerts Table

### Purpose
Show periods where outcome values spike unexpectedly.
Table must support threshold control and explicit empty state.

### API dependencies
- GET /api/metrics/alerts

### New component: AlertsThresholdControl

#### Responsibilities
- Render numeric input for threshold.
- Enforce allowed range and step.
- Emit threshold updates to parent.

#### Props
- value: number
- min: number
- max: number
- step: number
- onChange: (next: number) => void

#### UI behavior
- Default value: 0.3.
- Valid range in UI: 0.01 to 1.0.
- If user enters invalid value, show inline validation and keep last valid value.

### New component: AlertsTableCard

#### Responsibilities
- Render alerts table with required 4 columns.
- Handle loading, error, and empty states.
- Display records from AlertsResponse.items.

#### Props
- data: AlertsResponse | null
- isLoading: boolean
- errorMessage: string | null

#### Table columns
- Period: AlertEntry.period
- Recorded outcome: AlertEntry.outcome_total
- Rolling average of previous 3 periods: AlertEntry.baseline_average
- Percentage increase: AlertEntry.increase_ratio

#### UI behavior
- Empty state text must be explicit:
  - No anomalies detected for the selected threshold and date range.
- Percentage increase displayed as percent format (increase_ratio * 100).
- Currency/amount fields displayed with locale number formatting.

### Integration points
- Home container combines DateRangeFilter + threshold into alerts query.
- Query params sent to backend:
  - threshold
  - group_by (optional, default month if omitted)
  - start_date and end_date when present

## 3) B2B vs B2C Comparison View

### Purpose
Provide a dedicated comparison page with side-by-side top income categories and a summary chart.

### API dependencies
- GET /api/metrics/facets
- GET /api/metrics/categories/top?operation_type=income&limit=5&business_type=B2B
- GET /api/metrics/categories/top?operation_type=income&limit=5&business_type=B2C

### New route-level container: B2BVsB2CPage

#### Responsibilities
- Manage shared date range state for both segments.
- Fetch facets to populate available categories and date boundaries.
- Fetch top categories for B2B and B2C with identical filters.
- Build chart series from both responses.

#### Internal state
- dateRange: DateRangeFilter
- operationType: OperationType (fixed to income for this feature)
- limit: number (default 5)
- b2bData: TopCategoriesResponse | null
- b2cData: TopCategoriesResponse | null
- facets: FacetsResponse | null

### New component: SegmentTopCategoriesTable

#### Responsibilities
- Render one segment table (B2B or B2C).
- Show top categories, total amount, and share percentage.

#### Props
- title: string
- businessType: BusinessType
- items: CategoryEntry[]
- isLoading: boolean
- errorMessage: string | null

#### Table columns
- Category name: CategoryEntry.category
- Total income: CategoryEntry.total_amount
- Percentage of group total: computed in UI as
  - item.total_amount / sum(all rows total_amount)

#### UI behavior
- If no rows, display explicit empty state per segment.
- Keep both segment tables visually aligned and independently resilient to partial failures.

### New component: IncomeComparisonChartCard

#### Responsibilities
- Plot B2B total income versus B2C total income.
- Reflect same date range and filters as both tables.

#### Props
- b2bItems: CategoryEntry[]
- b2cItems: CategoryEntry[]
- isLoading: boolean

#### Data shaping
- b2bTotal = sum(CategoryEntry.total_amount from B2B)
- b2cTotal = sum(CategoryEntry.total_amount from B2C)
- Chart dataset contains two bars or points: B2B and B2C.

## Shared Fetching and Mapping Rules

### Query serialization
- Use snake_case query keys expected by backend.
- Omit keys with undefined values.

### API-to-UI type mapping
- Use interfaces in frontend/specs/api-types.ts and frontend/specs/param-types.ts.
- For list endpoints that return arrays, map into metadata wrappers at service layer where needed:
  - AlertsResponse.items wraps array from /api/metrics/alerts.
  - TopCategoriesResponse.items wraps array from /api/metrics/categories/top.

### Error handling
- 422 validation errors should surface actionable field-level messages where possible.
- Network and server errors should show card-level retry state.

### Loading states
- Keep current dashboard skeleton behavior for charts and KPI blocks.
- Add table skeleton rows for alerts and segment tables.

## Suggested File Targets

- src/components/dashboard/date-range-filter-bar.tsx
- src/components/dashboard/alerts-threshold-control.tsx
- src/components/dashboard/alerts-table-card.tsx
- src/components/dashboard/segment-top-categories-table.tsx
- src/components/dashboard/income-comparison-chart-card.tsx
- src/pages/b2b-vs-b2c-page.tsx
- src/lib/api-client.ts
- src/lib/query-params.ts

## Acceptance Checklist

- Date range filters all home dashboard datasets when set.
- Available date range from facets is visible near date inputs.
- Alerts table supports threshold input and shows explicit empty state.
- B2B and B2C top-income tables each show 5 categories by default.
- Comparison chart reflects totals from both segment responses.
- All requests honor backend parameter constraints and enum values.
