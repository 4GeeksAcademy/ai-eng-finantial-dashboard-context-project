# Tasks: Vista comparativa B2B vs B2C

**Input**: [plan.md](plan.md) (aprobado)
**Estado**: Draft — desglose para una futura fase de implementación
(spec-only por defecto, ver `specs/constitution.md` principio 8; se
ejecuta solo si el usuario lo pide explícitamente para esta feature).
`[P]` = paralelizable con la tarea anterior (archivo distinto, sin
dependencia).

## T001 — Tipar `TopCategoryItem` en el frontend [P]
**Archivo**: `frontend/src/lib/financial-types.ts`
Añadir el tipo definido en `plan.md` → "Contrato de datos". Sin
dependencias de otras tareas.

## T002 — Utilidades puras de comparación de negocio [P]
**Archivo nuevo**: `frontend/src/lib/business-comparison-utils.ts`
- `computeCategoryShares(items: TopCategoryItem[])`
- `sumTotalAmount(items: TopCategoryItem[]): number`
- `buildTopCategoriesQueryParams(businessType, startDate, endDate): URLSearchParams`
Ver firmas y reglas exactas en `plan.md`. Sin dependencias de otras
tareas.

## T003 — Tests de `business-comparison-utils.ts`
**Depende de**: T002
**Archivo nuevo**: `frontend/src/lib/business-comparison-utils.test.ts`
Casos obligatorios (ver `plan.md`): `computeCategoryShares` con lista
vacía, con 1 item (100%), con varios items (porcentajes suman ~100%);
`sumTotalAmount` con lista vacía y con varios items;
`buildTopCategoriesQueryParams` con 0/1/2 fechas presentes, siempre con
`operation_type=income&limit=5&business_type=...`.

## T004 — Parametrizar `DashboardHeader` [P]
**Depende de**: (ninguna)
**Archivo**: `frontend/src/components/dashboard/dashboard-header.tsx`
Añadir `title`/`subtitle` opcionales con los valores actuales como
default (ver `plan.md`). No debe cambiar el render del dashboard
existente si no se pasan las nuevas props.

## T005 — Componente `ViewNav` [P]
**Depende de**: (ninguna)
**Archivo nuevo**: `frontend/src/components/view-nav.tsx`
Dos botones ("Dashboard" / "B2B vs B2C"), resalta el activo según
`currentView`, llama `onViewChange`. Sin lógica ni fetch propios.

## T006 — Componente `TopCategoriesTable` [P]
**Depende de**: T001 (usa `TopCategoryItem`), T002 (usa
`computeCategoryShares`)
**Archivo nuevo**: `frontend/src/components/comparison/top-categories-table.tsx`
Props según `plan.md`. Calcula los porcentajes internamente a partir de
`items`. Estado vacío explícito cuando `items.length === 0`. Mismo
patrón visual que `anomaly-alerts-table.tsx`.

## T007 — Componente `BusinessTypeComparisonChart` [P]
**Depende de**: (ninguna — recibe totales ya numéricos)
**Archivo nuevo**: `frontend/src/components/comparison/business-type-comparison-chart.tsx`
`BarChart` de `recharts` con dos barras (`--chart-1` B2B, `--chart-2`
B2C), mismo estilo de tooltip que `income-outcome-chart.tsx`.

## T008 — Componente `ComparisonView`
**Depende de**: T001, T002, T006, T007
**Archivo nuevo**: `frontend/src/components/comparison/comparison-view.tsx`
Estado local de fecha (`startDate`/`endDate` propios, independientes del
dashboard), `<DateRangeFilter>` reutilizado con el `availableRange`
recibido por props, dos fetch a `/api/metrics/categories/top` (uno por
`business_type`) con `AbortController` independiente cada uno, calcula
`sumTotalAmount` de cada grupo para pasarlo al gráfico, renderiza las dos
`<TopCategoriesTable>` + `<BusinessTypeComparisonChart>`.

## T009 — Selector de vista en `App.tsx`
**Depende de**: T004, T005, T008
**Archivo**: `frontend/src/App.tsx`
Estado `currentView` (default `'dashboard'`), renderiza `<ViewNav>`
arriba de `<DashboardHeader>`, condicional entre el contenido actual del
dashboard y `<ComparisonView availableRange={availableRange} />`.

## T010 — Verificación manual en navegador
**Depende de**: T001–T009 completas
Recorrer los 5 escenarios de aceptación de `spec.md`, más: fallo de red
en solo una de las dos llamadas (la otra tabla y el gráfico no deben
verse afectados), ambas llamadas fallando a la vez, y cambiar de vista
ida y vuelta para confirmar que no queda estado obsoleto.

## T011 — Suite de tests completa
**Depende de**: T003, T010
`npm test` (suite completa, sin regresiones en Funcionalidades 1 y 2),
`npm run lint`, `npm run build`.

## Resumen de dependencias

```
T001 ─┬─→ T006 ─┐
T002 ─┤         │
T003 (tras T002)│
T007 ────────────┼─→ T008 ─→ T009 ─→ T010 ─→ T011
T004 ────────────┤
T005 ────────────┘
```

## Review checklist

- [ ] Tareas revisadas y aprobadas
- [ ] T001–T009 implementadas *(pendiente — no ejecutar sin decisión
      explícita de pasar a fase de implementación)*
- [ ] T010 verificación manual completada
- [ ] T011 suite de tests en verde
