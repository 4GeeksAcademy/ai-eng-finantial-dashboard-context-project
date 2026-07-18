import type { BusinessType, DateYMD, GroupBy, OperationType } from "./api-types";

/**
 * Filtro de rango temporal compartido entre funcionalidades.
 */
export interface DateRangeFilter {
  /**
   * Fecha inicial inclusiva del rango.
   * Opcional. Formato: YYYY-MM-DD.
   */
  start_date?: string;
  /**
   * Fecha final inclusiva del rango.
   * Opcional. Formato: YYYY-MM-DD.
   */
  end_date?: string;
}

/**
 * Query params para GET /api/metrics/alerts.
 */
export interface AlertsParams extends DateRangeFilter {
  /**
   * Umbral mínimo para detectar incremento anómalo.
   * Restricción backend: threshold >= 0.
   * Valor por defecto backend: 0.3.
   */
  threshold?: number;
  /**
   * Nivel de agrupación temporal.
   * Valores válidos: day | week | month.
   * Valor por defecto backend: month.
   */
  group_by?: GroupBy;
  /**
   * Segmento de negocio opcional para filtrar resultados.
   * Valores válidos: B2B | B2C.
   */
  business_type?: BusinessType;
}

/**
 * Query params para GET /api/metrics/categories/top.
 */
export interface TopCategoriesParams extends DateRangeFilter {
  /**
   * Tipo de operación a rankear.
   * Valores válidos: income | outcome.
   * Valor por defecto backend: outcome.
   */
  operation_type?: OperationType;
  /**
   * Número máximo de categorías devueltas.
   * Restricción backend: 1 <= limit <= 20.
   * Valor por defecto backend: 5.
   */
  limit?: number;
  /**
   * Segmento de negocio opcional para filtrar resultados.
   * Valores válidos: B2B | B2C.
   */
  business_type?: BusinessType;
}

/**
 * Query params para GET /api/metrics/summary (complementario para comparativa B2B vs B2C).
 */
export interface SummaryParams extends DateRangeFilter {
  /**
   * Nivel de agrupación temporal.
   * Valores válidos: day | week | month.
   * Valor por defecto backend: month.
   */
  group_by?: GroupBy;
  /**
   * Tipo de operación opcional para filtrar en el resumen.
   * Valores válidos: income | outcome.
   */
  operation_type?: OperationType;
  /**
   * Segmento de negocio opcional.
   * Valores válidos: B2B | B2C.
   */
  business_type?: BusinessType;
}

/**
 * Query params para GET /api/metrics/comparison (complementario para comparativa B2B vs B2C).
 */
export interface ComparisonParams {
  /**
   * Fecha inicial inclusiva del periodo actual.
   * Requerida. Formato: YYYY-MM-DD.
   */
  start_date: DateYMD;
  /**
   * Fecha final inclusiva del periodo actual.
   * Requerida. Formato: YYYY-MM-DD.
   */
  end_date: DateYMD;
  /**
   * Segmento de negocio opcional.
   * Valores válidos: B2B | B2C.
   */
  business_type?: BusinessType;
}
