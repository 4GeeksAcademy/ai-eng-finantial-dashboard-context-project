# Rule: Backend Architecture Boundaries

## Scope

Aplica a cambios dentro de [backend/app](backend/app) y en especial a rutas FastAPI, logica de agregacion y futuras fuentes de datos.

## Why

Hoy [backend/app/routes.py](backend/app/routes.py) mezcla transporte HTTP, modelos, generacion de mock data y logica de negocio. Esa concentracion dificulta sustituir mocks, ampliar la API o probar el dominio por capas.

## Rules

- Nuevas rutas no deben introducir mas logica de negocio dentro del handler si esa logica puede vivir en una funcion o servicio aislable.
- Si una ruta agrega filtrado, agregacion o comparacion no trivial, esa logica debe extraerse a una funcion dedicada y testeable.
- La sustitucion futura de mock data por una fuente real debe poder hacerse sin reescribir los handlers HTTP.

## Repo anchors

- Superficie actual a refactorizar o no empeorar: [backend/app/routes.py](backend/app/routes.py).
- Entrada de aplicacion a preservar simple: [backend/app/main.py](backend/app/main.py).