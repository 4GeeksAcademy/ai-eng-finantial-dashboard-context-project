# Mantener la lógica de negocio fuera de los componentes React

**Alcance:** `frontend/src/lib/financial-utils.ts` y cualquier componente bajo
`frontend/src/components/`.

**Justificación:** `computeKPIs` y `computeMonthlyData`, definidas en
`frontend/src/lib/financial-utils.ts`, no importan React y se testean sin montar
ningún componente (`frontend/src/lib/financial-utils.test.ts`). Esa separación es
lo que permite testear los cálculos financieros de forma rápida y aislada.

**Guía específica del proyecto:**
- Cualquier cálculo nuevo sobre `FinancialMovement[]` (totales, ratios,
  comparaciones, agrupaciones) se añade como función pura en
  `financial-utils.ts`, no dentro de un `.tsx`.
- Los componentes de `frontend/src/components/dashboard/` (como `kpi-row.tsx`,
  `income-outcome-chart.tsx`) solo deben recibir datos ya calculados por props
  (ver el patrón de `KPIRow` recibiendo `metrics: KPIMetrics | null`) y encargarse
  únicamente de presentación.
- Toda función nueva en `financial-utils.ts` debe llevar su test correspondiente
  en `financial-utils.test.ts`, siguiendo el estilo ya usado ahí (casos con datos
  de ejemplo pequeños y aserciones exactas).
