/**
 * Request/query parameter types for the Financial Metrics Dashboard.
 * Verified against the running backend's /docs (OpenAPI schema) on 2026-08-03.
 */

// ---------------------------------------------------------------------------
// Shared date range filter (Feature 1)
// ---------------------------------------------------------------------------

/**
 * Optional date range shared by multiple views.
 * Only include the keys the user has actually set in the outgoing query string
 * — do not send empty strings.
 *
 * Partial-range rule: if only one of the two dates is set, the empty one is
 * treated as "no limit" — the request is sent with just the date that was
 * provided (e.g. only start_date means "from that date onward").
 */
export interface DateRangeFilter {
    /** Inclusive start date, format YYYY-MM-DD */
    start_date?: string;
    /** Inclusive end date, format YYYY-MM-DD */
    end_date?: string;
  }
  
  // ---------------------------------------------------------------------------
  // GET /api/metrics (existing endpoint, extended by Feature 1)
  // ---------------------------------------------------------------------------
  
  /**
   * Params for the existing GET /api/metrics call made by the home dashboard.
   * Feature 1 adds start_date/end_date on top of what the endpoint already
   * supports (category, operation_type are not used by the current UI but
   * exist on the API).
   */
  export interface MetricsParams extends DateRangeFilter {
    category?: "suppliers" | "sales" | "operational" | "administrative" | "others";
    operation_type?: "income" | "outcome";
  }
  
  // ---------------------------------------------------------------------------
  // GET /api/metrics/alerts (Feature 2)
  // ---------------------------------------------------------------------------
  
  /**
   * Params for GET /api/metrics/alerts.
   *
   * threshold: ratio; the API itself only enforces minimum 0 with default 0.3.
   * The UI additionally restricts input to [0.01, 1.0]. If the user types a
   * value outside that range, show an inline error message and disable the
   * submit/apply action until the value is corrected — do not clamp
   * automatically and do not silently send an out-of-range value.
   *
   * group_by: the API supports "day" | "week" | "month" (default "month").
   * This spec fixes group_by to "month" for the alerts table; it is not
   * exposed as a user-facing control in Feature 2.
   */
  export interface AlertsParams extends DateRangeFilter {
    /** Spike ratio threshold. UI-enforced range: 0.01–1.0. Default 0.3. */
    threshold: number;
    /** Fixed to "month" for this feature; not user-configurable. */
    group_by: "month";
  }
  
  // ---------------------------------------------------------------------------
  // GET /api/metrics/categories/top (Feature 3)
  // ---------------------------------------------------------------------------
  
  /**
   * Params for GET /api/metrics/categories/top, called once per business line
   * (B2B and B2C) to build the two side-by-side "top 5" tables.
   *
   * limit: the API allows 1–20; this feature always requests 5.
   * Edge case: only 2 income categories exist in the current dataset
   * ("sales", "others"), so the API will typically return fewer than 5 rows.
   * The UI must render whatever rows come back (2, in practice) rather than
   * treating a short list as an error.
   */
  export interface TopCategoriesParams extends DateRangeFilter {
    operation_type: "income";
    /** Always 5 for this feature. */
    limit: 5;
    business_type: "B2B" | "B2C";
  }