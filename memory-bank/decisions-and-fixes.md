# Decisiones y fixes ya aplicados

Bugs reales encontrados y resueltos. #1–3: rama `chore/reglas-agente-y-fix-docker`
(mergeada a `main` vía PR #3). #4–7: sesión de skills externas (accesibilidad,
rendimiento, calidad web), rama `feature/agent-skills` — ver `progress.md`.
No revertir sin entender la causa raíz.

## 1. El frontend no arrancaba en Docker (`node.exe: not found`)

**Síntoma**: `docker compose up --build` levantaba el backend correctamente
pero el contenedor `frontend` salía con exit code 127:
```
/app/node_modules/.bin/vite: exec: line 33: node.exe: not found
```

**Causa raíz**: el shim multiplataforma que genera `npm` en
`node_modules/.bin/vite` tiene un bug real — su comprobación de fallback trata
la cadena `"node"` como ruta relativa literal en vez de resolverla por
`$PATH`, así que nunca usa el `node` real del contenedor y termina
intentando `node.exe` (inexistente en Linux). Reproducido tanto con npm
11.19.0 como con 10.9.9 dentro de la imagen `node:24-alpine` — **no es un bug
de una versión concreta de npm**, así que downgradear npm no lo arregla.

**Fix aplicado**: `frontend/Dockerfile` ya no ejecuta `npm run dev`; su `CMD`
invoca Vite directamente:
```
CMD ["node", "node_modules/vite/bin/vite.js", "--host", "0.0.0.0", "--port", "5173"]
```
El propio Dockerfile lleva un comentario explicando esto. Ver también
`.agents/rules/documentar-divergencias-dev-vs-docker.md`.

**Implicación para el futuro**: si alguien "simplifica" el `CMD` de vuelta a
`npm run dev` sin verificar antes que el bug ya no ocurre en la versión de
`node:*-alpine` en uso, reintroducirá el fallo silenciosamente (build pasa,
runtime falla).

## 2. `docker compose up --build` no aplicaba el fix tras cambiarlo

**Síntoma**: tras corregir el `CMD` del Dockerfile, un `docker compose up
--build` normal seguía sirviendo el `node_modules`/comportamiento antiguo —
el frontend seguía cayendo.

**Causa raíz**: el volumen anónimo declarado en `docker-compose.yml`
(`./frontend:/app` + `/app/node_modules`) puede persistir contenido obsoleto
entre reconstrucciones normales.

**Fix**: reconstruir con `docker compose up --build -d --force-recreate -V`
(la `-V` renueva los volúmenes anónimos). Ver
`.agents/rules/reconstruir-con-force-recreate-tras-cambiar-dependencias.md`.

## 3. Verificación de determinismo de los datos mock

Se comprobó explícitamente (dos llamadas consecutivas a `/api/metrics`,
comparación de JSON completo) que el backend devuelve siempre los mismos 360
movimientos — `generate_mock_movements(seed=42)` es determinista. Documentado
en `verification.md`. Importante para escribir tests con aserciones exactas
(`.agents/rules/aprovechar-el-seed-fijo-en-tests.md`).

## 4. Contraste de color insuficiente en modo oscuro (frontend)

**Síntoma**: Lighthouse/axe-core marcaba `color-contrast` en 0 sobre el
build real — el botón activo de `ViewNav` (`bg-primary`/`text-primary-foreground`)
y las 5 apariciones de `text-destructive` (mensajes de error, columna
"Increase" de la tabla de alertas) no cumplían el mínimo 4.5:1 en modo
oscuro (`<main className="dark">`, forzado siempre).

**Causa raíz**: los tokens `--primary: oklch(0.6 0.2 255)` y
`--destructive: oklch(0.45 0.18 27)` en `frontend/src/index.css` (bloque
`.dark`) daban ratios reales de 3.90:1 y 2.30–2.46:1 respectivamente —
verificado con una conversión OKLCH→sRGB→luminancia relativa hecha a mano
(no a ojo), no con los valores de diseño "que parecen razonables".

**Fix**: `--primary` bajó a `oklch(0.55 0.2 255)` (4.76:1, reutiliza el
valor ya usado en modo claro) y `--destructive` subió a `oklch(0.65 0.18 27)`
(5.35–5.72:1). Verificado: Lighthouse accessibility pasó de 96 a 100.

**Implicación para el futuro**: si se vuelve a tocar la paleta OKLCH del
modo oscuro, recalcular el contraste contra `--primary-foreground`/
`--card`/`--background` antes de asumir que un ajuste "se ve bien".

## 5. `frontend/.dockerignore` no existía

**Síntoma**: cualquier `docker build`/`docker compose build` del frontend
enviaba `frontend/node_modules` (211MB en el host) como parte del contexto
de build.

**Causa raíz**: `frontend/Dockerfile` hace `COPY . .` después de su propio
`RUN npm install`. Sin `.dockerignore`, un `node_modules` del host presente
en el contexto se copia encima del que el contenedor Linux acaba de
instalar — la misma clase de bug de shim de npm por plataforma que el
fix #1 de este archivo ya documentó una vez en este proyecto.

**Fix**: se añadió `frontend/.dockerignore` (excluye `node_modules`, `dist`,
`.env*`, `coverage`, `.git`, etc. — refleja el bloque frontend del
`.gitignore` raíz). Verificado con `docker build --no-cache`: el contexto
de build bajó de ~211MB a 83.98kB (visible en el log como
`[internal] load .dockerignore` seguido de `transferring context: 83.98kB`).
El volumen anónimo de `docker-compose.yml` ya enmascaraba esto en runtime
vía `docker compose up`, pero no protegía un `docker build` directo.

## 6. Vulnerabilidades de npm sin resolver (ver antes en `open-items.md`)

**Síntoma**: `npm audit` en `frontend/` reportaba 8 vulnerabilidades (1
baja, 1 moderada, 6 altas) — js-yaml, nanoid, postcss, vite y transitivas.
Ya señalado en `.agents/rules/revisar-npm-audit-antes-de-escalar.md`, nunca
resuelto en este fork.

**Fix**: `npm audit fix` (sin `--force`) las resolvió todas. `package.json`
no cambió — solo `package-lock.json` con bumps de versiones transitivas
dentro de los rangos semver ya declarados, así que no hubo saltos de
versión mayor en `vite`/`vitest` (el riesgo que la propia regla advertía).
Verificado con: 34 tests, typecheck, lint, build de producción, y rebuild
real de Docker (`--force-recreate -V`) con ambos contenedores respondiendo
200.

**Nota**: el fix reveló un warning nuevo de deprecación
(`configLoader: 'native'` sobre el uso de `__dirname` en
`frontend/vite.config.ts`, causado por el bump transitivo de Vite) —
corregido reemplazándolo por `import.meta.dirname`.

## 7. Vite preview sin backend distorsiona las métricas de Performance

**Síntoma**: Lighthouse contra el build de producción servido con
`vite preview` (`:4173`) medía LCP=4.4s y errores de consola (502 en
`/api/*`), sugiriendo una regresión de rendimiento seria.

**Causa raíz**: `vite preview` no aplica el proxy `/api` que sí existe en
`vite dev` (`server.proxy` en `vite.config.ts`), así que no hay backend
detrás. El fetch de datos falla y el elemento LCP termina siendo el banner
de error (`role="alert"`) en vez de un valor KPI real.

**Cómo se confirmó que era un artefacto y no un bug real**: se comparó con
el reporte de Lighthouse contra `:5173` (dev server vía docker-compose, con
backend real) del mismo momento — ahí el LCP es un `<p>` con un valor KPI
real, `elementRenderDelay` de ~474ms, 0 errores de consola. Conclusión: no
se tocó código de rendimiento a partir de la medición contra `:4173`, solo
se documentó la limitación (este proyecto no tiene una ruta de "producción"
que sirva el build compilado con proxy al backend — coherente con
`open-items.md`).
