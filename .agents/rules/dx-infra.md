# Developer experience / infra rules

## R11 — Rebuild with `--force-recreate -V` after changing frontend dependencies

Plain `docker compose up --build` is not enough after touching `frontend/package.json`
or the `Dockerfile`'s install/CMD steps.

**Fact:** reproduced in this session — `docker compose up --build` kept serving a
stale `node_modules` state through the anonymous volume declared in
`docker-compose.yml:8-10` (`./frontend:/app` + `/app/node_modules`); only
`docker compose up --build --force-recreate -V` picked up the corrected `CMD`.

## R12 — Check `npm audit` before taking this beyond an educational project

**Fact:** `npm install` in `frontend/` reports 8 vulnerabilities (1 low, 1 moderate,
6 high) that have not been addressed (`npm audit fix` not run).
