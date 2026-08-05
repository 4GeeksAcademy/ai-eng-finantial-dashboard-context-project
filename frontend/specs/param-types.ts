/**
 * Date range filter
 */
export interface DateRangeFilter {
  /** Start date (YYYY-MM-DD) */
  start_date?: string;

  /** End date (YYYY-MM-DD) */
  end_date?: string;
}

/**
 * Parameters for alerts endpoint
 */
export interface AlertsParams extends DateRangeFilter {
  /** Threshold between 0 and 1 (defaults to 0.3 in API) */
  threshold?: number;
}

/**
 * Parameters for top categories endpoint
 */
export interface TopCategoriesParams extends DateRangeFilter {
  /** Operation type */
  operation_type: "income" | "outcome";

  /** Maximum number of categories */
  limit: number;
}