# No Dead Code

## Purpose
Keep the repository lean and avoid confusing future contributors (human or AI agent) with files that look active but are not actually used anywhere.

## Scope
Applies to all files in `frontend/src/` and `backend/app/`.

## Rule
- Before merging, check whether a new or existing file is actually imported/used anywhere else in the codebase.
- If a file's only "user" is itself (e.g. only referenced in its own test), it is not dead — but if `grep -rn "<filename-without-extension>" <src-dir> --include="*.ts*"` returns zero matches outside the file itself, it MUST be deleted or explicitly justified in a code comment at the top of the file explaining why it's kept (e.g. "kept for local dev fallback, see issue #X").

## Bad example found in the repo (must be fixed)
`frontend/src/lib/mock-data.ts` (58 hardcoded records, all dated 2024) is not imported by any other file — confirmed with:
```bash
grep -rn "mock-data" frontend/src/ --include="*.ts*"
```
which returned zero matches. It is a leftover from before the frontend was connected to the real backend (`/api/metrics`).

## Suggested fix
Delete `frontend/src/lib/mock-data.ts`, or if it's needed as a Storybook/demo fallback, import it explicitly somewhere and add a comment explaining why.

## Validation task
Applied the `grep` check described above against the current repo state — confirmed `mock-data.ts` is unused. This rule was written directly from this finding (Phase 2 risk #3).