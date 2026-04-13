import { type FinancialMovement, type KPIMetrics, type MonthlyDataPoint } from './financial-types'

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function computeKPIs(movements: FinancialMovement[]): KPIMetrics {
  const totalIncome = movements
    .filter((m) => m.operation_type === 'income')
    .reduce((sum, m) => sum + m.amount, 0)

  const totalOutcome = movements
    .filter((m) => m.operation_type === 'outcome')
    .reduce((sum, m) => sum + m.amount, 0)

  const profit = totalIncome - totalOutcome
  const profitPercent = totalIncome > 0 ? (profit / totalIncome) * 100 : 0

  return { totalIncome, totalOutcome, profit, profitPercent }
}

export function computeMonthlyData(movements: FinancialMovement[]): MonthlyDataPoint[] {
  const monthlyMap: Record<number, { income: number; outcome: number }> = {}

  for (let i = 0; i < 12; i++) {
    monthlyMap[i] = { income: 0, outcome: 0 }
  }

  for (const m of movements) {
    const monthIndex = new Date(m.create_date).getMonth()
    if (m.operation_type === 'income') {
      monthlyMap[monthIndex].income += m.amount
    } else {
      monthlyMap[monthIndex].outcome += m.amount
    }
  }

  return MONTH_LABELS.map((month, i) => {
    const { income, outcome } = monthlyMap[i]
    const profit = income - outcome
    const profitPercent = income > 0 ? (profit / income) * 100 : 0
    return { month, income, outcome, profitPercent }
  })
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}
