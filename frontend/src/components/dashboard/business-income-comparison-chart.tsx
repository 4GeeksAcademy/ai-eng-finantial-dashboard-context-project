import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/financial-utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface BusinessIncomeComparisonChartProps {
  b2bTotal: number;
  b2cTotal: number;
  loading?: boolean;
}

const chartData = (b2bTotal: number, b2cTotal: number) => [
  { name: "B2B", total: b2bTotal },
  { name: "B2C", total: b2cTotal },
];

export function BusinessIncomeComparisonChart({
  b2bTotal,
  b2cTotal,
  loading,
}: BusinessIncomeComparisonChartProps) {
  if (loading) {
    return (
      <Card className="border-border/60">
        <CardHeader className="pb-4">
          <Skeleton className="h-5 w-56" />
          <Skeleton className="mt-1 h-3 w-72" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[280px] w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  const hasData = b2bTotal > 0 || b2cTotal > 0;

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">B2B vs B2C Income</CardTitle>
        <CardDescription>
          Visual comparison of total income for both business lines.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
            No hay ingresos para comparar en el rango seleccionado.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData(b2bTotal, b2cTotal)} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.6} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                width={48}
              />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-card)",
                }}
              />
              <Bar dataKey="total" fill="var(--chart-income)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
