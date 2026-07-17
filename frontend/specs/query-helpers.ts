import type { AlertsParams, DateRangeFilter, TopCategoriesParams } from './param-types'

/**
 * Convierte un rango de fechas opcional en pares query compatibles con la API.
 */
export function buildDateRangeParams(filter: DateRangeFilter): URLSearchParams {
  const params = new URLSearchParams()

  if (filter.start_date) {
    params.set('start_date', filter.start_date)
  }

  if (filter.end_date) {
    params.set('end_date', filter.end_date)
  }

  return params
}

/**
 * Convierte parametros de alertas en query string segura para la API.
 */
export function buildAlertsSearchParams(paramsInput: AlertsParams): URLSearchParams {
  const params = buildDateRangeParams(paramsInput)
  params.set('threshold', String(paramsInput.threshold))
  params.set('group_by', 'month')
  return params
}

/**
 * Convierte parametros de top categorias en query string segura para la API.
 */
export function buildTopCategoriesSearchParams(paramsInput: TopCategoriesParams): URLSearchParams {
  const params = buildDateRangeParams(paramsInput)
  params.set('operation_type', paramsInput.operation_type)
  params.set('limit', String(paramsInput.limit))

  if (paramsInput.business_type) {
    params.set('business_type', paramsInput.business_type)
  }

  return params
}

/**
 * Devuelve la representacion final para concatenar a una URL.
 */
export function toQueryString(params: URLSearchParams): string {
  const query = params.toString()
  return query ? `?${query}` : ''
}
