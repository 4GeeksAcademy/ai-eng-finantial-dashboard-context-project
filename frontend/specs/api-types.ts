/**
 * Formato de fecha aceptado por la API: YYYY-MM-DD.
 *
 * Se mantiene como string para coincidir con el contrato JSON real.
 */
export type DateYMD = string

/** Tipo de operacion financiera permitido por la API. */
export type OperationType = 'income' | 'outcome'

/** Tipo de linea de negocio permitido por la API. */
export type BusinessType = 'B2B' | 'B2C'

/** Categoria financiera permitida por la API. */
export type Category = 'suppliers' | 'sales' | 'operational' | 'administrative' | 'others'

/**
 * Respuesta de GET /api/metrics/facets.
 *
 * Se usa para poblar filtros y para mostrar el rango de fechas valido.
 */
export interface FacetsResponse {
  /**
   * Tipos de operacion disponibles para filtrar.
   * Valores validos: income, outcome.
   */
  operation_types: ReadonlyArray<OperationType>

  /**
   * Tipos de negocio disponibles para filtrar o segmentar.
   * Valores validos: B2B, B2C.
   */
  business_types: ReadonlyArray<BusinessType>

  /**
   * Categorias disponibles en el dataset.
   * Valores validos: suppliers, sales, operational, administrative, others.
   */
  categories: ReadonlyArray<Category>

  /**
   * Fecha minima disponible en el dataset.
   * Formato: YYYY-MM-DD.
   */
  min_date: DateYMD

  /**
   * Fecha maxima disponible en el dataset.
   * Formato: YYYY-MM-DD.
   */
  max_date: DateYMD
}

/**
 * Item de alerta devuelto por GET /api/metrics/alerts.
 */
export interface AlertEntry {
  /**
   * Periodo agregado reportado por la API.
   * Formato variable segun group_by:
   * - day: YYYY-MM-DD
   * - week: YYYY-Www
   * - month: YYYY-MM
   */
  period: string

  /**
   * Gasto total (outcome) del periodo.
   * Unidad: misma moneda base del dataset.
   */
  outcome_total: number

  /**
   * Promedio historico de outcome usado como linea base.
   * Unidad: misma moneda base del dataset.
   */
  baseline_average: number

  /**
   * Incremento relativo contra la linea base.
   * Ejemplo: 0.3585 equivale a 35.85%.
   */
  increase_ratio: number
}

/**
 * Respuesta de GET /api/metrics/alerts.
 *
 * Puede ser un arreglo vacio cuando no hay anomalias para el threshold actual.
 */
export type AlertsResponse = ReadonlyArray<AlertEntry>

/**
 * Item de categoria devuelto por GET /api/metrics/categories/top.
 */
export interface CategoryEntry {
  /**
   * Nombre de la categoria.
   * Valores validos: suppliers, sales, operational, administrative, others.
   */
  category: Category

  /**
   * Tipo de operacion aplicado al agregado.
   * Valores validos: income, outcome.
   */
  operation_type: OperationType

  /**
   * Monto total acumulado para la categoria.
   * Unidad: misma moneda base del dataset.
   */
  total_amount: number
}

/**
 * Respuesta de GET /api/metrics/categories/top.
 *
 * Devuelve hasta el limite solicitado, ordenado de mayor a menor monto.
 */
export type TopCategoriesResponse = ReadonlyArray<CategoryEntry>
