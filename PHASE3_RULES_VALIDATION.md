# Fase 3 - Validacion de reglas del repositorio

## Objetivo

Verificar que las reglas definidas en [./.agents/rules](./.agents/rules) no sean genericas ni decorativas, sino aplicables a tareas reales de este repositorio.

## Validacion por regla

### backend-architecture.md

- Aplica directamente porque [backend/app/routes.py](backend/app/routes.py) concentra handlers, generacion de mocks, agregaciones y alertas.
- Puede guiar tareas concretas como extraer proveedores de datos o mover calculos de resumen y comparacion a modulos de dominio.
- No es abstracta: apunta a un archivo existente y a un problema visible hoy.

### contract-alignment.md

- Aplica porque el contrato vive duplicado entre [backend/app/routes.py](backend/app/routes.py) y [frontend/src/lib/financial-types.ts](frontend/src/lib/financial-types.ts).
- Puede guiar tareas concretas como agregar un campo nuevo a `FinancialMovement` o cambiar enums de categorias sin romper el dashboard.
- No esta desconectada del flujo real: ataca un riesgo activo de drift entre capas.

### ui-and-data-consistency.md

- Aplica porque el dashboard ya expone labels, periodos y mensajes vacios en componentes concretos.
- Puede guiar tareas concretas como corregir el periodo hardcodeado en [frontend/src/components/dashboard/dashboard-header.tsx](frontend/src/components/dashboard/dashboard-header.tsx) o unificar idioma en la UI.
- No es ambigua: obliga a alinear texto visible con datos y calculos reales.

### testing-and-local-dx.md

- Aplica porque el repo ya tiene suites reales en backend y frontend, y ademas surgio un problema real con [frontend/tsconfig.app.json](frontend/tsconfig.app.json) por dependencias locales y permisos.
- Puede guiar tareas concretas como ampliar cobertura de casos borde o documentar restauracion local de `vite/client`.
- No es generica: nace de fricciones y patrones ya observados en este proyecto.

## Refinamiento realizado

- La regla inicial unica de ingenieria se dividio en reglas pequenas y enfocadas.
- Cada regla ahora tiene `Scope`, `Why`, `Rules` y `Repo anchors`.
- Se preservo un archivo indice en [./.agents/rules/engineering-practices.md](./.agents/rules/engineering-practices.md) para facilitar descubrimiento.

## Resultado

El directorio [./.agents/rules](./.agents/rules) ya existe, contiene reglas accionables y cada una fue validada contra superficies reales del repo.