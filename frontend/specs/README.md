# Frontend Specs — Financial Dashboard (Spec Driven Development)

These specs were written against the live backend's `/docs` (OpenAPI schema) running at
the time of writing. Types live in `api-types.ts` and `param-types.ts`; component
contracts live in `components.md`. This document defines, per feature, the endpoints
used, the types involved, the parameters, and the edge cases the UI must handle.

No implementation (React components, fetch calls) is included here — this is the spec
a developer or AI agent would implement from.

---

## Feature 1 — Date range filter (home dashboard)

**Endpoint:** `GET /api/metrics`
**Query:** `MetricsParams` (`start_date?`, `end_date?`, plus the endpoint's existing
`category?` / `operation_type?`, unused by this feature).
**Response:** `FinancialMovement[]` (unchanged — filtering happens server-side via
query params, the frontend still runs `computeKPIs` / `computeMonthlyData` on the
result).

Also uses `GET /api/metrics/facets` → `FacetsResponse`, fetched once on mount, to show
the available date range next to the filter inputs.

### Parameters

- `start_date`, `end_date`: optional strings, format `YYYY-MM-DD`.

### Edge cases

1. **Both dates empty:** no `start_date`/`end_date` query params are sent; the dashboard
   shows all available data (current behavior, unchanged).
2. **Only one date filled:** the empty date is treated as "no limit" — the filter is
   applied using only the date that was provided (e.g. `start_date` set, `end_date`
   empty → shows everything from `start_date` onward). The filter is NOT ignored while
   waiting for the second date.

---

## Feature 2 — Anomaly alerts table (home dashboard)

**Endpoint:** `GET /api/metrics/alerts`
**Query:** `AlertsParams` (`threshold`, `group_by` fixed to `"month"`, plus
`start_date?` / `end_date?` from the shared date filter).
**Response:** `AlertsResponse` (`AlertEntry[]`).

### Parameters

- `threshold`: number. API allows any value ≥ 0 (default `0.3`); this UI restricts
  input to `[0.01, 1.0]`.
- `group_by`: fixed to `"month"` for this feature (not user-configurable).

### Edge cases

1. **Empty array:** the UI renders the `EmptyState` component with fixed copy
   referencing the current threshold — the section is not hidden.
2. **Threshold out of `[0.01, 1.0]`:** show an inline validation error and disable
   applying the new value; the table keeps showing results for the last valid
   threshold until the input is corrected. No automatic clamping.
3. **Date range with no data:** same `EmptyState` component/copy as case 1 (an empty
   `alerts` array is indistinguishable from "no anomalies" whether caused by threshold
   or date range — one consistent empty state covers both).

---

## Feature 3 — B2B vs B2C comparison view

**Endpoints:**
- `GET /api/metrics/categories/top` (called twice — once per business line) with
  `operation_type=income`, `limit=5`, `business_type={B2B|B2C}`, plus the shared
  `start_date?` / `end_date?`.
- `GET /api/metrics/facets` → `FacetsResponse`, reused from Feature 1 if already
  fetched, for any category/business-line reference text.

**Query:** `TopCategoriesParams`.
**Response:** `TopCategoriesResponse` (`CategoryEntry[]`) per call.

### Parameters

- `operation_type`: fixed to `"income"` for this feature.
- `limit`: fixed to `5`. The API allows up to `20`; this feature does not expose that.
- `business_type`: `"B2B"` for the left panel, `"B2C"` for the right panel.

### Edge cases

1. **Fewer than 5 categories returned:** the current dataset only has 2 income
   categories ("sales", "others"). The panel renders exactly the rows the API returns
   — this is expected, not an error or a loading/empty state.
2. **Zero categories for a business line + date range:** that panel shows its own
   `EmptyState` ("No income data"); the other panel and the comparison chart continue
   to render normally using whatever data they have.
3. **Percentage calculation:** the API does not return a percentage field. The frontend
   computes it per panel as `total_amount / sum(all total_amount in that panel's
   response) * 100`. If the panel has zero categories, no percentage is rendered
   (avoids a division by zero).
4. **Comparison chart aggregation:** the chart's two totals are the sum of
   `total_amount` across the (already-fetched) top categories per business line —
   not a separate API call or a different aggregation.

---

## Reviewer checklist

- [ ] `npx tsc --noEmit` passes in strict mode (no `any`, no untyped `object` for
      payloads).
- [ ] Every relevant property has JSDoc (meaning, format, valid values).
- [ ] All types in `api-types.ts` match the live `/docs` schema (verified against a
      running backend on 2026-08-03 — re-verify if the backend changes).
- [ ] Commits on `feature/frontend-specs` are separated with clear messages (types →
      components → contract).