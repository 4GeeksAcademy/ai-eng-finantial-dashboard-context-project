/**
 * API response types for the Financial Metrics Dashboard.
 * Verified against the running backend's /docs (OpenAPI schema) on 2026-08-03.
 * Source endpoints are noted per interface.
 */

// ---------------------------------------------------------------------------
// GET /api/metrics
// ---------------------------------------------------------------------------

/** A single raw financial movement, as already used by the existing dashboard. */
export interface FinancialMovement {
    operation_type: "income" | "outcome";
    business_type: "B2B" | "B2C";
    category: "suppliers" | "sales" | "operational" | "administrative" | "others";
    amount: number;
    /** ISO date-time string */
    create_date: string;
  }
  
  // ---------------------------------------------------------------------------
  // GET /api/metrics/facets
  // ---------------------------------------------------------------------------
  
  /**
   * Response of GET /api/metrics/facets.
   * Used to discover the valid value ranges and available dataset date range.
   */
  export interface FacetsResponse {
    operation_types: ("income" | "outcome")[];
    business_types: ("B2B" | "B2C")[];
    categories: ("suppliers" | "sales" | "operational" | "administrative" | "others")[];
    /** Earliest date with data, format YYYY-MM-DD */
    min_date: string;
    /** Latest date with data, format YYYY-MM-DD */
    max_date: string;
  }
  
  // ---------------------------------------------------------------------------
  // GET /api/metrics/alerts
  // ---------------------------------------------------------------------------
  
  /** A single row returned by GET /api/metrics/alerts. */
  export interface AlertEntry {
    /** Period label. Format depends on group_by (e.g. "2025-12" for month). */
    period: string;
    /** Total outcome recorded in this period. */
    outcome_total: number;
    /** Average outcome of the previous 3 periods (rolling baseline). */
    baseline_average: number;
    /** Increase ratio vs. baseline_average (e.g. 0.5849 = +58.49%). */
    increase_ratio: number;
  }
  
  /** The API returns an array of alerts; can be empty ([]). */
  export type AlertsResponse = AlertEntry[];
  
  // ---------------------------------------------------------------------------
  // GET /api/metrics/categories/top
  // ---------------------------------------------------------------------------
  
  /**
   * A single item returned by GET /api/metrics/categories/top.
   * NOTE: the API does NOT return a percentage — it must be computed on the
   * frontend as total_amount / sum(all total_amount in the response) * 100.
   */
  export interface CategoryEntry {
    category: "suppliers" | "sales" | "operational" | "administrative" | "others";
    operation_type: "income" | "outcome";
    total_amount: number;
  }
  
  export type TopCategoriesResponse = CategoryEntry[];