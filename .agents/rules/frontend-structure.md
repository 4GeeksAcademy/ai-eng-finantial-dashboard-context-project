# Rule: Preserve the existing frontend layer separation

## Rule
Keep the frontend organized into the same three layers already present in the repository:

- dashboard/presentation components under [frontend/src/components/dashboard](frontend/src/components/dashboard)
- shared UI primitives under [frontend/src/components/ui](frontend/src/components/ui)
- financial/domain logic and shared types under [frontend/src/lib](frontend/src/lib)

Do not move rendering logic into the utility layer, and do not place UI-only concerns into the data/transformation layer.

## Repository evidence
- The App bootstraps the dashboard in [frontend/src/App.tsx](frontend/src/App.tsx).
- Dashboard-specific components live under [frontend/src/components/dashboard](frontend/src/components/dashboard):
  - [frontend/src/components/dashboard/dashboard-header.tsx](frontend/src/components/dashboard/dashboard-header.tsx)
  - [frontend/src/components/dashboard/kpi-row.tsx](frontend/src/components/dashboard/kpi-row.tsx)
  - [frontend/src/components/dashboard/income-outcome-chart.tsx](frontend/src/components/dashboard/income-outcome-chart.tsx)
  - [frontend/src/components/dashboard/profit-percent-chart.tsx](frontend/src/components/dashboard/profit-percent-chart.tsx)
- Shared UI wrappers live under [frontend/src/components/ui](frontend/src/components/ui):
  - [frontend/src/components/ui/card.tsx](frontend/src/components/ui/card.tsx)
  - [frontend/src/components/ui/skeleton.tsx](frontend/src/components/ui/skeleton.tsx)
- Domain and transformation logic lives under [frontend/src/lib](frontend/src/lib):
  - [frontend/src/lib/financial-types.ts](frontend/src/lib/financial-types.ts)
  - [frontend/src/lib/financial-utils.ts](frontend/src/lib/financial-utils.ts)
  - [frontend/src/lib/mock-data.ts](frontend/src/lib/mock-data.ts)

## Risk prevented
This prevents the dashboard from drifting into a single mixed layer where components compute business logic, UI shells hold data logic, and utility modules become hard to maintain. It also keeps component APIs and financial transformations aligned with the existing architecture.
