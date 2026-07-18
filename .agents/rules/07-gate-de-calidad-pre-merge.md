# Regla: Gate de calidad pre-merge

## Proposito
Establecer una verificacion minima antes de merge para evitar regresiones obvias.

## Alcance
- Cambios en frontend y backend.
- Flujo de PR y revisiones de agentes.

## Regla concreta y verificable
Antes de merge, todo cambio debe pasar un gate minimo:
1. Frontend: lint, test y build.
2. Backend: ejecucion de pruebas.
3. Si se cambian contratos API o docs operativas, actualizar pruebas/documentacion relacionadas.

## Justificacion
Preserva estabilidad del flujo actual y alinea calidad entre capas.

## Ejemplos aplicados al repo
- Frontend ya tiene scripts definidos en `frontend/package.json` (`lint`, `test`, `build`).
- Backend ya tiene `pytest` declarado en `backend/requirements.txt`.

## Criterios de validacion
- Evidencia de ejecucion de comandos de calidad en el PR o en CI.
- No se aprueba PR con tests rotos.
- Cambios de contrato API incluyen ajuste de tests.

## Anti-patrones
- Merge sin correr pruebas.
- Ajustar endpoint y omitir actualizacion de tests o docs.
