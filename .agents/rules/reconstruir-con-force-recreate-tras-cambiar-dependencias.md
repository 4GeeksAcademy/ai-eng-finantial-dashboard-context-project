# Reconstruir con `--force-recreate -V` tras cambiar dependencias del frontend

**Alcance:** flujo de `docker compose up` para el servicio `frontend`, en relación
con `docker-compose.yml:8-10` (`./frontend:/app` + volumen anónimo
`/app/node_modules`).

**Justificación:** reproducido directamente en este proyecto — tras corregir el
`CMD` del `frontend/Dockerfile`, un `docker compose up --build` normal siguió
sirviendo el contenido antiguo del volumen anónimo de `node_modules`, y el
contenedor frontend seguía cayendo con el mismo error. Solo
`docker compose up --build -d --force-recreate -V` forzó la recreación del
volumen y aplicó el `node_modules`/`CMD` correctos.

**Guía específica del proyecto:**
- Después de modificar `frontend/package.json`, `frontend/package-lock.json`, o
  el `RUN npm install`/`CMD` de `frontend/Dockerfile`, reconstruir con:
  `docker compose up --build -d --force-recreate -V`.
- Si algo en el frontend "no refleja" un cambio reciente de dependencias pese a
  haber hecho `--build`, sospechar primero del volumen anónimo de
  `node_modules` antes de investigar otra causa.
- No eliminar el patrón `./frontend:/app` + `/app/node_modules` de
  `docker-compose.yml` sin entender que existe justamente para evitar que el
  `node_modules` del host (potencialmente de otro SO) se monte dentro del
  contenedor Linux.
