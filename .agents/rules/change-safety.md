# Change Safety Rules

## Objective
Reduce regressions when evolving metrics APIs and dashboard behavior.

## Rules
1. Do not rename existing API fields returned by backend endpoints without updating frontend consumers and tests in the same change.
2. Do not introduce implicit timezone conversions when grouping by month/week/day.
3. Keep sorting behavior deterministic for timeline visualizations.
4. Avoid broad refactors in utility files when the task only requires a narrow fix.
5. Add or update tests when touching:
- Endpoint filtering behavior
- KPI calculations
- Monthly aggregation logic
- Currency/percent formatting outputs

## Review checklist
1. Does this change alter `operation_type`, `category`, or `business_type` semantics?
2. Do backend and frontend still agree on `FinancialMovement` shape?
3. Are date filters inclusive at both ends when expected?
4. Are test fixtures still readable and representative?
