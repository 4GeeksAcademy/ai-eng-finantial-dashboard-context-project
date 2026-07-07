/**
 * Tipos de parametros de consulta usados por la capa frontend.
 *
 * Nota: estos tipos modelan query params; no implementan fetch ni serializacion.
 */

/**
 * Tipo de operacion admitido por endpoints de metricas.
 */
export type OperationType = "income" | "outcome";

/**
 * Filtro de rango de fechas compartido entre funcionalidades.
 */
export interface DateRangeFilter {
  /**
   * Fecha de inicio opcional.
   * Formato requerido: YYYY-MM-DD.
   * Si no se envia, el backend no aplica limite inferior.
   */
  start_date?: string;

  /**
   * Fecha de fin opcional.
   * Formato requerido: YYYY-MM-DD.
   * Si no se envia, el backend no aplica limite superior.
   */
  end_date?: string;
}

/**
 * Parametros para `GET /api/metrics/alerts`.
 */
export interface AlertsParams extends DateRangeFilter {
  /**
   * Umbral de deteccion de anomalias.
   * Rango valido en frontend: 0.01 a 1.0.
   * Ejemplo: 0.3 representa 30%.
   */
  threshold: number;
}

/**
 * Parametros para `GET /api/metrics/categories/top`.
 */
export interface TopCategoriesParams extends DateRangeFilter {
  /**
   * Tipo de operacion para el ranking.
   * En la funcionalidad comparativa debe ser "income".
   */
  operation_type: OperationType;

  /**
   * Numero maximo de categorias a devolver.
   * Restriccion de API observada: entero entre 1 y 20.
   * En la comparativa se usa 5.
   */
  limit: number;
}
