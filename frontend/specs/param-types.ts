import type { BusinessType, OperationType } from './api-types'

/**
 * Parametros de rango de fechas compartidos entre funcionalidades.
 */
export interface DateRangeFilter {
  /**
   * Fecha de inicio del filtro (inclusive).
   * Formato: YYYY-MM-DD.
   * Campo opcional: si se omite, no se aplica limite inferior.
   */
  start_date?: string

  /**
   * Fecha de fin del filtro (inclusive).
   * Formato: YYYY-MM-DD.
   * Campo opcional: si se omite, no se aplica limite superior.
   */
  end_date?: string
}

/**
 * Parametros para GET /api/metrics/alerts en la funcionalidad de anomalias.
 */
export interface AlertsParams extends DateRangeFilter {
  /**
   * Umbral de deteccion de anomalias.
   * Regla API: mayor o igual a 0.
   * Regla de producto: normalmente se usa entre 0.01 y 1.0.
   */
  threshold: number
}

/**
 * Parametros para GET /api/metrics/categories/top en la vista comparativa.
 */
export interface TopCategoriesParams extends DateRangeFilter {
  /**
   * Tipo de operacion a consultar.
   * Para la comparativa solicitada debe ser income.
   */
  operation_type: OperationType

  /**
   * Maximo de filas devueltas por la API.
   * Rango valido de API: 1 a 20.
   */
  limit: number

  /**
   * Segmento de negocio.
   * Es opcional en API, pero en la comparativa B2B vs B2C se usa como requerido por flujo.
   */
  business_type?: BusinessType
}
