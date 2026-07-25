---
name: .skills/financial-dashboard-metric-guardrails
description: Enforce deterministic financial metric handling, formatting, and KPI consistency for dashboard changes.
---

# .skills/financial-dashboard-metric-guardrails

Use this skill to keep financial calculations and dashboard outputs consistent, deterministic, and reviewable.

## Objective

Ensure any change touching KPIs, monthly aggregates, or dashboard metric display follows a consistent set of data and formatting guardrails.

## Inputs

- Files under frontend/src/lib and frontend/src/components/dashboard that are changed.
- Existing metric contracts from frontend/src/lib/financial-types.ts.
- Data-fetch path in frontend/src/App.tsx.
- Existing tests in frontend/src/lib/financial-utils.test.ts.

## Expected Output

- Metrics logic stays in pure utility functions, not JSX rendering.
- Currency and percentage values use shared formatters from financial utilities.
- Empty/error/loading states remain explicit and user-readable.
- Any behavior change in metric math or aggregation includes matching test updates.

## Acceptance Criteria

- No duplicated KPI math appears in components.
- Components receive precomputed values or typed records and render them only.
- Formatting for monetary and percent values is centralized and reused.
- Deterministic behavior is preserved for mock/synthetic datasets used by tests.
- Build and lint pass for frontend after modifications.

## When to use

- Any task edits KPI formulas, monthly aggregation logic, or chart data transforms.
- Any task adds new financial cards, chart series, or metric summary labels.
- Any task changes number formatting rules for income, outcome, profit, or profit percentage.

## Instructions

1. Identify whether the change affects data generation, aggregation, formatting, or presentation.
2. Keep aggregation/math in frontend/src/lib/financial-utils.ts or a sibling utility, not in component bodies.
3. Reuse shared formatCurrency and formatPercent helpers for user-facing numeric output.
4. Keep dashboard components typed and presentational; avoid introducing any and untyped payload plumbing.
5. If logic changes, add or update tests in frontend/src/lib/financial-utils.test.ts to lock expected outputs.
6. Verify loading and error states remain clear and accessible in the dashboard UI.
7. Run frontend lint and build checks before finalizing.
