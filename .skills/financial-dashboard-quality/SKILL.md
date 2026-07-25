---
name: financial-dashboard-quality
description: Validates this FastAPI and React financial dashboard before handoff. Use when changing financial calculations, API contracts, loading or error states, dashboard charts, accessibility behavior, or production build configuration.
---

# Financial Dashboard Quality

## Objective

Keep financial results deterministic and correct while preserving accessible
dashboard behavior, typed API contracts, and a warning-free production build.

## Inputs

- The changed frontend or backend files and their git diff.
- Relevant API schemas in `backend/app/`.
- Financial types and calculations in `frontend/src/lib/`.
- Dashboard loading, error, KPI, and chart components.
- Current rules in `.agents/rules/` and memory in `memory-bank/`.

## Workflow

1. Classify the change as API contract, financial calculation, UI behavior,
   accessibility, or build performance.
2. Verify API changes use explicit FastAPI request/response schemas and
   constrained query inputs.
3. Keep financial calculations in pure reusable functions; ensure synthetic
   and test data remains deterministic.
4. For UI changes, check loading, error, empty, and populated states.
5. Apply the installed `accessibility` skill to landmarks, keyboard behavior,
   live regions, chart alternatives, motion, and contrast.
6. Apply `vercel-react-best-practices` to data flow, rendering, and bundle
   impact. Lazy-load heavy chart code.
7. Add or update tests proportional to the behavior changed.
8. Run the verification commands below and report exact results.
9. Update `memory-bank/current-project-status.md` when project capability or
   risk changes.

## Verification

From `frontend/`:

```powershell
npm run lint
npm test -- --run
npm run build
```

From `backend/`:

```powershell
python -m pytest
```

If Node reports `UNABLE_TO_VERIFY_LEAF_SIGNATURE` on Windows, use the trusted
system certificate store:

```powershell
$env:NODE_OPTIONS='--use-system-ca'
```

## Outputs

- Source and test changes tied to the identified quality category.
- A concise verification summary listing lint, test, and build outcomes.
- A memory-bank update when architecture, status, or known risks changed.
- Explicit remaining risks; do not claim WCAG or production readiness without
  corresponding automated and manual evidence.

## Acceptance Criteria

- Financial calculations remain deterministic and covered by tests.
- Modified API contracts are explicit and validated.
- Loading, error, empty, and populated UI states remain understandable.
- Decorative icons are hidden from assistive technology; dynamic errors and
  loading states are announced; chart data has a text alternative.
- Keyboard focus is visible and reduced-motion preferences are respected.
- `npm run lint`, frontend tests, and `npm run build` pass with no new warnings.
- Backend tests pass when backend behavior changes.
- No production credential, permissive production CORS setting, or generated
  build artifact is introduced.
