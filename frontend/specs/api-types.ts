import type { BusinessType, Category, OperationType } from '../src/lib/financial-types'

/**
 * Respuesta del endpoint GET /api/metrics/facets.
 */
export interface FacetsResponse {
  /**
   * Tipos de operacion disponibles en el dataset.
   * Valores validos: 'income' | 'outcome'.
   */
  operation_types: OperationType[]

  /**
   * Lineas de negocio disponibles en el dataset.
   * Valores validos: 'B2B' | 'B2C'.
   */
  business_types: BusinessType[]

  /**
   * Categorias de movimientos disponibles en el dataset.
   * Valores validos: 'suppliers' | 'sales' | 'operational' | 'administrative' | 'others'.
   */
  categories: Category[]

  /**
   * Fecha minima disponible en el dataset.
   * Formato: YYYY-MM-DD.
   */
  min_date: string

  /**
   * Fecha maxima disponible en el dataset.
   * Formato: YYYY-MM-DD.
   */
  max_date: string
}

/**
 * Fila individual de alerta de anomalia en outcomes.
 */
export interface AlertEntry {
  /**
   * Periodo agregado donde se detecto la alerta.
   * Formato esperado segun group_by: YYYY-MM (month), YYYY-Www (week) o YYYY-MM-DD (day).
   */
  period: string

  /**
   * Total de outcome observado en el periodo alertado.
   * Unidad: monto monetario positivo.
   */
  outcome_total: number

  /**
   * Media movil historica usada como baseline para comparar el outcome actual.
   * En la API actual se calcula con el historial disponible hasta ese periodo.
   */
  baseline_average: number

  /**
   * Incremento relativo de outcome contra baseline.
   * Ejemplo: 0.35 equivale a un aumento del 35%.
   */
  increase_ratio: number
}

/**
 * Respuesta del endpoint GET /api/metrics/alerts.
 */
export type AlertsResponse = AlertEntry[]

/**
 * Fila individual de categorias top por monto total.
 */
export interface CategoryEntry {
  /**
   * Nombre de la categoria.
   * Valores validos: 'suppliers' | 'sales' | 'operational' | 'administrative' | 'others'.
   */
  category: Category

  /**
   * Tipo de operacion agregado en el ranking.
   * Valores validos: 'income' | 'outcome'.
   */
  operation_type: OperationType

  /**
   * Monto total acumulado para la categoria en el rango filtrado.
   * Unidad: monto monetario positivo.
   */
  total_amount: number
}

/**
 * Respuesta del endpoint GET /api/metrics/categories/top.
 */
export type TopCategoriesResponse = CategoryEntry[]
