# Documentar cualquier divergencia entre el comando de dev local y el `CMD` de Docker

**Alcance:** `frontend/Dockerfile` (`CMD`) frente a `frontend/package.json`
(`scripts.dev`).

**Justificación:** `frontend/Dockerfile` ya no ejecuta `npm run dev`; ejecuta
`node node_modules/vite/bin/vite.js --host 0.0.0.0 --port 5173`. El cambio se
hizo para esquivar un bug real del shim multiplataforma que genera `npm` en
`node_modules/.bin/vite` (su tercera comprobación de fallback trata la cadena
`"node"` como ruta relativa literal en vez de resolverla por `$PATH`, así que
nunca usa el `node` real del contenedor y termina intentando `node.exe`,
inexistente en Linux — reproducido con npm 11.19.0 y también con 10.9.9).
Mientras tanto, `frontend/package.json:8` sigue definiendo `"dev": "vite"`, que
es lo que corre cualquiera que trabaje fuera de Docker.

**Guía específica del proyecto:**
- No revertir el `CMD` de `frontend/Dockerfile` a `npm run dev` sin verificar
  primero que el bug del shim de npm ya no ocurre en la versión de `node:*-alpine`
  usada en ese momento (probar con `docker run --rm <imagen> sh -c "npm run dev -- --help"`).
- Si se cambia el comando de arranque en el Dockerfile, dejar un comentario en el
  propio `Dockerfile` explicando por qué difiere de `npm run dev`.
- Cualquier otro `CMD`/`ENTRYPOINT` que se añada a otro Dockerfile del proyecto
  debe evitarse si depende de shims de `npm` generados en Windows/host, dado este
  antecedente.
