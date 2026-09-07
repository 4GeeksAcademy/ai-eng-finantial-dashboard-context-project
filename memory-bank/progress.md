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

`chore/reglas-agente-y-fix-docker` se mergeó a `main` (PR #3). Lo que sigue
pasó en una sesión posterior, rama `feature/agent-skills`.

## Sesión de skills externas (accesibilidad, rendimiento, calidad web)

12. Se cargaron y aplicaron tres skills externas vía `npx skills use` sobre
    `frontend/`, cada una auditando con evidencia real (no solo lectura de
    código) y corrigiendo lo encontrado:
    - **`accessibility`** (`addyosmani/web-quality-skills`): revisión
      estática contra WCAG 2.2 — `CardTitle` pasó de `<div>` a `<h2>`
      (rompía la navegación por encabezados), captions en tablas, roles
      `alert`/`aria-live` en errores dinámicos, nombres accesibles en
      gráficos, iconos decorativos con `aria-hidden`.
    - **`vercel-react-best-practices`** (`vercel-labs/agent-skills`, 70
      reglas de rendimiento React/Next.js — aplicable parcialmente porque
      este proyecto es Vite CSR, no Next.js): `computeKPIs` combinó dos
      pasadas `.filter().reduce()` en un solo bucle
      (`js-combine-iterations`); se auditaron patrones de despliegue del
      frontend y se detectó que faltaba `frontend/.dockerignore` (el build
      de Docker enviaba los 211MB de `node_modules` del host como contexto,
      con riesgo real de pisar el `node_modules` Linux recién instalado —
      la misma clase de bug que
      `.agents/rules/documentar-divergencias-dev-vs-docker.md` ya
      documentaba). Verificado con `docker build --no-cache`: contexto bajó
      de ~211MB a 83.98kB.
    - **`web-quality-audit`** (mismo repo que `accessibility`, cubre
      Performance/A11y/SEO/Best Practices/Agentic Browsing estilo
      Lighthouse): se corrió Lighthouse real contra el dev server (`:5173`
      vía docker-compose, con backend funcionando) y contra el build de
      producción (`vite preview` en `:4173`). Encontró 2 bugs de contraste
      de color reales (confirmados por axe-core, no solo teoría) en modo
      oscuro — se recalcularon los tokens OKLCH con conversión
      OKLCH→sRGB→luminancia para dar con valores que sí cumplen 4.5:1 en
      vez de ajustar a ojo. También: meta description ausente, fuente
      `'Inter'` declarada en CSS pero nunca cargada (se añadió vía Google
      Fonts con patrón preload+swap asíncrono tras detectar que la primera
      versión bloqueaba el render), `robots.txt` ausente, y source maps
      ausentes en el build de producción — estos dos últimos se resolvieron
      según preferencia explícita del usuario (bloquear indexación con
      `Disallow: /`, activar `build.sourcemap`). El LCP de 4.4s medido
      contra el build standalone resultó ser un artefacto de medición (sin
      backend detrás de `vite preview`, `/api` daba 502 y el LCP terminaba
      siendo el banner de error) — confirmado comparando con la corrida
      contra `:5173` con backend real, donde el LCP es un valor KPI normal.
13. Se le pidió al agente que identificara un gap no cubierto por ninguna
    skill cargada: **dependencias/backend sin auditar**. Evidencia concreta:
    `npm audit` reportaba 8 vulnerabilidades (6 altas), ya señaladas en
    `.agents/rules/revisar-npm-audit-antes-de-escalar.md` pero nunca
    resueltas en este fork (ver también `conventions-and-rules.md`, donde
    se documentó que esta regla no era "descubrible" desde un prompt
    genérico).
14. `npm audit fix` (sin `--force`) resolvió las 8 vulnerabilidades sin
    bumps de versión mayor (`package.json` no cambió). Verificado con: 34
    tests, typecheck, lint, build de producción, y rebuild real de Docker
    (`docker compose up --build -d --force-recreate -V`) con ambos
    contenedores respondiendo 200. De paso corrigió un warning nuevo de
    deprecación (`__dirname` → `import.meta.dirname` en `vite.config.ts`).
15. Se creó `.agents/skills/commit-profesional-es/SKILL.md` — skill propia
    (no externa) para redactar mensajes de commit en español con prefijo
    Conventional Commits correcto detectado a partir del diff real. Incluye
    una nota explícita: no puede forzar la ausencia de la firma
    `Co-Authored-By` del agente que la use, porque eso lo decide el harness
    de la sesión, no la skill.
16. Todo lo anterior se subió usando la propia skill nueva: 6 commits en
    `feature/agent-skills` (uno por tipo/alcance en vez de uno mezclado —
    `fix(accesibilidad)`, `fix(seo)` ×2 en commits separados, `build(vite)`,
    `fix(deps)`, `chore(agents)`), pusheados a `origin`. PR todavía no
    abierto.

**Rama actual**: `feature/agent-skills`, pusheada a `origin`, sin PR abierto
todavía.
