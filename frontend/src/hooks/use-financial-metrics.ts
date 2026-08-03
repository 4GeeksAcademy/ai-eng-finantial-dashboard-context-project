import { useState, useEffect, useCallback } from "react";
import type { KPIMetrics, MonthlyDataPoint } from "@/lib/financial-types";
import { computeKPIs, computeMonthlyData, computePeriodLabel } from "@/lib/financial-utils";
import { fetchFinancialData } from "@/lib/services/financial-api";

export interface UseFinancialMetricsReturn {
  metrics: KPIMetrics | null;
  monthlyData: MonthlyDataPoint[];
  period: string | undefined;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFinancialMetrics(): UseFinancialMetricsReturn {
  const [metrics, setMetrics] = useState<KPIMetrics | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyDataPoint[]>([]);
  const [period, setPeriod] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback((signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    fetchFinancialData(signal)
      .then((movements) => {
        setMetrics(computeKPIs(movements));
        setMonthlyData(computeMonthlyData(movements));
        setPeriod(computePeriodLabel(movements));
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error("[Financial Dashboard API Failure]:", err);
        setError(
          err instanceof Error ? err.message : "Error insospechado al conectar con el servidor."
        );
      })
      .finally(() => {
        if (!signal?.aborted) {
          setLoading(false);
        }
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadData(controller.signal);
    return () => controller.abort();
  }, [loadData]);

  const refetch = useCallback(() => {
    loadData();
  }, [loadData]);

  return { metrics, monthlyData, period, loading, error, refetch };
}
