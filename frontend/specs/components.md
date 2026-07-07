# Desglose de Componentes por Funcionalidad

Este documento describe la capa de componentes frontend esperada para las tres funcionalidades, sin implementar React en este entregable.

## Funcionalidad 1: Filtro por rango de fechas

### Objetivo de UI
Permitir seleccionar `start_date` y `end_date` (opcionales) y mostrar rango disponible desde facetas.

### Componentes sugeridos
- `DateRangeFiltersPanel`
- `DateInputField` (reutilizable para inicio/fin)
- `AvailableRangeHint`

### Props sugeridas
- `valueStart: string`
- `valueEnd: string`
- `minDate: string | null`
- `maxDate: string | null`
- `onChangeStart(next: string): void`
- `onChangeEnd(next: string): void`
- `onApply(): void`
- `onClear(): void`
- `error: string | null`

### Estado de UI
- Cargando facetas
- Error de facetas
- Rango valido aplicado
- Rango invalido (inicio > fin)

## Funcionalidad 2: Tabla de alertas de anomalias

### Objetivo de UI
Mostrar alertas por umbral configurable y mantener componente visible incluso sin filas.

### Componentes sugeridos
- `AnomalyAlertsTable`
- `AlertThresholdInput`
- `AlertsEmptyState`

### Props sugeridas
- `rows: AlertEntry[]`
- `threshold: string`
- `thresholdError: string | null`
- `loading: boolean`
- `error: string | null`
- `onThresholdChange(next: string): void`

### Estado de UI
- Cargando alertas
- Error de alertas
- Sin anomalias (tabla visible + mensaje explicito)
- Datos cargados

## Funcionalidad 3: Vista comparativa B2B vs B2C

### Objetivo de UI
Mostrar dos tablas paralelas (B2B y B2C) con top 5 categorias de ingreso y un grafico unico de comparacion de totales.

### Componentes sugeridos
- `ComparisonViewContainer`
- `BusinessIncomeTable` (reutilizable por linea)
- `BusinessIncomeComparisonChart`
- `ViewSwitcher` (Overview vs Comparacion)

### Props sugeridas para tabla
- `businessType: "B2B" | "B2C"`
- `rows: CategoryEntry[]`
- `groupTotalIncome: number`
- `availableCategories: Category[]`
- `loading: boolean`
- `error: string | null`

### Props sugeridas para grafico
- `b2bIncomeTotal: number`
- `b2cIncomeTotal: number`
- `loading: boolean`

### Estado de UI
- Cargando comparativa
- Error de comparativa
- Sin datos para rango actual
- Datos cargados

## Reglas de composicion
- El filtro de fechas es compartido por las tres funcionalidades.
- La vista comparativa no debe duplicar logica de validacion de fechas.
- Los componentes de tablas y grafico reciben datos listos para renderizar (sin fetch interno).
