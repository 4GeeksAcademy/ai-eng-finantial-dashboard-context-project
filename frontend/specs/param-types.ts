/**
 * Date string in `YYYY-MM-DD` format.
 *
 * This template literal enforces the structural pattern at compile time,
 * while runtime validation should still verify calendar-valid values.
 */
export type ISODateString = `${number}${number}${number}${number}-${number}${number}-${number}${number}`

/**
 * Business segment used by comparison-oriented endpoints.
 */
export type BusinessType = 'B2B' | 'B2C'

/**
 * Financial operation kind accepted by metrics endpoints.
 */
export type OperationType = 'income' | 'outcome'

/**
 * Aggregation granularity accepted by summary and alerts endpoints.
 */
export type GroupBy = 'day' | 'week' | 'month'

/**
 * Shared optional date window used across metrics-related endpoints.
 */
export interface DateRangeFilter {
  /**
   * Inclusive lower bound date for filtering records.
   *
   * Format: `YYYY-MM-DD`.
   * If omitted, the backend applies no lower date bound.
   */
  startDate?: ISODateString

  /**
   * Inclusive upper bound date for filtering records.
   *
   * Format: `YYYY-MM-DD`.
   * If omitted, the backend applies no upper date bound.
   */
  endDate?: ISODateString
}

/**
 * Query parameters used by the anomaly alerts feature.
 */
export interface AlertsParams extends DateRangeFilter {
  /**
   * Minimum anomaly ratio to include in the response.
   *
   * Valid range: `>= 0`.
   * Backend default: `0.3` when omitted.
   */
  threshold?: number

  /**
   * Time bucketing level used by the alert baseline calculation.
   *
   * Valid values: `day`, `week`, `month`.
   * Backend default: `month` when omitted.
   */
  groupBy?: GroupBy

  /**
   * Optional business segment filter for the alerts computation.
   *
   * Valid values: `B2B`, `B2C`.
   */
  businessType?: BusinessType
}

/**
 * Query parameters used by the top categories comparison feature.
 */
export interface TopCategoriesParams extends DateRangeFilter {
  /**
   * Operation direction to rank categories by.
   *
   * Valid values: `income`, `outcome`.
   * Backend default: `outcome` when omitted.
   */
  operationType?: OperationType

  /**
   * Maximum number of ranked categories to return.
   *
   * Valid range: integer from `1` to `20`.
   * Backend default: `5` when omitted.
   */
  limit?: number

  /**
   * Optional business segment filter for category aggregation.
   *
   * Valid values: `B2B`, `B2C`.
   */
  businessType?: BusinessType
}
