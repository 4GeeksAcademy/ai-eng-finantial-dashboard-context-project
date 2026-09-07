# Frontend Specifications (Phase: Contract-First)

## Document status

- Purpose: define frontend capability specs before implementation.
- Source of truth for API contracts: live FastAPI OpenAPI at http://localhost:8000/openapi.json (served by /docs).
- Claim labels used in this document:
	- VERIFIED /docs
	- INCORRECT
	- UNVERIFIED

## Current frontend API consumption baseline

- VERIFIED /docs: the frontend currently fetches only /api/metrics.
	- Evidence: [frontend/src/App.tsx](src/App.tsx)
- VERIFIED /docs: the frontend defines API base as VITE_API_BASE_URL fallback empty string.
	- Evidence: [frontend/src/App.tsx](src/App.tsx)
- VERIFIED /docs: local dev proxy maps /api to http://backend:8000.
	- Evidence: [frontend/vite.config.ts](vite.config.ts)
- UNVERIFIED: frontend currently consumes /api/metrics/facets.
- UNVERIFIED: frontend currently consumes /api/metrics/alerts.
- UNVERIFIED: frontend currently consumes /api/metrics/categories/top.

## API contract reference (required for upcoming features)

### Endpoint A

- Path: /api/metrics
- Method: GET
- Claim: VERIFIED /docs

Query parameters:
- start_date
	- Type: string (date format) or null
	- Required: no
	- Constraints: date format
- end_date
	- Type: string (date format) or null
	- Required: no
	- Constraints: date format
- category
	- Type: string enum or null
	- Required: no
	- Valid values: suppliers, sales, operational, administrative, others
- operation_type
	- Type: string enum or null
	- Required: no
	- Valid values: income, outcome

200 response shape:
- Type: array of FinancialMovement
- FinancialMovement fields (all required):
	- create_date: string (date format)
	- amount: number
	- operation_type: string enum (income, outcome)
	- category: string enum (suppliers, sales, operational, administrative, others)
	- business_type: string enum (B2B, B2C)

Validation visible in OpenAPI:
- Enum validation on category and operation_type
- Date format validation on date query params and create_date
- 422 validation response: HTTPValidationError

### Endpoint B

- Path: /api/metrics/facets
- Method: GET
- Claim: VERIFIED /docs

Query parameters:
- None

200 response shape:
- Type: MetricsFacets object
- Fields (all required):
	- operation_types: array of enum strings (income, outcome)
	- business_types: array of enum strings (B2B, B2C)
	- categories: array of enum strings (suppliers, sales, operational, administrative, others)
	- min_date: string (date format)
	- max_date: string (date format)

Validation visible in OpenAPI:
- Enum constraints in facet arrays
- Date format for min_date and max_date

### Endpoint C

- Path: /api/metrics/alerts
- Method: GET
- Claim: VERIFIED /docs

Query parameters:
- threshold
	- Type: number
	- Required: no
	- Default: 0.3
	- Constraints: minimum 0
- group_by
	- Type: string enum
	- Required: no
	- Default: month
	- Valid values: day, week, month
- start_date
	- Type: string (date format) or null
	- Required: no
	- Constraints: date format
- end_date
	- Type: string (date format) or null
	- Required: no
	- Constraints: date format
- business_type
	- Type: string enum or null
	- Required: no
	- Valid values: B2B, B2C

200 response shape:
- Type: array of MetricsAlert
- MetricsAlert fields (all required):
	- period: string
	- outcome_total: number
	- baseline_average: number
	- increase_ratio: number

Validation visible in OpenAPI:
- threshold minimum 0
- Enum constraints on group_by and business_type
- Date format validation on date query params
- 422 validation response: HTTPValidationError

### Endpoint D

- Path: /api/metrics/categories/top
- Method: GET
- Claim: VERIFIED /docs

Query parameters:
- operation_type
	- Type: string enum
	- Required: no
	- Default: outcome
	- Valid values: income, outcome
- limit
	- Type: integer
	- Required: no
	- Default: 5
	- Constraints: minimum 1, maximum 20
- start_date
	- Type: string (date format) or null
	- Required: no
	- Constraints: date format
- end_date
	- Type: string (date format) or null
	- Required: no
	- Constraints: date format
- business_type
	- Type: string enum or null
	- Required: no
	- Valid values: B2B, B2C

200 response shape:
- Type: array of TopCategoryItem
- TopCategoryItem fields (all required):
	- category: string enum (suppliers, sales, operational, administrative, others)
	- operation_type: string enum (income, outcome)
	- total_amount: number

Validation visible in OpenAPI:
- limit min 1 and max 20
- Enum constraints on operation_type, category, business_type
- Date format validation on date query params
- 422 validation response: HTTPValidationError

## Feature specification 1: Date range filtering on main dashboard

Status: future capability, not implemented yet.

### Objective

- Allow users to select start and end dates and refresh dashboard data accordingly.

### API dependency

- Primary endpoint: /api/metrics (VERIFIED /docs)
- Required request behavior:
	- Include start_date and end_date query params when provided.
	- Keep params omitted when not selected.

### Required frontend contract behavior

- Query param names must be exact:
	- start_date
	- end_date
- Param type must be date strings compatible with OpenAPI date format.
- Response must be treated as FinancialMovement array with exact field names:
	- create_date
	- amount
	- operation_type
	- category
	- business_type

### Existing integration points

- Current fetch function to extend: [frontend/src/App.tsx](src/App.tsx)
- Existing transformations to reuse: [frontend/src/lib/financial-utils.ts](src/lib/financial-utils.ts)
- Existing movement type to keep aligned: [frontend/src/lib/financial-types.ts](src/lib/financial-types.ts)

### Contract risks if ignored

- Using camelCase params or fields will fail against backend contract.
- Sending invalid date values can trigger 422.
- Renaming create_date or operation_type in frontend types will break aggregation logic.

## Feature specification 2: Anomaly alerts table

Status: future capability, not implemented yet.

### Objective

- Display anomaly alerts as a table, sourced from backend alerts endpoint.

### API dependency

- Primary endpoint: /api/metrics/alerts (VERIFIED /docs)

### Required request behavior

- Supported query params (all optional):
	- threshold (number, min 0, default 0.3)
	- group_by (day, week, month; default month)
	- start_date (date)
	- end_date (date)
	- business_type (B2B, B2C)

### Required response handling

- Must treat response as array of objects with exact fields:
	- period: string
	- outcome_total: number
	- baseline_average: number
	- increase_ratio: number

### Existing integration points

- No current alerts fetch exists in frontend (UNVERIFIED in current code usage).
- Recommended fetch integration location by pattern: [frontend/src/App.tsx](src/App.tsx)

### Contract risks if ignored

- Omitting threshold min constraint handling may produce avoidable 422 errors.
- Assuming non-existent fields will break table rendering.

## Feature specification 3: B2B vs B2C comparison view

Status: future capability, not implemented yet.

### Objective

- Provide side-by-side comparison inputs/results for B2B and B2C slices.

### API dependencies for this spec stage

- Primary for filter options: /api/metrics/facets (VERIFIED /docs)
- Primary for category ranking panels: /api/metrics/categories/top (VERIFIED /docs)
- Optional data baseline path already in UI: /api/metrics (VERIFIED /docs)

### Required request behavior

- For facets:
	- GET /api/metrics/facets with no params
- For top categories:
	- Use business_type with exact values B2B or B2C
	- Respect operation_type enum income or outcome
	- Respect limit range 1..20
	- Optional date filters must use start_date and end_date exact names

### Required response handling

- MetricsFacets exact fields:
	- operation_types
	- business_types
	- categories
	- min_date
	- max_date
- TopCategoryItem exact fields:
	- category
	- operation_type
	- total_amount

### Existing integration points

- Frontend currently has no fetch call for facets or top categories (UNVERIFIED in current code usage).
- Existing type location to extend safely: [frontend/src/lib/financial-types.ts](src/lib/financial-types.ts)

### Contract risks if ignored

- Invalid limit outside 1..20 can trigger 422.
- Any business type label different from B2B or B2C is invalid.

## Claims audit

- "Frontend already consumes /api/metrics/alerts": INCORRECT
- "Frontend already consumes /api/metrics/categories/top": INCORRECT
- "Frontend already consumes /api/metrics/facets": INCORRECT
- "Date filters are required for /api/metrics": INCORRECT
- "All four requested endpoints are present in live OpenAPI": VERIFIED /docs

## Non-goals for this document

- No implementation details beyond contract-safe integration points.
- No UI design decisions finalized here.
- No backend API shape changes proposed.
