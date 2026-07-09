import { type ChangeEvent } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type MetricsAlert } from "@/lib/financial-types";
import { formatCurrency, formatPercent } from "@/lib/financial-utils";

interface AnomalyAlertsTableProps {
  alerts: MetricsAlert[];
  loading?: boolean;
  error?: string | null;
  thresholdInput: string;
  thresholdError?: string | null;
  onThresholdChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function AnomalyAlertsTable({
  alerts,
  loading,
  error,
  thresholdInput,
  thresholdError,
  onThresholdChange,
}: AnomalyAlertsTableProps) {
  const thresholdHelpId = "threshold-help";
  const thresholdErrorId = "threshold-error";

  return (
    <Card className="border-border/60">
      <CardHeader className="gap-3 pb-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">Anomaly Alerts</CardTitle>
          <CardDescription>
            Outcome periods flagged by the alerts endpoint threshold.
          </CardDescription>
        </div>

        <label className="flex flex-col gap-1 text-sm text-muted-foreground md:w-44">
          Umbral de deteccion
          <input
            id="threshold-input"
            type="number"
            min="0.01"
            max="1"
            step="0.01"
            value={thresholdInput}
            onChange={onThresholdChange}
            className="h-10 rounded-md border border-input bg-background px-3 text-foreground"
            aria-invalid={thresholdError ? true : undefined}
            aria-describedby={thresholdError ? thresholdErrorId : thresholdHelpId}
          />
        </label>
      </CardHeader>

      <CardContent className="space-y-3">
        <p id={thresholdHelpId} className="text-xs text-muted-foreground">
          Ingresa un valor decimal entre 0.01 y 1.00.
        </p>

        {thresholdError ? (
          <div
            id={thresholdErrorId}
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive-foreground"
          >
            {thresholdError}
          </div>
        ) : null}

        {error ? (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive-foreground"
          >
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-secondary/50 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Periodo</th>
                  <th className="px-4 py-3 font-medium">Outcome registrado</th>
                  <th className="px-4 py-3 font-medium">Media movil de periodos previos</th>
                  <th className="px-4 py-3 font-medium">Incremento porcentual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {alerts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-muted-foreground"
                    >
                      No se detectaron anomalias para el umbral actual.
                    </td>
                  </tr>
                ) : (
                  alerts.map((alert) => (
                    <tr key={alert.period}>
                      <td className="px-4 py-3 text-foreground">{alert.period}</td>
                      <td className="px-4 py-3 text-foreground">
                        {formatCurrency(alert.outcome_total)}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {formatCurrency(alert.baseline_average)}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {formatPercent(alert.increase_ratio * 100)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
