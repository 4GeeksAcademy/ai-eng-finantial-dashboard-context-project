# Especificación de componentes (frontend)

Documento de diseño funcional para implementación posterior. No incluye código React ni consumo de API.

## Funcionalidad 1: Filtro de rango de fechas en dashboard principal

### Componentes propuestos

#### DateRangeFilterBar
- Propósito: capturar y validar un rango de fechas compartido por widgets del dashboard.
- Props:
  - `value: DateRangeFilter`
  - `minDate: DateYMD` (desde `FacetsResponse.min_date`)
  - `maxDate: DateYMD` (desde `FacetsResponse.max_date`)
  - `disabled?: boolean`
  - `isLoading?: boolean`
  - `errorMessage?: string | null`
  - `onChange: (next: DateRangeFilter) => void`
  - `onApply: () => void`
  - `onReset: () => void`
- Dependencias de datos:
  - `FacetsResponse` para límites válidos.
- Estados borde:
  - loading de facets: controles deshabilitados y placeholder visible.
  - error de facets: mensaje de error y acción de reintento.
  - fechas fuera de rango: bloqueo de envío + mensaje de validación.
  - `start_date > end_date`: bloqueo de envío + validación visible.

### Reglas de interacción
- Ambos campos son opcionales; vacío significa "sin filtro".
- Si el usuario define una sola fecha, se envía solo ese extremo.
- El botón "Aplicar" solo se habilita cuando el rango es válido.
- El botón "Limpiar" restablece `start_date` y `end_date` a `undefined`.

## Funcionalidad 2: Tabla de alertas de anomalías

### Componentes propuestos

#### AlertsThresholdControl
- Propósito: permitir ajustar sensibilidad de detección de alertas.
- Props:
  - `value: number`
  - `min?: number` (recomendado UI: 0.1)
  - `max?: number` (recomendado UI: 1.0)
  - `step?: number` (recomendado UI: 0.05)
  - `defaultValue?: number` (backend por defecto: 0.3)
  - `disabled?: boolean`
  - `onChange: (next: number) => void`
- Dependencias de datos:
  - `AlertsParams.threshold`.
- Estados borde:
  - valor inválido (<0): bloqueo de consulta + mensaje "threshold debe ser >= 0".

#### AlertsTable
- Propósito: mostrar periodos con incremento anómalo de egresos.
- Props:
  - `rows: AlertsResponse`
  - `isLoading?: boolean`
  - `errorMessage?: string | null`
  - `emptyMessage?: string`
- Columnas requeridas:
  - Periodo (`AlertEntry.period`)
  - Outcome registrado (`AlertEntry.outcome_total`)
  - Media móvil de 3 periodos anteriores (UI calcula valor usando historial previo; no viene explícito en payload)
  - Incremento porcentual (`AlertEntry.increase_ratio` formateado a %)
- Dependencias de datos:
  - `AlertsResponse` y estado de filtro temporal compartido (`DateRangeFilter`).
- Estados borde:
  - sin resultados: tabla visible con estado vacío explícito (no desaparecer).
  - error de consulta: estado de error con acción de reintento.
  - loading: skeleton o filas de carga conservando estructura de columnas.

### Reglas de interacción
- Al cambiar threshold y aplicar filtros, la tabla refresca respetando rango de fechas compartido.
- El estado vacío debe comunicar que no se detectaron anomalías para los filtros activos.

## Funcionalidad 3: Vista comparativa B2B vs B2C

### Componentes propuestos

#### BusinessComparisonPage
- Propósito: orquestar la vista dual B2B/B2C con filtro de fechas compartido.
- Props:
  - `dateRange: DateRangeFilter`
  - `onDateRangeChange: (next: DateRangeFilter) => void`
- Dependencias de datos:
  - `TopCategoriesParams` para cada segmento (`business_type: B2B` y `business_type: B2C`, `operation_type: income`, `limit: 5`).
  - Endpoints complementarios para total comparado por grupo:
    - `GET /api/metrics/summary` (con `business_type`) o
    - `GET /api/metrics/comparison` (si se desea variación contra periodo previo).
- Estados borde:
  - si un segmento falla y el otro no, mostrar error parcial por panel sin ocultar el panel sano.

#### BusinessTopCategoriesPanel
- Propósito: presentar top 5 categorías de ingreso por segmento.
- Props:
  - `businessType: "B2B" | "B2C"`
  - `rows: TopCategoriesResponse`
  - `groupTotal: number`
  - `isLoading?: boolean`
  - `errorMessage?: string | null`
- Reglas de presentación:
  - Mostrar categoría, monto total y porcentaje sobre el total del grupo.
  - El porcentaje por fila se calcula en UI como `row.total_amount / groupTotal`.
- Estados borde:
  - `groupTotal = 0`: porcentajes deben mostrarse como 0% evitando división por cero.
  - `rows.length = 0`: renderizar estado vacío explícito del panel (tabla vacía + mensaje "Sin categorías para el rango actual") sin ocultar el panel.
  - respuesta con menos de 5 filas: mostrar las disponibles y estado informativo.

#### B2BvsB2CTotalChart
- Propósito: gráfico único con total de ingresos B2B vs B2C para el rango activo.
- Props:
  - `b2bTotal: number`
  - `b2cTotal: number`
  - `isLoading?: boolean`
  - `errorMessage?: string | null`
- Dependencias de datos:
  - Totales agregados por grupo obtenidos desde endpoint complementario documentado.
- Estados borde:
  - ambos totales en 0: renderizar gráfico con estado neutral y mensaje contextual.

### Reglas de interacción
- El filtro de fechas debe ser único y afectar simultáneamente ambos paneles y el gráfico comparativo.
- La carga de B2B y B2C puede hacerse en paralelo, pero cada panel debe conservar su estado individual.
- Si el top-5 de B2B está vacío, el panel B2B debe renderizar estado vacío explícito.
- Si el top-5 de B2C está vacío, el panel B2C debe renderizar estado vacío explícito.
