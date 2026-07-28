# Rule: Backend Domain Logic and Endpoint Design

## Scope
- Applies to: backend/app/routes.py, backend/tests/test_routes.py
- Task types: adding endpoints, changing filters, adding analytics, refactoring backend logic

## Trigger to apply
- Any task that adds/modifies endpoint parameters, response models, or analytics calculations.

## Why
The backend already separates domain helpers from route handlers. Preserving this pattern reduces regressions and makes tests easier.

## Required standard
1. Business logic must be implemented in pure helper functions when possible.
2. Route handlers should orchestrate request/response, not contain heavy logic.
3. Avoid endpoint duplication; prefer shared filters (example: business_type) over copy-pasted routes.
4. Every endpoint must declare a response_model.

## Implementation guidance
- Keep transformations in dedicated functions (filtering, summarization, comparisons, alert detection).
- Reuse shared filter functions for date, category, operation type, and segment.
- If deprecating duplicated routes, preserve backward compatibility and document migration path.

## Acceptance checks
- New logic can be unit-tested without HTTP client.
- Endpoint code stays thin and references reusable helpers.
- No new near-duplicate endpoint pairs without documented reason.
- If a new endpoint overlaps with existing filters, reviewer can point to why extension of existing route was not viable.

## Repo fit validation
- Current routes.py already contains reusable helpers and multiple analytics endpoints.
- Current tests validate endpoint contracts and filtering behavior.
- This rule aligns with existing strengths and targets current duplication risk.
