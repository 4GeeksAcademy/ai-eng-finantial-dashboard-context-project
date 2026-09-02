# Decisiones y fixes ya aplicados

Bugs reales encontrados y resueltos durante el trabajo en la rama
`chore/reglas-agente-y-fix-docker`. No revertir sin entender la causa raíz.

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
