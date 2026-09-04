# Implementation Plan: Filtro de rango de fechas en el dashboard principal

**Input**: [spec.md](spec.md) (aprobado)
**Estado**: Draft — pendiente de aprobación antes de pasar a `tasks.md`

## Constitution check

Repaso contra [specs/constitution.md](../constitution.md) antes de detallar
el diseño:

| Principio | Cumplimiento |
|---|---|
| 1. Lógica de negocio fuera de componentes | La validación de rango y la construcción de query params van en `lib/date-filter-utils.ts` (funciones puras), no en el componente ni en `App.tsx`. |
| 2. Fuente única de verdad de tipos | `MetricsFacets` se tipa en `financial-types.ts` reflejando el modelo Pydantic ya existente en `routes.py`; no se inventan campos nuevos. |
| 3. Datos mock deterministas | No aplica — no se toca `generate_mock_movements`. |
| 4. CORS/credenciales | No aplica — no se toca `main.py`. |
| 5. Alias `@/` | Todos los imports nuevos usan `@/lib/...`, `@/components/...`. |
| 6. Verificar estado real antes de planificar | Ya verificado en `spec.md`: **no se toca `backend/`**. |

Ningún principio requiere excepción.

## Resumen técnico

Feature 100% frontend. Se añade estado de filtro (`startDate`, `endDate`)
en `App.tsx`, un componente `DateRangeFilter` para los inputs, una llamada a
`/api/metrics/facets` en el montaje, y se reenvían `start_date`/`end_date` a
`/api/metrics` cuando cambian. Validación y construcción de query params
son funciones puras y testeadas.

## Archivos afectados

### Nuevos

- **`frontend/src/lib/date-filter-utils.ts`**
  - `isValidDateRange(startDate: string, endDate: string): boolean` — `true`
    si alguno está vacío o si `startDate <= endDate` (comparación de
    strings `YYYY-MM-DD`, válida lexicográficamente sin parsear a `Date`).
  - `buildMetricsQueryParams(startDate: string, endDate: string): URLSearchParams`
    — añade `start_date`/`end_date` solo si no están vacíos.
- **`frontend/src/lib/date-filter-utils.test.ts`** — casos: ambos vacíos,
  solo inicio, solo fin, inicio < fin, inicio == fin, inicio > fin;
  construcción de query params con 0/1/2 fechas presentes.
- **`frontend/src/components/dashboard/date-range-filter.tsx`** —
  componente controlado, sin estado propio ni fetch. Recibe:
  ```ts
  interface DateRangeFilterProps {
    startDate: string
    endDate: string
    onStartDateChange: (value: string) => void
    onEndDateChange: (value: string) => void
    availableRange: { minDate: string; maxDate: string } | null
    errorMessage: string | null
  }
  ```
  Dos `<input type="date">` nativos (controlados) + texto con el rango
  disponible (si `availableRange` no es `null`) + mensaje de error inline
  (si `errorMessage` no es `null`). Sigue el estilo visual de
  `dashboard-header.tsx` (Tailwind, mismos tokens de color).

### Editados

- **`frontend/src/lib/financial-types.ts`** — añadir:
  ```ts
  export interface MetricsFacets {
    min_date: string
    max_date: string
  }
  ```
  Se tipan solo los campos que el frontend usa (`min_date`/`max_date`), no
  todo el modelo `MetricsFacets` del backend — evita campos no usados
  (ver principio 6 / criterio de `no-editar-mock-data-sin-confirmar-uso`
  aplicado por analogía: no se añade lo que no se usa).
- **`frontend/src/App.tsx`**:
  - Nuevo estado: `startDate`, `endDate` (`string`, `''` por defecto),
    `availableRange: { minDate; maxDate } | null`, `dateRangeError: string | null`.
  - `fetchFinancialData` pasa a aceptar `(startDate, endDate)` y usa
    `buildMetricsQueryParams` para construir la URL.
  - Nueva función `fetchMetricsFacets()` → `GET /api/metrics/facets`.
  - `useEffect` #1 (una vez, on mount): pide facets; si falla, deja
    `availableRange` en `null` (se oculta el texto, no rompe nada más) —
    no usa el mismo estado `error` que el fetch de métricas.
  - `useEffect` #2 (dependencias `[startDate, endDate]`):
    1. Calcula `isValidDateRange(startDate, endDate)`.
    2. Si es inválido: setea `dateRangeError`, **no** hace fetch, sale.
    3. Si es válido: limpia `dateRangeError`, crea un `AbortController`,
       llama a `fetchFinancialData(startDate, endDate, controller.signal)`.
    4. Cleanup del effect: `controller.abort()` — así, si el usuario cambia
       la fecha antes de que resuelva la petición anterior, esa respuesta
       se descarta (cumple FR-008) sin necesidad de contador manual de
       peticiones.
    5. En el catch, ignorar errores de tipo `AbortError` (son cancelaciones
       intencionales, no fallos reales); cualquier otro error sigue
       seteando el `error` existente (cumple FR-007).
  - Render: `<DateRangeFilter>` entre `<DashboardHeader>` y el banner de
    `error`, pasando el estado de arriba.

## Decisiones de diseño y alternativas descartadas

- **AbortController vs. contador de request-id**: se elige `AbortController`
  por ser el patrón idiomático de React para este caso y porque ya cancela
  la petición HTTP real (el contador manual solo ignora la respuesta, no
  cancela la llamada). Menos código, mismo resultado.
- **Comparación de fechas como string vs. `Date`**: `YYYY-MM-DD` es
  comparable lexicográficamente sin parsear (`'2024-01-05' < '2024-02-01'`
  ya da el orden correcto), evita problemas de timezone al construir
  `Date` desde un string sin hora. Se usa comparación de strings en
  `isValidDateRange`.
- **`fetchFinancialData`/`fetchMetricsFacets` viven en `App.tsx`, no en un
  `lib/api.ts` nuevo**: son solo dos funciones de fetch, y el patrón actual
  ya las coloca junto al componente que las usa (`fetchFinancialData` ya
  está en `App.tsx` hoy). Crear un archivo nuevo para dos funciones sería
  una abstracción prematura para el tamaño actual del proyecto.
- **No se usa librería de date-picker**: confirmado como fuera de alcance
  en `spec.md`; `<input type="date">` nativo ya da validación de formato y
  UI de calendario del navegador sin dependencias nuevas.

## Testing

- Unitarios (Vitest, mismo runner que `financial-utils.test.ts`):
  `date-filter-utils.test.ts` cubre todos los casos de `isValidDateRange` y
  `buildMetricsQueryParams` listados arriba.
- Manual (antes de dar la feature por terminada, `docker compose up` o
  `npm run dev`): recorrer los 6 escenarios de aceptación del spec en el
  navegador, incluyendo el caso de rango inválido y el de borrar ambas
  fechas para volver a ver todo el dataset.
- No se añaden tests de backend — no hay cambios de backend.

## Fuera de alcance de este plan (heredado del spec)

Filtro por categoría/tipo/business_type, persistencia en URL o
`localStorage`, date-picker con librería externa.

## Review checklist

- [x] Diseño técnico revisado y aprobado por el usuario
- [x] Constitution check sin excepciones pendientes
- [x] Archivos afectados identificados con responsabilidad clara por archivo
