# Coding Standards

These rules are derived from observed engineering strengths and weaknesses in this repository. They are intended to preserve good patterns and correct risky ones.

## Rules That Preserve Good Practices

### Rule G1: Keep API contracts strongly typed
- Every new or modified backend endpoint must define explicit request/response schemas and validate query parameters.
- FastAPI response_model and constrained Query inputs should be used to keep contracts stable and discoverable.

Rationale:
- The current backend benefits from typed endpoint contracts and predictable payload shapes.

### Rule G2: Keep business calculations in pure reusable functions
- Financial calculations and transformations should remain in pure functions outside UI rendering code.
- UI components should consume computed results rather than embed heavy calculation logic.

Rationale:
- The current frontend utility pattern improves testability and readability.

### Rule G3: Preserve deterministic test data behavior
- Any mock/synthetic dataset used in development or tests must be reproducible (seeded or fixture-based).
- Deterministic data paths should be default in tests.

Rationale:
- Reproducibility currently makes backend behavior and tests stable.

## Rules That Correct Bad Practices

### Rule B1: Do not use permissive CORS in production-targeted configurations
- Wildcard origins with credentialed requests are prohibited outside local-only development.
- CORS origin lists must be environment-driven and explicit.

Rationale:
- Current CORS setup is permissive and unsafe for production scenarios.

### Rule B2: Avoid backend monolith modules
- Routing, schemas, data access/generation, and analytics logic must be separated into dedicated modules as the codebase grows.
- New features should follow modular boundaries rather than extending a single routes file indefinitely.

Rationale:
- Current concentration of concerns in one module increases coupling and maintenance cost.

### Rule B3: Require UI behavior tests for critical user states
- Frontend changes that affect data loading, error handling, or rendering logic must include component or integration tests.
- Utility-only tests are insufficient when UI behavior can regress.

Rationale:
- Current frontend tests miss component-level confidence for key states.

## Scope
- These rules apply to backend and frontend contributions in this repository.
- They complement existing lint/type/test tooling and are intended for pull request reviews and agent-guided contributions.
