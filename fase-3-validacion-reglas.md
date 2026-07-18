# Fase 3 - Validacion de reglas implementadas

## Reglas creadas

1. `.agents/rules/01-endpoint-response-model-y-contrato.md`
2. `.agents/rules/02-evitar-duplicacion-de-filtros-dominio.md`
3. `.agents/rules/03-cors-por-entorno.md`
4. `.agents/rules/04-documentacion-sin-referencias-rotas.md`
5. `.agents/rules/05-logica-financiera-en-lib-y-testeada.md`
6. `.agents/rules/06-efectos-react-con-cancelacion.md`
7. `.agents/rules/07-gate-de-calidad-pre-merge.md`

## Mapeo regla -> hallazgo de Fase 2 -> estado de calidad

1. `01-endpoint-response-model-y-contrato`
- Cubre hallazgos: regla propuesta 1 de Fase 2 (contratos de endpoint y tests de contrato).
- Evidencia base: `backend/app/routes.py`, `backend/tests/test_routes.py`.
- Estado: clara.

2. `02-evitar-duplicacion-de-filtros-dominio`
- Cubre hallazgos: riesgo 3 de Fase 2 (duplicacion de filtros y regeneracion de datos).
- Evidencia base: repeticion de filtros por `business_type` en `backend/app/routes.py`.
- Estado: clara.

3. `03-cors-por-entorno`
- Cubre hallazgos: riesgo 1 de Fase 2 (CORS abierto).
- Evidencia base: `backend/app/main.py` con `allow_origins=["*"]`.
- Estado: clara.

4. `04-documentacion-sin-referencias-rotas`
- Cubre hallazgos: riesgos 5 y 6 de Fase 2 (referencias documentales a artefactos no presentes).
- Evidencia base: `README.md`, `AGENTS.md`.
- Estado: clara.

5. `05-logica-financiera-en-lib-y-testeada`
- Cubre hallazgos: buena practica 3 y regla propuesta 5 de Fase 2.
- Evidencia base: `frontend/src/lib/financial-utils.ts`, `frontend/src/lib/financial-utils.test.ts`.
- Estado: clara.

6. `06-efectos-react-con-cancelacion`
- Cubre hallazgos: riesgo 4 de Fase 2 (fetch sin cancelacion en React).
- Evidencia base: `frontend/src/App.tsx`.
- Estado: clara.

7. `07-gate-de-calidad-pre-merge`
- Cubre hallazgos: regla propuesta 7 de Fase 2 (gate minimo de calidad).
- Evidencia base: scripts de `frontend/package.json` y tests backend via `pytest`.
- Estado: requiere refinamiento.
- Motivo: aun no existe comando unico documentado ni pipeline CI versionado en este repo.
- Cierre propuesto: agregar comando estandar en README y/o workflow CI para ejecutar gate automaticamente.

## Validacion de aplicabilidad en tareas reales

- Las reglas 01, 02 y 03 guian directamente cambios backend sobre endpoints, filtros y seguridad.
- Las reglas 05 y 06 guian tareas frontend sobre calculo de metricas y llamadas de red.
- La regla 04 guIa tareas de mantenimiento documental y onboarding.
- La regla 07 guIa revisiones de PR y reduce merges con calidad incompleta.

## Ajustes aplicados para mejorar precision y aplicabilidad

1. Se elimino lenguaje abstracto y se exigieron criterios verificables por archivo/test/comando.
2. Se separo una regla por archivo para facilitar adopcion incremental.
3. Se priorizo primero impacto alto (contrato API, duplicacion, CORS).
4. Se incluyeron anti-patrones para evitar interpretaciones ambiguas.
5. Se marco explicitamente la unica regla que aun requiere refinamiento (gate pre-merge) y como cerrarla.
