import type { OperationType } from '../src/lib/financial-types'

/**
 * Filtro compartido por rango de fechas para endpoints de metricas.
 */
export interface DateRangeFilter {
  /**
   * Fecha inicial inclusiva del rango.
   * Formato: YYYY-MM-DD.
   * Si se omite, no se aplica limite inferior de fecha.
   */
  start_date?: string

  /**
   * Fecha final inclusiva del rango.
   * Formato: YYYY-MM-DD.
   * Si se omite, no se aplica limite superior de fecha.
   */
  end_date?: string
}

/**
 * Parametros de consulta para GET /api/metrics/alerts.
 */
export interface AlertsParams extends DateRangeFilter {
  /**
   * Umbral de alerta expresado como ratio decimal.
   * Restriccion de UI de la funcionalidad: 0.01 a 1.0.
   * Restriccion actual de API (/docs): >= 0, default 0.3.
   * Ejemplo: 0.3 equivale a 30%.
   */
  threshold?: number
}

/**
 * Parametros de consulta para GET /api/metrics/categories/top.
 */
export interface TopCategoriesParams extends DateRangeFilter {
  /**
   * Tipo de operacion para construir el ranking de categorias.
   * Valores validos: 'income' | 'outcome'.
   * Para la comparativa B2B vs B2C se usa 'income'.
   */
  operation_type?: OperationType

  /**
   * Numero maximo de categorias a devolver.
   * Restriccion de API (/docs): entero entre 1 y 20.
   * Valor por defecto de API: 5.
   */
  limit?: number
}
