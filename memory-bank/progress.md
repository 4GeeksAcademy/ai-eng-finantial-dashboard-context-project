# Progreso (log cronológico)

Basado en `verification.md` y el historial de commits de
`chore/reglas-agente-y-fix-docker`.

1. Se mapeó la estructura completa del proyecto (backend FastAPI de un solo
   router, frontend React/Vite, docker-compose) y sus entry points.
2. Se detectó y resolvió: `frontend/node_modules` no existía → `npm install`
   ejecutado (263 paquetes) → error de TypeScript/ESLint en `App.tsx`
   resuelto.
3. Se instaló Docker Desktop / se detectó que estaba operativo; se corrigió
   un `PATH` desactualizado en la sesión de shell para poder invocarlo.
4. Se lanzó `docker compose up --build`: backend arrancó bien, **frontend
   fallaba** (`node.exe: not found`, exit code 127).
5. Diagnóstico del bug del shim de `npm` (reproducido con npm 11.19.0 y
   10.9.9, con y sin bind-mount) → fix aplicado en `frontend/Dockerfile`
   (`CMD` invoca `node node_modules/vite/bin/vite.js` directamente).
6. Confirmado con `docker compose up --build -d --force-recreate -V`:
   backend y frontend `Up`, ambos respondiendo (200 OK).
7. Verificado manualmente: puertos correctos (5173/8000), el frontend
   muestra mensaje de error si el backend cae, `/api/metrics` es
   determinista (mismos 360 movimientos en llamadas repetidas).
8. Commit `3f4845a`: fix del Dockerfile + primera versión de `.agents/rules/`
   (agrupada por categoría) + `verification.md`.
9. Redacción de reglas mejorada: 14 archivos individuales en
   `.agents/rules/`, uno por regla, con estructura fija (alcance,
   justificación anclada a un hecho del repo, guía específica) + índice
   `README.md`. Comentario añadido en `frontend/Dockerfile` explicando la
   divergencia con `npm run dev`. Commit `73f8759`.
10. Validación de las 14 reglas contra el repo, una a una, con un agente en
    worktree aislado: 12 PASS, 2 con problema (`revisar-npm-audit-antes-de-escalar.md`
    y `no-editar-mock-data-sin-confirmar-uso.md`). Resultado documentado en
    `verification.md`. Commit `5922bf8`.
11. Creación de `memory-bank/` (esta carpeta) para que futuros agentes no
    tengan que redescubrir nada de lo anterior.

**Rama actual**: `chore/reglas-agente-y-fix-docker`, pusheada a `origin`, sin
PR abierto todavía (decisión explícita de posponerlo).
