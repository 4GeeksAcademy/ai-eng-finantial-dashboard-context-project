/**
 * Query parameter types for the three planned frontend functionalities.
 *
 * Every property here mirrors a FastAPI `Query(...)` parameter verified
 * against `docs/openapi.json`. All are optional at the type level
 * exactly where the backend's `Query(default=...)` makes them optional —
 * required params are typed as required.
 */

import type { BusinessType, OperationType } from "../src/lib/financial-types";

/**
 * Shared date-range filter, reused by every endpoint that accepts
 * `start_date`/`end_date`. Both are optional and independent of each
 * other — see `frontend/specs/components.md` for the exact UI behavior
 * when only one of the two is set.
 */
export interface DateRangeFilter {
  /**
   * Inclusive lower bound on `create_date`. Format: `YYYY-MM-DD`.
   * When omitted, there is no lower bound — all movements from the
   * start of the dataset are included.
   */
  start_date?: string;
  /**
   * Inclusive upper bound on `create_date`. Format: `YYYY-MM-DD`.
   * When omitted, there is no upper bound — all movements up to the
   * end of the dataset are included.
   */
  end_date?: string;
}

/**
 * Query params for `GET /api/metrics/alerts`, used by Functionality 2.
 *
 * VERIFIED DISCREPANCY: the PM brief says `threshold` is "un ratio entre
 * 0.01 y 1.0". The backend's `Query` schema only declares
 * `minimum: 0` — no `maximum` at all, and no enforced lower bound of
 * 0.01 either (`0` is accepted). If the 0.01–1.0 range matters, it MUST
 * be validated on the frontend before sending the request; the backend
 * will silently accept `0` or `5.0`.
 */
export interface AlertsParams extends DateRangeFilter {
  /**
   * Anomaly sensitivity ratio. PM-intended range: 0.01–1.0 (frontend-
   * enforced, see discrepancy note above). Server default: `0.3`.
   * A period is flagged when its outcome exceeds the cumulative prior
   * average by more than this ratio.
   */
  threshold?: number;
}

/**
 * Query params for `GET /api/metrics/categories/top`, used by
 * Functionality 3. The PM's example query
 * (`?operation_type=income&limit=5`) omits `business_type`, but it is
 * required in practice — without it there is no way to separate B2B
 * from B2C, which is the entire point of the comparison view.
 */
export interface TopCategoriesParams extends DateRangeFilter {
  /**
   * Which side of the ledger to rank categories by. Functionality 3
   * always sends `"income"` — the PM brief asks specifically for
   * revenue performance. Server default: `"outcome"` — do not rely on
   * the default, always send this explicitly for Functionality 3.
   */
  operation_type?: OperationType;
  /**
   * Max rows to return, server-validated to the integer range 1–20.
   * Functionality 3 always sends `5` (the PM's "top 5"). See
   * `CategoryEntry` in `api-types.ts` for why this still returns at most
   * 2 rows for income today. Server default: `5`.
   */
  limit?: number;
  /**
   * Which business line to scope the ranking to. Not in the PM's
   * example query string, but required — omitting it mixes B2B and B2C
   * together, which defeats Functionality 3's purpose.
   */
  business_type?: BusinessType;
}
