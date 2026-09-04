# Tasks: Tabla de alertas de anomalías en el dashboard principal

**Input**: [plan.md](plan.md) (aprobado)
**Estado**: Draft — desglose para una futura fase de implementación.
Según la metodología de este proyecto (spec-only, ver
`specs/constitution.md` principio 8), **estas tareas no se ejecutan en
esta conversación** — quedan listas para cuando se decida implementar.
`[P]` = paralelizable con la tarea anterior (archivo distinto, sin
dependencia).

## T001 — Tipar `MetricsAlert` en el frontend [P]
**Archivo**: `frontend/src/lib/financial-types.ts`
Añadir el tipo definido en `plan.md` → "Contrato de datos". Sin
dependencias de otras tareas.

## T002 — Utilidades puras de validación de umbral [P]
**Archivo nuevo**: `frontend/src/lib/anomaly-threshold-utils.ts`
- `isValidThreshold(value: string): boolean`
- `buildAlertsQueryParams(threshold: number, startDate: string, endDate: string): URLSearchParams`
Ver firmas y reglas exactas en `plan.md`. Sin dependencias de otras
tareas.

## T003 — Tests de `anomaly-threshold-utils.ts`
**Depende de**: T002
**Archivo nuevo**: `frontend/src/lib/anomaly-threshold-utils.test.ts`
Casos obligatorios (ver `plan.md`): `"0.3"` válido (default), límites
`"0.01"`/`"1"` válidos, fuera de rango (`"0"`, `"1.5"`) inválidos, no
numérico o vacío (`"abc"`, `""`) inválidos; `buildAlertsQueryParams` con
0/1/2 fechas presentes más `threshold` siempre incluido.

## T004 — Componente `AnomalyAlertsTable` [P]
**Depende de**: T001 (usa el tipo `MetricsAlert` en sus props)
**Archivo nuevo**: `frontend/src/components/dashboard/anomaly-alerts-table.tsx`
Props según `plan.md` (`AnomalyAlertsTableProps`). Input de umbral +
tabla de 4 columnas + mensaje de estado vacío explícito cuando
`alerts.length === 0`. Sigue el patrón visual de
`income-outcome-chart.tsx` (`Card`, `Skeleton`). Sin lógica de detección
de anomalías — solo formatea y renderiza lo que llega en `alerts`.

## T005 — Fetch de alertas en `App.tsx`
**Depende de**: T001, T002
**Archivo**: `frontend/src/App.tsx`
Nueva función `fetchMetricsAlerts(threshold, startDate, endDate, signal): Promise<MetricsAlert[]>`
→ `GET /api/metrics/alerts` usando `buildAlertsQueryParams`.

## T006 — Estado y efecto de alertas en `App.tsx`
**Depende de**: T005
**Archivo**: `frontend/src/App.tsx`
- Estado nuevo: `threshold: string` (default `"0.3"`), `alerts:
  MetricsAlert[]`, `alertsError: string | null`.
- Derivar `isThresholdValid`/`thresholdError` con `isValidThreshold`
  (valor derivado, no `setState` síncrono en effect — mismo patrón fijado
  en la Funcionalidad 1 tras el aviso de `react-hooks/set-state-in-effect`).
- `useEffect` con deps `[threshold, startDate, endDate]`: si
  `!isThresholdValid`, `return` sin fetch; si es válido, `AbortController`
  + `fetchMetricsAlerts`, cleanup aborta. Mismo manejo de `AbortError` que
  el efecto de métricas de la Funcionalidad 1.

## T007 — Integrar `AnomalyAlertsTable` en el render de `App.tsx`
**Depende de**: T004, T006
**Archivo**: `frontend/src/App.tsx`
Nueva `<section>` después de la de gráficos existente, pasando `alerts`,
`threshold`, el setter, `thresholdError` y el estado de carga/error de
esta sección (no reutilizar el `loading`/`error` de `/api/metrics`).

## T008 — Verificación manual en navegador
**Depende de**: T001–T007 completas
Recorrer los 6 escenarios de aceptación de `spec.md` en el navegador, más
el caso de `increase_ratio == threshold` exacto (no debe aparecer como
alerta) y la condición de carrera al cambiar `threshold` y las fechas casi
a la vez.

## T009 — Suite de tests completa
**Depende de**: T003, T008
`npm test` (suite completa, sin regresiones en los tests existentes de
las Funcionalidades 1 y 2), `npm run lint`, `npm run build`.

## Resumen de dependencias

```
T001 ─┐
T002 ─┼─→ T005 ─→ T006 ─→ T007 ─→ T008 ─→ T009
T004 ─┘              ↑                    ↑
T003 (tras T002) ─────┴────────────────────┘
```

## Review checklist

- [ ] Tareas revisadas y aprobadas
- [ ] T001–T007 implementadas *(pendiente — no ejecutar sin decisión
      explícita de pasar a fase de implementación)*
- [ ] T008 verificación manual completada
- [ ] T009 suite de tests en verde
