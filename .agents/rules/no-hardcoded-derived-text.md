# No Hardcoded Derived Text

## Purpose
Prevent the UI from silently drifting out of sync with the actual data it displays.

## Scope
Applies to `frontend/src/App.tsx` and any component that renders a label, date, period, or range that could instead be computed from fetched data.

## Rule
- Any text that describes the shape of the data (a date range, a period label, a "last updated" timestamp, a count) MUST be derived from the actual API response, never written as a literal string in JSX.
- If a placeholder is genuinely needed before data loads, it must come from a loading/skeleton state — not a static string that looks like real data.

## Bad example found in the repo (must be fixed)
`frontend/src/App.tsx`:
```tsx
<DashboardHeader period="2024 - Full Year" />
```
This is hardcoded. The backend (`backend/app/routes.py`, `_year_for_month`) generates mock data based on the *current* year (`date.today()`), not 2024. This label is a leftover from when the frontend used the static `frontend/src/lib/mock-data.ts` (all dated 2024) instead of the live backend — see `no-dead-code.md`.

## Suggested fix
Derive the period from `monthlyData` (already computed via `computeMonthlyData`) once it loads, e.g. deriving the min/max year present in the fetched movements, instead of a fixed string.

## Validation task
Applied by cross-referencing `App.tsx`'s hardcoded label against `routes.py`'s dynamic year logic — confirmed the mismatch. This rule connects two Phase 2 findings (risk #3 dead code + risk #4 stale label) into one coherent fix.