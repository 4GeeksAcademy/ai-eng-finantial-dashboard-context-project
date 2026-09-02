# Testing rules

## R7 — Expose new logic as a pure, directly-importable function for tests

New business logic (backend or frontend) should be testable without going through
HTTP or component rendering.

**Fact:** `backend/tests/test_routes.py` imports and tests `generate_mock_movements`
and `filter_movements_by_date` directly (not only through `client.get(...)`); the
same pattern applies in `frontend/src/lib/financial-utils.test.ts`, which tests
`computeKPIs`/`computeMonthlyData` without mounting any component.

## R8 — Rely on the `seed=42` determinism for exact assertions in backend tests

Don't settle for "list is not empty" checks when an exact value is guaranteed by the
fixed seed.

**Fact:** `test_generate_mock_movements_returns_full_year_sorted_data` in
`backend/tests/test_routes.py:12-16` asserts `len(movements) == 360` exactly,
relying on the fixed seed.
