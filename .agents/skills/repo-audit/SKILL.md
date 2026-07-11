# Repo Audit Skill

## Purpose
Perform a fast, practical repository audit for this financial dashboard project and return actionable findings.

## Inputs
- Task goal (bug fix, feature, refactor, or review)
- Optional focus area (`backend`, `frontend`, `tests`, or `all`)

## Procedure
1. Map relevant files.
- Backend: `backend/app`, `backend/tests`
- Frontend: `frontend/src`, especially `frontend/src/lib` and `frontend/src/components/dashboard`
2. Validate behavior contracts.
- API payload fields and filters
- KPI and monthly aggregation calculations
- Formatting helpers and chart-ready data
3. Run targeted checks where possible.
- `cd backend && pytest -q`
- `cd frontend && npm test`
- `cd frontend && npm run lint`
4. Report findings in this order:
- High-risk issues first
- Missing tests
- Assumptions/open questions
- Short patch plan

## Output format
- Summary: one paragraph
- Findings: numbered list with file paths
- Suggested changes: concise step list
- Validation: commands run and outcomes

## Guardrails
1. Prioritize compatibility over style-only changes.
2. Never report a behavior break without pointing to the concrete source file.
3. If tests cannot be run, state that explicitly.
