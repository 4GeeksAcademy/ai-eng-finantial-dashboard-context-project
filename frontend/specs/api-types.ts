import type { BusinessType, GroupBy, ISODateString, OperationType } from './param-types'

/**
 * Financial category labels exposed by metrics endpoints.
 */
export type Category = 'suppliers' | 'sales' | 'operational' | 'administrative' | 'others'

/**
 * ISO 8601 timestamp string used for metadata fields.
 *
 * Expected format example: `2026-07-18T14:05:00Z`.
 */
export type ISODateTimeString = `${ISODateString}T${string}`

/**
 * API payload from `/api/metrics/facets`.
 *
 * This response powers date picker boundaries and available enum filters
 * in B2B vs B2C-related views.
 */
export interface FacetsResponse {
  /**
   * Operation types currently present in the dataset.
   *
   * Values are limited to `income` and `outcome`.
   */
  operation_types: OperationType[]

  /**
   * Business segments currently present in the dataset.
   *
   * Values are limited to `B2B` and `B2C`.
   */
  business_types: BusinessType[]

  /**
   * Categories currently present in the dataset.
   *
   * Values are limited to known category enums returned by the API.
   */
  categories: Category[]

  /**
   * Earliest available movement date in the current dataset.
   *
   * Format: `YYYY-MM-DD`.
   */
  min_date: ISODateString

  /**
   * Latest available movement date in the current dataset.
   *
   * Format: `YYYY-MM-DD`.
   */
  max_date: ISODateString
}

/**
 * Single anomaly row rendered in the alerts table.
 *
 * This interface mirrors one item from `/api/metrics/alerts`.
 */
export interface AlertEntry {
  /**
   * Time bucket identifier where the anomaly occurred.
   *
   * The exact string format depends on `group_by`.
   * Typical examples: `2026-07`, `2026-W28`, or `2026-07-18`.
   */
  period: string

  /**
   * Total outcome amount for the period represented by `period`.
   */
  outcome_total: number

  /**
   * Baseline average outcome used as comparison reference.
   *
   * Usually computed from prior periods on the backend.
   */
  baseline_average: number

  /**
   * Relative increase ratio against the baseline average.
   *
   * Example: `0.45` means a 45% increase.
   */
  increase_ratio: number
}

/**
 * Alert list response consumed by the anomaly table feature.
 *
 * `items` contains API rows, while metadata supports pagination,
 * diagnostics, and UI state introspection.
 */
export interface AlertsResponse {
  /**
   * List of anomaly rows to display.
   */
  items: AlertEntry[]

  /**
   * Number of rows returned in `items`.
   *
   * This is typically `items.length` at response generation time.
   */
  totalCount: number

  /**
   * Threshold value applied when producing this response.
   *
   * Valid range: `>= 0`.
   */
  threshold: number

  /**
   * Aggregation granularity used to compute the anomaly periods.
   */
  groupBy: GroupBy

  /**
   * UTC timestamp indicating when the response was assembled.
   *
   * Format: ISO 8601 date-time string.
   */
  generatedAt: ISODateTimeString
}

/**
 * Single category aggregate row used in B2B vs B2C ranking tables.
 *
 * This interface mirrors one item from `/api/metrics/categories/top`.
 */
export interface CategoryEntry {
  /**
   * Ranked category name.
   */
  category: Category

  /**
   * Operation type used during aggregation.
   */
  operation_type: OperationType

  /**
   * Sum of amounts for the given `category` and `operation_type`.
   */
  total_amount: number
}

/**
 * Top categories response consumed by the comparison table feature.
 */
export interface TopCategoriesResponse {
  /**
   * Ordered ranking entries returned for the selected filters.
   */
  items: CategoryEntry[]

  /**
   * Number of entries included in `items`.
   */
  totalCount: number

  /**
   * Requested maximum number of category rows for this response.
   *
   * Valid range: integer from `1` to `20`.
   */
  limit: number

  /**
   * Operation type used for ranking.
   */
  operationType: OperationType

  /**
   * UTC timestamp indicating when the response was assembled.
   *
   * Format: ISO 8601 date-time string.
   */
  generatedAt: ISODateTimeString
}
