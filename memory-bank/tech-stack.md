# Stack tecnologico

## Frontend
- Lenguaje:
  - TypeScript.
- Framework/runtime:
  - React 19.
  - Vite 8.
- UI y visualizacion:
  - Recharts para graficos.
  - Lucide React para iconos.
  - class-variance-authority, clsx y tailwind-merge para composicion de estilos.
- Calidad y testing:
  - ESLint 9 + typescript-eslint + react-hooks + react-refresh.
  - Vitest y cobertura con @vitest/coverage-v8.
- Scripts clave:
  - dev, build, lint, test, test:watch, test:coverage.

## Backend
- Lenguaje:
  - Python.
- Framework/runtime:
  - FastAPI.
  - Uvicorn (standard).
- Modelado y validacion:
  - Pydantic via modelos de respuesta y dominio.
- Testing:
  - Pytest y pytest-cov.
- Depuracion y cliente de pruebas:
  - debugpy.
  - httpx.

## Infraestructura y tooling
- Orquestacion local:
  - Docker Compose con dos servicios: frontend y backend.
- Networking local:
  - Frontend publicado en 5173.
  - Backend publicado en 8000 (y 5678 para debug).
  - Proxy de Vite para /api hacia http://backend:8000.
- DX:
  - Montaje por volumen en ambos servicios para iteracion local.
  - Alias de import frontend "@" -> src.

## Dependencias clave (impacto en arquitectura)
- React + Vite: base SPA y bucle de desarrollo rapido.
- FastAPI: capa HTTP tipada con OpenAPI y response_model.
- Recharts: visualizacion de metricas en cliente.
- Pytest/Vitest: validacion de logica y contratos en backend/frontend.

## Observaciones de madurez
- El stack esta bien definido para desarrollo local y entrenamiento.
- No se observan piezas de persistencia, auth ni observabilidad de produccion.
- CORS en backend se mantiene abierto, util para demo pero no endurecido.

## Fuentes
- frontend/package.json
- frontend/vite.config.ts
- frontend/eslint.config.js
- backend/requirements.txt
- backend/app/main.py
- backend/app/routes.py
- docker-compose.yml
- backend/tests/test_routes.py
- frontend/src/lib/financial-utils.test.ts
