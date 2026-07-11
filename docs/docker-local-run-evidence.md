# Evidencia de ejecucion local con Docker

## Objetivo
Documentar la verificacion de arranque local del stack con Docker Compose.

## Comandos ejecutados
1. `docker compose up --build -d`
2. `docker compose ps`
3. `docker compose down`

## Resultado observado
- Servicios levantados correctamente:
  - `backend` en puertos `8000` y `5678`.
  - `frontend` en puerto `5173`.
- Estado observado en `docker compose ps`: ambos contenedores en `Up`.
- `docker compose down` ejecuto limpieza de contenedores y red sin errores bloqueantes.

## Conclusion
El proyecto arranca localmente por Docker Compose con frontend y backend operativos en los puertos esperados.
