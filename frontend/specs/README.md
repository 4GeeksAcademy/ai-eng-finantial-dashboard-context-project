# Data Contract Documentation

This document defines the frontend data contracts for the three requested features.
Endpoint paths and parameter constraints were verified against backend Swagger at `/docs`.

Related spec files:
- `frontend/specs/param-types.ts`
- `frontend/specs/api-types.ts`
- `frontend/specs/component.md`

## Shared Domain Types

### Request-side types
- `ISODateString`: `YYYY-MM-DD` string shape
- `DateRangeFilter`: optional `startDate`, `endDate`
- `AlertsParams`: `DateRangeFilter` + `threshold`, `groupBy`, `businessType`
- `TopCategoriesParams`: `DateRangeFilter` + `operationType`, `limit`, `businessType`

### Response-side types
- `FacetsResponse`
- `AlertEntry`
- `AlertsResponse`
- `CategoryEntry`
- `TopCategoriesResponse`
- `Category`, `OperationType`, `BusinessType`

## Feature 1: Date Range Filter on Home Dashboard

### Endpoints consumed
- `GET /api/metrics/facets`
- `GET /api/metrics`
- `GET /api/metrics/summary`
- `GET /api/metrics/categories/top`
- `GET /api/metrics/alerts`

### Request types used
- `DateRangeFilter`
- `AlertsParams` (when fetching alerts)
- `TopCategoriesParams` (when fetching top categories)
- Additional query keys for summary API (same date range + optional grouping/business filters)

### Response types used
- `/api/metrics/facets` -> `FacetsResponse`
- `/api/metrics` -> raw array of financial movement objects
  - `create_date`, `amount`, `operation_type`, `category`, `business_type`
- `/api/metrics/summary` -> raw array of summary rows
  - `period`, `income`, `outcome`, `net`
- `/api/metrics/categories/top` -> raw array mapped into `TopCategoriesResponse.items`
- `/api/metrics/alerts` -> raw array mapped into `AlertsResponse.items`

### Parameter constraints

#### `GET /api/metrics/facets`
- No query parameters.

#### `GET /api/metrics`
- `start_date`:
  - Optional
  - Type: string (date), format `YYYY-MM-DD`
- `end_date`:
  - Optional
  - Type: string (date), format `YYYY-MM-DD`
- `category`:
  - Optional
  - Enum: `suppliers | sales | operational | administrative | others`
- `operation_type`:
  - Optional
  - Enum: `income | outcome`

#### `GET /api/metrics/summary`
- `group_by`:
  - Optional
  - Enum: `day | week | month`
  - Default: `month`
- `start_date`:
  - Optional
  - Type: string (date), format `YYYY-MM-DD`
- `end_date`:
  - Optional
  - Type: string (date), format `YYYY-MM-DD`
- `category`:
  - Optional
  - Enum: `suppliers | sales | operational | administrative | others`
- `operation_type`:
  - Optional
  - Enum: `income | outcome`
- `business_type`:
  - Optional
  - Enum: `B2B | B2C`

#### `GET /api/metrics/categories/top`
- `operation_type`:
  - Optional
  - Enum: `income | outcome`
  - Default: `outcome`
- `limit`:
  - Optional
  - Type: integer
  - Min: `1`
  - Max: `20`
  - Default: `5`
- `start_date`:
  - Optional
  - Type: string (date), format `YYYY-MM-DD`
- `end_date`:
  - Optional
  - Type: string (date), format `YYYY-MM-DD`
- `business_type`:
  - Optional
  - Enum: `B2B | B2C`

#### `GET /api/metrics/alerts`
- `threshold`:
  - Optional
  - Type: number
  - Min: `0`
  - Default: `0.3`
- `group_by`:
  - Optional
  - Enum: `day | week | month`
  - Default: `month`
- `start_date`:
  - Optional
  - Type: string (date), format `YYYY-MM-DD`
- `end_date`:
  - Optional
  - Type: string (date), format `YYYY-MM-DD`
- `business_type`:
  - Optional
  - Enum: `B2B | B2C`

### Edge cases and required UI behavior
1. Both date inputs empty:
- UI must show full data scope.
- UI must still display available bounds from `FacetsResponse.min_date` and `FacetsResponse.max_date`.

2. `start_date > end_date` in UI form:
- UI must block request dispatch.
- UI must show inline validation explaining the date order issue.

3. Date outside dataset bounds:
- Backend may return empty arrays.
- UI must render empty-state messaging per widget instead of hiding sections.

## Feature 2: Anomaly Alerts Table on Home Dashboard

### Endpoint consumed
- `GET /api/metrics/alerts`

### Request types used
- `AlertsParams`
  - `threshold?: number`
  - `groupBy?: GroupBy`
  - `businessType?: BusinessType`
  - `startDate?: ISODateString`
  - `endDate?: ISODateString`

### Response types used
- Raw API response: `AlertEntry[]`
  - `period`, `outcome_total`, `baseline_average`, `increase_ratio`
- UI service wrapper: `AlertsResponse`
  - `items: AlertEntry[]`
  - `totalCount`, `threshold`, `groupBy`, `generatedAt`

### Parameter constraints
- `threshold`:
  - Optional
  - Type: number
  - Min: `0`
  - Default: `0.3`
- `group_by`:
  - Optional
  - Enum: `day | week | month`
  - Default: `month`
- `start_date`:
  - Optional
  - Type: string (date), format `YYYY-MM-DD`
- `end_date`:
  - Optional
  - Type: string (date), format `YYYY-MM-DD`
- `business_type`:
  - Optional
  - Enum: `B2B | B2C`

### Edge cases and required UI behavior
1. No anomalies returned for current threshold/date range:
- UI must show explicit empty-state text: "No anomalies detected for the selected threshold and date range."
- UI must keep table container visible.

2. User enters threshold below minimum:
- UI must show validation error and prevent invalid request.
- UI should preserve last valid threshold.

3. Backend validation error (422), for example malformed date:
- UI must show actionable field-level error message.
- UI must not crash or clear already rendered non-alert sections.

## Feature 3: B2B vs B2C Comparison View

### Endpoints consumed
- `GET /api/metrics/facets`
- `GET /api/metrics/categories/top?operation_type=income&limit=5&business_type=B2B`
- `GET /api/metrics/categories/top?operation_type=income&limit=5&business_type=B2C`

### Request types used
- `DateRangeFilter` (shared for both B2B and B2C requests)
- `TopCategoriesParams`
  - `operationType?: OperationType`
  - `limit?: number`
  - `businessType?: BusinessType`
  - `startDate?: ISODateString`
  - `endDate?: ISODateString`

### Response types used
- `/api/metrics/facets` -> `FacetsResponse`
- `/api/metrics/categories/top` -> raw `CategoryEntry[]`
  - `category`, `operation_type`, `total_amount`
- UI service wrapper per segment -> `TopCategoriesResponse`
  - `items: CategoryEntry[]`
  - `totalCount`, `limit`, `operationType`, `generatedAt`

### Parameter constraints

#### `GET /api/metrics/facets`
- No query parameters.

#### `GET /api/metrics/categories/top`
- `operation_type`:
  - Optional
  - Enum: `income | outcome`
  - Default: `outcome`
  - Feature-specific required value: `income`
- `limit`:
  - Optional
  - Type: integer
  - Min: `1`
  - Max: `20`
  - Default: `5`
- `start_date`:
  - Optional
  - Type: string (date), format `YYYY-MM-DD`
- `end_date`:
  - Optional
  - Type: string (date), format `YYYY-MM-DD`
- `business_type`:
  - Optional
  - Enum: `B2B | B2C`
  - Feature-specific requests should set explicitly to one of the two values per table

### Edge cases and required UI behavior
1. One segment returns data and the other is empty:
- UI must show data for available segment.
- UI must show explicit empty state for the segment with no rows.

2. One request fails and the other succeeds:
- UI must show partial content with per-section error state.
- UI must not block the successful segment.

3. `limit` outside backend bounds (less than 1 or greater than 20):
- UI must clamp or validate before request.
- UI must prevent invalid query values from being sent.

## Contract Notes

- Query keys sent to backend must be snake_case (`start_date`, `end_date`, `operation_type`, `group_by`, `business_type`).
- UI state may remain camelCase and be mapped in the API client.
- List endpoints (`/api/metrics/alerts`, `/api/metrics/categories/top`) return arrays directly; frontend wrapper response types (`AlertsResponse`, `TopCategoriesResponse`) are service-layer abstractions for UI metadata.
