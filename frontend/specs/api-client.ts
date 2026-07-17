import type { AlertsResponse, FacetsResponse, TopCategoriesResponse } from './api-types'
import type { AlertsParams, TopCategoriesParams } from './param-types'
import { buildAlertsSearchParams, buildTopCategoriesSearchParams, toQueryString } from './query-helpers'

/**
 * Cliente HTTP minimo y tipado para los endpoints usados por las especificaciones.
 */
export interface SpecsApiClient {
  /** Base URL de API, por ejemplo: '' o 'http://localhost:8000'. */
  baseUrl: string

  /** Fetch inyectable para facilitar pruebas. */
  fetchImpl?: typeof fetch
}

function joinUrl(baseUrl: string, path: string, query: string = ''): string {
  return `${baseUrl}${path}${query}`
}

async function requestJson<T>(
  fetchImpl: typeof fetch,
  url: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetchImpl(url, init)

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`)
  }

  return (await response.json()) as T
}

/**
 * Obtiene facets para rango de fechas y metadatos de filtros.
 */
export async function getFacets(client: SpecsApiClient): Promise<FacetsResponse> {
  const fetchImpl = client.fetchImpl ?? fetch
  const url = joinUrl(client.baseUrl, '/api/metrics/facets')
  return requestJson<FacetsResponse>(fetchImpl, url)
}

/**
 * Obtiene alertas de anomalias usando threshold y rango opcional.
 */
export async function getAlerts(client: SpecsApiClient, params: AlertsParams): Promise<AlertsResponse> {
  const fetchImpl = client.fetchImpl ?? fetch
  const query = toQueryString(buildAlertsSearchParams(params))
  const url = joinUrl(client.baseUrl, '/api/metrics/alerts', query)
  return requestJson<AlertsResponse>(fetchImpl, url)
}

/**
 * Obtiene top categorias para comparativas B2B y B2C.
 */
export async function getTopCategories(
  client: SpecsApiClient,
  params: TopCategoriesParams,
): Promise<TopCategoriesResponse> {
  const fetchImpl = client.fetchImpl ?? fetch
  const query = toQueryString(buildTopCategoriesSearchParams(params))
  const url = joinUrl(client.baseUrl, '/api/metrics/categories/top', query)
  return requestJson<TopCategoriesResponse>(fetchImpl, url)
}
