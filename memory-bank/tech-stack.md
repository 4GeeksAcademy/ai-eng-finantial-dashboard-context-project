# Tech Stack

## Frontend

### Framework y runtime

- React 19
- TypeScript
- Vite

Evidencia:

- Dependencias y scripts en [frontend/package.json](../frontend/package.json)
- Configuración de build en [frontend/vite.config.ts](../frontend/vite.config.ts)

### UI y visualización

- Recharts para gráficos
- Lucide React para iconografía
- Tailwind CSS (incluye @tailwindcss/vite)
- class-variance-authority, clsx y tailwind-merge para composición de estilos

Evidencia:

- [frontend/package.json](../frontend/package.json)
- Componentes dashboard en [frontend/src/components/dashboard](../frontend/src/components/dashboard)

### Calidad frontend

- ESLint (config dedicado)
- Vitest + cobertura V8

Evidencia:

- [frontend/eslint.config.js](../frontend/eslint.config.js)
- Scripts test en [frontend/package.json](../frontend/package.json)
- Tests en [frontend/src/lib/financial-utils.test.ts](../frontend/src/lib/financial-utils.test.ts)

## Backend

### Framework y runtime

- FastAPI
- Uvicorn (standard extras)
- Pydantic (modelado/validación de contratos)

Evidencia:

- [backend/requirements.txt](../backend/requirements.txt)
- Inicialización de app en [backend/app/main.py](../backend/app/main.py)
- Modelos y endpoints en [backend/app/routes.py](../backend/app/routes.py)

### Testing backend

- Pytest
- pytest-cov
- httpx (ecosistema de testing de API)

Evidencia:

- [backend/requirements.txt](../backend/requirements.txt)
- Suite de rutas en [backend/tests/test_routes.py](../backend/tests/test_routes.py)

## Infraestructura y tooling

### Contenedores y ejecución local

- Docker Compose para levantar frontend + backend
- Dockerfile separado por servicio

Evidencia:

- [docker-compose.yml](../docker-compose.yml)
- [backend/Dockerfile](../backend/Dockerfile)
- [frontend/Dockerfile](../frontend/Dockerfile)
- Instrucciones en [README.md](../README.md) y [README.es.md](../README.es.md)

### Integración frontend-backend

- Uso de proxy Vite para /api por defecto
- Soporte para VITE_API_BASE_URL en escenarios alternativos

Evidencia:

- Nota de proxy en [README.md](../README.md) y [README.es.md](../README.es.md)
- Consumo API en [frontend/src/App.tsx](../frontend/src/App.tsx)

## Dependencias clave (resumen)

### Frontend

- react, react-dom
- recharts
- lucide-react
- tailwindcss, @tailwindcss/vite
- vitest, @vitest/coverage-v8

### Backend

- fastapi
- uvicorn[standard]
- pytest, pytest-cov
- httpx
