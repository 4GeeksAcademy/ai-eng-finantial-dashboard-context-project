# Regla: Evitar duplicacion de filtros y transformaciones

## Proposito
Reducir deuda tecnica en backend y mantener consistencia funcional entre endpoints.

## Alcance
- Logica de negocio y endpoints en `backend/app/routes.py`.
- Futuras capas de servicio si se extrae logica.

## Regla concreta y verificable
Si una logica de filtro o transformacion aparece por segunda vez, debe extraerse a helper reutilizable en el mismo modulo o en una capa de servicio.

## Justificacion
Mitiga divergencias entre endpoints y baja el costo de mantenimiento.

## Ejemplos aplicados al repo
- Base reutilizable existente: `filter_movements`, `filter_movements_by_date`, `ensure_chronological_order`.
- Zona a vigilar: filtros por `business_type` repetidos en varios endpoints (`summary`, `top`, `comparison`, `alerts`, `b2b`, `b2c`).

## Criterios de validacion
- No hay bloques duplicados de 3 o mas lineas con la misma intencion de filtrado.
- Se reutilizan helpers para filtros comunes.
- Cuando se agrega un nuevo filtro global, se cambia en un solo punto reutilizable.

## Anti-patrones
- Copiar/pegar comprensiones de listas de filtros en cada endpoint.
- Recalcular la misma transformacion en varios handlers en vez de reutilizar helper.
