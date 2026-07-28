# Rule: Frontend Language, Locale, and API Contract Consistency

## Scope
- Applies to: frontend/src/App.tsx, frontend/src/lib/*.ts, frontend/src/components/**/*.tsx
- Task types: UI copy updates, formatting logic, data fetching, dashboard feature work

## Trigger to apply
- Any task that changes UI labels, visible messages, formatters, or API response typing.

## Why
The frontend mixes Spanish and English strings and hardcodes locale behavior. Consistency improves user trust and reduces product debt.

## Required standard
1. Define one default product language for UI copy and use it consistently.
2. Locale-sensitive formatting must be centralized and configurable.
3. API payload types must remain aligned with backend contracts.
4. User-visible error messages must be clear, actionable, and localized.

## Implementation guidance
- Centralize copy strings and avoid inline mixed-language text.
- Keep format utilities (currency, percent, month labels) in one module.
- Update frontend types when backend response models change.

## Acceptance checks
- New UI screens do not introduce mixed-language labels.
- Locale can be changed from one config point.
- API fetch flow handles loading, error, and typed success path.
- A reviewer can identify where copy is centralized and where locale is configured.

## Repo fit validation
- App.tsx currently fetches metrics and handles loading/error.
- financial-utils.ts centralizes formatting and KPI computations.
- This rule directly guides current dashboard evolution work.
