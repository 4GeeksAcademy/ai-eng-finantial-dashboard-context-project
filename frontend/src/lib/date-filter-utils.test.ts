import { describe, expect, it } from "vitest";

import { buildMetricsQueryParams, isValidDateRange } from "./date-filter-utils";

describe("isValidDateRange", () => {
  it("is valid when both dates are empty", () => {
    expect(isValidDateRange("", "")).toBe(true);
  });

  it("is valid when only start date is set", () => {
    expect(isValidDateRange("2024-01-10", "")).toBe(true);
  });

  it("is valid when only end date is set", () => {
    expect(isValidDateRange("", "2024-01-10")).toBe(true);
  });

  it("is valid when start is before end", () => {
    expect(isValidDateRange("2024-01-01", "2024-01-31")).toBe(true);
  });

  it("is valid when start equals end", () => {
    expect(isValidDateRange("2024-01-15", "2024-01-15")).toBe(true);
  });

  it("is invalid when start is after end", () => {
    expect(isValidDateRange("2024-02-01", "2024-01-01")).toBe(false);
  });
});

describe("buildMetricsQueryParams", () => {
  it("returns empty params when no dates are set", () => {
    const params = buildMetricsQueryParams("", "");
    expect(params.toString()).toBe("");
  });

  it("includes only start_date when only start is set", () => {
    const params = buildMetricsQueryParams("2024-01-10", "");
    expect(params.toString()).toBe("start_date=2024-01-10");
  });

  it("includes only end_date when only end is set", () => {
    const params = buildMetricsQueryParams("", "2024-01-31");
    expect(params.toString()).toBe("end_date=2024-01-31");
  });

  it("includes both when both are set", () => {
    const params = buildMetricsQueryParams("2024-01-10", "2024-01-31");
    expect(params.toString()).toBe("start_date=2024-01-10&end_date=2024-01-31");
  });
});
