import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { AnomalyAlertsTable } from "@/components/dashboard/anomaly-alerts-table";
import { BusinessIncomeComparisonChart } from "@/components/dashboard/business-income-comparison-chart";
import { BusinessIncomeTable } from "@/components/dashboard/business-income-table";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KPIRow } from "@/components/dashboard/kpi-row";
import { IncomeOutcomeChart } from "@/components/dashboard/income-outcome-chart";
import { ProfitPercentChart } from "@/components/dashboard/profit-percent-chart";
import {
  type BusinessCategoryShare,
  type BusinessType,
  type DateRangeFilters,
  type DashboardView,
  type FinancialMovement,
  type KPIMetrics,
  type MetricsAlert,
  type MetricsFacets,
  type MonthlyDataPoint,
  type TopCategoryItem,
} from "@/lib/financial-types";
import {
  computeCategoryShareRows,
  computeIncomeTotal,
  computeKPIs,
  computeMonthlyData,
} from "@/lib/financial-utils";
import {
  buildAlertsQuery,
  buildBusinessMetricsQuery,
  buildMetricsQuery,
  buildPeriodLabel,
  buildTopCategoriesQuery,
  DEFAULT_ALERT_THRESHOLD,
  MAX_ALERT_THRESHOLD,
  MIN_ALERT_THRESHOLD,
  normalizeDateInput,
  normalizeThresholdInput,
  validateAlertThreshold,
  validateDateRange,
} from "@/lib/date-range-filters";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
const TOP_CATEGORIES_LIMIT = 5;

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

async function fetchTopCategories(
  filters: DateRangeFilters,
  businessType: BusinessType,
  limit: number,
  signal: AbortSignal,
): Promise<TopCategoryItem[]> {
  const query = buildTopCategoriesQuery(filters, businessType, limit);
  const response = await fetch(`${API_BASE_URL}/api/metrics/categories/top${query}`, {
    signal,
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch top categories: ${response.status}`);
  }
  return response.json();
}

async function fetchBusinessIncomeMovements(
  filters: DateRangeFilters,
  businessType: BusinessType,
  signal: AbortSignal,
): Promise<FinancialMovement[]> {
  const endpoint = businessType === "B2B" ? "/api/metrics/b2b" : "/api/metrics/b2c";
  const query = buildBusinessMetricsQuery(filters, "income");
  const response = await fetch(`${API_BASE_URL}${endpoint}${query}`, { signal });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${businessType} income movements: ${response.status}`);
  }
  return response.json();
}

function App() {
  const [activeView, setActiveView] = useState<DashboardView>("overview");
  const [metrics, setMetrics] = useState<KPIMetrics | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyDataPoint[]>([]);
  const [alerts, setAlerts] = useState<MetricsAlert[]>([]);
  const [b2bRows, setB2bRows] = useState<BusinessCategoryShare[]>([]);
  const [b2cRows, setB2cRows] = useState<BusinessCategoryShare[]>([]);
  const [b2bTotalIncome, setB2bTotalIncome] = useState(0);
  const [b2cTotalIncome, setB2cTotalIncome] = useState(0);
  const [loading, setLoading] = useState(true);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [comparisonLoading, setComparisonLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alertsError, setAlertsError] = useState<string | null>(null);
  const [comparisonError, setComparisonError] = useState<string | null>(null);
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
    const pageTitle =
      activeView === "overview"
        ? "Financial Overview | AI Financial Dashboard"
        : "B2B vs B2C Comparison | AI Financial Dashboard";
    const pageDescription =
      activeView === "overview"
        ? "Executive financial KPIs, income/outcome trends, and anomaly alerts for your business."
        : "Compare B2B and B2C income performance by category and total contribution.";

    document.title = pageTitle;

    const descriptionMeta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (descriptionMeta) {
      descriptionMeta.setAttribute("content", pageDescription);
    }
  }, [activeView]);

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
    if (activeView !== "overview") {
      return;
    }

    const controller = new AbortController();

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
  }, [activeView, appliedFilters]);

  useEffect(() => {
    if (activeView !== "overview") {
      return;
    }

    const controller = new AbortController();

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
  }, [activeView, appliedFilters, appliedThreshold]);

  useEffect(() => {
    if (activeView !== "comparison") {
      return;
    }

    const controller = new AbortController();
    const limit = Math.min(TOP_CATEGORIES_LIMIT, facets?.categories.length ?? TOP_CATEGORIES_LIMIT);

    Promise.all([
      fetchTopCategories(appliedFilters, "B2B", limit, controller.signal),
      fetchTopCategories(appliedFilters, "B2C", limit, controller.signal),
      fetchBusinessIncomeMovements(appliedFilters, "B2B", controller.signal),
      fetchBusinessIncomeMovements(appliedFilters, "B2C", controller.signal),
    ])
      .then(([b2bTopCategories, b2cTopCategories, b2bMovements, b2cMovements]) => {
        const nextB2bTotal = computeIncomeTotal(b2bMovements);
        const nextB2cTotal = computeIncomeTotal(b2cMovements);

        setB2bTotalIncome(nextB2bTotal);
        setB2cTotalIncome(nextB2cTotal);
        setB2bRows(computeCategoryShareRows(b2bTopCategories, nextB2bTotal));
        setB2cRows(computeCategoryShareRows(b2cTopCategories, nextB2cTotal));
      })
      .catch((requestError: unknown) => {
        if (
          requestError instanceof Error &&
          requestError.name === "AbortError"
        ) {
          return;
        }
        setB2bRows([]);
        setB2cRows([]);
        setB2bTotalIncome(0);
        setB2cTotalIncome(0);
        setComparisonError(
          "No se pudo cargar la comparativa B2B vs B2C. Revisa la API de backend.",
        );
      })
      .finally(() => {
        setComparisonLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [activeView, appliedFilters, facets?.categories.length]);

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

    setError(null);
    setAlertsError(null);
    setComparisonError(null);
    setLoading(true);
    setAlertsLoading(true);
    setComparisonLoading(true);
    setAppliedFilters(nextFilters);
  }

  function handleClearFilters(): void {
    setStartDateInput("");
    setEndDateInput("");
    setLoading(true);
    setAlertsLoading(true);
    setComparisonLoading(true);
    setAlertsError(null);
    setComparisonError(null);
    setAppliedFilters({ startDate: null, endDate: null });
    setError(null);
  }

  function handleChangeView(view: DashboardView): void {
    if (view === activeView) {
      return;
    }

    if (view === "overview") {
      setLoading(true);
      setAlertsLoading(true);
      setError(null);
      setAlertsError(null);
    } else {
      setComparisonLoading(true);
      setComparisonError(null);
    }

    setActiveView(view);
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

  const headerTitle =
    activeView === "overview" ? "Financial Overview" : "B2B vs B2C Comparison";
  const headerSubtitle =
    activeView === "overview"
      ? "Executive metrics dashboard"
      : "Income performance comparison by business line";
  const availableComparisonCategories = facets?.categories ?? [];

  return (
    <main className="dark min-h-screen bg-background text-foreground">
      <a
        href="#dashboard-content"
        className="sr-only rounded-md bg-card px-3 py-2 text-sm text-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        Saltar al contenido principal
      </a>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div id="dashboard-content" className="flex flex-col gap-8">
          <DashboardHeader
            title={headerTitle}
            subtitle={headerSubtitle}
            period={periodLabel}
          />

          <section aria-label="Dashboard views" className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleChangeView("overview")}
              aria-pressed={activeView === "overview"}
              className={
                activeView === "overview"
                  ? "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  : "rounded-md border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
              }
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => handleChangeView("comparison")}
              aria-pressed={activeView === "comparison"}
              className={
                activeView === "comparison"
                  ? "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  : "rounded-md border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
              }
            >
              B2B vs B2C
            </button>
          </section>

          <section
            aria-label="Date range filters"
            className="rounded-lg border border-border bg-card p-4"
          >
            <form
              className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]"
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

              <div className="flex items-end gap-2 md:self-end">
                <button
                  type="submit"
                  className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Aplicar
                </button>

                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="h-10 rounded-md border border-border bg-secondary px-4 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                >
                  Limpiar
                </button>
              </div>
            </form>

            <p className="mt-2 text-xs text-muted-foreground">
              Rango disponible: {facets?.min_date ?? "..."} a {facets?.max_date ?? "..."}
            </p>
          </section>

          {activeView === "overview" && error ? (
            <div
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive-foreground"
            >
              {error}
            </div>
          ) : null}

          {activeView === "overview" ? (
            <>
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
            </>
          ) : (
            <>
              {comparisonError ? (
                <div
                  role="alert"
                  className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive-foreground"
                >
                  {comparisonError}
                </div>
              ) : null}

              <section
                aria-label="Business income category comparison"
                className="grid grid-cols-1 gap-4 xl:grid-cols-2"
              >
                <BusinessIncomeTable
                  businessType="B2B"
                  rows={b2bRows}
                  totalIncome={b2bTotalIncome}
                  availableCategories={availableComparisonCategories}
                  loading={comparisonLoading}
                  error={null}
                />
                <BusinessIncomeTable
                  businessType="B2C"
                  rows={b2cRows}
                  totalIncome={b2cTotalIncome}
                  availableCategories={availableComparisonCategories}
                  loading={comparisonLoading}
                  error={null}
                />
              </section>

              <section aria-label="B2B and B2C income comparison chart">
                <BusinessIncomeComparisonChart
                  b2bTotal={b2bTotalIncome}
                  b2cTotal={b2cTotalIncome}
                  loading={comparisonLoading}
                />
              </section>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
