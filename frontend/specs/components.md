# Component Specifications — Financial Dashboard

Reference: existing home dashboard components at `frontend/src/components/dashboard/`
(`dashboard-header.tsx`, `kpi-row.tsx`, `income-outcome-chart.tsx`, `profit-percent-chart.tsx`).
Types referenced below are defined in `api-types.ts` and `param-types.ts`.

---

## Feature 1 — DateRangeFilterBar

- **Component:** `DateRangeFilterBar`
- **Location:** top of the home dashboard, above `KPIRow`
- **Props:**
  - `value: DateRangeFilter` — controlled state, lifted to `App.tsx`
  - `onChange: (next: DateRangeFilter) => void`
  - `facets: FacetsResponse | null` — `null` while `/api/metrics/facets` is loading
- **Layout:** single row — `[Start date input] [End date input] [available range hint text]`
- **Behavior — partial range:** if only `start_date` or only `end_date` is set, the empty
  field is treated as "no limit". The filter is applied immediately using whichever date
  is present; the app does not wait for both fields to be valid.
- **Behavior — applying the filter:** on change, `App.tsx` re-fetches `GET /api/metrics`
  with the current `MetricsParams` (built from `value`), replacing the movements used by
  `computeKPIs` and `computeMonthlyData`.
- **Hint text:** `Data available from {facets.min_date} to {facets.max_date}`. Rendered as
  a skeleton/placeholder while `facets` is `null`.
- **Reused by:** Feature 2 (`OutcomeAlertsTable`) and Feature 3 (comparison page) share the
  same `DateRangeFilter` value where noted below.

---

## Feature 2 — OutcomeAlertsTable

- **Component:** `OutcomeAlertsTable`
- **Location:** below the existing `IncomeOutcomeChart` / `ProfitPercentChart` section
- **Props:**
  - `alerts: AlertEntry[]`
  - `loading: boolean`
  - `threshold: number` — controlled input value
  - `onThresholdChange: (next: number) => void`
  - `thresholdError: string | null` — set when the typed value is outside `[0.01, 1.0]`
  - `dateFilter: DateRangeFilter` — the same value as `DateRangeFilterBar`, passed through
    to `GET /api/metrics/alerts` as `start_date` / `end_date`
- **Columns:** Period | Outcome | Baseline average (previous 3 periods) | Increase (%)
  - "Increase (%)" is `increase_ratio * 100`, formatted with one decimal.
- **Threshold input:**
  - Accepts values in `[0.01, 1.0]`.
  - On out-of-range input, show an inline error message next to the field
    (e.g. "Enter a value between 0.01 and 1.0") and disable applying the new
    threshold (the table keeps showing results for the last valid threshold)
    until the value is corrected. Do not clamp the value automatically.
- **Empty state:** if `alerts.length === 0` (no anomalies at the current threshold),
  render `EmptyState` with title "No anomalies detected" and body text that references
  the current threshold (e.g. "No period exceeded a 30% increase over its baseline.").
- **Loading state:** render `Skeleton` rows while `loading` is `true`.

---

## Feature 3 — Business Comparison Page

- **Route/page component:** `BusinessComparisonPage`
- **Props:** none (owns its own state: `dateFilter: DateRangeFilter`, fetched data for
  both business lines)
- **Layout:** a `DateRangeFilterBar` at the top (same component as Feature 1, independent
  state instance), then a two-column section, then a single chart below both columns.

### TopCategoriesPanel (used twice: B2B and B2C)

- **Component:** `TopCategoriesPanel`
- **Props:**
  - `businessType: "B2B" | "B2C"`
  - `categories: CategoryEntry[]` — result of `GET /api/metrics/categories/top` with
    `operation_type=income`, `limit=5`, `business_type={businessType}`
  - `loading: boolean`
- **Columns:** Category | Total income | % of group
  - "% of group" is computed on the frontend:
    `category.total_amount / sum(all categories in this panel's total_amount) * 100`.
- **Edge case — fewer than 5 categories:** the current dataset only has 2 income
  categories ("sales", "others"), so the API commonly returns fewer than 5 rows. The
  panel must render exactly the rows returned (no placeholder rows, no error) — a short
  list is expected behavior, not a failure state.
- **Empty state:** if `categories.length === 0` for a given business line and date range,
  render `EmptyState` with title "No income data" scoped to that panel only (the other
  panel keeps rendering normally).

### BusinessComparisonChart

- **Component:** `BusinessComparisonChart`
- **Props:** `b2b: CategoryEntry[]`, `b2c: CategoryEntry[]`, `loading: boolean`
- **Aggregation rule:** the chart compares two totals — `sum(b2b[].total_amount)` vs.
  `sum(b2c[].total_amount)` — i.e. the sum of the same top-5 (or fewer) income
  categories already fetched for each panel above. It does not make a separate API call.
- **Chart type:** single bar or donut comparing the two totals, labeled "B2B" / "B2C".