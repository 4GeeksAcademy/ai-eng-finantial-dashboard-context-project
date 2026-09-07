import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { type MonthlyDataPoint } from '@/lib/financial-types'
import { useId, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'

interface ProfitPercentChartProps {
  data: MonthlyDataPoint[]
  loading?: boolean
}

interface TooltipPayload {
  name: string
  value: number
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const value = payload[0]?.value ?? 0
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ backgroundColor: 'var(--chart-profit)' }}
        />
        <span className="text-muted-foreground">Profit margin:</span>
        <span className="font-medium text-foreground ml-auto pl-4">{value.toFixed(1)}%</span>
      </div>
    </div>
  )
}

export function ProfitPercentChart({ data, loading }: ProfitPercentChartProps) {
  const titleId = useId()
  const descriptionId = useId()
  const summaryId = useId()

  if (loading) {
    return (
      <Card className="border-border/60">
        <CardHeader className="pb-4">
          <Skeleton className="h-5 w-52" />
          <Skeleton className="h-3 w-64 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[280px] w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  const hasData = data.some((d) => d.profitPercent !== 0)
  const chartSummary = useMemo(() => {
    const values = data.map((point) => point.profitPercent)
    const averagePercent = values.length
      ? values.reduce((sum, value) => sum + value, 0) / values.length
      : 0
    const highest = data.reduce(
      (peak, point) => (point.profitPercent > peak.profitPercent ? point : peak),
      data[0] ?? { month: 'N/A', income: 0, outcome: 0, profitPercent: 0 },
    )
    const lowest = data.reduce(
      (peak, point) => (point.profitPercent < peak.profitPercent ? point : peak),
      data[0] ?? { month: 'N/A', income: 0, outcome: 0, profitPercent: 0 },
    )

    return { averagePercent, highest, lowest }
  }, [data])

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <CardTitle as="h2" className="text-base font-semibold" id={titleId}>
          Profit Margin %
        </CardTitle>
        <CardDescription id={descriptionId}>
          Monthly profit as a percentage of total income
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <p
            aria-describedby={descriptionId}
            aria-labelledby={titleId}
            className="flex h-[280px] items-center justify-center text-muted-foreground text-sm"
          >
            No data available to display
          </p>
        ) : (
          <figure aria-describedby={`${descriptionId} ${summaryId}`} aria-labelledby={titleId}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.6} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v.toFixed(0)}%`}
                  width={40}
                  domain={['auto', 'auto']}
                />
                <ReferenceLine y={0} stroke="var(--color-border)" strokeDasharray="4 4" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="profitPercent"
                  name="profitPercent"
                  stroke="var(--chart-profit)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: 'var(--chart-profit)', strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <figcaption className="sr-only" id={summaryId}>
              Average monthly profit margin is {chartSummary.averagePercent.toFixed(1)} percent.
              Highest monthly margin is {chartSummary.highest.profitPercent.toFixed(1)} percent in {chartSummary.highest.month}.
              Lowest monthly margin is {chartSummary.lowest.profitPercent.toFixed(1)} percent in {chartSummary.lowest.month}.
            </figcaption>
          </figure>
        )}
      </CardContent>
    </Card>
  )
}
