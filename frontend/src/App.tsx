import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { AnomalyAlertsTable } from "@/components/dashboard/anomaly-alerts-table";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KPIRow } from "@/components/dashboard/kpi-row";
import { IncomeOutcomeChart } from "@/components/dashboard/income-outcome-chart";
import { ProfitPercentChart } from "@/components/dashboard/profit-percent-chart";
import {
  type DateRangeFilters,
  type FinancialMovement,
  type KPIMetrics,
  type MetricsAlert,
  type MetricsFacets,
  type MonthlyDataPoint,
} from "@/lib/financial-types";
import { computeKPIs, computeMonthlyData } from "@/lib/financial-utils";
import {
  buildAlertsQuery,
  buildMetricsQuery,
  buildPeriodLabel,
  DEFAULT_ALERT_THRESHOLD,
  MAX_ALERT_THRESHOLD,
  MIN_ALERT_THRESHOLD,
  normalizeDateInput,
  normalizeThresholdInput,
  validateAlertThreshold,
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

async function fetchMetricsAlerts(
  filters: DateRangeFilters,
  threshold: number,
  signal: AbortSignal,
): Promise<MetricsAlert[]> {
  const query = buildAlertsQuery(filters, threshold);
  const response = await fetch(`${API_BASE_URL}/api/metrics/alerts${query}`, {
    signal,
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch metrics alerts: ${response.status}`);
  }
  return response.json();
}

function App() {
  const [metrics, setMetrics] = useState<KPIMetrics | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyDataPoint[]>([]);
  const [alerts, setAlerts] = useState<MetricsAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alertsError, setAlertsError] = useState<string | null>(null);
  const [facets, setFacets] = useState<MetricsFacets | null>(null);
  const [startDateInput, setStartDateInput] = useState("");
  const [endDateInput, setEndDateInput] = useState("");
  const [thresholdInput, setThresholdInput] = useState(
    DEFAULT_ALERT_THRESHOLD.toFixed(2),
  );
  const [thresholdError, setThresholdError] = useState<string | null>(null);
  const [appliedThreshold, setAppliedThreshold] = useState(
    DEFAULT_ALERT_THRESHOLD,
  );
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

  useEffect(() => {
    const validationError = validateDateRange(appliedFilters);
    if (validationError) {
      setAlertsError(validationError);
      setAlertsLoading(false);
      return;
    }

    const thresholdValidationError = validateAlertThreshold(appliedThreshold);
    if (thresholdValidationError) {
      setThresholdError(thresholdValidationError);
      setAlertsLoading(false);
      return;
    }

    const controller = new AbortController();
    setAlertsLoading(true);
    setAlertsError(null);

    fetchMetricsAlerts(appliedFilters, appliedThreshold, controller.signal)
      .then((payload) => {
        setAlerts(payload);
      })
      .catch((requestError: unknown) => {
        if (
          requestError instanceof Error &&
          requestError.name === "AbortError"
        ) {
          return;
        }
        setAlertsError(
          "No se pudieron cargar las alertas de anomalias. Revisa la API de backend.",
        );
      })
      .finally(() => {
        setAlertsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [appliedFilters, appliedThreshold]);

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

  function handleStartDateChange(event: ChangeEvent<HTMLInputElement>): void {
    setStartDateInput(event.target.value);
  }

  function handleEndDateChange(event: ChangeEvent<HTMLInputElement>): void {
    setEndDateInput(event.target.value);
  }

  function handleThresholdChange(event: ChangeEvent<HTMLInputElement>): void {
    const { value } = event.target;
    setThresholdInput(value);

    const normalizedThreshold = normalizeThresholdInput(value);
    if (normalizedThreshold === null) {
      setThresholdError("El umbral debe ser un numero valido.");
      return;
    }

    const validationError = validateAlertThreshold(normalizedThreshold);
    if (validationError) {
      setThresholdError(validationError);
      return;
    }

    setThresholdError(null);
    setAppliedThreshold(normalizedThreshold);
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
                  onChange={handleStartDateChange}
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
                  onChange={handleEndDateChange}
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

          <section aria-label="Anomaly alerts">
            <AnomalyAlertsTable
              alerts={alerts}
              loading={alertsLoading}
              error={alertsError}
              thresholdInput={thresholdInput}
              thresholdError={thresholdError}
              onThresholdChange={handleThresholdChange}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Umbral permitido: {MIN_ALERT_THRESHOLD.toFixed(2)} a {MAX_ALERT_THRESHOLD.toFixed(1)}.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;
