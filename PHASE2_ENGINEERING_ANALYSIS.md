# Fase 2 - Analisis de practicas de ingenieria

## Alcance

Revision del frontend, backend, configuracion local y pruebas para identificar practicas utiles, riesgos y reglas propuestas para futuras iteraciones.

## Buenas practicas identificadas

### Arquitectura y contratos

1. El backend define modelos de respuesta explicitos con Pydantic y tipos acotados con `Literal`, lo que hace visibles los contratos de la API y reduce ambiguedad en filtros y respuestas. Evidencia en [backend/app/routes.py](backend/app/routes.py).
2. El frontend modela el dominio con tipos propios y separa la logica de calculo en utilidades puras, evitando mezclar reglas de negocio simples con los componentes visuales. Evidencia en [frontend/src/lib/financial-types.ts](frontend/src/lib/financial-types.ts) y [frontend/src/lib/financial-utils.ts](frontend/src/lib/financial-utils.ts).

### Testing

3. El backend cubre salud, filtros, segmentacion, resumenes, comparaciones y alertas con pruebas automatizadas, lo que protege el comportamiento principal de la API. Evidencia en [backend/tests/test_routes.py](backend/tests/test_routes.py).
4. El frontend tiene pruebas unitarias sobre calculos y formateadores, incluyendo un caso no trivial de orden cronologico cruzando anos. Evidencia en [frontend/src/lib/financial-utils.test.ts](frontend/src/lib/financial-utils.test.ts).

### DX y composicion UI

5. El proyecto esta preparado para desarrollo local con Docker Compose y proxy de Vite para `/api`, reduciendo configuracion manual en entorno local. Evidencia en [docker-compose.yml](docker-compose.yml), [frontend/vite.config.ts](frontend/vite.config.ts) y [README.es.md](README.es.md).
6. El dashboard usa componentes reutilizables y estados de carga con skeletons, una buena base para una UI consistente y escalable. Evidencia en [frontend/src/components/dashboard/kpi-card.tsx](frontend/src/components/dashboard/kpi-card.tsx), [frontend/src/components/dashboard/kpi-row.tsx](frontend/src/components/dashboard/kpi-row.tsx), [frontend/src/components/dashboard/income-outcome-chart.tsx](frontend/src/components/dashboard/income-outcome-chart.tsx) y [frontend/src/components/dashboard/profit-percent-chart.tsx](frontend/src/components/dashboard/profit-percent-chart.tsx).

## Malas practicas o riesgos detectados

### Arquitectura

1. [backend/app/routes.py](backend/app/routes.py) concentra rutas HTTP, generacion de datos mock, modelos, transformaciones, agregaciones y deteccion de alertas en un solo modulo. Eso vuelve mas caro testear, reemplazar la fuente de datos o evolucionar la API por capas.
2. El dominio financiero esta duplicado entre backend y frontend, con enums y shapes definidos por separado. Esa duplicacion crea riesgo de drift entre contrato backend y consumo frontend. Evidencia en [backend/app/routes.py](backend/app/routes.py) y [frontend/src/lib/financial-types.ts](frontend/src/lib/financial-types.ts).

### Correctitud y producto

3. El encabezado del dashboard muestra un periodo fijo `2024 — Full Year`, pero los datos mock dependen de la fecha actual y hoy generan periodos 2025/2026. Eso puede inducir a lecturas incorrectas del tablero. Evidencia en [frontend/src/components/dashboard/dashboard-header.tsx](frontend/src/components/dashboard/dashboard-header.tsx) y [backend/app/routes.py](backend/app/routes.py).
4. La generacion de datos mock usa semilla fija pero tambien depende de `date.today()`, por lo que el dataset cambia con el tiempo aunque el seed sea el mismo. Eso reduce reproducibilidad de demos, snapshots y analisis historicos. Evidencia en [backend/app/routes.py](backend/app/routes.py).

### Testing y DX

5. Las pruebas cubren happy paths razonablemente bien, pero faltan casos limite importantes: rangos invalidos o invertidos, respuestas vacias, errores de red en frontend y consistencia entre frontend y contrato de API. Evidencia por ausencia relativa en [backend/tests/test_routes.py](backend/tests/test_routes.py) y [frontend/src/lib/financial-utils.test.ts](frontend/src/lib/financial-utils.test.ts).
6. Hay friccion de entorno entre desarrollo en contenedor y tooling local del editor: el frontend depende de `vite/client` para TypeScript, pero si las dependencias locales no estan instaladas o quedan con permisos de root, el editor rompe aunque la app en Docker siga funcionando. Evidencia en [frontend/tsconfig.app.json](frontend/tsconfig.app.json), [frontend/Dockerfile](frontend/Dockerfile) y [docker-compose.yml](docker-compose.yml).
7. La UX y los mensajes estan mezclados entre ingles y espanol, lo que daña consistencia del producto y complica una futura estrategia de i18n. Evidencia en [frontend/src/App.tsx](frontend/src/App.tsx), [frontend/src/components/dashboard/dashboard-header.tsx](frontend/src/components/dashboard/dashboard-header.tsx) y [frontend/src/components/dashboard/kpi-row.tsx](frontend/src/components/dashboard/kpi-row.tsx).

## Hallazgos agrupados por categoria

### Arquitectura

- Fortaleza: contratos tipados y funciones puras reutilizables.
- Riesgo: modulo backend demasiado concentrado y dominio duplicado entre capas.

### Naming y consistencia

- Fortaleza: nombres de endpoints y tipos son mayormente claros.
- Riesgo: la presentacion mezcla idiomas y periodos hardcodeados que no reflejan los datos reales.

### Testing

- Fortaleza: buena cobertura del comportamiento principal en backend y calculos puros en frontend.
- Riesgo: faltan pruebas de casos borde, error handling e integracion de contrato.

### Documentacion y DX

- Fortaleza: arranque local simple con Compose y proxy de Vite.
- Riesgo: el flujo entre dependencias del contenedor y dependencias visibles para el editor no esta explicado ni blindado.

## Reglas propuestas

Las reglas propuestas para mitigar estos riesgos y preservar patrones utiles quedaron definidas en [./.agents/rules/engineering-practices.md](./.agents/rules/engineering-practices.md).