# Desglose de componentes

## Funcionalidad 1: Filtro de rango de fechas en dashboard principal

- DashboardPage
- Responsabilidad: orquesta estado global de filtros, carga de datos y render de KPIs/graficos.
- Props clave: sin props (pagina raiz).
- Estado clave: `dateRange: DateRangeFilter`.

- DateRangeFilterBar
- Responsabilidad: renderiza input de fecha inicio y fecha fin, y comunica cambios al contenedor.
- Props clave:
  - `value: DateRangeFilter`
  - `onChange: (next: DateRangeFilter) => void`
  - `minDate?: string`
  - `maxDate?: string`
  - `isLoadingFacets?: boolean`

- DateRangeReference
- Responsabilidad: mostrar rango valido disponible del dataset (min_date - max_date).
- Props clave:
  - `minDate?: string`
  - `maxDate?: string`
  - `isLoading?: boolean`

- useDateRangeFilters (hook)
- Responsabilidad: normaliza y serializa `start_date`/`end_date` para query string.
- Entradas: `DateRangeFilter`.
- Salidas: objeto de query y helpers de validacion local.

## Funcionalidad 2: Tabla de alertas de anomalias

- AlertsSection
- Responsabilidad: contenedor de umbral + tabla + estados (loading, error, vacio).
- Props clave:
  - `dateRange: DateRangeFilter`

- AlertsThresholdInput
- Responsabilidad: input numerico para threshold con clamp de UI entre 0.01 y 1.0.
- Props clave:
  - `value: number`
  - `onChange: (threshold: number) => void`
  - `min?: number` (0.01)
  - `max?: number` (1.0)
  - `step?: number` (ej: 0.01)

- AlertsTable
- Responsabilidad: tabla de 4 columnas (period, outcome, baseline, increase).
- Props clave:
  - `rows: AlertsResponse`
  - `isLoading?: boolean`

- EmptyAlertsState
- Responsabilidad: mensaje explicito cuando no hay anomalias para el umbral actual.
- Props clave:
  - `threshold: number`

- useAlertsQuery (hook)
- Responsabilidad: construye `AlertsParams`, ejecuta fetch y maneja estado de peticion.
- Entradas: `AlertsParams`.
- Salidas: `{ data, isLoading, isError }`.

## Funcionalidad 3: Vista comparativa B2B vs B2C

- B2BvsB2CPage
- Responsabilidad: pagina dedicada de comparativa; controla filtros de fecha y carga paralela de datos por linea de negocio.
- Props clave: sin props (ruta/pagina).
- Estado clave: `dateRange: DateRangeFilter`.

- ComparisonFiltersBar
- Responsabilidad: reutiliza filtro de fechas para comparativa.
- Props clave:
  - `value: DateRangeFilter`
  - `onChange: (next: DateRangeFilter) => void`
  - `minDate?: string`
  - `maxDate?: string`

- TopCategoriesPanel
- Responsabilidad: seccion de una linea de negocio (B2B o B2C) con tabla top 5.
- Props clave:
  - `title: 'B2B' | 'B2C'`
  - `rows: TopCategoriesResponse`
  - `groupTotalIncome: number`
  - `isLoading?: boolean`

- TopCategoriesTable
- Responsabilidad: render de filas con categoria, total y porcentaje sobre total del grupo.
- Props clave:
  - `rows: TopCategoriesResponse`
  - `groupTotalIncome: number`

- IncomeComparisonChart
- Responsabilidad: grafico unico con total ingresos B2B vs B2C.
- Props clave:
  - `b2bIncomeTotal: number`
  - `b2cIncomeTotal: number`

- useTopCategoriesByBusinessType (hook)
- Responsabilidad: dispara 2 consultas a `/api/metrics/categories/top` con `business_type` distinto y mismo rango de fecha.
- Entradas:
  - `baseParams: TopCategoriesParams`
  - `businessType: 'B2B' | 'B2C'`
- Salidas: `{ data, isLoading, isError }`.
