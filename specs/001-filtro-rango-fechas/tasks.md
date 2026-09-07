# Tasks: Filtro de rango de fechas en el dashboard principal

**Input**: [plan.md](plan.md) (aprobado)
**Estado**: Draft — ejecutar en orden; `[P]` = puede hacerse en paralelo con
la tarea anterior porque toca un archivo distinto sin dependencia entre sí.

## T001 — Tipar `MetricsFacets` en el frontend [P]
**Archivo**: `frontend/src/lib/financial-types.ts`
Añadir:
```ts
export interface MetricsFacets {
  min_date: string
  max_date: string
}
```
Solo estos dos campos (los que consume esta feature), no todo el modelo del
backend. Sin dependencias de otras tareas.

## T002 — Crear utilidades puras de filtro de fecha [P]
**Archivo nuevo**: `frontend/src/lib/date-filter-utils.ts`
- `isValidDateRange(startDate: string, endDate: string): boolean`
- `buildMetricsQueryParams(startDate: string, endDate: string): URLSearchParams`
Ver firmas y reglas exactas en `plan.md` → "Archivos afectados / Nuevos".
Sin dependencias de otras tareas.

## T003 — Tests de `date-filter-utils.ts`
**Depende de**: T002
**Archivo nuevo**: `frontend/src/lib/date-filter-utils.test.ts`
Casos obligatorios:
- `isValidDateRange`: ambos vacíos → `true`; solo inicio → `true`; solo fin
  → `true`; inicio < fin → `true`; inicio == fin → `true`; inicio > fin →
  `false`.
- `buildMetricsQueryParams`: sin fechas → params vacíos; solo `start_date`;
  solo `end_date`; ambos.
Ejecutar `npm test` en `frontend/` y confirmar que pasan antes de seguir.

## T004 — Componente `DateRangeFilter` [P]
**Depende de**: (ninguna — usa tipos primitivos, no `MetricsFacets`)
**Archivo nuevo**: `frontend/src/components/dashboard/date-range-filter.tsx`
Props según `plan.md` (`DateRangeFilterProps`): dos `<input type="date">`
controlados + texto de rango disponible si `availableRange` no es `null` +
mensaje de error inline si `errorMessage` no es `null`. Sin estado propio,
sin fetch. Estilo Tailwind consistente con `dashboard-header.tsx`.

## T005 — Extender fetch de métricas y añadir fetch de facets en `App.tsx`
**Depende de**: T001, T002
**Archivo**: `frontend/src/App.tsx`
- `fetchFinancialData` pasa a aceptar `(startDate, endDate, signal)` y usa
  `buildMetricsQueryParams` para construir la query string.
- Nueva función `fetchMetricsFacets(): Promise<MetricsFacets>` →
  `GET /api/metrics/facets`.

## T006 — Estado y efectos del filtro en `App.tsx`
**Depende de**: T005
**Archivo**: `frontend/src/App.tsx`
- Estado nuevo: `startDate`, `endDate` (`string`, default `''`),
  `availableRange: { minDate: string; maxDate: string } | null`,
  `dateRangeError: string | null`.
- `useEffect` on-mount: llama `fetchMetricsFacets()`; en éxito, mapea
  `min_date`/`max_date` → `availableRange.minDate`/`maxDate`; en fallo,
  deja `availableRange` en `null` sin tocar el `error` general.
- `useEffect` con deps `[startDate, endDate]`: valida con
  `isValidDateRange`; si inválido, setea `dateRangeError` y no hace fetch;
  si válido, limpia `dateRangeError`, crea `AbortController`, llama a
  `fetchFinancialData`, y en el cleanup del effect aborta el controller.
  En el `catch`, ignorar `AbortError`; cualquier otro error setea el
  `error` existente igual que hoy.

## T007 — Integrar `DateRangeFilter` en el render de `App.tsx`
**Depende de**: T004, T006
**Archivo**: `frontend/src/App.tsx`
Renderizar `<DateRangeFilter>` entre `<DashboardHeader>` y el banner de
`error`, pasando `startDate`, `endDate`, los setters, `availableRange` y
`dateRangeError` como `errorMessage`.

## T008 — Verificación manual en navegador
**Depende de**: T001–T007 completas
Levantar la app (`docker compose up --build` o `npm run dev` en
`frontend/` + backend corriendo) y recorrer en el navegador los 6
escenarios de aceptación de `spec.md`:
1. Sin fechas → todos los datos.
2. Solo fecha de inicio.
3. Rango completo válido → KPIs y ambos gráficos coinciden.
4. Borrar ambas fechas → vuelve a verse todo.
5. Inicio > fin → mensaje de error inline, sin request nueva.
6. Rango disponible visible cerca de los inputs tras la carga inicial.
Adicional: cambiar de fecha rápido varias veces seguidas y confirmar que
no aparecen datos de una respuesta obsoleta (FR-008).

## T009 — Suite de tests completa
**Depende de**: T003, T008
Ejecutar `npm test` en `frontend/` (suite completa, no solo el archivo
nuevo) y confirmar que todo pasa, incluyendo `financial-utils.test.ts`
existente sin regresiones.

## Resumen de dependencias

```
T001 ─┐
T002 ─┼─→ T005 ─→ T006 ─→ T007 ─→ T008 ─→ T009
T004 ─┘              ↑                    ↑
T003 (tras T002) ─────┴────────────────────┘
```

## Review checklist

- [x] Tareas revisadas y aprobadas por el usuario
- [x] T001–T007 implementadas
- [x] T008 verificación manual completada (backend uvicorn + `npm run dev`,
      recorrido con Playwright: los 6 escenarios de aceptación + condición
      de carrera; ver capturas y notas en la conversación)
- [x] T009 suite de tests en verde (15/15, `npm test`), más `npm run lint`
      y `npm run build` sin errores
