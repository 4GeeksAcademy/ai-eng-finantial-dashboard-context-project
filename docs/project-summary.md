# Resumen del proyecto - Financial Metrics Dashboard

## 1. Objetivo y alcance
Dashboard de metricas financieras basado en datos simulados.
No existe persistencia real ni base de datos en el estado actual del proyecto.

## 2. Arquitectura actual
- Backend: FastAPI con modelos Pydantic y endpoints de metricas.
- Frontend: React 19 + TypeScript con Vite.
- Integracion: el frontend consume API REST del backend.

## 3. Flujo real de datos
- La aplicacion frontend realiza un fetch principal a `GET /api/metrics` desde `frontend/src/App.tsx`.
- Los KPIs y la agregacion mensual se calculan en cliente en `frontend/src/lib/financial-utils.ts`.
- El backend expone endpoints de agregacion y analitica en `backend/app/routes.py`, pero actualmente no son consumidos por la UI principal.

## 4. Contratos y tipado
- Existe duplicacion manual de contratos entre:
  1. Modelos backend en `backend/app/routes.py`.
  2. Tipos frontend en `frontend/src/lib/financial-types.ts`.
- Actualmente no hay generacion automatica de tipos desde OpenAPI, por lo que hay riesgo de drift entre backend y frontend.

## 5. Generacion de datos mock
- El backend no usa base de datos: genera datos por request con semilla fija `seed=42` en `backend/app/routes.py`.
- Se generan 360 movimientos por ejecucion (12 meses x 30 movimientos).
- El anio de los datos depende de la fecha actual mediante `_year_for_month` en `backend/app/routes.py`.

## 6. Hallazgos relevantes con evidencia
1. Codigo muerto potencial en mock-data:
- `frontend/src/lib/mock-data.ts` contiene datos mock, pero no se observa consumo desde la app principal.
- Recomendacion de verificacion: buscar imports de `mock-data` o uso de `mockMovements` fuera del propio archivo para confirmar eliminacion segura.

2. Inconsistencia de periodo mostrado en UI:
- El header usa periodo hardcodeado en `frontend/src/App.tsx` con valor `2024 - Full Year`.
- Los datos backend usan anio dinamico segun fecha actual en `backend/app/routes.py`.

3. Fragilidad potencial en test de comparison:
- `backend/tests/test_routes.py` usa rango fijo `2025-03-01` a `2025-03-31`.
- Al depender de datos generados dinamicamente por fecha actual, ese acoplamiento temporal puede romperse en el futuro.

4. CORS abierto en backend:
- `backend/app/main.py` permite cualquier origen con `allow_origins=["*"]`.
- Adecuado para desarrollo, riesgoso para produccion sin restriccion por entorno.

## 7. Stack tecnico
- Backend: FastAPI, Pydantic, pytest, Docker.
- Frontend: React 19, TypeScript, Vite, Tailwind CSS v4, Recharts, Vitest, ESLint.
- Utilidades UI: class-variance-authority, clsx, tailwind-merge.

## 8. Prioridades recomendadas
1. Corregir periodo hardcodeado en frontend para derivarlo de datos reales.
2. Definir estrategia de contratos tipados compartidos (OpenAPI -> TS).
3. Revisar y eliminar mock-data no utilizado si se confirma codigo muerto.
4. Parametrizar CORS por entorno (dev, staging, prod).
5. Hacer robusto el test de comparison para evitar dependencia temporal rigida.
