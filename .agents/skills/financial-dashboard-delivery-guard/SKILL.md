---
name: financial-dashboard-delivery-guard
description: Reglas del proyecto para cambios en dashboard financiero: fetch cancelable, estados vacios/error visibles, contratos API trazables y logica financiera en src/lib con tests.
license: MIT
metadata:
  author: ai-eng-dashboard
  version: "1.0.0"
---

# Financial Dashboard Delivery Guard

## Objetivo
Asegurar que cualquier cambio en el dashboard financiero preserve robustez de UX, contrato de datos y mantenibilidad sin regressiones silenciosas.

## Inputs esperados
- Cambios en frontend React/TypeScript bajo `frontend/src`.
- Cambios en endpoints o contratos de datos de metricas.
- Nuevos componentes KPI, tablas o graficos.

## Output esperado
- UI con estados `loading`, `error` y `empty` explicitos por seccion.
- Llamadas HTTP en `useEffect` con cancelacion (`AbortController`).
- Elementos visuales criticos con semantica accesible (landmarks, etiquetas y feedback para lectores).
- Logica financiera en funciones puras dentro de `frontend/src/lib`.
- Evidencia de validacion (lint, tests y build) antes de merge.

## Criterios de aceptacion
1. Si hay `fetch` en `useEffect`, existe cleanup que aborta solicitud y no actualiza estado tras abortar.
2. Ningun componente nuevo calcula formulas financieras complejas inline en JSX; se mueve a `frontend/src/lib`.
3. Cada visualizacion de datos maneja vacio y error sin ocultar el modulo completo.
4. Si cambia contrato API, se actualizan tipos en `frontend/specs` y pruebas relacionadas.
5. El cambio pasa `npm run lint`, `npm run test` y `npm run build` en `frontend`.

## Checklist rapido
- [ ] Cancelacion en efectos asincronos
- [ ] Estados vacio/error por modulo
- [ ] Semantica accesible minima
- [ ] Tipos/contratos sincronizados
- [ ] Gate de calidad en verde
