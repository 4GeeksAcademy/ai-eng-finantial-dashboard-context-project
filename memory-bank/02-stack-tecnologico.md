# Stack tecnologico

---

## Frontend

### Framework y lenguaje

- React 19
- TypeScript
- Vite

### UI y visualizacion

- Tailwind CSS v4
- Recharts
- Lucide React
- class-variance-authority
- clsx
- tailwind-merge

### Calidad y pruebas

- ESLint
- Vitest
- @vitest/coverage-v8

---

## Backend

### Framework y runtime

- FastAPI
- Uvicorn standard
- Pydantic (a traves de FastAPI)

### Pruebas y desarrollo

- pytest
- pytest-cov
- httpx
- debugpy

## Infraestructura y tooling

- Docker Compose con dos servicios: frontend y backend.
- Dockerfiles separados por capa.
- Proxy de Vite para /api en desarrollo local.

## Dependencias clave por impacto

- Recharts: render de graficas financieras.
- FastAPI + Pydantic: contratos tipados de API.
- Vitest y pytest: red de seguridad de regresion en frontend y backend.

## Evidencia principal

- [frontend/package.json](../frontend/package.json)
- [backend/requirements.txt](../backend/requirements.txt)
- [docker-compose.yml](../docker-compose.yml)
- [frontend/vite.config.ts](../frontend/vite.config.ts)
- [backend/Dockerfile](../backend/Dockerfile)
- [frontend/Dockerfile](../frontend/Dockerfile)
