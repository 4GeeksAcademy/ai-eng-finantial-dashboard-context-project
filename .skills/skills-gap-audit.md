# Skills Gap Audit

Date: 2026-09-07

## Scope

This audit compares the currently installed project skills against common delivery workflow needs for this repository: commits, deployments, testing/QA, CI/CD, and release quality gates.

## Installed Skills (Current)

Source of truth: [skills-lock.json](../skills-lock.json)

- accessibility
- frontend-design
- seo
- vercel-react-best-practices
- webapp-testing

## Repository Signals Used

- Project startup and local run: [README.md](../README.md)
- Current services only (frontend/backend): [docker-compose.yml](../docker-compose.yml)
- Frontend container runs Vite dev server: [frontend/Dockerfile](../frontend/Dockerfile)
- Backend container runs uvicorn with reload/debugpy: [backend/Dockerfile](../backend/Dockerfile)
- Frontend tests available (Vitest): [frontend/package.json](../frontend/package.json), [frontend/src/lib/financial-utils.test.ts](../frontend/src/lib/financial-utils.test.ts)
- Backend tests available (pytest): [backend/requirements.txt](../backend/requirements.txt), [backend/tests/test_routes.py](../backend/tests/test_routes.py)

## Gaps (Errors / Missing Coverage)

### 1) Commit quality workflow is not covered enough

Gap:
- No installed skill currently targets commit conventions, commit message hygiene, or pre-commit policy.

Repository evidence:
- No commit policy files were found (for example commitlint, pre-commit config, CONTRIBUTING) in this repository scan.

Impact:
- Inconsistent commit messages and lower traceability in PR/release history.

Improvement:
- Add a commit-focused skill and standardize commit format in team workflow.

Recommended installs:
- `npx skills add github/awesome-copilot@conventional-commit`
- `npx skills add mattpocock/skills@setup-pre-commit`

### 2) Deployment guidance is under-covered

Gap:
- Installed skills do not include a deployment strategy skill.

Repository evidence:
- Compose and Dockerfiles are development-oriented and do not define a production deployment pipeline: [docker-compose.yml](../docker-compose.yml), [frontend/Dockerfile](../frontend/Dockerfile), [backend/Dockerfile](../backend/Dockerfile)

Impact:
- Risk of ad-hoc production rollout steps and missing rollback/checklist practices.

Improvement:
- Add a deployment pipeline skill and document environment-specific deployment playbooks.

Recommended installs:
- `npx skills add wshobson/agents@deployment-pipeline-design`
- `npx skills add addyosmani/agent-skills@ci-cd-and-automation`

### 3) Testing skill coverage is partial (QA breadth)

Gap:
- Current testing skill is browser/webapp oriented, but repository also depends on unit and API tests.

Repository evidence:
- Frontend unit tests exist: [frontend/src/lib/financial-utils.test.ts](../frontend/src/lib/financial-utils.test.ts)
- Backend API tests exist: [backend/tests/test_routes.py](../backend/tests/test_routes.py)
- Installed testing skill is webapp-testing only: [skills-lock.json](../skills-lock.json)

Impact:
- QA guidance may skew toward UI checks and miss stronger test strategy coverage (unit/integration/regression matrix).

Improvement:
- Add broad QA strategy skill and (optionally) language-specific testing pattern skills.

Recommended installs:
- `npx skills add mattpocock/skills@qa`
- `npx skills add wshobson/agents@javascript-testing-patterns`
- `npx skills add wshobson/agents@python-testing-patterns`

### 4) Release management skill is missing

Gap:
- No installed skill for release notes/changelog discipline and release readiness checks.

Repository evidence:
- No release automation or changelog workflow files were found in this repository scan.

Impact:
- Difficult release traceability and inconsistent handoff quality.

Improvement:
- Add commit/release-oriented skills and define release checklist in repository docs.

Recommended installs:
- `npx skills add github/awesome-copilot@git-commit`
- `npx skills add github/awesome-copilot@conventional-commit`

## Priority Order

1. Commit conventions + pre-commit setup
2. CI/CD + deployment pipeline design
3. QA strategy expansion beyond browser-only checks
4. Release notes/checklist discipline

## Practical Next Step

Install a minimal high-impact set first:

1. `npx skills add github/awesome-copilot@conventional-commit`
2. `npx skills add addyosmani/agent-skills@ci-cd-and-automation`
3. `npx skills add wshobson/agents@deployment-pipeline-design`
4. `npx skills add mattpocock/skills@qa`
