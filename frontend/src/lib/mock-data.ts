import { type FinancialMovement } from './financial-types'

export const mockMovements: FinancialMovement[] = [
  // January
  { create_date: '2024-01-05', amount: 48200, operation_type: 'income', category: 'sales', business_type: 'B2B' },
  { create_date: '2024-01-08', amount: 12400, operation_type: 'income', category: 'sales', business_type: 'B2C' },
  { create_date: '2024-01-12', amount: 18500, operation_type: 'outcome', category: 'suppliers', business_type: 'B2B' },
  { create_date: '2024-01-18', amount: 6300, operation_type: 'outcome', category: 'operational', business_type: 'B2B' },
  { create_date: '2024-01-22', amount: 3200, operation_type: 'outcome', category: 'administrative', business_type: 'B2B' },
  // February
  { create_date: '2024-02-03', amount: 52800, operation_type: 'income', category: 'sales', business_type: 'B2B' },
  { create_date: '2024-02-10', amount: 9100, operation_type: 'income', category: 'others', business_type: 'B2C' },
  { create_date: '2024-02-14', amount: 21000, operation_type: 'outcome', category: 'suppliers', business_type: 'B2B' },
  { create_date: '2024-02-20', amount: 5800, operation_type: 'outcome', category: 'operational', business_type: 'B2B' },
  { create_date: '2024-02-25', amount: 4100, operation_type: 'outcome', category: 'administrative', business_type: 'B2C' },
  // March
  { create_date: '2024-03-06', amount: 67400, operation_type: 'income', category: 'sales', business_type: 'B2B' },
  { create_date: '2024-03-11', amount: 14200, operation_type: 'income', category: 'sales', business_type: 'B2C' },
  { create_date: '2024-03-15', amount: 24500, operation_type: 'outcome', category: 'suppliers', business_type: 'B2B' },
  { create_date: '2024-03-19', amount: 7200, operation_type: 'outcome', category: 'operational', business_type: 'B2B' },
  { create_date: '2024-03-27', amount: 3900, operation_type: 'outcome', category: 'administrative', business_type: 'B2B' },
  // April
  { create_date: '2024-04-04', amount: 58900, operation_type: 'income', category: 'sales', business_type: 'B2B' },
  { create_date: '2024-04-09', amount: 11800, operation_type: 'income', category: 'sales', business_type: 'B2C' },
  { create_date: '2024-04-13', amount: 22300, operation_type: 'outcome', category: 'suppliers', business_type: 'B2B' },
  { create_date: '2024-04-21', amount: 6100, operation_type: 'outcome', category: 'operational', business_type: 'B2B' },
  { create_date: '2024-04-28', amount: 4500, operation_type: 'outcome', category: 'others', business_type: 'B2C' },
  // May
  { create_date: '2024-05-05', amount: 71200, operation_type: 'income', category: 'sales', business_type: 'B2B' },
  { create_date: '2024-05-12', amount: 16300, operation_type: 'income', category: 'sales', business_type: 'B2C' },
  { create_date: '2024-05-16', amount: 28700, operation_type: 'outcome', category: 'suppliers', business_type: 'B2B' },
  { create_date: '2024-05-22', amount: 8400, operation_type: 'outcome', category: 'operational', business_type: 'B2B' },
  { create_date: '2024-05-29', amount: 5200, operation_type: 'outcome', category: 'administrative', business_type: 'B2B' },
  // June
  { create_date: '2024-06-03', amount: 64500, operation_type: 'income', category: 'sales', business_type: 'B2B' },
  { create_date: '2024-06-10', amount: 13700, operation_type: 'income', category: 'others', business_type: 'B2C' },
  { create_date: '2024-06-17', amount: 25900, operation_type: 'outcome', category: 'suppliers', business_type: 'B2B' },
  { create_date: '2024-06-24', amount: 7600, operation_type: 'outcome', category: 'operational', business_type: 'B2B' },
  // July
  { create_date: '2024-07-02', amount: 78900, operation_type: 'income', category: 'sales', business_type: 'B2B' },
  { create_date: '2024-07-08', amount: 18100, operation_type: 'income', category: 'sales', business_type: 'B2C' },
  { create_date: '2024-07-15', amount: 31200, operation_type: 'outcome', category: 'suppliers', business_type: 'B2B' },
  { create_date: '2024-07-22', amount: 9100, operation_type: 'outcome', category: 'operational', business_type: 'B2B' },
  { create_date: '2024-07-30', amount: 5800, operation_type: 'outcome', category: 'administrative', business_type: 'B2B' },
  // August
  { create_date: '2024-08-06', amount: 72400, operation_type: 'income', category: 'sales', business_type: 'B2B' },
  { create_date: '2024-08-13', amount: 15600, operation_type: 'income', category: 'sales', business_type: 'B2C' },
  { create_date: '2024-08-19', amount: 27800, operation_type: 'outcome', category: 'suppliers', business_type: 'B2B' },
  { create_date: '2024-08-26', amount: 8200, operation_type: 'outcome', category: 'operational', business_type: 'B2B' },
  // September
  { create_date: '2024-09-04', amount: 84100, operation_type: 'income', category: 'sales', business_type: 'B2B' },
  { create_date: '2024-09-11', amount: 19500, operation_type: 'income', category: 'sales', business_type: 'B2C' },
  { create_date: '2024-09-17', amount: 33600, operation_type: 'outcome', category: 'suppliers', business_type: 'B2B' },
  { create_date: '2024-09-23', amount: 9800, operation_type: 'outcome', category: 'operational', business_type: 'B2B' },
  { create_date: '2024-09-30', amount: 6200, operation_type: 'outcome', category: 'administrative', business_type: 'B2B' },
  // October
  { create_date: '2024-10-07', amount: 91300, operation_type: 'income', category: 'sales', business_type: 'B2B' },
  { create_date: '2024-10-14', amount: 22700, operation_type: 'income', category: 'sales', business_type: 'B2C' },
  { create_date: '2024-10-21', amount: 36400, operation_type: 'outcome', category: 'suppliers', business_type: 'B2B' },
  { create_date: '2024-10-28', amount: 10600, operation_type: 'outcome', category: 'operational', business_type: 'B2B' },
  // November
  { create_date: '2024-11-05', amount: 87600, operation_type: 'income', category: 'sales', business_type: 'B2B' },
  { create_date: '2024-11-12', amount: 21400, operation_type: 'income', category: 'sales', business_type: 'B2C' },
  { create_date: '2024-11-19', amount: 34100, operation_type: 'outcome', category: 'suppliers', business_type: 'B2B' },
  { create_date: '2024-11-26', amount: 10200, operation_type: 'outcome', category: 'operational', business_type: 'B2B' },
  { create_date: '2024-11-30', amount: 7100, operation_type: 'outcome', category: 'administrative', business_type: 'B2B' },
  // December
  { create_date: '2024-12-03', amount: 96800, operation_type: 'income', category: 'sales', business_type: 'B2B' },
  { create_date: '2024-12-10', amount: 25200, operation_type: 'income', category: 'sales', business_type: 'B2C' },
  { create_date: '2024-12-17', amount: 38900, operation_type: 'outcome', category: 'suppliers', business_type: 'B2B' },
  { create_date: '2024-12-23', amount: 11400, operation_type: 'outcome', category: 'operational', business_type: 'B2B' },
  { create_date: '2024-12-30', amount: 8600, operation_type: 'outcome', category: 'administrative', business_type: 'B2B' },
]
