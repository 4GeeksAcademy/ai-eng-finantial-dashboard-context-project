# Strict Typing for API Contracts

## Purpose
Prevent invalid values from entering the system silently, and make API contracts explicit and self-documenting.

## Scope
Applies to every FastAPI endpoint and every Pydantic model in `backend/app/`.

## Rule
- Every endpoint MUST declare an explicit `response_model` in its `@router.get(...)` / `@router.post(...)` decorator.
- Fields that only accept a fixed set of values MUST use `Literal[...]`, never a generic `str`.
- New enums of values (categories, statuses, types) get their own `Literal` type alias at the top of the file, not inlined per-field.

## Good example (already in the repo)
`backend/app/routes.py` defines `OperationType = Literal["income", "outcome"]`, `Category = Literal["suppliers", "sales", "operational", "administrative", "others"]`, and `BusinessType = Literal["B2B", "B2C"]` as reusable type aliases. Every endpoint declares `response_model` (e.g. `@router.get("/api/metrics/summary", response_model=list[MetricsSummaryItem])`).

## Bad example to avoid
Do not write `category: str` and validate it manually inside the function body — this pushes validation to runtime and loses IDE/type-checker support.

## Why this matters
With `Literal` + `response_model`, FastAPI auto-generates accurate OpenAPI docs (`/docs`) and rejects invalid values at the request-parsing layer, before any business logic runs.

## Validation task
Applied when reviewing `get_metrics_alerts`: confirmed `threshold: float = Query(default=0.3, ge=0)` also follows the spirit of the rule by constraining valid input ranges, not just literal value sets — rule extended in practice to numeric constraints via `Query(ge=..., le=...)`.