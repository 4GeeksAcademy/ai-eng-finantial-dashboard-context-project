import { describe, expect, it } from "vitest";

import {
  buildAlertsQuery,
  buildBusinessMetricsQuery,
  buildMetricsQuery,
  buildPeriodLabel,
  buildTopCategoriesQuery,
  normalizeThresholdInput,
  validateAlertThreshold,
  normalizeDateInput,
  validateDateRange,
} from "./date-range-filters";

describe("normalizeDateInput", () => {
  it("returns null for empty input", () => {
    expect(normalizeDateInput("")).toBeNull();
    expect(normalizeDateInput("   ")).toBeNull();
  });

  it("accepts valid YYYY-MM-DD", () => {
    expect(normalizeDateInput("2026-07-07")).toBe("2026-07-07");
  });

  it("rejects invalid calendar dates", () => {
    expect(normalizeDateInput("2026-02-30")).toBeNull();
    expect(normalizeDateInput("07-07-2026")).toBeNull();
  });
});

describe("validateDateRange", () => {
  it("allows empty filters", () => {
    expect(validateDateRange({ startDate: null, endDate: null })).toBeNull();
  });

  it("returns error when start is after end", () => {
    expect(
      validateDateRange({ startDate: "2026-07-08", endDate: "2026-07-07" }),
    ).toBe("La fecha de inicio no puede ser mayor a la fecha de fin.");
  });
});

describe("buildMetricsQuery", () => {
  it("returns empty query with no filters", () => {
    expect(buildMetricsQuery({ startDate: null, endDate: null })).toBe("");
  });

  it("builds query with both filters", () => {
    expect(
      buildMetricsQuery({ startDate: "2026-01-01", endDate: "2026-01-31" }),
    ).toBe("?start_date=2026-01-01&end_date=2026-01-31");
  });
});

describe("buildPeriodLabel", () => {
  it("returns Full Year when no filters are set", () => {
    expect(buildPeriodLabel({ startDate: null, endDate: null })).toBe("Full Year");
  });
});

describe("normalizeThresholdInput", () => {
  it("returns null for empty input", () => {
    expect(normalizeThresholdInput(" ")).toBeNull();
  });

  it("parses valid numeric input", () => {
    expect(normalizeThresholdInput("0.35")).toBe(0.35);
  });
});

describe("validateAlertThreshold", () => {
  it("accepts values inside range", () => {
    expect(validateAlertThreshold(0.01)).toBeNull();
    expect(validateAlertThreshold(0.3)).toBeNull();
    expect(validateAlertThreshold(1)).toBeNull();
  });

  it("rejects values outside allowed range", () => {
    expect(validateAlertThreshold(0)).toBe("El umbral debe estar entre 0.01 y 1.0.");
    expect(validateAlertThreshold(1.01)).toBe("El umbral debe estar entre 0.01 y 1.0.");
  });
});

describe("buildAlertsQuery", () => {
  it("includes threshold without dates", () => {
    expect(buildAlertsQuery({ startDate: null, endDate: null }, 0.3)).toBe(
      "?threshold=0.3",
    );
  });

  it("includes threshold and date range", () => {
    expect(
      buildAlertsQuery(
        { startDate: "2026-01-01", endDate: "2026-01-31" },
        0.45,
      ),
    ).toBe("?start_date=2026-01-01&end_date=2026-01-31&threshold=0.45");
  });
});

describe("comparison queries", () => {
  it("builds top categories query for a business type", () => {
    expect(
      buildTopCategoriesQuery(
        { startDate: "2026-01-01", endDate: "2026-01-31" },
        "B2B",
        5,
      ),
    ).toBe(
      "?start_date=2026-01-01&end_date=2026-01-31&operation_type=income&business_type=B2B&limit=5",
    );
  });

  it("builds business metrics query with date range and operation type", () => {
    expect(
      buildBusinessMetricsQuery(
        { startDate: "2026-01-01", endDate: null },
        "income",
      ),
    ).toBe("?start_date=2026-01-01&operation_type=income");
  });
});
