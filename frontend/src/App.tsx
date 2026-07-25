import { lazy, Suspense, useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KPIRow } from "@/components/dashboard/kpi-row";
import { type FinancialMovement } from "@/lib/financial-types";
import { computeKPIs, computeMonthlyData } from "@/lib/financial-utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

// Skill applied: performance via route-level code splitting for chart-heavy modules (Recharts)
// to reduce initial JavaScript payload and improve first render responsiveness.
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

async function fetchFinancialData(): Promise<FinancialMovement[]> {
  const response = await fetch(`${API_BASE_URL}/api/metrics`);
  if (!response.ok) {
    throw new Error(`Failed to fetch financial data: ${response.status}`);
  }
  return response.json();
}

function ChartCardSkeleton({ ariaLabel }: { ariaLabel: string }) {
  return (
    <div
      aria-busy="true"
      aria-label={ariaLabel}
      className="rounded-xl border border-border/60 bg-card p-6 shadow-sm"
    >
      <div className="mb-3 h-5 w-48 animate-pulse rounded bg-accent" />
      <div className="mb-4 h-3 w-64 animate-pulse rounded bg-accent" />
      <div className="h-[280px] w-full animate-pulse rounded-lg bg-accent" />
    </div>
  );
}

function App() {
  const [movements, setMovements] = useState<FinancialMovement[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    document.title = "Financial Overview Dashboard";

    fetchFinancialData()
      .then((data) => {
        if (!cancelled) {
          setMovements(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            "No se pudo cargar la informacion financiera. Revisa la API de backend.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Derive metrics during render (vercel-react-best-practices: rerender-derived-state-no-effect)
  const metrics = movements ? computeKPIs(movements) : null;
  const monthlyData = movements ? computeMonthlyData(movements) : [];

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main
        id="main-content"
        tabIndex={-1}
        className="dark min-h-screen bg-background text-foreground"
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8">
            <DashboardHeader period="2024 - Full Year" />

            {error ? (
              <div
                role="alert"
                aria-live="assertive"
                className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive-foreground"
              >
                {error}
              </div>
            ) : null}

            <section
              aria-labelledby="kpi-section-title"
              aria-busy={loading}
            >
              <h2 id="kpi-section-title" className="sr-only">
                Key performance indicators
              </h2>
              <KPIRow metrics={metrics} loading={loading} />
            </section>

            <section
              aria-labelledby="charts-section-title"
              aria-busy={loading}
              className="grid grid-cols-1 gap-4 xl:grid-cols-2"
            >
              <h2 id="charts-section-title" className="sr-only">
                Financial charts
              </h2>
              <Suspense
                fallback={
                  <ChartCardSkeleton ariaLabel="Loading income and outcome chart" />
                }
              >
                <IncomeOutcomeChart data={monthlyData} loading={loading} />
              </Suspense>
              <Suspense
                fallback={
                  <ChartCardSkeleton ariaLabel="Loading profit margin chart" />
                }
              >
                <ProfitPercentChart data={monthlyData} loading={loading} />
              </Suspense>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
