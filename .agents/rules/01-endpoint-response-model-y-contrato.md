# Regla: Endpoint con response_model y test de contrato

## Proposito
Garantizar que cada endpoint HTTP tenga un contrato explicito y verificable para evitar regresiones silenciosas.

## Alcance
- Backend FastAPI en `backend/app`.
- Tests de API en `backend/tests`.

## Regla concreta y verificable
Toda ruta nueva o modificada en FastAPI debe cumplir ambas condiciones:
1. Declarar `response_model` en el decorador de ruta.
2. Tener al menos una prueba de contrato que valide `status_code`, estructura de respuesta y un caso de borde.

## Justificacion
Mitiga salidas inconsistentes y cambios de contrato no detectados por tests.

## Ejemplos aplicados al repo
- Cumple: `backend/app/routes.py` usa `response_model` en `/api/metrics`, `/api/metrics/facets`, `/api/metrics/summary`.
- Cumple: `backend/tests/test_routes.py` valida forma de salida en pruebas de `summary`, `comparison` y `alerts`.

## Criterios de validacion
- Existe `response_model=` en la firma de cada endpoint nuevo.
- Existe prueba asociada en `backend/tests` que verifique shape y no solo `200`.
- Si el endpoint acepta query params, el test incluye al menos una combinacion de filtros.

## Anti-patrones
- Endpoint sin `response_model`.
- Test que solo valida `status_code == 200`.
- Agregar endpoint sin actualizar pruebas.
