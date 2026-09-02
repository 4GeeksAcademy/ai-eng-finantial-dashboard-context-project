# Project overview

## Qué es

Dashboard de métricas financieras, proyecto educativo de la Career Program de
[4Geeks Academy](https://4geeksacademy.com/) (ver `README.md`). El propósito
declarado no es solo el dashboard en sí: el `README.md` pide forkear el repo,
usar un agente de IA para inspeccionarlo, y documentar reglas + memory bank
(esta misma carpeta) para ese fork — es decir, el proyecto es también un
ejercicio de "onboarding de agentes" sobre una base de código real.

## Stack

- **Backend**: FastAPI (Python 3.13), sin base de datos — `backend/app/main.py`,
  `backend/app/routes.py`.
- **Frontend**: React 19 + Vite 8 + TypeScript + Tailwind v4 + recharts —
  `frontend/src/`.
- **Orquestación**: `docker-compose.yml` (dos servicios: `backend`, `frontend`).

## Arquitectura

- Todo el backend vive en dos archivos: `backend/app/main.py` (crea la app,
  CORS, incluye el router) y `backend/app/routes.py` (modelos Pydantic +
  9 endpoints + toda la lógica de negocio como funciones puras).
- **Sin persistencia real**: `generate_mock_movements(seed=42)` genera 360
  movimientos financieros deterministas (mismo dataset siempre, verificado
  llamando dos veces a `/api/metrics` y comparando byte a byte) para todo el
  año en curso, en memoria, en cada request.
- El frontend hace `fetch` a `/api/metrics` desde `frontend/src/App.tsx`,
  calcula KPIs/agregados en `frontend/src/lib/financial-utils.ts` (funciones
  puras, testeadas en `financial-utils.test.ts`), y los pinta con componentes
  de `frontend/src/components/dashboard/`.
- **Puente frontend↔backend**: en dev, Vite proxea `/api/*` hacia
  `http://backend:8000` (`frontend/vite.config.ts`), así que el frontend no
  necesita conocer la URL real salvo que se sobreescriba con
  `VITE_API_BASE_URL` (`frontend/.env.example`).

## Entry points

- Backend: `backend/app/main.py` (`app = FastAPI(...)`, `app.include_router(router)`).
- Frontend: `frontend/index.html` → `frontend/src/main.tsx` → `frontend/src/App.tsx`.

## Endpoints (todos en `backend/app/routes.py`)

`GET /health`, `GET /api/metrics`, `GET /api/metrics/facets`,
`GET /api/metrics/summary`, `GET /api/metrics/categories/top`,
`GET /api/metrics/comparison`, `GET /api/metrics/alerts`,
`GET /api/metrics/b2b`, `GET /api/metrics/b2c`.

## Cómo se ejecuta

```bash
docker compose up --build
```
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Docs interactivas: http://localhost:8000/docs

Alternativa sin Docker: `uvicorn app.main:app --reload` en `backend/` (tras
`pip install -r requirements.txt`) y `npm run dev` en `frontend/` (tras
`npm install`).

Ver [decisions-and-fixes.md](decisions-and-fixes.md) antes de tocar
`frontend/Dockerfile` o el flujo de `docker compose up` — hay comportamiento
no obvio ya resuelto que no debe reintroducirse.
