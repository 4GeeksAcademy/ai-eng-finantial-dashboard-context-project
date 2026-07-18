# Regla: Efectos React con cancelacion en llamadas HTTP

## Proposito
Evitar race conditions y updates de estado fuera de ciclo de vida en UI.

## Alcance
- Componentes React con `useEffect` y llamadas `fetch`.

## Regla concreta y verificable
Cualquier llamada HTTP dentro de `useEffect` debe implementar cancelacion con `AbortController` o guardas equivalentes de montaje/desmontaje.

## Justificacion
Reduce bugs intermitentes cuando el componente se desmonta o cambia rapido de contexto.

## Ejemplos aplicados al repo
- Caso actual a mejorar: carga de datos en `frontend/src/App.tsx` dentro de `useEffect`.

## Criterios de validacion
- Cada efecto asincrono define mecanismo de cancelacion.
- El catch distingue cancelacion de error real cuando sea posible.
- No se actualiza estado si la solicitud fue abortada.

## Anti-patrones
- `fetch` en `useEffect` sin `AbortController`.
- Actualizar estado en promesa resuelta despues de desmontar.
