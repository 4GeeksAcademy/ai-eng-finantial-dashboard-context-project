import { type BusinessType, type TopCategoryItem } from "./financial-types";

export function sumTotalAmount(items: TopCategoryItem[]): number {
  return items.reduce((sum, item) => sum + item.total_amount, 0);
}

export function computeCategoryShares(
  items: TopCategoryItem[],
): (TopCategoryItem & { percentage: number })[] {
  const total = sumTotalAmount(items);
  return items.map((item) => ({
    ...item,
    percentage: total > 0 ? (item.total_amount / total) * 100 : 0,
  }));
}

export function buildTopCategoriesQueryParams(
  businessType: BusinessType,
  startDate: string,
  endDate: string,
): URLSearchParams {
  const params = new URLSearchParams();
  params.set("operation_type", "income");
  params.set("limit", "5");
  params.set("business_type", businessType);
  if (startDate) {
    params.set("start_date", startDate);
  }
  if (endDate) {
    params.set("end_date", endDate);
  }
  return params;
}
