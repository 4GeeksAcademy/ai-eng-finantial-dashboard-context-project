import { describe, expect, it } from "vitest";

import {
  buildTopCategoriesQueryParams,
  computeCategoryShares,
  sumTotalAmount,
} from "./business-comparison-utils";
import type { TopCategoryItem } from "./financial-types";

const sampleItems: TopCategoryItem[] = [
  { category: "sales", operation_type: "income", total_amount: 750 },
  { category: "others", operation_type: "income", total_amount: 250 },
];

describe("sumTotalAmount", () => {
  it("returns 0 for an empty list", () => {
    expect(sumTotalAmount([])).toBe(0);
  });

  it("sums total_amount across items", () => {
    expect(sumTotalAmount(sampleItems)).toBe(1000);
  });
});

describe("computeCategoryShares", () => {
  it("returns an empty array for an empty list", () => {
    expect(computeCategoryShares([])).toEqual([]);
  });

  it("gives 100% for a single item", () => {
    const result = computeCategoryShares([sampleItems[0]]);
    expect(result).toEqual([{ ...sampleItems[0], percentage: 100 }]);
  });

  it("computes percentages that add up to 100", () => {
    const result = computeCategoryShares(sampleItems);
    expect(result[0].percentage).toBe(75);
    expect(result[1].percentage).toBe(25);
    expect(result[0].percentage + result[1].percentage).toBe(100);
  });
});

describe("buildTopCategoriesQueryParams", () => {
  it("always includes operation_type, limit and business_type", () => {
    const params = buildTopCategoriesQueryParams("B2B", "", "");
    expect(params.toString()).toBe(
      "operation_type=income&limit=5&business_type=B2B",
    );
  });

  it("includes start_date when set", () => {
    const params = buildTopCategoriesQueryParams("B2C", "2024-01-10", "");
    expect(params.toString()).toBe(
      "operation_type=income&limit=5&business_type=B2C&start_date=2024-01-10",
    );
  });

  it("includes both dates when set", () => {
    const params = buildTopCategoriesQueryParams("B2B", "2024-01-10", "2024-01-31");
    expect(params.toString()).toBe(
      "operation_type=income&limit=5&business_type=B2B&start_date=2024-01-10&end_date=2024-01-31",
    );
  });
});
