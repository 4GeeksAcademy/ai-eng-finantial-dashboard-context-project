import { describe, expect, it } from "vitest";

import {
  buildAlertsQueryParams,
  isValidThreshold,
} from "./anomaly-threshold-utils";

describe("isValidThreshold", () => {
  it("is valid for the default value", () => {
    expect(isValidThreshold("0.3")).toBe(true);
  });

  it("is valid at the lower bound", () => {
    expect(isValidThreshold("0.01")).toBe(true);
  });

  it("is valid at the upper bound", () => {
    expect(isValidThreshold("1")).toBe(true);
  });

  it("is invalid below the lower bound", () => {
    expect(isValidThreshold("0")).toBe(false);
  });

  it("is invalid above the upper bound", () => {
    expect(isValidThreshold("1.5")).toBe(false);
  });

  it("is invalid for non-numeric input", () => {
    expect(isValidThreshold("abc")).toBe(false);
  });

  it("is invalid for an empty value", () => {
    expect(isValidThreshold("")).toBe(false);
  });
});

describe("buildAlertsQueryParams", () => {
  it("always includes threshold", () => {
    const params = buildAlertsQueryParams(0.3, "", "");
    expect(params.toString()).toBe("threshold=0.3");
  });

  it("includes start_date when set", () => {
    const params = buildAlertsQueryParams(0.3, "2024-01-10", "");
    expect(params.toString()).toBe("threshold=0.3&start_date=2024-01-10");
  });

  it("includes end_date when set", () => {
    const params = buildAlertsQueryParams(0.3, "", "2024-01-31");
    expect(params.toString()).toBe("threshold=0.3&end_date=2024-01-31");
  });

  it("includes both dates when set", () => {
    const params = buildAlertsQueryParams(0.5, "2024-01-10", "2024-01-31");
    expect(params.toString()).toBe(
      "threshold=0.5&start_date=2024-01-10&end_date=2024-01-31",
    );
  });
});
