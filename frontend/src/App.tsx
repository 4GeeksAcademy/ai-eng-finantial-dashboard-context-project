import { type FormEvent, useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KPIRow } from "@/components/dashboard/kpi-row";
import { IncomeOutcomeChart } from "@/components/dashboard/income-outcome-chart";
import { ProfitPercentChart } from "@/components/dashboard/profit-percent-chart";
import {
  type DateRangeFilters,
  type FinancialMovement,
  type KPIMetrics,
  type MetricsFacets,
  type MonthlyDataPoint,
} from "@/lib/financial-types";
import { computeKPIs, computeMonthlyData } from "@/lib/financial-utils";
import {
  buildMetricsQuery,
  buildPeriodLabel,
  normalizeDateInput,
  validateDateRange,
} from "@/lib/date-range-filters";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

async function fetchFinancialData(
  filters: DateRangeFilters,
  signal: AbortSignal,
): Promise<FinancialMovement[]> {
  const query = buildMetricsQuery(filters);
  const response = await fetch(`${API_BASE_URL}/api/metrics${query}`, { signal });
  if (!response.ok) {
    throw new Error(`Failed to fetch financial data: ${response.status}`);
  }
  return response.json();
}

async function fetchMetricsFacets(signal: AbortSignal): Promise<MetricsFacets> {
  const response = await fetch(`${API_BASE_URL}/api/metrics/facets`, { signal });
  if (!response.ok) {
    throw new Error(`Failed to fetch metrics facets: ${response.status}`);
  }
  return response.json();
}

function App() {
  const [metrics, setMetrics] = useState<KPIMetrics | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [facets, setFacets] = useState<MetricsFacets | null>(null);
  const [startDateInput, setStartDateInput] = useState("");
  const [endDateInput, setEndDateInput] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<DateRangeFilters>({
    startDate: null,
    endDate: null,
  });

  const periodLabel = buildPeriodLabel(appliedFilters);

  useEffect(() => {
    const controller = new AbortController();

    fetchMetricsFacets(controller.signal)
      .then((payload) => {
        setFacets(payload);
      })
      .catch((requestError: unknown) => {
        if (
          requestError instanceof Error &&
          requestError.name === "AbortError"
        ) {
          return;
        }
        setError(
          "No se pudo cargar el rango de fechas disponible. Revisa la API de backend.",
        );
      });

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const validationError = validateDateRange(appliedFilters);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchFinancialData(appliedFilters, controller.signal)
      .then((movements) => {
        setMetrics(computeKPIs(movements));
        setMonthlyData(computeMonthlyData(movements));
      })
      .catch((requestError: unknown) => {
        if (
          requestError instanceof Error &&
          requestError.name === "AbortError"
        ) {
          return;
        }
        setError(
          "No se pudo cargar la informacion financiera. Revisa la API de backend.",
        );
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [appliedFilters]);

  function handleApplyFilters(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const nextFilters: DateRangeFilters = {
      startDate: normalizeDateInput(startDateInput),
      endDate: normalizeDateInput(endDateInput),
    };

    const validationError = validateDateRange(nextFilters);
    if (validationError) {
      setError(validationError);
      return;
    }

    setAppliedFilters(nextFilters);
  }

  function handleClearFilters(): void {
    setStartDateInput("");
    setEndDateInput("");
    setAppliedFilters({ startDate: null, endDate: null });
    setError(null);
  }

  return (
    <main className="dark min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <DashboardHeader period={periodLabel} />

          <section
            aria-label="Date range filters"
            className="rounded-lg border border-border bg-card p-4"
          >
            <form
              className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto_auto]"
              onSubmit={handleApplyFilters}
            >
              <label className="flex flex-col gap-1 text-sm text-muted-foreground">
                Fecha de inicio
                <input
                  type="date"
                  value={startDateInput}
                  onChange={(event) => setStartDateInput(event.target.value)}
                  min={facets?.min_date}
                  max={facets?.max_date}
                  className="h-10 rounded-md border border-input bg-background px-3 text-foreground"
                />
              </label>

              <label className="flex flex-col gap-1 text-sm text-muted-foreground">
                Fecha de fin
                <input
                  type="date"
                  value={endDateInput}
                  onChange={(event) => setEndDateInput(event.target.value)}
                  min={facets?.min_date}
                  max={facets?.max_date}
                  className="h-10 rounded-md border border-input bg-background px-3 text-foreground"
                />
              </label>

              <button
                type="submit"
                className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Aplicar
              </button>

              <button
                type="button"
                onClick={handleClearFilters}
                className="h-10 rounded-md border border-border bg-secondary px-4 text-sm font-medium text-secondary-foreground hover:opacity-90"
              >
                Limpiar
              </button>
            </form>

            <p className="mt-2 text-xs text-muted-foreground">
              Rango disponible: {facets?.min_date ?? "..."} a {facets?.max_date ?? "..."}
            </p>
          </section>

          {error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive-foreground">
              {error}
            </div>
          ) : null}

          <section aria-label="Key performance indicators">
            <KPIRow metrics={metrics} loading={loading} />
          </section>

          <section
            aria-label="Financial charts"
            className="grid grid-cols-1 gap-4 xl:grid-cols-2"
          >
            <IncomeOutcomeChart data={monthlyData} loading={loading} />
            <ProfitPercentChart data={monthlyData} loading={loading} />
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;
