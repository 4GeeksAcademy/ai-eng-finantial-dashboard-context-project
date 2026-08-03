---
name: financial-dashboard-conventions
description: Project-specific data and formatting conventions for this Financial Metrics Dashboard. Use when writing or reviewing code that displays currency/percentage values, types a category/business_type/operation_type field, or builds query params for the /api/metrics* endpoints. Not a general React or accessibility skill — this only covers this dashboard's own data model.
license: MIT
metadata:
  author: freily-rodriguez
  version: "1.0.0"
---

# Financial Dashboard Conventions

This skill documents conventions specific to this project's data model and API, verified
against the running backend's `/docs` and the existing frontend code. It exists to prevent
common mistakes an agent (or a new contributor) would otherwise make by guessing.

## Objective

Ensure any new or modified code that touches financial values, the dashboard's fixed
enums, or the metrics API's query parameters follows the same conventions already used
elsewhere in the codebase — instead of introducing a second, inconsistent way of doing
the same thing.

## When to apply

- Displaying a currency amount or a percentage anywhere in the UI
- Adding a prop, state field, or API param typed as `category`, `business_type`, or
  `operation_type`
- Building a query string for any `/api/metrics*` endpoint that accepts an optional date
  range or other optional filter
- Computing a percentage/ratio that the API itself does not return

## Rule 1 — Currency and percentage formatting

**Input:** a raw `number` representing money (USD) or a percentage.
**Output:** a formatted `string` for display.

Always use the existing helpers in `frontend/src/lib/financial-utils.ts` —
`formatCurrency(value)` and `formatPercent(value)` — instead of calling
`toLocaleString()` / `toFixed()` directly in a component.

```ts
// ❌ Wrong — ad-hoc formatting, inconsistent with the rest of the app
<span>${amount.toFixed(2)}</span>

// ✅ Correct — reuses the project's single source of truth for formatting
import { formatCurrency } from "@/lib/financial-utils";
<span>{formatCurrency(amount)}</span>
```

If a new formatting need doesn't fit the existing helpers (e.g. a percentage with more
decimal places), extend `financial-utils.ts` with a new named export — do not create a
second local formatter inside a component.

**Exception — compact chart axis labels:** short, space-constrained axis ticks (e.g.
`` `${v.toFixed(0)}%` `` or `` `$${(v/1000).toFixed(0)}k` ``) are a different use case
from a full value display (tooltip, table cell, KPI card) and are not required to use
`formatCurrency`/`formatPercent`, which are not designed to abbreviate. Full-value
displays (tooltips, tables, cards) must use the helpers.

**Acceptance criteria:** no tooltip, table cell, or KPI display contains an inline
`toFixed`, `toLocaleString`, or manual `${...}%` string built for a value the app already
has a helper for. Compact axis-tick formatting is exempt.

## Rule 2 — Typed enums, not raw strings

**Input:** any field representing `category`, `business_type`, or `operation_type`.
**Output:** a TypeScript union literal type, matching the backend's real enum values —
verified against `/docs`, not assumed:

```ts
type Category = "suppliers" | "sales" | "operational" | "administrative" | "others";
type BusinessType = "B2B" | "B2C";
type OperationType = "income" | "outcome";
```

```ts
// ❌ Wrong — accepts any string, no compile-time protection against typos
function filterByCategory(category: string) { ... }

// ✅ Correct — invalid values are caught at compile time
function filterByCategory(category: Category) { ... }
```

**Acceptance criteria:** no new prop, state, or function parameter representing one of
these three fields is typed as plain `string`.

## Rule 3 — Optional date range query params

**Input:** a `{ start_date?, end_date? }`-shaped filter state (this shape is called
`DateRangeFilter` in `frontend/specs/param-types.ts` on the `feature/frontend-specs`
branch — that file is not present on `main` or on this branch; the shape is documented
here for any branch that doesn't have it).
**Output:** a query object/string sent to the API.

Only include `start_date` / `end_date` in the outgoing request when the user has actually
set them. Never send an empty string — omit the key entirely.

```ts
// ❌ Wrong — sends start_date= (empty), which the API may treat differently than "unset"
const params = { start_date: filter.start_date ?? "", end_date: filter.end_date ?? "" };

// ✅ Correct — only present keys the user actually filled in
const params: Record<string, string> = {};
if (filter.start_date) params.start_date = filter.start_date;
if (filter.end_date) params.end_date = filter.end_date;
```

**Acceptance criteria:** no outgoing request to `/api/metrics*` includes `start_date` or
`end_date` as an empty string.

## Rule 4 — Computing percentages the API doesn't return

**Input:** an array of items with a `total_amount` (e.g. `CategoryEntry[]` from
`/api/metrics/categories/top`), where the caller wants each item's share of the group.
**Output:** a percentage per item, computed on the frontend.

```ts
// ✅ Correct — guards the zero-total case explicitly
function withPercentages(entries: { total_amount: number }[]) {
  const total = entries.reduce((sum, e) => sum + e.total_amount, 0);
  return entries.map((e) => ({
    ...e,
    percent: total > 0 ? (e.total_amount / total) * 100 : 0,
  }));
}
```

**Acceptance criteria:** any percentage-of-group calculation guards against a zero total
(no `NaN` or `Infinity` rendered in the UI when a group has no data).