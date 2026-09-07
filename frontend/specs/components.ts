import type {
  AlertEntry,
  AlertsResponse,
  ApiDateString,
  BusinessTypeApi,
  FacetsResponse,
  OperationTypeApi,
  TopCategoriesResponse,
} from "./api-types";
import type { AlertsParams, DateRangeFilter, TopCategoriesParams } from "./param-types";

/** Shared request lifecycle state for async UI sections. */
export type AsyncState = "idle" | "loading" | "success" | "error";

/**
 * Functionality 1: Date range filtering for the main dashboard.
 * Contract for a date-range controls component.
 */
export interface DateRangeFilterControlsProps {
  /** Current filter model sent to /api/metrics as query params. */
  value: DateRangeFilter;
  /** Earliest selectable date from /api/metrics/facets.min_date. */
  min_date: ApiDateString;
  /** Latest selectable date from /api/metrics/facets.max_date. */
  max_date: ApiDateString;
  /** True while a metrics refresh request is in flight. */
  is_loading: boolean;
  /** Emits partial date updates without triggering fetch by itself. */
  on_change: (next: DateRangeFilter) => void;
  /** Commits current dates and triggers data refresh. */
  on_apply: () => void;
  /** Clears start_date and end_date, then refreshes baseline metrics. */
  on_reset: () => void;
}

/**
 * Functionality 1: Main dashboard integration contract.
 * Explicitly ties filter UI with movement loading and transformed chart data refresh.
 */
export interface MainDashboardDateRangeIntegrationProps {
  /** Facets payload used to initialize allowed ranges and select values. */
  facets: FacetsResponse | null;
  /** Current /api/metrics request filter. */
  date_range: DateRangeFilter;
  /** Request lifecycle for metrics fetch. */
  metrics_state: AsyncState;
  /** Optional request error to render user feedback. */
  metrics_error: string | null;
  /** Updates in-memory date range model. */
  on_date_range_change: (next: DateRangeFilter) => void;
  /** Applies filters and requests /api/metrics again. */
  on_date_range_apply: () => void;
  /** Clears filters and requests unfiltered /api/metrics. */
  on_date_range_reset: () => void;
}

/**
 * Functionality 2: Anomaly alerts table row rendering contract.
 * Uses exact /api/metrics/alerts response fields only.
 */
export interface AlertsTableRowProps {
  /** Single API row from /api/metrics/alerts. */
  entry: AlertEntry;
  /** Current threshold used by the table query context. */
  threshold: number;
}

/**
 * Functionality 2: Anomaly alerts table section contract.
 */
export interface AlertsTableSectionProps {
  /** Current query model used for /api/metrics/alerts. */
  params: AlertsParams;
  /** Rows returned by /api/metrics/alerts. */
  rows: AlertsResponse;
  /** Request lifecycle for alerts fetch. */
  request_state: AsyncState;
  /** Optional error string for failed requests. */
  error_message: string | null;
  /** Updates query params before refresh. */
  on_params_change: (next: AlertsParams) => void;
  /** Triggers a request with current params. */
  on_refresh: () => void;
}

/**
 * Functionality 3: B2B vs B2C comparison shared query model.
 * Restricts business type to OpenAPI enum values.
 */
export interface BusinessSliceQuery extends TopCategoriesParams {
  /** Business segment for one side of the comparison. */
  business_type: BusinessTypeApi;
}

/**
 * Functionality 3: Top-categories panel for a single business slice.
 */
export interface BusinessTopCategoriesPanelProps {
  /** Panel title, usually matching selected business_type. */
  title: string;
  /** Query model used for /api/metrics/categories/top. */
  query: BusinessSliceQuery;
  /** Rows returned for the selected business_type. */
  rows: TopCategoriesResponse;
  /** Request lifecycle for this panel fetch. */
  request_state: AsyncState;
  /** Optional error string for failed panel request. */
  error_message: string | null;
}

/**
 * Functionality 3: B2B vs B2C comparison view contract.
 * Solves ambiguity by requiring two explicit datasets, one per business type.
 */
export interface B2BVsB2CComparisonViewProps {
  /** Available filter options and date bounds from /api/metrics/facets. */
  facets: FacetsResponse;
  /** Shared date range applied to both B2B and B2C requests. */
  date_range: DateRangeFilter;
  /** Shared operation type applied to both side queries. */
  operation_type: OperationTypeApi;
  /** Shared row limit applied to both side queries (OpenAPI: 1..20). */
  limit: number;
  /** B2B rows from /api/metrics/categories/top?business_type=B2B. */
  b2b_rows: TopCategoriesResponse;
  /** B2C rows from /api/metrics/categories/top?business_type=B2C. */
  b2c_rows: TopCategoriesResponse;
  /** Shared request lifecycle for comparison fetches. */
  request_state: AsyncState;
  /** Optional error message if either side fails. */
  error_message: string | null;
  /** Updates shared date range. */
  on_date_range_change: (next: DateRangeFilter) => void;
  /** Updates shared operation type. */
  on_operation_type_change: (next: OperationTypeApi) => void;
  /** Updates shared limit value. */
  on_limit_change: (next: number) => void;
  /** Triggers both B2B and B2C refresh requests. */
  on_refresh: () => void;
}

/**
 * Cross-feature utility contract for validating date bounds before request dispatch.
 */
export interface DateRangeValidationResult {
  /** True when the date range can be sent to API. */
  is_valid: boolean;
  /** Optional machine-readable reason when validation fails. */
  reason: "missing_range" | "start_after_end" | "out_of_bounds" | null;
  /** Start date normalized to API date format when present. */
  normalized_start_date: ApiDateString | null;
  /** End date normalized to API date format when present. */
  normalized_end_date: ApiDateString | null;
}
