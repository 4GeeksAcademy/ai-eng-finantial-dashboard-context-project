import { useEffect, useState } from "react";
import { AnomalyAlertsTable } from "@/components/dashboard/anomaly-alerts-table";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DateRangeFilter } from "@/components/dashboard/date-range-filter";
import { KPIRow } from "@/components/dashboard/kpi-row";
import { IncomeOutcomeChart } from "@/components/dashboard/income-outcome-chart";
import { ProfitPercentChart } from "@/components/dashboard/profit-percent-chart";
import {
  type FinancialMovement,
  type KPIMetrics,
  type MetricsAlert,
  type MetricsFacets,
  type MonthlyDataPoint,
} from "@/lib/financial-types";
import { computeKPIs, computeMonthlyData } from "@/lib/financial-utils";
import { buildMetricsQueryParams, isValidDateRange } from "@/lib/date-filter-utils";
import {
  buildAlertsQueryParams,
  isValidThreshold,
} from "@/lib/anomaly-threshold-utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

async function fetchFinancialData(
  startDate: string,
  endDate: string,
  signal: AbortSignal,
): Promise<FinancialMovement[]> {
  const params = buildMetricsQueryParams(startDate, endDate);
  const query = params.toString();
  const response = await fetch(
    `${API_BASE_URL}/api/metrics${query ? `?${query}` : ""}`,
    { signal },
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch financial data: ${response.status}`);
  }
  return response.json();
}

async function fetchMetricsFacets(): Promise<MetricsFacets> {
  const response = await fetch(`${API_BASE_URL}/api/metrics/facets`);
  if (!response.ok) {
    throw new Error(`Failed to fetch metrics facets: ${response.status}`);
  }
  return response.json();
}

async function fetchMetricsAlerts(
  threshold: number,
  startDate: string,
  endDate: string,
  signal: AbortSignal,
): Promise<MetricsAlert[]> {
  const params = buildAlertsQueryParams(threshold, startDate, endDate);
  const response = await fetch(`${API_BASE_URL}/api/metrics/alerts?${params.toString()}`, {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [availableRange, setAvailableRange] = useState<{
    minDate: string;
    maxDate: string;
  } | null>(null);

  const isRangeValid = isValidDateRange(startDate, endDate);
  const dateRangeError = isRangeValid
    ? null
    : "The start date must be before or equal to the end date.";

  const [threshold, setThreshold] = useState("0.3");
  const [alerts, setAlerts] = useState<MetricsAlert[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [alertsError, setAlertsError] = useState<string | null>(null);

  const isThresholdValid = isValidThreshold(threshold);
  const thresholdError = isThresholdValid
    ? null
    : "The threshold must be a number between 0.01 and 1.0.";

  useEffect(() => {
    fetchMetricsFacets()
      .then((facets) => {
        setAvailableRange({ minDate: facets.min_date, maxDate: facets.max_date });
      })
      .catch(() => {
        setAvailableRange(null);
      });
  }, []);

  useEffect(() => {
    if (!isRangeValid) {
      return;
    }

    const controller = new AbortController();
    fetchFinancialData(startDate, endDate, controller.signal)
      .then((movements) => {
        setMetrics(computeKPIs(movements));
        setMonthlyData(computeMonthlyData(movements));
        setError(null);
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setError(
          "No se pudo cargar la informacion financiera. Revisa la API de backend.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [startDate, endDate, isRangeValid]);

  useEffect(() => {
    if (!isThresholdValid || !isRangeValid) {
      return;
    }

    const controller = new AbortController();
    fetchMetricsAlerts(Number(threshold), startDate, endDate, controller.signal)
      .then((data) => {
        setAlerts(data);
        setAlertsError(null);
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setAlertsError("No se pudieron cargar las alertas de anomalias.");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setAlertsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [threshold, startDate, endDate, isThresholdValid, isRangeValid]);

  const showLoading = loading && isRangeValid;
  const showAlertsLoading = alertsLoading && isThresholdValid && isRangeValid;

  return (
    <main className="dark min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <DashboardHeader period="2024 - Full Year" />

          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            availableRange={availableRange}
            errorMessage={dateRangeError}
          />

          {error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive-foreground">
              {error}
            </div>
          ) : null}

          <section aria-label="Key performance indicators">
            <KPIRow metrics={metrics} loading={showLoading} />
          </section>

          <section
            aria-label="Financial charts"
            className="grid grid-cols-1 gap-4 xl:grid-cols-2"
          >
            <IncomeOutcomeChart data={monthlyData} loading={showLoading} />
            <ProfitPercentChart data={monthlyData} loading={showLoading} />
          </section>

          <section aria-label="Anomaly alerts">
            <AnomalyAlertsTable
              alerts={alerts}
              threshold={threshold}
              onThresholdChange={setThreshold}
              thresholdError={thresholdError}
              loading={showAlertsLoading}
              error={alertsError}
            />
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;
