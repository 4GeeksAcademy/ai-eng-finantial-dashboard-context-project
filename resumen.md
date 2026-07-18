# Resumen del repositorio

- Este proyecto es un dashboard de métricas financieras con frontend en React + TypeScript y backend en FastAPI.
- Su propósito actual parece ser servir como base de práctica o handover técnico para explorar un stack full stack pequeño, documentar reglas para agentes y entender el flujo entre una UI analítica y una API.
- A nivel funcional, muestra ingresos, egresos, beneficio y gráficos agregados por mes a partir de movimientos financieros.
- La evidencia del repositorio indica que hoy funciona más como demo técnica que como producto conectado a una fuente de datos real.

# Stack tecnológico

- Lenguajes:
  - TypeScript en frontend.
  - Python en backend.
  - Markdown y YAML para documentación y orquestación.
- Frameworks y librerías:
  - React 19.
  - Vite 8.
  - FastAPI.
  - Recharts para visualización.
  - Lucide React para iconos.
  - class-variance-authority, clsx y tailwind-merge para composición de estilos.
  - Componentes base tipo shadcn/ui, evidenciado por frontend/components.json y componentes en src/components/ui.
- Herramientas de desarrollo:
  - TypeScript compiler.
  - ESLint 9 con typescript-eslint, react-hooks y react-refresh.
  - Vitest en frontend.
  - Pytest en backend.
  - debugpy en backend para depuración.
- Infraestructura local o contenedores:
  - Docker Compose para levantar frontend y backend.
  - Un contenedor Vite para frontend y otro para FastAPI para backend.
  - Proxy local de Vite hacia http://backend:8000 para rutas /api.
- Testing, linting y build:
  - Frontend: npm run build, npm run lint, npm run test, npm run test:coverage.
  - Backend: pytest y pytest-cov están declarados en requirements.txt.
  - Build local recomendado: docker compose up --build.

# Estructura del proyecto

- frontend:
  - Contiene la aplicación de dashboard.
  - src/App.tsx concentra la carga de datos y el ensamblaje de la UI principal.
  - src/components/dashboard agrupa componentes de presentación del tablero, KPIs y gráficos.
  - src/components/ui contiene primitivas de UI reutilizables.
  - src/lib concentra tipos, utilidades de agregación y datos mock adicionales.
- backend:
  - app/main.py inicializa FastAPI, CORS y el router.
  - app/routes.py concentra modelos, generación de datos mock, filtros y endpoints.
  - tests incluye pruebas de API y de lógica de filtrado.
- Archivos de orquestación y documentación:
  - docker-compose.yml orquesta ambos servicios.
  - README.md y README.es.md explican arranque, propósito formativo y expectativas sobre agentes.
  - AGENTS.md define que los agentes deben revisar .agents/rules, .agents/skills y memory-bank antes de actuar.

# Arquitectura y flujo general

- La arquitectura es full stack simple de dos capas:
  - Frontend React que consume la API.
  - Backend FastAPI que entrega movimientos financieros.
- Flujo actual de datos:
  - App.tsx hace fetch a /api/metrics.
  - Vite redirige /api al contenedor backend.
  - El backend genera movimientos mock en memoria con una semilla fija y devuelve el resultado filtrado.
  - El frontend transforma esos movimientos en KPIs y series mensuales mediante utilidades locales.
- Piezas centrales:
  - backend/app/routes.py es el núcleo funcional real del backend actual.
  - frontend/src/App.tsx es el punto de integración del frontend.
  - frontend/src/lib/financial-utils.ts concentra la lógica de agregación usada por la UI.
- Patrones relevantes:
  - Backend monolítico y orientado a funciones: modelos Pydantic + helpers + endpoints en un solo módulo.
  - Frontend con separación razonable entre contenedor, componentes presentacionales y utilidades puras.
  - La lógica analítica principal del frontend está desacoplada en funciones testeables.
- Hallazgo importante:
  - El backend implementa hoy solo /health y /api/metrics, pero existen modelos y helpers que sugieren endpoints analíticos más avanzados todavía no expuestos.

# Reglas y convenciones detectadas

- Instrucciones de agentes:
  - AGENTS.md obliga a revisar .agents/rules, .agents/skills y memory-bank.
  - En este fork no existen actualmente esas carpetas, así que la regla existe pero su soporte material todavía no está creado.
  - README.md también espera que el fork documente reglas propuestas y memory bank.
- Convenciones de nombres:
  - Frontend usa kebab-case en nombres de archivo de componentes, por ejemplo dashboard-header.tsx y profit-percent-chart.tsx.
  - Los componentes React exportan nombres en PascalCase.
  - Las utilidades y tipos se agrupan por dominio financiero bajo src/lib.
  - El backend usa snake_case en Python y nombres de tipos claros con Pydantic.
- Organización de componentes, utilidades o rutas:
  - Los componentes de dashboard viven separados de las primitivas UI.
  - Los tipos compartidos del frontend están centralizados en financial-types.ts.
  - La transformación de datos de negocio para la UI está en financial-utils.ts.
  - El backend no separa todavía rutas, servicios y capa de datos; todo vive esencialmente en routes.py.
- Restricciones o formas de trabajo deducibles:
  - El proyecto está pensado para correr localmente por Docker Compose.
  - La API base del frontend depende del proxy de Vite o de VITE_API_BASE_URL.
  - El repo está orientado a aprendizaje, inspección por agentes y posterior formalización de reglas.

# Herramientas y scripts importantes

- Comandos relevantes:
  - docker compose up --build: arranque completo recomendado.
  - En frontend:
    - npm run dev
    - npm run build
    - npm run lint
    - npm run test
    - npm run test:coverage
  - En backend:
    - pytest
- Archivos de configuración importantes:
  - docker-compose.yml: define servicios, puertos y volúmenes.
  - frontend/package.json: scripts y dependencias del frontend.
  - frontend/vite.config.ts: alias @ y proxy /api hacia backend.
  - frontend/eslint.config.js: reglas de linting de TypeScript y React.
  - frontend/components.json: configuración de componentes estilo shadcn/ui.
  - backend/requirements.txt: dependencias Python.
  - backend/app/main.py: bootstrap de FastAPI y CORS.
- Observación útil:
  - README menciona frontend/.env.example para redefinir VITE_API_BASE_URL, pero ese archivo no está presente en este fork al momento de la revisión.

# Estado actual del proyecto

- Partes que parecen completas:
  - La base de ejecución local con frontend y backend.
  - El flujo mínimo frontend -> backend -> renderizado de KPIs y gráficos.
  - Las utilidades puras del frontend y sus pruebas unitarias.
  - La generación y filtrado básico de movimientos en backend.
- Partes que parecen mockeadas, incompletas o de demo:
  - La fuente de datos del backend es completamente mock y generada en memoria.
  - No hay base de datos, persistencia, autenticación ni configuración por entorno más allá del proxy/base URL.
  - El frontend consume un único endpoint crudo y realiza la agregación en cliente.
  - routes.py contiene modelos y funciones para resúmenes, categorías top, comparaciones y alertas, pero esos endpoints no están implementados en el archivo revisado.
- Riesgos o huecos relevantes:
  - Existe una divergencia fuerte entre backend/tests/test_routes.py y backend/app/routes.py: las pruebas esperan endpoints como /api/metrics/b2b, /api/metrics/facets, /api/metrics/summary, /api/metrics/categories/top, /api/metrics/comparison y /api/metrics/alerts que no aparecen implementados en la versión actual del router.
  - Esto sugiere que el proyecto está en transición, incompleto o desalineado entre código y pruebas.
  - CORS está abierto a cualquier origen, adecuado para demo, pero no para endurecimiento de producción.
  - Hay mezcla de idioma en UI y código: textos en inglés para widgets y mensaje de error en español.

# Mapa de lectura recomendado

- Orden sugerido para entender el repo rápido:
  - README.md
  - AGENTS.md
  - docker-compose.yml
  - frontend/package.json
  - backend/requirements.txt
  - frontend/src/App.tsx
  - backend/app/main.py
  - backend/app/routes.py
  - frontend/src/lib/financial-types.ts
  - frontend/src/lib/financial-utils.ts
  - frontend/src/components/dashboard/
  - backend/tests/test_routes.py
  - frontend/src/lib/financial-utils.test.ts
- Ruta de lectura recomendada para alguien nuevo:
  - Primero entiende cómo se levanta y cuál es el objetivo del proyecto.
  - Luego sigue el flujo runtime real: App.tsx -> /api/metrics -> routes.py.
  - Después revisa cómo se calculan KPIs y series mensuales en financial-utils.ts.
  - Finalmente inspecciona los tests del backend para detectar hacia dónde parece evolucionar la API.

# Conclusión

- Este repositorio es una base full stack pequeña para un dashboard financiero, pensada tanto para visualizar métricas como para servir de ejercicio de análisis técnico y documentación asistida por agentes.
- La parte operativa mínima ya existe: frontend en React, backend en FastAPI, arranque con Docker Compose y un flujo funcional de datos mock.
- La arquitectura actual es simple y fácil de recorrer, con buena separación en frontend entre presentación y utilidades.
- El backend todavía no está maduro como capa analítica completa: genera datos sintéticos y su superficie pública no coincide con todas las pruebas existentes.
- En la práctica, conviene leerlo como un proyecto formativo o de handover, no como una aplicación de negocio cerrada.
- Si vas a extenderlo, el primer foco debería ser decidir si la lógica analítica se consolida en backend o se mantiene parcialmente en frontend, y alinear API, tests y documentación.

# Fuentes revisadas

- Archivos revisados directamente:
  - README.md
  - AGENTS.md
  - docker-compose.yml
  - backend/requirements.txt
  - backend/app/main.py
  - backend/app/routes.py
  - backend/tests/test_routes.py
  - frontend/package.json
  - frontend/vite.config.ts
  - frontend/eslint.config.js
  - frontend/components.json
  - frontend/src/App.tsx
  - frontend/src/lib/financial-types.ts
  - frontend/src/lib/financial-utils.ts
  - frontend/src/lib/financial-utils.test.ts
  - frontend/src/lib/mock-data.ts
  - frontend/src/components/dashboard/kpi-row.tsx
  - frontend/src/components/dashboard/income-outcome-chart.tsx
- Fuentes más importantes para construir este resumen:
  - README.md para propósito, forma de arranque y expectativa pedagógica.
  - backend/app/routes.py para entender la capacidad real actual del backend.
  - frontend/src/App.tsx y frontend/src/lib/financial-utils.ts para el flujo funcional real del frontend.
  - backend/tests/test_routes.py para detectar desalineaciones entre implementación y contrato esperado.
