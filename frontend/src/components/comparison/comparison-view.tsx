import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DateRangeFilter } from "@/components/dashboard/date-range-filter";
import { TopCategoriesTable } from "@/components/comparison/top-categories-table";
import { BusinessTypeComparisonChart } from "@/components/comparison/business-type-comparison-chart";
import { type BusinessType, type TopCategoryItem } from "@/lib/financial-types";
import { isValidDateRange } from "@/lib/date-filter-utils";
import { buildTopCategoriesQueryParams, sumTotalAmount } from "@/lib/business-comparison-utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

async function fetchTopCategories(
  businessType: BusinessType,
  startDate: string,
  endDate: string,
  signal: AbortSignal,
): Promise<TopCategoryItem[]> {
  const params = buildTopCategoriesQueryParams(businessType, startDate, endDate);
  const response = await fetch(
    `${API_BASE_URL}/api/metrics/categories/top?${params.toString()}`,
    { signal },
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch top categories: ${response.status}`);
  }
  return response.json();
}

interface ComparisonViewProps {
  availableRange: { minDate: string; maxDate: string } | null;
}

export function ComparisonView({ availableRange }: ComparisonViewProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const isRangeValid = isValidDateRange(startDate, endDate);
  const dateRangeError = isRangeValid
    ? null
    : "The start date must be before or equal to the end date.";

  const [b2bItems, setB2bItems] = useState<TopCategoryItem[]>([]);
  const [b2bLoading, setB2bLoading] = useState(true);
  const [b2bError, setB2bError] = useState<string | null>(null);

  const [b2cItems, setB2cItems] = useState<TopCategoryItem[]>([]);
  const [b2cLoading, setB2cLoading] = useState(true);
  const [b2cError, setB2cError] = useState<string | null>(null);

  useEffect(() => {
    if (!isRangeValid) {
      return;
    }

    const controller = new AbortController();
    fetchTopCategories("B2B", startDate, endDate, controller.signal)
      .then((data) => {
        setB2bItems(data);
        setB2bError(null);
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setB2bError("No se pudieron cargar las categorias de B2B.");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setB2bLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [startDate, endDate, isRangeValid]);

  useEffect(() => {
    if (!isRangeValid) {
      return;
    }

    const controller = new AbortController();
    fetchTopCategories("B2C", startDate, endDate, controller.signal)
      .then((data) => {
        setB2cItems(data);
        setB2cError(null);
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setB2cError("No se pudieron cargar las categorias de B2C.");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setB2cLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [startDate, endDate, isRangeValid]);

  const showB2bLoading = b2bLoading && isRangeValid;
  const showB2cLoading = b2cLoading && isRangeValid;

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader
        title="B2B vs B2C Comparison"
        subtitle="Income performance across business lines"
        period="2024 - Full Year"
      />

      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        availableRange={availableRange}
        errorMessage={dateRangeError}
      />

      <section
        aria-label="Top income categories by business line"
        className="grid grid-cols-1 gap-4 xl:grid-cols-2"
      >
        <TopCategoriesTable
          title="B2B"
          items={b2bItems}
          loading={showB2bLoading}
          error={b2bError}
        />
        <TopCategoriesTable
          title="B2C"
          items={b2cItems}
          loading={showB2cLoading}
          error={b2cError}
        />
      </section>

      <section aria-label="B2B vs B2C income comparison">
        <BusinessTypeComparisonChart
          b2bTotal={sumTotalAmount(b2bItems)}
          b2cTotal={sumTotalAmount(b2cItems)}
          loading={showB2bLoading || showB2cLoading}
        />
      </section>
    </div>
  );
}
