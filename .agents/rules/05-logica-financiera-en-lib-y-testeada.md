# Regla: Logica financiera en `src/lib` y testeada

## Proposito
Preservar testabilidad y evitar acoplar logica de negocio dentro de componentes React.

## Alcance
- Frontend en `frontend/src`.
- Modulos de dominio en `frontend/src/lib`.
- Tests en `frontend/src/lib/*.test.ts`.

## Regla concreta y verificable
Toda logica de calculo financiero debe implementarse en funciones puras dentro de `src/lib` y tener pruebas unitarias antes de ser usada por componentes.

## Justificacion
Disminuye regresiones de negocio y permite refactor de UI sin romper calculos.

## Ejemplos aplicados al repo
- Cumple: `computeKPIs` y `computeMonthlyData` en `frontend/src/lib/financial-utils.ts`.
- Cumple: pruebas en `frontend/src/lib/financial-utils.test.ts`.
- Uso correcto: `frontend/src/App.tsx` consume funciones de `src/lib`.

## Criterios de validacion
- No hay formula de negocio compleja embebida en componentes.
- Cada nueva funcion de calculo en `src/lib` tiene test asociado.
- Los componentes solo orquestan estado/render y consumen utilidades.

## Anti-patrones
- Calcular KPIs directo en JSX o dentro de componentes de grafico.
- Cambiar formula de negocio sin actualizar tests.
