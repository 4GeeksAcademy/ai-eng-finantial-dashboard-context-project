# Rule: UI and Data Consistency

## Scope

Aplica a textos visibles, periodos mostrados, etiquetas de KPIs, graficos y estados del dashboard en [frontend/src](frontend/src).

## Why

El dashboard ya tiene una base reusable buena, pero existen riesgos de inconsistencias entre lo que la UI declara y lo que los datos realmente representan, por ejemplo periodos hardcodeados o mezcla de idiomas.

## Rules

- No introducir periodos o labels hardcodeados si pueden contradecir el dataset renderizado.
- Los textos visibles del dashboard deben mantenerse en un idioma consistente por pantalla o flujo.
- Si un componente presenta metricas derivadas, su texto de apoyo debe seguir alineado con el calculo real implementado.

## Repo anchors

- Header con periodo visible: [frontend/src/components/dashboard/dashboard-header.tsx](frontend/src/components/dashboard/dashboard-header.tsx).
- KPIs y helper texts: [frontend/src/components/dashboard/kpi-row.tsx](frontend/src/components/dashboard/kpi-row.tsx).
- Graficos y mensajes vacios: [frontend/src/components/dashboard/income-outcome-chart.tsx](frontend/src/components/dashboard/income-outcome-chart.tsx) y [frontend/src/components/dashboard/profit-percent-chart.tsx](frontend/src/components/dashboard/profit-percent-chart.tsx).