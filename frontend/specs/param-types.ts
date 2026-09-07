import type { ApiDateString, BusinessTypeApi, OperationTypeApi } from "./api-types";

export type GroupByParam = "day" | "week" | "month";

export interface DateRangeFilter {
  /** Inclusive start date filter (OpenAPI format: date, YYYY-MM-DD). */
  start_date?: ApiDateString;
  /** Inclusive end date filter (OpenAPI format: date, YYYY-MM-DD). */
  end_date?: ApiDateString;
}

export interface AlertsParams extends DateRangeFilter {
  /** Alert trigger threshold; OpenAPI minimum is 0. */
  threshold?: number;
  /** Aggregation grain for period labels in alert rows. */
  group_by?: GroupByParam;
  /** Optional business segment filter supported by the API. */
  business_type?: BusinessTypeApi;
}

export interface TopCategoriesParams extends DateRangeFilter {
  /** Aggregation operation type for category ranking. */
  operation_type?: OperationTypeApi;
  /** Maximum category rows; OpenAPI constraints: min 1, max 20. */
  limit?: number;
  /** Optional business segment filter supported by the API. */
  business_type?: BusinessTypeApi;
}
