# Implementation Plan: Tabla de alertas de anomalías en el dashboard principal

**Input**: [spec.md](spec.md) (aprobado)
**Estado**: Draft — pendiente de aprobación

## Constitution check

| Principio | Cumplimiento |
|---|---|
| 1. Lógica de negocio fuera de componentes | La tabla solo formatea y renderiza `MetricsAlert[]` tal cual llega; ninguna detección de anomalías se recalcula en frontend (consistente con la decisión tomada en el spec sobre `baseline_average`). |
| 2. Fuente única de verdad de tipos | `MetricsAlert` en `financial-types.ts` mirror 1:1 del modelo del backend (snake_case), igual que `MetricsFacets`. |
| 3. Datos mock deterministas | No aplica — no se toca `generate_mock_movements`. |
| 4. CORS/credenciales | No aplica. |
| 5. Alias `@/` | Todo import nuevo usa `@/lib/...`, `@/components/...`. |
| 6. Verificar estado real antes de planificar | Ya hecho en `spec.md` — no se toca `backend/`. |
| 7. Afirmaciones de API verificadas contra `docs/openapi.json` | Ya hecho en `spec.md` (tabla de verificación) — dos ❌ resueltos con el usuario. |
| 8. Spec-only, sin implementar | Este plan describe archivos y contratos **a crear**, no se ejecuta código en esta fase. |

Sin excepciones pendientes.

## Resumen técnico

Feature de frontend puro. Reutiliza el patrón ya establecido en la
Funcionalidad 1 (`specs/001-filtro-rango-fechas/`): estado en `App.tsx`,
fetch con `AbortController` por cambio de dependencias, error inline
propio de la sección. Se añade un segundo "filtro" (`threshold`) que
convive con `startDate`/`endDate` ya existentes — la tabla depende de los
tres.

## Contrato de datos (tipos)

**Archivo**: `frontend/src/lib/financial-types.ts` (editar)

```ts
export interface MetricsAlert {
  period: string
  outcome_total: number
  baseline_average: number
  increase_ratio: number
}
```

Mirror exacto de `MetricsAlert` en `backend/app/routes.py` / verificado en
`docs/openapi.json` → `components.schemas.MetricsAlert`. No se traduce a
camelCase porque, igual que `FinancialMovement`/`MetricsFacets`, es un
tipo que llega tal cual de la API sin transformación intermedia.

## Contrato de utilidades puras

**Archivo nuevo**: `frontend/src/lib/anomaly-threshold-utils.ts`

- `isValidThreshold(value: string): boolean` — `true` solo si `value` es
  numérico y está en `[0.01, 1.0]`. Un string vacío es **inválido** aquí
  (a diferencia de las fechas de la Funcionalidad 1): el PM fija un valor
  por defecto de 0.3 para el umbral, no un estado "sin filtro" — así que
  el input siempre debe llevar un número válido, nunca quedar vacío sin
  bloquear.
- `buildAlertsQueryParams(threshold: number, startDate: string, endDate: string): URLSearchParams`
  — añade `threshold` siempre, más `start_date`/`end_date` si no están
  vacíos (reutiliza la misma idea que `buildMetricsQueryParams` de la
  Funcionalidad 1, pero como función propia porque el parámetro base
  cambia — no se generaliza una función común todavía para dos casos, ver
  "Alternativas descartadas").

**Archivo nuevo**: `frontend/src/lib/anomaly-threshold-utils.test.ts` —
casos: valor por defecto `"0.3"` válido, límites `"0.01"`/`"1"` válidos,
fuera de rango (`"0"`, `"1.5"`) inválidos, no numérico (`"abc"`, `""`)
inválidos.

## Contrato de componentes (props, sin implementación de render)

**Archivo nuevo**: `frontend/src/components/dashboard/anomaly-alerts-table.tsx`

```ts
interface AnomalyAlertsTableProps {
  alerts: MetricsAlert[]
  threshold: string
  onThresholdChange: (value: string) => void
  thresholdError: string | null
  loading?: boolean
  error?: string | null
}
```

Diseño de contenido (para cuando se implemente):
- Input numérico de umbral arriba de la tabla (`type="number"`, `min="0.01"`, `max="1"`, `step="0.01"`), con `thresholdError` inline igual que `DateRangeFilter` en la Funcionalidad 1.
- Tabla con columnas: Período | Outcome | Promedio anterior | Incremento — usando `formatCurrency` para las dos columnas monetarias y `formatPercent` (multiplicando `increase_ratio * 100`) para la última, ambas ya existentes en `financial-utils.ts`.
- Si `alerts.length === 0` (y no hay error ni loading): mensaje de estado vacío explícito en el cuerpo de la tabla, por ejemplo "No se detectaron anomalías para el umbral actual." — nunca ocultar la sección completa (FR-004).
- Sigue el patrón visual de `income-outcome-chart.tsx`: `Card`/`CardHeader`/`CardContent` de `@/components/ui/card`, `Skeleton` en estado `loading`.
- **No existe componente de tabla reutilizable en `components/ui/`** (solo `card.tsx`, `skeleton.tsx`) — este componente construye su propio `<table>` con clases Tailwind, no depende de una librería de tablas nueva.

## Integración con `App.tsx` (descrita, no implementada aquí)

- Nuevo estado: `threshold: string` (default `"0.3"`), derivar
  `isThresholdValid`/`thresholdError` igual que `isRangeValid`/`dateRangeError`
  de la Funcionalidad 1 (valores derivados, no `setState` síncrono en
  effect — la Funcionalidad 1 ya dejó ese patrón fijado tras el aviso del
  linter `react-hooks/set-state-in-effect`).
- Nuevo estado: `alerts: MetricsAlert[]`, `alertsError: string | null`,
  `alertsLoading: boolean`.
- Nuevo `useEffect` con deps `[threshold, startDate, endDate]`: igual
  patrón `AbortController` que el efecto de métricas de la Funcionalidad
  1 — cancela la petición anterior en el cleanup, ignora `AbortError`.
- Nueva función `fetchMetricsAlerts(threshold, startDate, endDate, signal)`
  → `GET /api/metrics/alerts` (sin `group_by`, se deja el default `month`
  del backend — ver spec).
- Render: `<AnomalyAlertsTable>` en una nueva `<section>` después de la de
  gráficos existente.

## Alternativas descartadas

- **Generalizar `buildMetricsQueryParams`/`buildAlertsQueryParams` en una
  sola función**: se evalúa pero se descarta por ahora — los parámetros
  base son distintos (`start_date`/`end_date` vs. `threshold` +
  `start_date`/`end_date`) y forzar una firma común añadiría parámetros
  opcionales que no todos los llamadores usan. Con solo dos casos, dos
  funciones pequeñas y explícitas son más claras que una abstracción
  compartida prematura.
- **Reutilizar el mismo patrón `isValidDateRange` (vacío = válido) para
  el umbral**: descartado porque el umbral, a diferencia de las fechas,
  no tiene un estado "sin filtro" — siempre se envía con un valor (0.3 por
  defecto), así que vacío debe ser inválido, no equivalente a "todo".
- **Librería de tabla (TanStack Table, etc.)**: no se introduce — la
  tabla no pagina, ordena ni filtra internamente (eso ya lo hace el
  backend), así que un `<table>` HTML con Tailwind es suficiente y no
  añade una dependencia nueva.

## Testing (propuesto para cuando se implemente)

- Unitarios: `anomaly-threshold-utils.test.ts` (casos arriba).
- Manual: recorrer los 6 escenarios de aceptación del spec, más el caso
  de umbral en el límite exacto (`increase_ratio == threshold`, no debe
  aparecer).
- Sin tests de backend — no hay cambios de backend.

## Fuera de alcance de este plan (heredado del spec)

`group_by` configurable, `business_type` en esta tabla, media móvil real
de 3 períodos recalculada en frontend, orden/paginación/exportación de la
tabla.

## Review checklist

- [x] Diseño técnico revisado y aprobado
- [x] Constitution check sin excepciones pendientes
- [x] Contrato de tipos y de componente definidos y verificados contra
      `docs/openapi.json`
