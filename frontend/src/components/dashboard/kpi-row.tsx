import { KPICard } from './kpi-card'
import { type KPIMetrics } from '@/lib/financial-types'
import { formatCurrency, formatPercent } from '@/lib/financial-utils'
import { TrendingUp, TrendingDown, DollarSign, BarChart2 } from 'lucide-react'

interface KPIRowProps {
  metrics: KPIMetrics | null
  loading?: boolean
}

export function KPIRow({ metrics, loading }: KPIRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <KPICard
        label="Total Income"
        value={metrics ? formatCurrency(metrics.totalIncome) : '—'}
        helperText="Cumulative revenue from all income movements"
        icon={TrendingUp}
        variant="income"
        loading={loading}
      />
      <KPICard
        label="Total Outcome"
        value={metrics ? formatCurrency(metrics.totalOutcome) : '—'}
        helperText="Total expenditure across all categories"
        icon={TrendingDown}
        variant="outcome"
        loading={loading}
      />
      <KPICard
        label="Profit"
        value={metrics ? formatCurrency(metrics.profit) : '—'}
        helperText="Net profit — income minus total outcome"
        icon={DollarSign}
        variant="profit"
        loading={loading}
      />
      <KPICard
        label="Profit Margin"
        value={metrics ? formatPercent(metrics.profitPercent) : '—'}
        helperText="Profit as a percentage of total income"
        icon={BarChart2}
        variant="profitPercent"
        loading={loading}
      />
    </div>
  )
}
