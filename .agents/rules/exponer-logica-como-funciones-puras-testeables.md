# Exponer la lógica nueva como funciones puras testeables directamente

**Alcance:** `backend/app/routes.py` + `backend/tests/`, y
`frontend/src/lib/financial-utils.ts` + `frontend/src/lib/financial-utils.test.ts`.

**Justificación:** el proyecto ya prueba su lógica sin pasar por HTTP ni por
render de componentes: `backend/tests/test_routes.py` importa y llama
directamente a `generate_mock_movements` y `filter_movements_by_date`
(`test_routes.py:6,12-16,19-26`); `frontend/src/lib/financial-utils.test.ts`
prueba `computeKPIs`/`computeMonthlyData`/`formatCurrency`/`formatPercent` sin
montar ningún componente React.

**Guía específica del proyecto:**
- Backend: cualquier lógica nueva debe quedar como función importable desde
  `app.routes` (o el módulo que corresponda) y tener al menos un test que la
  llame directamente, además de (si aplica) un test de integración vía
  `client.get(...)` como los que ya existen en `test_routes.py`.
- Frontend: cualquier cálculo nuevo va a `financial-utils.ts` con su test en
  `financial-utils.test.ts`; evitar escribir el primer test como un test de
  componente si la lógica puede aislarse como función pura.
