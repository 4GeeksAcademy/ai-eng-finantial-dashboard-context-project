# Rule: Testing Contracts and Regression Coverage

## Scope
- Applies to: backend/tests/*.py, frontend/src/**/*.test.ts, frontend/package.json, backend/requirements.txt
- Task types: endpoint changes, utility changes, feature additions, bug fixes

## Trigger to apply
- Any task that modifies business logic, endpoint contracts, or frontend data transformations.

## Why
The repo has a good baseline of route and utility tests. Expanding to contract and integration checks will prevent integration regressions.

## Required standard
1. Every behavior change must include or update tests.
2. Backend endpoint changes require route-level tests for happy path and relevant edge case.
3. Frontend data-transformation changes require deterministic unit tests.
4. Breaking API contract changes require coordinated backend and frontend test updates.

## Implementation guidance
- Keep deterministic fixtures or seeded generation for stable assertions.
- Add explicit tests for filters, grouping options, and comparison logic boundaries.
- Add integration checks for fetch + parse + render when introducing new API usage in frontend.

## Acceptance checks
- Tests fail before fix and pass after fix for bug-driven work.
- New endpoint parameters are covered by tests.
- Frontend and backend contract changes are validated in the same PR.
- If tests are not added, PR must include explicit rationale and risk note.

## Repo fit validation
- Existing backend tests already cover key endpoints and filters.
- Existing frontend vitest setup supports utility and contract-oriented tests.
- This rule is practical with current toolchain and scripts.
