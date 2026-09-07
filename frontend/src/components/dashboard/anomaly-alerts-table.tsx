import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type MetricsAlert } from "@/lib/financial-types";
import { formatCurrency, formatPercent } from "@/lib/financial-utils";

interface AnomalyAlertsTableProps {
  alerts: MetricsAlert[];
  threshold: string;
  onThresholdChange: (value: string) => void;
  thresholdError: string | null;
  loading?: boolean;
  error?: string | null;
}

export function AnomalyAlertsTable({
  alerts,
  threshold,
  onThresholdChange,
  thresholdError,
  loading,
  error,
}: AnomalyAlertsTableProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4 sm:flex sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="text-base font-semibold">Anomaly Alerts</CardTitle>
          <CardDescription>
            Periods where outcome spiked above the alert threshold
          </CardDescription>
        </div>
        <div className="mt-3 flex flex-col items-start gap-1 sm:mt-0 sm:items-end">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Threshold
            <input
              type="number"
              min="0.01"
              max="1"
              step="0.01"
              value={threshold}
              onChange={(event) => onThresholdChange(event.target.value)}
              aria-invalid={thresholdError ? true : undefined}
              aria-describedby={thresholdError ? 'threshold-error' : undefined}
              className="w-20 rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground"
            />
          </label>
          {thresholdError ? (
            <span id="threshold-error" role="alert" className="text-xs font-medium text-destructive">
              {thresholdError}
            </span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-40 w-full rounded-lg" />
        ) : error ? (
          <div role="alert" className="flex h-40 items-center justify-center text-sm text-destructive">
            {error}
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-center text-sm text-muted-foreground">
            No se detectaron anomalías para el umbral actual.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Anomaly alerts</caption>
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">Period</th>
                  <th className="py-2 pr-4 font-medium">Outcome</th>
                  <th className="py-2 pr-4 font-medium">Previous average</th>
                  <th className="py-2 font-medium">Increase</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert) => (
                  <tr key={alert.period} className="border-b border-border/60 last:border-0">
                    <td className="py-2 pr-4 text-foreground">{alert.period}</td>
                    <td className="py-2 pr-4 text-foreground">
                      {formatCurrency(alert.outcome_total)}
                    </td>
                    <td className="py-2 pr-4 text-muted-foreground">
                      {formatCurrency(alert.baseline_average)}
                    </td>
                    <td className="py-2 font-medium text-destructive">
                      {formatPercent(alert.increase_ratio * 100)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
