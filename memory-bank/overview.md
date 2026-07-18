# Overview del producto

## Que es este proyecto
- Dashboard de metricas financieras con arquitectura full stack.
- Frontend en React + TypeScript y backend en FastAPI.
- Enfocado en visualizacion y exploracion de ingresos, egresos, neto y alertas.

## Objetivo funcional actual
- Exponer datos financieros via API y mostrarlos en una UI con KPIs y graficos.
- Habilitar ejercicios de handover tecnico y trabajo asistido por agentes.

## Flujo principal
- El frontend solicita datos a rutas bajo /api.
- Vite hace proxy de /api hacia el servicio backend.
- El backend genera movimientos mock con semilla fija y aplica filtros/agregaciones.
- El frontend transforma la respuesta para KPIs y series mensuales.

## Componentes centrales
- Backend:
  - Enrutador principal de metricas y endpoints de resumen/comparacion/alertas.
  - Generacion de datos mock y helpers de filtrado.
- Frontend:
  - Orquestacion de carga en App.
  - Modulos de calculo financiero en src/lib.
  - Componentes de dashboard para KPIs y charts.

## Alcance actual y limites
- Estado actual orientado a demo/entrenamiento: no hay persistencia en BD ni autenticacion.
- API funcional con endpoints de salud, metricas base, facets, summary, top categories, comparison, alerts, B2B y B2C.
- Existe mezcla de idioma en UI/codigo (mensajes en espanol y etiquetas en ingles).

## Ambiguedades o faltantes conocidos
- README referencia frontend/.env.example, pero no existe en el repo.
- AGENTS exige .agents/skills y memory-bank; actualmente .agents/skills no existe.

## Fuentes
- README.md
- AGENTS.md
- docker-compose.yml
- backend/app/main.py
- backend/app/routes.py
- frontend/src/App.tsx
- frontend/src/lib/financial-utils.ts
- fase-2-practicas.md
- fase-3-validacion-reglas.md
