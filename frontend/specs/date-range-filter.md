# Especificacion: filtro por rango de fechas

## Objetivo
Permitir al equipo de finanzas filtrar el dashboard por fecha de inicio y fecha de fin sin romper el flujo actual.

## Reglas funcionales
- Existen dos filtros opcionales:
  - Fecha de inicio
  - Fecha de fin
- Si ambos filtros estan vacios, se solicita el historico completo (`GET /api/metrics`).
- Si uno o ambos filtros tienen valor valido, se envian como query params en formato `YYYY-MM-DD`:
  - `start_date`
  - `end_date`
- El rango disponible se obtiene desde `GET /api/metrics/facets` y se muestra cerca de los filtros.

## Reglas de validacion
- Solo se aceptan fechas ISO `YYYY-MM-DD`.
- Si `start_date > end_date`, no se aplica el filtro y se muestra mensaje de error.
- No se envian parametros invalidos al backend.

## UX
- Los controles se muestran en la parte superior del dashboard.
- Se preserva el estilo visual existente.
- Se mantiene manejo consistente de loading y error.
- Las solicitudes usan cancelacion para evitar estados inconsistentes por race conditions.

## Contratos API usados
- `GET /api/metrics`
  - Query opcional: `start_date`, `end_date`
- `GET /api/metrics/facets`
  - Campos usados: `min_date`, `max_date`

## Alcance
- Incluido: filtros de fecha para la vista principal del dashboard.
- Excluido: cambios de backend, cambios de contratos API, nuevos filtros por categoria/negocio en esta tarea.
