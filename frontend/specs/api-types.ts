/**
 * Tipos de respuesta de API usados por las funcionalidades de frontend.
 *
 * Nota: estos tipos documentan el contrato esperado desde frontend/specs.
 * No implementan llamadas HTTP ni lógica de renderizado.
 */

/**
 * Tipo de operacion admitido por la API de metricas.
 * - "income": ingresos.
 * - "outcome": egresos.
 */
export type OperationType = "income" | "outcome";

/**
 * Tipo de negocio admitido por la API de metricas.
 * - "B2B": business to business.
 * - "B2C": business to consumer.
 */
export type BusinessType = "B2B" | "B2C";

/**
 * Categoria admitida por la API en movimientos y agregados.
 */
export type Category =
  | "suppliers"
  | "sales"
  | "operational"
  | "administrative"
  | "others";

/**
 * Respuesta de `GET /api/metrics/facets`.
 * Utilizada por:
 * - Funcionalidad 1: rango de fechas disponible.
 * - Funcionalidad 3: referencia de categorias disponibles.
 */
export interface FacetsResponse {
  /**
   * Tipos de operacion disponibles en el dataset.
   * Valores validos: "income" | "outcome".
   */
  operation_types: OperationType[];

  /**
   * Lineas de negocio disponibles en el dataset.
   * Valores validos: "B2B" | "B2C".
   */
  business_types: BusinessType[];

  /**
   * Categorias disponibles en el dataset.
   * Valores validos: "suppliers" | "sales" | "operational" | "administrative" | "others".
   */
  categories: Category[];

  /**
   * Fecha minima disponible en el historico.
   * Formato: YYYY-MM-DD.
   */
  min_date: string;

  /**
   * Fecha maxima disponible en el historico.
   * Formato: YYYY-MM-DD.
   */
  max_date: string;
}

/**
 * Entrada individual de alerta en `GET /api/metrics/alerts`.
 */
export interface AlertEntry {
  /**
   * Periodo agregado reportado por la API.
   * Formato comun observado: YYYY-MM para agregacion mensual.
   */
  period: string;

  /**
   * Monto total de outcome registrado en el periodo.
   * Unidad: moneda del dashboard.
   * Valor esperado: numero >= 0.
   */
  outcome_total: number;

  /**
   * Valor base calculado por la API para comparar el outcome del periodo.
   * Unidad: moneda del dashboard.
   * Valor esperado: numero >= 0.
   */
  baseline_average: number;

  /**
   * Ratio de incremento sobre baseline (no porcentaje directo).
   * Ejemplo: 0.3 equivale a 30%.
   * Valor esperado: numero > 0 cuando existe alerta.
   */
  increase_ratio: number;
}

/**
 * Respuesta de `GET /api/metrics/alerts`.
 */
export type AlertsResponse = AlertEntry[];

/**
 * Entrada individual de categoria top en `GET /api/metrics/categories/top`.
 */
export interface CategoryEntry {
  /**
   * Nombre de la categoria.
   * Valores validos: "suppliers" | "sales" | "operational" | "administrative" | "others".
   */
  category: Category;

  /**
   * Tipo de operacion usado para el agregado.
   * En la funcionalidad comparativa debe ser "income".
   */
  operation_type: OperationType;

  /**
   * Monto total agregado para la categoria.
   * Unidad: moneda del dashboard.
   * Valor esperado: numero >= 0.
   */
  total_amount: number;
}

/**
 * Respuesta de `GET /api/metrics/categories/top`.
 */
export type TopCategoriesResponse = CategoryEntry[];
