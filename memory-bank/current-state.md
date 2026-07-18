# Estado actual del proyecto

## Features implementadas
- Backend:
  - Endpoint de salud.
  - Endpoint base de metricas con filtros por fecha, categoria y tipo de operacion.
  - Endpoints analiticos: facets, summary, top categories, comparison y alerts.
  - Endpoints segmentados por tipo de negocio: B2B y B2C.
- Frontend:
  - Carga de datos desde /api/metrics.
  - Render de KPIs y graficos de income vs outcome y profit percent.
  - Manejo basico de estados loading/error.
- Calidad:
  - Pruebas unitarias de utilidades financieras en frontend.
  - Pruebas de endpoints y filtros en backend.
- Gobernanza de agentes:
  - Reglas versionadas en .agents/rules (fase 3 completada).

## Gaps conocidos
- Producto/datos:
  - Fuente de datos mock en memoria; no hay persistencia real.
  - No hay autenticacion/autorizacion.
- Seguridad/configuracion:
  - CORS abierto a cualquier origen en backend.
- Frontend robustez:
  - Fetch en App sin cancelacion explicita (AbortController).
- Documentacion/drift:
  - README referencia frontend/.env.example no existente.
  - AGENTS pide .agents/skills, pero ese directorio no existe actualmente.
- Proceso de calidad:
  - Existe regla de gate pre-merge, pero aun sin comando unico documentado en README ni CI automatizado en el repo.

## Prioridades siguientes (recomendadas)

### Alta prioridad
- Endurecer CORS por entorno y documentar configuracion.
- Definir y documentar gate de calidad pre-merge ejecutable.
- Corregir drift documental (crear frontend/.env.example o ajustar README).

### Prioridad media
- Extraer logica repetida de filtros backend a puntos reutilizables.
- Añadir cancelacion de fetch en frontend para evitar race conditions.
- Crear .agents/skills inicial para cumplir AGENTS y mejorar operatividad.

### Prioridad estructural
- Introducir capa de persistencia y separar rutas/servicios/acceso a datos.
- Revisar si agregaciones deben vivir en backend vs frontend para consolidar contrato de API.

## Ambiguedades explicitas
- El repositorio contiene base suficiente para demo y aprendizaje, pero no define aun roadmap oficial de producto.
- No hay evidencia en este estado de una pipeline CI declarada en archivos del repo.

## Fuentes
- backend/app/main.py
- backend/app/routes.py
- backend/tests/test_routes.py
- frontend/src/App.tsx
- frontend/src/lib/financial-utils.ts
- frontend/src/lib/financial-utils.test.ts
- README.md
- AGENTS.md
- .agents/rules/07-gate-de-calidad-pre-merge.md
- fase-2-practicas.md
- fase-3-validacion-reglas.md
