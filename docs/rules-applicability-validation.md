# Validacion de aplicabilidad de reglas

## Objetivo
Verificar que las reglas en `.agents/rules` guien tareas reales del repositorio y no sean teoricas.

## Reglas validadas y evidencia

### 1) Fullstack inspection at task start
- Regla fuente: `.agents/rules/fullstack-workflow.md`
- Evidencia: se inspeccionaron backend (`backend/app/routes.py`) y frontend (`frontend/src/App.tsx`) antes de definir verificaciones.
- Resultado: aplicable.

### 2) Validaciones minimas antes de cerrar cambios
- Regla fuente: `.agents/rules/fullstack-workflow.md`
- Evidencia ejecutada:
  - `cd backend && pytest -q` -> 15 passed.
  - `cd frontend && npm test` -> 5 passed.
  - `cd frontend && npm run lint` -> passing.
- Resultado: aplicable.

### 3) Preservar contratos API/frontend
- Regla fuente: `.agents/rules/change-safety.md`
- Evidencia: al validar endpoints avanzados se ajusto el check a contratos reales (`current_period`, `previous_period`, `delta_abs`, `delta_pct`) definidos en backend.
- Resultado: aplicable.

### 4) Orden cronologico determinista
- Regla fuente: `.agents/rules/change-safety.md` y `.agents/rules/fullstack-workflow.md`
- Evidencia: funciones de orden y agregacion en backend usan orden por fecha y las verificaciones funcionales incluyeron consistencia temporal para series.
- Resultado: aplicable.

### 5) Regla refinada por evidencia real
- Regla fuente: `.agents/rules/fullstack-workflow.md`
- Ajuste realizado: comando de tests frontend actualizado de `npm test -- --runInBand` a `npm test` para coincidir con Vitest del repo.
- Resultado: aplicable tras refinamiento.

## Conclusion
Las reglas actuales son utilizables en el flujo real del proyecto y ya cuentan con evidencia de ejecucion. Se recomienda mantener una revision ligera de comandos al cambiar tooling.
