import { memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { type MonthlyDataPoint } from '@/lib/financial-types'
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

const CHART_MARGIN = { top: 4, right: 8, left: 0, bottom: 0 } as const

const X_AXIS_TICK = { fontSize: 12, fill: 'var(--color-muted-foreground)' } as const

const Y_AXIS_TICK = { fontSize: 11, fill: 'var(--color-muted-foreground)' } as const

const PROFIT_DOT = { r: 3, fill: 'var(--chart-profit)', strokeWidth: 0 } as const

const ACTIVE_DOT = { r: 5, strokeWidth: 0 } as const

const Y_AXIS_DOMAIN = ['auto', 'auto'] as const

const loadingSkeleton = (
  <Card className="border-border/60" role="status" aria-busy="true">
    <span className="sr-only">Loading profit margin chart</span>
    <CardHeader className="pb-4">
      <Skeleton className="h-5 w-52" />
      <Skeleton className="h-3 w-64 mt-1" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-[280px] w-full rounded-lg" />
    </CardContent>
  </Card>
)

const emptyState = (
  <div className="flex h-[280px] items-center justify-center text-muted-foreground text-sm">
    No data available to display
  </div>
)

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

function ProfitMarginSummary({ data }: { data: MonthlyDataPoint[] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <p className="text-xs font-medium text-muted-foreground mb-2">Monthly data summary</p>
      <table className="w-full text-xs text-left border-collapse">
        <caption className="sr-only">
          Monthly profit margin percentages for each month shown in the chart
        </caption>
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th scope="col" className="py-1.5 pr-3 font-medium">Month</th>
            <th scope="col" className="py-1.5 font-medium text-right">Profit margin</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.month} className="border-b border-border/60 text-foreground">
              <th scope="row" className="py-1.5 pr-3 font-normal">{row.month}</th>
              <td className="py-1.5 text-right tabular-nums">{row.profitPercent.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function formatPercentAxisTick(v: number) {
  return `${v.toFixed(0)}%`
}

const customTooltip = <CustomTooltip />

function ProfitPercentChartComponent({ data, loading }: ProfitPercentChartProps) {
  if (loading) {
    return loadingSkeleton
  }

  const hasData = data.some((d) => d.profitPercent !== 0)

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Profit Margin %</CardTitle>
        <CardDescription>Monthly profit as a percentage of total income</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          emptyState
        ) : (
          <>
            <div
              role="img"
              aria-label="Line chart showing monthly profit margin as a percentage of income"
            >
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data} margin={CHART_MARGIN}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.6} />
                  <XAxis
                    dataKey="month"
                    tick={X_AXIS_TICK}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={Y_AXIS_TICK}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={formatPercentAxisTick}
                    width={40}
                    domain={Y_AXIS_DOMAIN}
                  />
                  <ReferenceLine y={0} stroke="var(--color-border)" strokeDasharray="4 4" />
                  <Tooltip content={customTooltip} />
                  <Line
                    type="monotone"
                    dataKey="profitPercent"
                    name="profitPercent"
                    stroke="var(--chart-profit)"
                    strokeWidth={2}
                    dot={PROFIT_DOT}
                    activeDot={ACTIVE_DOT}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <ProfitMarginSummary data={data} />
          </>
        )}
      </CardContent>
    </Card>
  )
}

export const ProfitPercentChart = memo(ProfitPercentChartComponent)
