# Documentation rules

## R9 — Directories referenced by `AGENTS.md` must exist or be explicitly marked pending

**Fact:** `AGENTS.md` references `./.agents/rules`, `./.agents/skills`, and
`./memory-bank`; as of this writing only `.agents/rules` (this directory) exists —
`.agents/skills` and `memory-bank/` are still pending, per the fork's own README
"Recommended steps" (fork → inspect → document rules/memory bank).

## R10 — Document any divergence between the local dev command and the Dockerfile `CMD`

**Fact:** `frontend/Dockerfile`'s `CMD` no longer runs `npm run dev`; it runs
`node node_modules/vite/bin/vite.js --host 0.0.0.0 --port 5173` (changed to work
around an `npm`-generated bin-shim bug that made the frontend container exit with
code 127 — `node.exe: not found` — inside `node:24-alpine`). Meanwhile
`frontend/package.json:8` still defines `"dev": "vite"`, which is what a contributor
running locally outside Docker would use. Without this note, someone could
"simplify" the `CMD` back to `npm run dev` and silently reintroduce the crash.
