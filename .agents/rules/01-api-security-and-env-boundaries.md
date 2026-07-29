# Rule: API Security and Environment Boundaries

## Scope
- Applies to: backend/app/main.py, backend/app/routes.py, docker-compose.yml, README.md, README.es.md
- Task types: API configuration, deployment configuration, environment variables, backend changes

## Trigger to apply
- Any task that edits CORS, middleware, env vars, Docker startup, or backend exposure over HTTP.

## Why
The current API uses permissive CORS settings suitable for demos but risky for production. This rule prevents unsafe defaults from leaking into non-demo environments.

## Required standard
1. CORS origin policy must be environment-specific.
2. Wildcard origins are allowed only in explicit demo/dev mode.
3. Credentials must not be enabled with wildcard origins.
4. README files must explain the environment variables used for CORS behavior.

## Implementation guidance
- Introduce env-driven settings (example: APP_ENV, ALLOWED_ORIGINS, ALLOW_CREDENTIALS).
- Keep local DX simple while hardening staging/production defaults.
- If adding new middleware, document rationale and expected behavior.

## Acceptance checks
- Backend startup config reads environment for CORS behavior.
- No unconditional allow_origins=["*"] in production path.
- README and README.es explain how to configure CORS safely.
- PR diff includes either hardened config changes or explicit "demo-only" justification.

## Repo fit validation
- This repo has CORS middleware in backend/app/main.py.
- This repo has local-first execution via docker-compose and README docs.
- This rule is actionable for current code and future deployment hardening.
