import { describe, expect, it } from "vitest";

import {
  buildMetricsQuery,
  buildPeriodLabel,
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
