# Especificacion de Componentes Frontend

Este documento define la capa de componentes para las tres funcionalidades, sin implementar React ni llamadas reales a API.

## Tipos base para props
```ts
type DateISO = string // YYYY-MM-DD

interface RetryableState {
	isLoading: boolean
	error: string | null
	onRetry: () => void
}
```

## Funcionalidad 1: Filtro de rango de fechas en dashboard principal

### Componentes
1. DashboardDateRangeFilter
Responsabilidad: renderizar fecha inicio, fecha fin, rango disponible y validacion local de rango.
Props:
```ts
interface DashboardDateRangeFilterProps {
	minDate?: DateISO
	maxDate?: DateISO
	valueStartDate?: DateISO
	valueEndDate?: DateISO
	isLoadingFacets: boolean
	facetsError: string | null
	validationMessage: string | null
	onChangeStartDate: (value?: DateISO) => void
	onChangeEndDate: (value?: DateISO) => void
	onClearDateRange: () => void
}
```
Renderizado condicional:
1. Si isLoadingFacets es true, mostrar placeholder del rango disponible.
2. Si facetsError existe, mostrar mensaje "No se pudo cargar el rango disponible" y mantener inputs activos.
3. Si validationMessage existe (start_date > end_date), mostrar error inline y bloquear trigger de fetch.
4. Si solo start_date esta completo, mostrar estado "Desde {start_date}".
5. Si solo end_date esta completo, mostrar estado "Hasta {end_date}".

2. DashboardDateRangeHint
Responsabilidad: mostrar texto de referencia de rango disponible.
Props:
```ts
interface DashboardDateRangeHintProps {
	minDate?: DateISO
	maxDate?: DateISO
	unavailableMessage: string
}
```
Renderizado condicional:
1. Si minDate y maxDate existen, renderizar "Rango disponible: {minDate} a {maxDate}".
2. Si falta alguno, renderizar unavailableMessage.

3. DashboardFiltersBar
Responsabilidad: contenedor visual para filtro de fechas y futuros filtros globales.
Props:
```ts
interface DashboardFiltersBarProps {
	children: React.ReactNode
}
```
Renderizado condicional:
1. Siempre visible mientras la vista principal este montada.

Salidas: ninguna.
Estados UI: normal.

## Funcionalidad 2: Tabla de alertas de anomalias

### Componentes
1. AlertsThresholdInput
Responsabilidad: capturar y validar umbral configurable.
Props:
```ts
interface AlertsThresholdInputProps {
	value: number
	min: number
	max: number
	step: number
	disabled: boolean
	validationMessage: string | null
	onChangeThreshold: (value: number) => void
}
```
Renderizado condicional:
1. Si validationMessage existe, mostrar error inline bajo el input.
2. Si value esta fuera de rango de producto (0.01-1.0), mostrar advertencia y no disparar request.

2. AlertsTable
Responsabilidad: mostrar resultados de anomalias en tabla de 4 columnas.
Props:
```ts
interface AlertsTableProps extends RetryableState {
	rows: Array<{
		period: string
		outcome_total: number
		baseline_average: number
		increase_ratio: number
	}>
	emptyMessage: string
}
```
Renderizado condicional:
1. Si isLoading es true, renderizar skeleton de tabla.
2. Si error existe, renderizar error + boton de reintento.
3. Si rows.length === 0, renderizar emptyMessage explicitamente.
4. Si hay rows, renderizar las 4 columnas obligatorias.

3. AlertsSection
Responsabilidad: orquestar input de umbral y tabla.
Props:
```ts
interface AlertsSectionProps {
	threshold: number
	rows: AlertsTableProps['rows']
	isLoading: boolean
	error: string | null
	dateRangeContext: { start_date?: DateISO; end_date?: DateISO }
	onThresholdChange: (value: number) => void
	onRetry: () => void
}
```
Renderizado condicional:
1. Si solo start_date existe, mostrar badge "Filtrado desde {start_date}".
2. Si solo end_date existe, mostrar badge "Filtrado hasta {end_date}".
3. Si ambos existen, mostrar badge "Filtrado {start_date} a {end_date}".

## Funcionalidad 3: Vista comparativa B2B vs B2C

### Componentes
1. ComparisonDateRangeFilter
Responsabilidad: filtro de fechas para la pagina comparativa.
Props:
```ts
interface ComparisonDateRangeFilterProps {
	minDate?: DateISO
	maxDate?: DateISO
	valueStartDate?: DateISO
	valueEndDate?: DateISO
	validationMessage: string | null
	onChangeStartDate: (value?: DateISO) => void
	onChangeEndDate: (value?: DateISO) => void
	onClear: () => void
}
```
Renderizado condicional:
1. Si validationMessage existe, bloquear refresh de tablas y grafico.
2. Si solo un input esta completo, ejecutar consultas con ese unico limite temporal.

2. BusinessTopCategoriesTable
Responsabilidad: tabla por segmento con top categorias de ingresos.
Props:
```ts
interface BusinessTopCategoriesTableProps extends RetryableState {
	businessType: 'B2B' | 'B2C'
	rows: Array<{
		category: 'suppliers' | 'sales' | 'operational' | 'administrative' | 'others'
		total_amount: number
		percent_of_group: number
	}>
	totalAmount: number
	emptyMessage: string
}
```
Renderizado condicional:
1. Si isLoading es true, renderizar skeleton.
2. Si error existe, renderizar error + reintento del panel.
3. Si rows.length === 0, renderizar estado vacio del panel (obligatorio para ambos paneles).
4. Si rows.length > 0, renderizar top-5 con porcentaje por fila.

3. B2BVsB2CTotalChart
Responsabilidad: visualizar comparativa del total de ingresos B2B vs B2C.
Props:
```ts
interface B2BVsB2CTotalChartProps extends RetryableState {
	b2bTotal: number
	b2cTotal: number
	emptyMessage: string
}
```
Renderizado condicional:
1. Si ambos paneles de categorias estan vacios, renderizar emptyMessage en lugar del grafico.
2. Si hay datos en al menos un grupo, renderizar comparativa con ambos valores (incluyendo 0 para grupo vacio).

4. B2BVsB2CComparisonPage
Responsabilidad: layout principal de la nueva ruta y composicion de secciones.
Props:
```ts
interface B2BVsB2CComparisonPageProps {
	dateFilter: ComparisonDateRangeFilterProps
	b2bTable: BusinessTopCategoriesTableProps
	b2cTable: BusinessTopCategoriesTableProps
	totalChart: B2BVsB2CTotalChartProps
}
```
Renderizado condicional:
1. La pagina no colapsa completa por error de un solo bloque.
2. Cada bloque mantiene su estado independiente (loading, empty, error, data).

## Convenciones transversales de componentes
1. Nunca ocultar un modulo completo por estado vacio si la funcionalidad requiere feedback explicito.
2. Errores recuperables deben exponer accion de reintento local.
3. Las validaciones de rango de fechas se resuelven en UI antes de disparar request.
4. Los componentes de presentacion no construyen query params; consumen estado ya validado.
