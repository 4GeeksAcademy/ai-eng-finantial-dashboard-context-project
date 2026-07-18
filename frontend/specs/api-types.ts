/**
 * Fecha de consulta en formato calendario.
 * Formato esperado: YYYY-MM-DD.
 */
export type DateYMD = string;

/**
 * Identificador de periodo agregado por el backend.
 * Puede venir como YYYY-MM (group_by=month), YYYY-Www (group_by=week) o YYYY-MM-DD (group_by=day).
 */
export type MetricsPeriod = string;

/**
 * Tipo de operación financiera.
 */
export type OperationType = "income" | "outcome";

/**
 * Segmento de negocio.
 */
export type BusinessType = "B2B" | "B2C";

/**
 * Nivel de agregación temporal soportado por el backend.
 */
export type GroupBy = "day" | "week" | "month";

/**
 * Categoría financiera soportada por el backend.
 */
export type Category =
  | "suppliers"
  | "sales"
  | "operational"
  | "administrative"
  | "others";

/**
 * Respuesta del endpoint GET /api/metrics/facets.
 */
export interface FacetsResponse {
  /**
   * Tipos de operación disponibles para filtrar datos.
   */
  operation_types: OperationType[];
  /**
   * Tipos de negocio disponibles para filtrar datos.
   */
  business_types: BusinessType[];
  /**
   * Categorías disponibles en el dataset.
   */
  categories: Category[];
  /**
   * Fecha mínima del dataset completo.
   * Formato: YYYY-MM-DD.
   */
  min_date: DateYMD;
  /**
   * Fecha máxima del dataset completo.
   * Formato: YYYY-MM-DD.
   */
  max_date: DateYMD;
}

/**
 * Entrada individual de la respuesta de GET /api/metrics/alerts.
 */
export interface AlertEntry {
  /**
   * Periodo agregado en el que se detectó incremento anómalo.
   * El formato depende del group_by solicitado.
   */
  period: MetricsPeriod;
  /**
   * Total de egresos del periodo evaluado.
   */
  outcome_total: number;
  /**
   * Promedio histórico usado como línea base por el backend.
   */
  baseline_average: number;
  /**
   * Ratio de incremento respecto de la base histórica.
   * Ejemplo: 0.35 equivale a 35% de incremento.
   */
  increase_ratio: number;
}

/**
 * Respuesta del endpoint GET /api/metrics/alerts.
 */
export type AlertsResponse = AlertEntry[];

/**
 * Entrada individual de la respuesta de GET /api/metrics/categories/top.
 */
export interface CategoryEntry {
  /**
   * Categoría de la operación agregada.
   */
  category: Category;
  /**
   * Tipo de operación sobre el que se hizo el ranking.
   */
  operation_type: OperationType;
  /**
   * Monto total acumulado para la categoría.
   */
  total_amount: number;
}

/**
 * Respuesta del endpoint GET /api/metrics/categories/top.
 */
export type TopCategoriesResponse = CategoryEntry[];

/**
 * Entrada individual de GET /api/metrics/summary (endpoint complementario para comparativas).
 */
export interface SummaryEntry {
  /**
   * Periodo agregado según group_by.
   */
  period: MetricsPeriod;
  /**
   * Total de ingresos del periodo.
   */
  income: number;
  /**
   * Total de egresos del periodo.
   */
  outcome: number;
  /**
   * Balance neto del periodo (income - outcome).
   */
  net: number;
}

/**
 * Respuesta del endpoint GET /api/metrics/summary.
 */
export type SummaryResponse = SummaryEntry[];

/**
 * Respuesta del endpoint GET /api/metrics/comparison (complementario para comparativas).
 */
export interface ComparisonResponse {
  /**
   * Neto del periodo actual filtrado.
   */
  current_period: number;
  /**
   * Neto del periodo anterior equivalente en duración.
   */
  previous_period: number;
  /**
   * Diferencia absoluta entre periodo actual y anterior.
   */
  delta_abs: number;
  /**
   * Diferencia porcentual en base al periodo anterior.
   * Puede ser null cuando previous_period = 0.
   */
  delta_pct: number | null;
}
