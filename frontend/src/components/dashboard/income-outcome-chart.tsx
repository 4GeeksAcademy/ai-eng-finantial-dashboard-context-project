import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { type MonthlyDataPoint } from '@/lib/financial-types'
import { formatCurrency } from '@/lib/financial-utils'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface IncomeOutcomeChartProps {
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
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 py-0.5">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground capitalize">{entry.name}:</span>
          <span className="font-medium text-foreground ml-auto pl-4">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

function MonthlyDataSummary({ data }: { data: MonthlyDataPoint[] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <p className="text-xs font-medium text-muted-foreground mb-2">Monthly data summary</p>
      <table className="w-full text-xs text-left border-collapse">
        <caption className="sr-only">
          Monthly income and outcome amounts for each month shown in the chart
        </caption>
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th scope="col" className="py-1.5 pr-3 font-medium">Month</th>
            <th scope="col" className="py-1.5 pr-3 font-medium text-right">Income</th>
            <th scope="col" className="py-1.5 font-medium text-right">Outcome</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.month} className="border-b border-border/60 text-foreground">
              <th scope="row" className="py-1.5 pr-3 font-normal">{row.month}</th>
              <td className="py-1.5 pr-3 text-right tabular-nums">{formatCurrency(row.income)}</td>
              <td className="py-1.5 text-right tabular-nums">{formatCurrency(row.outcome)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function IncomeOutcomeChart({ data, loading }: IncomeOutcomeChartProps) {
  if (loading) {
    return (
      <Card className="border-border/60" role="status" aria-busy="true">
        <span className="sr-only">Loading income versus outcome chart</span>
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

  const hasData = data.some((d) => d.income > 0 || d.outcome > 0)

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Income vs. Outcome</CardTitle>
        <CardDescription>Monthly revenue and expenditure evolution</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex h-[280px] items-center justify-center text-muted-foreground text-sm">
            No data available to display
          </div>
        ) : (
          <>
            <div
              role="img"
              aria-label="Line chart showing monthly income versus outcome over the selected period"
            >
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
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    width={48}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {/*
                    Recharts' default Legend toggles series via mouse click on non-focusable
                    spans, with no built-in keyboard path. Making it fully operable would
                    require a custom Legend + local hidden-series state wired into each Line.
                    Instead, the visible MonthlyDataSummary table below provides the same
                    values in a keyboard- and screen-reader-accessible form.
                  */}
                  <Legend
                    formatter={(value) => (
                      <span className="text-xs text-muted-foreground capitalize">{value}</span>
                    )}
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    name="income"
                    stroke="var(--chart-income)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: 'var(--chart-income)', strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="outcome"
                    name="outcome"
                    stroke="var(--chart-outcome)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: 'var(--chart-outcome)', strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <MonthlyDataSummary data={data} />
          </>
        )}
      </CardContent>
    </Card>
  )
}
