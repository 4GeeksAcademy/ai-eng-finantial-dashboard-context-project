/**
 * Response types for the three planned frontend functionalities.
 *
 * Every interface here is a 1:1 mirror of a Pydantic response model in
 * `backend/app/routes.py`, verified against the live OpenAPI contract at
 * `docs/openapi.json` (regenerate it with `docs/README.md`'s command if
 * the backend changes). Property names are kept in the API's original
 * snake_case — do not rename them to camelCase, they are meant to be
 * assigned directly from `response.json()`.
 *
 * Domain literal types (`Category`, `OperationType`, `BusinessType`) are
 * reused from `frontend/src/lib/financial-types.ts` rather than
 * redeclared, so this file can never drift from the actual frontend
 * source of truth for those enums.
 */

import type {
  BusinessType,
  Category,
  OperationType,
} from "../src/lib/financial-types";

/**
 * Response of `GET /api/metrics/facets`.
 *
 * Used by Functionality 1 (date range filter) purely for `min_date`/
 * `max_date`, shown next to the date inputs as a reference of the valid
 * range.
 *
 * VERIFIED DISCREPANCY (see `frontend/specs/README.md` for detail): the
 * PM brief for Functionality 3 (B2B vs B2C) says "las categorías
 * disponibles para cada grupo deben obtenerse del endpoint de facetas" —
 * but `categories` here is a single **global** list, not segmented by
 * `business_type` or `operation_type` (confirmed by reading
 * `build_metrics_facets` in `backend/app/routes.py`, which iterates over
 * *all* movements with no filter). Do NOT use `categories` to determine
 * what's available per business line in Functionality 3 — use the
 * `category` field already present in each `CategoryEntry` returned by
 * `GET /api/metrics/categories/top?business_type=...` instead.
 */
export interface FacetsResponse {
  /** All operation types present anywhere in the dataset. */
  operation_types: OperationType[];
  /** All business types present anywhere in the dataset. */
  business_types: BusinessType[];
  /**
   * All categories present anywhere in the dataset, income and outcome
   * combined, both business types combined. NOT scoped to a single
   * group — see the discrepancy note above.
   */
  categories: Category[];
  /** Earliest `create_date` in the dataset, as `YYYY-MM-DD`. */
  min_date: string;
  /** Latest `create_date` in the dataset, as `YYYY-MM-DD`. */
  max_date: string;
}

/**
 * One anomaly row in the response of `GET /api/metrics/alerts`.
 * Used by Functionality 2 (anomaly alerts table).
 *
 * VERIFIED DISCREPANCY: the PM brief says this table shows "media móvil
 * de los 3 períodos anteriores". It does not. Reading
 * `detect_outcome_alerts` in `backend/app/routes.py`, `baseline_average`
 * is a **cumulative (expanding) average** of every period before the
 * current one, back to the start of the filtered range — not a fixed
 * 3-period window. Label this column honestly in the UI (e.g. "Previous
 * average"), do not call it a "3-period moving average".
 */
export interface AlertEntry {
  /**
   * The period this alert belongs to, formatted according to the
   * `group_by` query param used for the request: `YYYY-MM-DD` for
   * `"day"`, `YYYY-Www` (ISO week) for `"week"`, `YYYY-MM` for
   * `"month"` (the default).
   */
  period: string;
  /** Total outcome amount for this period. Always >= 0. */
  outcome_total: number;
  /**
   * Cumulative average of `outcome_total` across every period strictly
   * before this one (see discrepancy note above). Only periods where
   * this baseline is defined AND positive AND exceeded by more than
   * `threshold` are returned — the first period in the range can never
   * produce a row, since it has no prior periods to average.
   */
  baseline_average: number;
  /**
   * `(outcome_total - baseline_average) / baseline_average`, e.g. `0.42`
   * means a 42% increase over the baseline. This is a ratio, not a
   * pre-multiplied percentage — multiply by 100 for display.
   */
  increase_ratio: number;
}

/** Response of `GET /api/metrics/alerts` — already filtered server-side to only the periods that exceeded `threshold`. Empty array means no anomalies for the current filter, not an error. */
export type AlertsResponse = AlertEntry[];

/**
 * One row in the response of `GET /api/metrics/categories/top`.
 * Used by Functionality 3 (B2B vs B2C comparison tables).
 *
 * VERIFIED DISCREPANCY #1: the PM brief asks for "porcentaje sobre el
 * total del grupo" as a table column. This field is NOT in the API
 * response — `TopCategoryItem` in `backend/app/routes.py` has no
 * percentage field. It must be computed on the frontend from the
 * `total_amount` values already present in the response array (safe to
 * do because of discrepancy #2 below — the array is always complete).
 *
 * VERIFIED DISCREPANCY #2: the PM brief says "las 5 categorías de
 * ingreso principales" — with `limit=5`. `Category` has exactly 5
 * possible literal values, so requesting `limit=5` always returns every
 * category that has at least one matching movement, never a truncated
 * subset. In practice, reading `_build_movement` in
 * `backend/app/routes.py`, an `income` movement can only ever have
 * category `"sales"` or `"others"` — `"suppliers"`, `"operational"` and
 * `"administrative"` only ever appear on `outcome` movements. So a
 * top-5 income-categories table will realistically render **at most 2
 * rows**, not 5. This is expected behavior of the current dataset, not
 * a bug — the UI copy must not promise "top 5" literally, and both
 * `TopCategoriesResponse` panels (B2B and B2C) must specify what they
 * render with fewer than 5 rows (see `frontend/specs/components.md`).
 */
export interface CategoryEntry {
  category: Category;
  /**
   * Always `"income"` for Functionality 3 — the request always pins
   * `operation_type=income` (see `TopCategoriesParams` in
   * `param-types.ts`). Kept here because the API returns it regardless.
   */
  operation_type: OperationType;
  /** Total amount for this category within the requested filters. */
  total_amount: number;
}

/**
 * Response of `GET /api/metrics/categories/top`. Already sorted by
 * `total_amount` descending, already limited to `limit` entries — never
 * re-sort or re-slice it on the frontend.
 */
export type TopCategoriesResponse = CategoryEntry[];
