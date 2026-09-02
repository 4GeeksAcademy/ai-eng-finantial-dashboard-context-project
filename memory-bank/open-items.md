# Pendientes / riesgos conocidos

Lo que queda abierto a día de hoy (rama `chore/reglas-agente-y-fix-docker`).
No asumir que ya está resuelto solo porque está documentado.

## Estructura de agentes incompleta

`AGENTS.md` referencia `./.agents/rules`, `./.agents/skills` y
`./memory-bank`. A día de hoy:
- `.agents/rules/` ✅ existe (14 reglas + índice).
- `.agents/skills/` ❌ no existe todavía.
- `memory-bank/` ✅ ya existe (esta carpeta, creada después de `.agents/rules`).

Ver `.agents/rules/mantener-agents-md-alineado-con-carpetas-reales.md` —
actualizarla si `.agents/skills/` se crea en el futuro.

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

## Vulnerabilidades de npm sin resolver

`npm install` en `frontend/` reporta 8 vulnerabilidades (1 baja, 1 moderada,
6 altas). No se ha ejecutado `npm audit fix`. Ver
`.agents/rules/revisar-npm-audit-antes-de-escalar.md` — y ojo, esta regla ya
se demostró poco "descubrible" por un agente sin que se le apunte
directamente (ver `conventions-and-rules.md`).

## Estado de git

Trabajo hecho en la rama `chore/reglas-agente-y-fix-docker` (no en `main`).
Commits: fix del Dockerfile del frontend, `.agents/rules/` completo,
`verification.md`. **Todavía no se ha abierto un Pull Request hacia `main`**
— se decidió explícitamente posponerlo. Antes de mergear, revisar si sigue
habiendo trabajo pendiente en esta lista.

## `.claude/` sin trackear

Existe `.claude/settings.json` en el repo local, sin commitear
intencionadamente (config local del editor, no del proyecto). No añadirlo a
un commit salvo que se decida explícitamente lo contrario.
