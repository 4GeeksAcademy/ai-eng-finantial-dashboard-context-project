import { Suspense, lazy, useMemo } from "react";
import useSWR from "swr";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KPIRow } from "@/components/dashboard/kpi-row";
import {
  type FinancialMovement,
  type KPIMetrics,
  type MonthlyDataPoint,
} from "@/lib/financial-types";
import { computeKPIs, computeMonthlyData } from "@/lib/financial-utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

const IncomeOutcomeChart = lazy(() =>
  import("@/components/dashboard/income-outcome-chart").then((module) => ({
    default: module.IncomeOutcomeChart,
  })),
);

const ProfitPercentChart = lazy(() =>
  import("@/components/dashboard/profit-percent-chart").then((module) => ({
    default: module.ProfitPercentChart,
  })),
);

async function fetchFinancialData(url: string): Promise<FinancialMovement[]> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch financial data: ${response.status}`);
  }
  return response.json();
}

function App() {
  const { data: movements, error, isLoading } = useSWR<FinancialMovement[]>(
    `${API_BASE_URL}/api/metrics`,
    fetchFinancialData,
    {
      revalidateOnFocus: false,
    },
  );

  const metrics: KPIMetrics | null = useMemo(
    () => (movements ? computeKPIs(movements) : null),
    [movements],
  );
  const monthlyData: MonthlyDataPoint[] = useMemo(
    () => (movements ? computeMonthlyData(movements) : []),
    [movements],
  );
  const loading = isLoading;
  const errorMessage = error
    ? "No se pudo cargar la informacion financiera. Revisa la API de backend."
    : null;

  return (
    <main
      id="main-content"
      tabIndex={-1}
      aria-busy={loading}
      className="dark min-h-screen bg-background text-foreground"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p aria-live="polite" className="sr-only" role="status">
          {loading
            ? "Loading financial dashboard data."
            : errorMessage
              ? "Financial dashboard failed to load."
              : "Financial dashboard data loaded."}
        </p>
        <div className="flex flex-col gap-8">
          <DashboardHeader period="2024 - Full Year" />

          {errorMessage ? (
            <div
              className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive-foreground"
              role="alert"
            >
              {errorMessage}
            </div>
          ) : null}

          <section aria-label="Key performance indicators">
            <KPIRow metrics={metrics} loading={loading} />
          </section>

          <section
            aria-label="Financial charts"
            className="grid grid-cols-1 gap-4 xl:grid-cols-2"
          >
            <Suspense
              fallback={
                <div className="rounded-xl border border-border/60 bg-card p-6 text-sm text-muted-foreground">
                  Loading chart modules...
                </div>
              }
            >
              <IncomeOutcomeChart data={monthlyData} loading={loading} />
            </Suspense>
            <Suspense
              fallback={
                <div className="rounded-xl border border-border/60 bg-card p-6 text-sm text-muted-foreground">
                  Loading chart modules...
                </div>
              }
            >
              <ProfitPercentChart data={monthlyData} loading={loading} />
            </Suspense>
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;
