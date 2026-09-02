# Security rules

## R14 — Don't combine `allow_origins=["*"]` with `allow_credentials=True`

**Fact:** exactly this combination is set in `backend/app/main.py:7-12`. Browsers
reject `Access-Control-Allow-Origin: *` once credentials are involved, and this
pairing is an anti-pattern that must not be copied as-is into a project with real
authentication.
