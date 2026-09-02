# Dead code / data-source rules

## R13 — Don't edit `frontend/src/lib/mock-data.ts` expecting it to affect the dashboard

Confirm actual usage before touching it.

**Fact:** a repo-wide search for `mock-data` under `frontend/src` returns zero
imports — the file is not wired into `App.tsx` or any component; the app's real
data source is the backend's `generate_mock_movements()` via `/api/metrics`.
