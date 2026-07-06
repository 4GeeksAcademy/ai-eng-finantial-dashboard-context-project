# Contexto del proyecto

## Resumen rápido

Proyecto full stack de métricas financieras con:

- Frontend en React + TypeScript.
- Backend en FastAPI.
- Orquestación local con Docker Compose.

Fuente: [README.md](README.md), [docker-compose.yml](docker-compose.yml).

## Stack de frontend

- Framework y lenguaje: React 19 + TypeScript.
- Bundler/dev server: Vite.
- Estilos: Tailwind CSS v4.
- Gráficas: Recharts.
- Iconos: Lucide React.
- Utilidades de clases: clsx y tailwind-merge.
- Calidad/pruebas: ESLint y Vitest.

Fuentes:

- [frontend/package.json](frontend/package.json)
- [frontend/vite.config.ts](frontend/vite.config.ts)
- [frontend/Dockerfile](frontend/Dockerfile)

## Stack de backend

- Framework API: FastAPI.
- Servidor ASGI: Uvicorn.
- Debug remoto: debugpy.
- Testing: pytest, pytest-cov y httpx.
- Runtime base del contenedor: Python 3.13 slim.

Fuentes:

- [backend/requirements.txt](backend/requirements.txt)
- [backend/app/main.py](backend/app/main.py)
- [backend/Dockerfile](backend/Dockerfile)

## Cómo se levanta el proyecto

### Opción recomendada (repositorio)

1. Desde la raíz del repositorio, ejecutar:

   docker compose up --build

2. Servicios esperados:

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:8000>
- Documentación de API: <http://localhost:8000/docs>

Fuente: [README.md](README.md), [README.es.md](README.es.md), [docker-compose.yml](docker-compose.yml).

### Qué ocurre internamente al levantar

- Docker Compose crea 2 servicios: frontend y backend.
- Frontend expone el puerto 5173 y depende de backend.
- Backend expone los puertos 8000 y 5678.
- El frontend usa proxy de Vite para enrutar solicitudes de /api hacia <http://backend:8000>.

Fuente: [docker-compose.yml](docker-compose.yml), [frontend/vite.config.ts](frontend/vite.config.ts), [frontend/Dockerfile](frontend/Dockerfile), [backend/Dockerfile](backend/Dockerfile).

## Notas útiles

- La raíz del backend en <http://localhost:8000> puede responder 404 si no hay ruta definida para /. Esto no implica que el backend esté caído.
- Para validar backend activo, se puede consultar /health y /docs.

Fuente: [backend/app/main.py](backend/app/main.py), [backend/app/routes.py](backend/app/routes.py).
