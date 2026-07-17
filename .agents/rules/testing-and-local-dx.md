# Rule: Testing and Local DX

## Scope

Aplica a pruebas de backend y frontend, configuracion de TypeScript, dependencias locales y flujos de desarrollo con Docker Compose.

## Why

El repo ya tiene pruebas utiles y un flujo local funcional, pero tambien mostro friccion real: casos borde faltantes en tests y problemas de editor cuando las dependencias locales o permisos no coinciden con el entorno en contenedor.

## Rules

- Todo cambio de API debe incluir al menos una verificacion nominal y una verificacion de borde o contrato.
- Toda logica de transformacion nueva en frontend debe vivir en una funcion pura con prueba unitaria.
- No introducir flujos que dejen dependencias locales con permisos de root si el repo se usa desde VS Code fuera del contenedor de ejecucion.
- Si una configuracion del editor depende de paquetes locales, la documentacion o el cambio debe dejar claro como restaurarlos.

## Repo anchors

- Tests backend actuales: [backend/tests/test_routes.py](backend/tests/test_routes.py).
- Tests frontend actuales: [frontend/src/lib/financial-utils.test.ts](frontend/src/lib/financial-utils.test.ts).
- Config TypeScript sensible a dependencias locales: [frontend/tsconfig.app.json](frontend/tsconfig.app.json).
- Flujo local con contenedores: [docker-compose.yml](docker-compose.yml) y [frontend/Dockerfile](frontend/Dockerfile).