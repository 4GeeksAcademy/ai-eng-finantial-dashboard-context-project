# Especificaciones Frontend

Documentacion de contrato de datos para las tres funcionalidades solicitadas.
Validado contra la documentacion viva del backend en /docs y /openapi.json.

## Entregables en esta carpeta
1. 01-dashboard-date-range-filter.md
2. 02-anomaly-alerts-table.md
3. 03-b2b-vs-b2c-comparison-view.md
4. api-types.ts
5. param-types.ts
6. components.md
7. query-helpers.ts
8. api-client.ts

## Funcionalidad 1: Filtro de rango de fechas en dashboard principal

### Endpoints consumidos
1. GET /api/metrics/facets
Uso: obtener min_date y max_date para referencia de rango valido.
2. GET /api/metrics
Uso: obtener dataset principal filtrado por fechas opcionales.

### Tipos TypeScript usados
Request:
1. DateRangeFilter de param-types.ts
Response:
1. FacetsResponse de api-types.ts para facets
2. FinancialMovement de src/lib/financial-types.ts para metrics

### Parametros validos y restricciones
GET /api/metrics/facets
1. No recibe parametros.

GET /api/metrics
1. start_date: opcional, formato YYYY-MM-DD.
2. end_date: opcional, formato YYYY-MM-DD.
3. category: opcional, suppliers | sales | operational | administrative | others.
4. operation_type: opcional, income | outcome.

Reglas de UI para fechas:
1. Ambos campos son opcionales.
2. Si start_date es mayor que end_date, no se dispara request y se muestra validacion inline.

### Edge cases y respuesta esperada de UI
1. Facets falla y metrics funciona.
UI: mantener dashboard operativo y mostrar mensaje de referencia no disponible para rango.
2. Fecha invalida por formato enviada manualmente y API responde 422.
UI: prevenir desde input date; si llega 422, mostrar error no bloqueante y preservar pantalla.
3. Usuario limpia ambas fechas.
UI: recargar dataset completo sin filtros de fecha.

## Funcionalidad 2: Tabla de alertas de anomalias

### Endpoints consumidos
1. GET /api/metrics/alerts
Uso: obtener anomalias de outcome por periodo.

### Tipos TypeScript usados
Request:
1. AlertsParams de param-types.ts
2. DateRangeFilter de param-types.ts
Response:
1. AlertEntry de api-types.ts
2. AlertsResponse de api-types.ts

### Parametros validos y restricciones
GET /api/metrics/alerts
1. threshold: opcional en API, number, default 0.3, minimo 0.
2. group_by: opcional en API, day | week | month, default month.
3. start_date: opcional, formato YYYY-MM-DD.
4. end_date: opcional, formato YYYY-MM-DD.
5. business_type: opcional, B2B | B2C.

Reglas de UI para threshold:
1. Valor inicial 0.3.
2. Rango de producto recomendado 0.01 a 1.0.
3. Mantener manejo robusto ante 422 aunque se valide en cliente.

### Edge cases y respuesta esperada de UI
1. API responde arreglo vacio.
UI: mostrar estado vacio explicito, no ocultar el modulo.
2. threshold menor que 0 y API responde 422.
UI: mensaje de validacion y mantener visible el resto del dashboard.
3. Error de red o 5xx.
UI: mensaje de error local del modulo y accion de reintento.

## Funcionalidad 3: Vista comparativa B2B vs B2C

### Endpoints consumidos
1. GET /api/metrics/categories/top
Uso: top categorias por grupo para tablas comparativas.
2. GET /api/metrics/facets
Uso: rango disponible de fechas y categorias validas.

### Tipos TypeScript usados
Request:
1. TopCategoriesParams de param-types.ts
2. DateRangeFilter de param-types.ts
Response:
1. CategoryEntry de api-types.ts
2. TopCategoriesResponse de api-types.ts
3. FacetsResponse de api-types.ts

### Parametros validos y restricciones
GET /api/metrics/categories/top
1. operation_type: opcional en API, income | outcome, default outcome.
2. limit: opcional en API, integer, default 5, minimo 1, maximo 20.
3. start_date: opcional, formato YYYY-MM-DD.
4. end_date: opcional, formato YYYY-MM-DD.
5. business_type: opcional, B2B | B2C.

Reglas funcionales para esta vista:
1. Tablas: operation_type=income, limit=5, business_type=B2B o B2C.
2. Total comparativo: usar limit=20 por grupo para evitar truncamiento de top 5.
3. Si start_date es mayor que end_date, no se dispara request.

### Edge cases y respuesta esperada de UI
1. Un grupo devuelve arreglo vacio y el otro no.
UI: mostrar estado vacio solo en el bloque afectado; mantener el otro bloque con datos.
2. Ambos grupos devuelven arreglo vacio.
UI: mostrar estados vacios en ambas tablas y en grafico total comparativo.
3. limit fuera de rango.
UI: prevenir en cliente; si ocurre, manejar 422 con mensaje no bloqueante.

## Regla de mantenimiento de contrato
1. Cualquier cambio de endpoint, enum o formato en backend requiere actualizar este README y los tipos de api-types.ts y param-types.ts dentro del mismo trabajo.
2. Esta carpeta especifica frontend; no es una implementacion de componentes React ni de infraestructura de llamadas en runtime.

## Matriz de trazabilidad

| Funcionalidad | Endpoint | Tipo Request | Tipo Response | Componentes |
| --- | --- | --- | --- | --- |
| Filtro de rango de fechas | GET /api/metrics/facets | Sin parametros | FacetsResponse | DashboardDateRangeFilter, DashboardDateRangeHint, DashboardFiltersBar |
| Filtro de rango de fechas | GET /api/metrics | DateRangeFilter | FinancialMovement[] | DashboardDateRangeFilter, DashboardFiltersBar |
| Tabla de alertas de anomalias | GET /api/metrics/alerts | AlertsParams (+ DateRangeFilter) | AlertsResponse (AlertEntry[]) | AlertsThresholdInput, AlertsTable, AlertsSection |
| Vista comparativa B2B vs B2C | GET /api/metrics/categories/top | TopCategoriesParams (+ DateRangeFilter) | TopCategoriesResponse (CategoryEntry[]) | BusinessTopCategoriesTable, B2BVsB2CTotalChart, B2BVsB2CComparisonPage |
| Vista comparativa B2B vs B2C | GET /api/metrics/facets | Sin parametros | FacetsResponse | ComparisonDateRangeFilter, B2BVsB2CComparisonPage |

Notas de lectura:
1. En la funcionalidad comparativa, operation_type se fija en income y business_type alterna entre B2B y B2C.
2. Para total comparativo completo por grupo se usa limit=20, aunque las tablas visibles usan limit=5.