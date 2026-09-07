# Pendientes / riesgos conocidos

Lo que queda abierto a día de hoy (rama `feature/agent-skills`).
No asumir que ya está resuelto solo porque está documentado.

## Estructura de agentes — completa

`AGENTS.md` referencia `./.agents/rules`, `./.agents/skills` y
`./memory-bank`. A día de hoy:
- `.agents/rules/` ✅ existe (14 reglas + índice).
- `.agents/skills/` ✅ existe desde la sesión de `feature/agent-skills`:
  `commit-profesional-es/SKILL.md` (mensajes de commit en español con
  prefijo Conventional Commits correcto). Ver `progress.md` #15.
- `memory-bank/` ✅ ya existe (esta carpeta).

`.agents/rules/mantener-agents-md-alineado-con-carpetas-reales.md` ya se
actualizó para reflejar esto (tenía su propia cláusula de "si se crea
`.agents/skills/`, actualizar esta regla"). Si se añaden más skills en el
futuro, volver a revisarla.

## Backend sin capa de configuración

`seed`, categorías y probabilidades siguen hardcodeados como literales en
`backend/app/routes.py`. No hay `backend/.env.example` equivalente al del
frontend. Ver `.agents/rules/configuracion-explicita-en-backend.md`.

## `frontend/src/lib/mock-data.ts` es código muerto

Confirmado por grep: ningún archivo de `frontend/src` lo importa. La fuente
real de datos de la UI es el backend vía `/api/metrics`. No se ha decidido si
eliminarlo o conectarlo a algo (tests, Storybook). Ver
`.agents/rules/no-editar-mock-data-sin-confirmar-uso.md`.

## CORS abierto

`backend/app/main.py` tiene `allow_origins=["*"]` + `allow_credentials=True`.
Funciona hoy porque no hay autenticación real; sería inválido/inseguro en
cuanto se añadan cookies de sesión o tokens. Ver
`.agents/rules/no-combinar-cors-wildcard-con-credenciales.md`.

## Vulnerabilidades de npm — resuelto

~~`npm install` en `frontend/` reporta 8 vulnerabilidades (1 baja, 1
moderada, 6 altas). No se ha ejecutado `npm audit fix`.~~ **Resuelto** en la
sesión de `feature/agent-skills`: `npm audit fix` (sin `--force`) → 0
vulnerabilidades, sin cambios de versión mayor. Detalle en
`decisions-and-fixes.md` #6. Confirma lo que ya decía `conventions-and-rules.md`:
`.agents/rules/revisar-npm-audit-antes-de-escalar.md` no es "descubrible"
desde un prompt genérico — esta vez se resolvió porque se le pidió
explícitamente al agente que identificara un gap de cobertura, no porque
apareciera solo.

## Estado de git

`chore/reglas-agente-y-fix-docker` se mergeó a `main` (PR #3). Trabajo
actual en la rama `feature/agent-skills`, pusheada a `origin`: 7 commits
nuevos sobre `main` — `perf(frontend)` (vercel-react-best-practices +
`.dockerignore`), `fix(accesibilidad)`, `fix(seo)` ×2, `build(vite)`,
`fix(deps)` (npm audit fix), `chore(agents)` (skill `commit-profesional-es`).
**Todavía no se ha abierto un Pull Request hacia `main`.** Antes de mergear,
revisar si sigue habiendo trabajo pendiente en esta lista.

## `.claude/` sin trackear

Existe `.claude/settings.json` en el repo local, sin commitear
intencionadamente (config local del editor, no del proyecto). No añadirlo a
un commit salvo que se decida explícitamente lo contrario.
