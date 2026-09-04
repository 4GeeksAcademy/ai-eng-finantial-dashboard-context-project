import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/financial-utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface BusinessTypeComparisonChartProps {
  b2bTotal: number;
  b2cTotal: number;
  loading?: boolean;
}

interface TooltipPayload {
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      <p className="text-muted-foreground">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export function BusinessTypeComparisonChart({
  b2bTotal,
  b2cTotal,
  loading,
}: BusinessTypeComparisonChartProps) {
  const data = [
    { businessType: "B2B", total: b2bTotal },
    { businessType: "B2C", total: b2cTotal },
  ];

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">B2B vs B2C Income</CardTitle>
        <CardDescription>Total income comparison between business lines</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[240px] w-full rounded-lg" />
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.6} />
              <XAxis
                dataKey="businessType"
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                width={48}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--color-border)", opacity: 0.2 }} />
              <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                <Cell fill="var(--color-chart-1)" />
                <Cell fill="var(--color-chart-2)" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
