# Implementation Plan: Vista comparativa B2B vs B2C

**Input**: [spec.md](spec.md) (aprobado)
**Estado**: Draft — pendiente de aprobación

## Constitution check

| Principio | Cumplimiento |
|---|---|
| 1. Lógica de negocio fuera de componentes | Cálculo de porcentaje y suma de totales en `lib/business-comparison-utils.ts`, puro y testeado — no en los componentes. |
| 2. Fuente única de verdad de tipos | `TopCategoryItem` mirror 1:1 del backend, igual criterio que `MetricsAlert`/`MetricsFacets`. |
| 3. Datos mock deterministas | No aplica. |
| 4. CORS/credenciales | No aplica. |
| 5. Alias `@/` | Todo import nuevo usa `@/lib/...`, `@/components/...`. |
| 6. Verificar estado real antes de planificar | Hecho en `spec.md` — sin cambios de backend. |
| 7. Afirmaciones de API verificadas contra `docs/openapi.json` | Hecho en `spec.md` (4 discrepancias resueltas con el usuario). |
| 8. Spec-only vs. implementar | Este plan describe archivos a crear; se implementa solo si el usuario lo pide explícitamente para esta feature (como ya ocurrió con la 001 y la 002). |

Sin excepciones pendientes.

## Resumen técnico

Feature de frontend puro, sin routing nuevo: un selector de vista con
estado en `App.tsx` alterna entre el dashboard actual y una nueva vista
`ComparisonView`. Esta vista pide dos veces `/api/metrics/categories/top`
(una por `business_type`) con el mismo patrón `AbortController` ya
establecido, calcula porcentajes en frontend, y deriva el gráfico
comparativo sumando esos mismos datos — sin llamadas adicionales.

## Selector de vista (sin routing)

**Archivo**: `frontend/src/App.tsx` (editar)

- Nuevo estado: `currentView: 'dashboard' | 'comparison'` (default
  `'dashboard'`).
- Nuevo componente pequeño **`frontend/src/components/view-nav.tsx`**:
  dos botones ("Dashboard", "B2B vs B2C"), resalta el activo, llama
  `onViewChange(view)`. Sin lógica propia, solo presentación.
- `App.tsx` renderiza `<ViewNav currentView={currentView}
  onViewChange={setCurrentView} />` arriba de `<DashboardHeader>`, y
  condicional: si `currentView === 'dashboard'`, el contenido actual
  (KPIs, gráficos, alertas); si `'comparison'`, `<ComparisonView
  availableRange={availableRange} />` (reutiliza el `availableRange` que
  `App.tsx` ya obtiene de `/api/metrics/facets` para la Funcionalidad 1 —
  sin fetch de facetas duplicado, ver spec).
- Cambiar de vista desmonta la anterior (sin caché) — aceptado
  explícitamente en el spec.

## `DashboardHeader` parametrizado

**Archivo**: `frontend/src/components/dashboard/dashboard-header.tsx` (editar)

Añadir `title`/`subtitle` opcionales con los valores actuales como
default, para poder reusarlo en `ComparisonView` con un título distinto
sin duplicar el componente:

```ts
interface DashboardHeaderProps {
  period?: string
  title?: string      // default: 'Financial Overview'
  subtitle?: string    // default: 'Executive metrics dashboard'
}
```

Cambio no rompe nada existente (mismos defaults).

## Contrato de datos (tipos)

**Archivo**: `frontend/src/lib/financial-types.ts` (editar)

```ts
export interface TopCategoryItem {
  category: Category
  operation_type: OperationType
  total_amount: number
}
```

Mirror exacto de `TopCategoryItem` verificado en
`docs/openapi.json` → `components.schemas.TopCategoryItem`.

## Contrato de utilidades puras

**Archivo nuevo**: `frontend/src/lib/business-comparison-utils.ts`

- `computeCategoryShares(items: TopCategoryItem[]): (TopCategoryItem & { percentage: number })[]`
  — `percentage = total_amount / suma(total_amount de items) * 100`;
  devuelve `[]` sin dividir por cero si `items` está vacío.
- `sumTotalAmount(items: TopCategoryItem[]): number` — reutilizado tanto
  para el denominador del porcentaje como para las dos barras del
  gráfico comparativo (un solo lugar de verdad, ver spec FR-004).
- `buildTopCategoriesQueryParams(businessType: BusinessType, startDate: string, endDate: string): URLSearchParams`
  — fija `operation_type=income&limit=5`, añade `business_type` siempre,
  `start_date`/`end_date` si no están vacíos.

**Archivo nuevo**: `frontend/src/lib/business-comparison-utils.test.ts`
— casos: `computeCategoryShares` con 0/1/2 items (porcentajes suman
~100%, caso vacío no rompe), `sumTotalAmount` con lista vacía y con
varios items, `buildTopCategoriesQueryParams` con/sin fechas.

## Contrato de componentes (props, sin implementación de render)

**Archivo nuevo**: `frontend/src/components/comparison/top-categories-table.tsx`

```ts
interface TopCategoriesTableProps {
  title: string                    // "B2B" / "B2C"
  items: TopCategoryItem[]
  loading?: boolean
  error?: string | null
}
```
Calcula `computeCategoryShares(items)` internamente para pintar la
tercera columna (no lo recibe ya calculado — es un detalle de
presentación derivado de `items`, no estado). Mismo patrón visual y de
estado vacío que `anomaly-alerts-table.tsx` (Card + tabla Tailwind +
mensaje "No hay ingresos registrados para {title} en este rango." si
`items.length === 0`).

**Archivo nuevo**: `frontend/src/components/comparison/business-type-comparison-chart.tsx`

```ts
interface BusinessTypeComparisonChartProps {
  b2bTotal: number
  b2cTotal: number
  loading?: boolean
}
```
`BarChart` de `recharts` (ya es dependencia) con dos barras, `--chart-1`
para B2B y `--chart-2` para B2C (tokens categóricos ya definidos en
`index.css`, no se añade CSS nuevo). Mismo `CustomTooltip`/estilo que
`income-outcome-chart.tsx`.

**Archivo nuevo**: `frontend/src/components/comparison/comparison-view.tsx`

```ts
interface ComparisonViewProps {
  availableRange: { minDate: string; maxDate: string } | null
}
```
Orquesta: su propio `startDate`/`endDate` (estado local, independiente
del filtro del dashboard — ver spec), reutiliza `<DateRangeFilter>` de
la Funcionalidad 1 pasándole `availableRange` recibido por props, hace
las dos llamadas a `/api/metrics/categories/top` (una por
`business_type`) con `AbortController` independiente cada una, y
renderiza `<TopCategoriesTable>` × 2 + `<BusinessTypeComparisonChart>`.

## Alternativas descartadas

- **Routing real (`react-router`)**: descartado en el spec — añadiría una
  dependencia nueva para un problema que un estado `currentView` resuelve
  igual de bien al tamaño actual de la app.
- **Pasar el porcentaje ya calculado como prop de `TopCategoriesTable`**:
  descartado — `items` (la respuesta cruda de la API) ya es toda la
  información que la tabla necesita; calcular el porcentaje dentro es
  menos estado que sincronizar, y sigue siendo una función pura reutilizada
  (`computeCategoryShares`), no lógica duplicada.
- **Compartir el filtro de fechas del dashboard con la vista de
  comparación**: descartado en el spec — son contextos distintos ("la
  comparativa" tiene su propio filtro), aunque sí se comparte
  `availableRange` (metadato global del dataset, no estado de filtro).
- **Endpoint nuevo en backend para el total por grupo**: descartado — ya
  es derivable sumando la respuesta existente (`sumTotalAmount`), pedir
  un endpoint nuevo sería trabajo de backend innecesario.

## Testing (propuesto para cuando se implemente)

- Unitarios: `business-comparison-utils.test.ts` (casos arriba).
- Manual: los 5 escenarios de aceptación del spec, más el caso de fallo
  de red en solo una de las dos llamadas (B2B u B2C) y el de ambas
  fallando a la vez.
- Sin tests de backend — no hay cambios de backend.

## Fuera de alcance de este plan (heredado del spec)

Routing real, filtro por categoría adicional, comparación de `outcome`,
persistencia de la vista seleccionada, caché entre cambios de vista.

## Review checklist

- [x] Diseño técnico revisado y aprobado
- [x] Constitution check sin excepciones pendientes
- [x] Contrato de tipos, utilidades y componentes definidos y verificados
      contra `docs/openapi.json`
