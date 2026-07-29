# Contrato de datos del frontend

Este documento define los contratos de peticion/respuesta para las 3 funcionalidades pedidas en `frontend/specs/frontend_spec.md`.

Verificacion de endpoints: las rutas y restricciones aqui listadas se contrastaron contra el esquema OpenAPI expuesto por FastAPI (fuente de `/docs`).

## Funcionalidad 1: Filtro de rango de fechas en dashboard principal

### Endpoints consumidos

- `GET /api/metrics/facets`
- `GET /api/metrics`
- `GET /api/metrics/summary`
- `GET /api/metrics/categories/top` (si hay visuales de top categorias en la misma pantalla)
- `GET /api/metrics/alerts` (si la tabla de alertas se muestra en la misma pantalla)

### Tipos TypeScript

- Respuesta de facetas: `FacetsResponse` en `frontend/specs/api-types.ts`
- Filtro compartido de fechas: `DateRangeFilter` en `frontend/specs/param-types.ts`

### Parametros validos y restricciones

- `start_date` (opcional): `string` en formato `YYYY-MM-DD`.
- `end_date` (opcional): `string` en formato `YYYY-MM-DD`.
- Ambos filtros son inclusivos cuando se envian.
- Si ambos faltan, la UI debe solicitar datos completos (sin filtro de fecha).

### Edge cases y comportamiento UI

- Caso edge 1: `start_date` > `end_date`.
- UI esperada: bloquear envio o corregir antes de llamar API; mostrar mensaje de validacion de rango invalido.

- Caso edge 2: rango fuera de `min_date`/`max_date` de facetas.
- UI esperada: clamp o advertencia visible; mantener referencia de rango valido junto a inputs.

- Caso edge 3: facetas no disponibles por error de red.
- UI esperada: inputs siguen operativos, pero la referencia de rango muestra estado de error/reintento.

## Funcionalidad 2: Tabla de alertas de anomalias

### Endpoints consumidos

- `GET /api/metrics/alerts`

### Tipos TypeScript

- Respuesta de alertas: `AlertEntry`, `AlertsResponse` en `frontend/specs/api-types.ts`
- Parametros de consulta: `AlertsParams` en `frontend/specs/param-types.ts`

### Parametros validos y restricciones

- `threshold` (opcional): `number`.
- Restriccion de API en `/docs`: `threshold >= 0`, default `0.3`.
- Restriccion funcional/UI solicitada: rango recomendado `0.01` a `1.0`.
- `start_date` y `end_date` (opcionales): de `DateRangeFilter`, formato `YYYY-MM-DD`.

### Edge cases y comportamiento UI

- Caso edge 1: no hay alertas para el threshold actual.
- UI esperada: tabla visible con estado vacio explicito (mensaje), nunca desaparecer silenciosamente.

- Caso edge 2: usuario intenta threshold fuera del rango UI (ej: 0 o 1.5).
- UI esperada: clamp al rango permitido o validacion inline antes del fetch.

- Caso edge 3: rango de fechas muy corto (sin historial suficiente para baseline).
- UI esperada: estado vacio explicando que no hubo datos comparables para detectar anomalias.

## Funcionalidad 3: Vista comparativa B2B vs B2C

### Endpoints consumidos

- `GET /api/metrics/categories/top`
- `GET /api/metrics/facets`

Notas de uso para esta vista:

- Se recomienda llamar `/api/metrics/categories/top` dos veces en paralelo, con `business_type=B2B` y `business_type=B2C`.
- Para cumplir la funcionalidad, fijar `operation_type=income` y `limit=5`.

### Tipos TypeScript

- Respuesta de top categorias: `CategoryEntry`, `TopCategoriesResponse` en `frontend/specs/api-types.ts`
- Parametros de consulta: `TopCategoriesParams` en `frontend/specs/param-types.ts`
- Referencia de rango/categorias disponibles: `FacetsResponse` en `frontend/specs/api-types.ts`

### Parametros validos y restricciones

- `operation_type` (opcional): `'income' | 'outcome'` segun `/docs`; para comparativa usar `'income'`.
- `limit` (opcional): entero entre `1` y `20` segun `/docs`; para comparativa usar `5`.
- `start_date` y `end_date` (opcionales): de `DateRangeFilter`, formato `YYYY-MM-DD`.
- `business_type` (adicional para esta vista): `'B2B' | 'B2C'` (validado en `/docs`).

### Edge cases y comportamiento UI

- Caso edge 1: una linea de negocio no retorna categorias en el rango filtrado.
- UI esperada: panel de esa linea muestra estado vacio, el otro panel y el grafico siguen renderizando con los datos disponibles.

- Caso edge 2: empate de montos o menos de 5 categorias disponibles.
- UI esperada: mostrar las categorias retornadas sin forzar filas ficticias; el porcentaje debe recalcularse solo con el total real del grupo.

- Caso edge 3: total del grupo igual a 0 (evitar division por cero en porcentaje).
- UI esperada: porcentaje mostrado como `0%` o `N/A` de forma consistente y explicita.

## Mapeo rapido: tipos por endpoint

- `GET /api/metrics/facets`
- Response: `FacetsResponse`
- Params: sin query params.

- `GET /api/metrics/alerts`
- Response: `AlertsResponse`
- Params: `AlertsParams`

- `GET /api/metrics/categories/top`
- Response: `TopCategoriesResponse`
- Params: `TopCategoriesParams` (+ `business_type` cuando se compare B2B/B2C)
