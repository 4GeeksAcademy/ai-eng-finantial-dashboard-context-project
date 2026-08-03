# CORS Security

## Purpose
Prevent an insecure CORS configuration that could allow credentialed requests from arbitrary origins.

## Scope
Applies to `backend/app/main.py` and any future middleware configuration involving `CORSMiddleware` or similar cross-origin settings.

## Rule
- NEVER combine `allow_origins=["*"]` with `allow_credentials=True`. This combination is invalid per the CORS spec and is rejected by modern browsers — but even where it "works," it is a security anti-pattern.
- In development, list explicit origins (e.g. `["http://localhost:5173", "http://<vps-ip>:5173"]`) instead of a wildcard.
- In production, `allow_origins` must be an explicit, minimal list of trusted frontend domains — never `*`.

## Bad example found in the repo (must be fixed)
`backend/app/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
This is the exact anti-pattern this rule exists to prevent.

## Suggested fix
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)
```

## Validation task
Applied by reviewing `backend/app/main.py` directly — confirmed the anti-pattern is present in the current codebase. This rule was written specifically because of this finding (Phase 2 risk #1), not derived generically.