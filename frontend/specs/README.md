# Especificación del contrato de datos (frontend)

Este documento define los contratos TypeScript y reglas de uso para tres funcionalidades del dashboard financiero, alineados con el backend FastAPI actual.

## 1) Filtro de rango de fechas en dashboard principal

### Endpoints consumidos
- `GET /api/metrics/facets`
- Endpoints afectados por el filtro compartido:
  - `GET /api/metrics/alerts`
  - `GET /api/metrics/categories/top`
  - `GET /api/metrics/summary` (complementario en comparativa)

### Tipos TypeScript involucrados
- Respuesta:
  - `FacetsResponse`
- Parámetros:
  - `DateRangeFilter`
  - `AlertsParams` (hereda `DateRangeFilter`)
  - `TopCategoriesParams` (hereda `DateRangeFilter`)
  - `SummaryParams` (hereda `DateRangeFilter`)

### Restricciones y valores válidos
- `DateRangeFilter.start_date?` y `DateRangeFilter.end_date?`: formato `YYYY-MM-DD`.
- Ambos parámetros son opcionales en los endpoints listados.
- El rango válido para la UI se acota con `FacetsResponse.min_date` y `FacetsResponse.max_date`.

### Edge cases y comportamiento UI esperado
1. Usuario selecciona `start_date` mayor que `end_date`.
- UI: bloquear acción de aplicar filtro y mostrar validación inmediata.
2. Usuario completa solo `start_date` o solo `end_date`.
- UI: enviar consulta con el único extremo definido y mantener el otro sin filtrar.
3. Usuario deja ambos campos vacíos.
- UI: enviar consulta sin fechas y mostrar datos globales (sin filtro temporal).
4. Fecha fuera de `min_date/max_date`.
- UI: impedir envío y mostrar mensaje de rango permitido.

## 2) Tabla de alertas de anomalías

### Endpoints consumidos
- `GET /api/metrics/alerts`

### Tipos TypeScript involucrados
- Respuesta:
  - `AlertEntry`
  - `AlertsResponse`
- Parámetros:
  - `AlertsParams`

### Restricciones y valores válidos
- `threshold?`: número con restricción backend `>= 0` (default backend `0.3`).
- `group_by?`: `day | week | month` (default backend `month`).
- `business_type?`: `B2B | B2C`.
- `start_date?`, `end_date?`: opcionales, formato `YYYY-MM-DD`.

### Edge cases y comportamiento UI esperado
1. Respuesta vacía (`[]`) para filtros activos.
- UI: mostrar tabla con estado vacío explícito "No se detectaron anomalías" (sin ocultar el componente).
2. Usuario ingresa `threshold < 0`.
- UI: bloquear envío y mostrar error de validación local alineado con restricción backend.
3. Error de red o backend.
- UI: mostrar estado de error persistente con opción de reintento.

## 3) Vista comparativa B2B vs B2C

### Endpoints consumidos
- Principal para top categorías:
  - `GET /api/metrics/categories/top`
- Complementarios reales para total comparado por grupo:
  - `GET /api/metrics/summary` (recomendado para total por rango y `business_type`)
  - `GET /api/metrics/comparison` (opcional si también se desea variación vs periodo previo)

### Tipos TypeScript involucrados
- Respuesta:
  - `CategoryEntry`
  - `TopCategoriesResponse`
  - `SummaryEntry`
  - `SummaryResponse`
  - `ComparisonResponse`
- Parámetros:
  - `TopCategoriesParams`
  - `SummaryParams`
  - `ComparisonParams`
  - `DateRangeFilter`

### Restricciones y valores válidos
- `TopCategoriesParams.operation_type?`: `income | outcome` (default backend `outcome`).
- `TopCategoriesParams.limit?`: entero `1..20` (default backend `5`).
- `TopCategoriesParams.business_type?`: `B2B | B2C`.
- `SummaryParams.group_by?`: `day | week | month`.
- `ComparisonParams.start_date` y `ComparisonParams.end_date` son requeridos.
- Todas las fechas en query: `YYYY-MM-DD`.

### Edge cases y comportamiento UI esperado
1. Un panel (B2B o B2C) falla y el otro responde bien.
- UI: mantener ambos paneles visibles, con error parcial en panel afectado y datos en el otro.
2. La lista top-5 de B2B o de B2C llega vacía (`[]`).
- UI: mantener visible el panel afectado y renderizar estado vacío explícito "Sin categorías para el rango actual".
3. Total del grupo = 0 al calcular porcentajes por categoría.
- UI: mostrar `0%` para evitar división por cero y mantener tabla legible.
4. El endpoint devuelve menos de 5 categorías.
- UI: mostrar filas disponibles y estado informativo "Menos categorías para el rango actual".

## Opcionalidad vs obligatoriedad de parámetros

- Opcionales:
  - `DateRangeFilter.start_date`, `DateRangeFilter.end_date`
  - `AlertsParams.threshold`, `AlertsParams.group_by`, `AlertsParams.business_type`
  - `TopCategoriesParams.operation_type`, `TopCategoriesParams.limit`, `TopCategoriesParams.business_type`
  - `SummaryParams.group_by`, `SummaryParams.operation_type`, `SummaryParams.business_type`
  - `ComparisonParams.business_type`
- Requeridos:
  - `ComparisonParams.start_date`
  - `ComparisonParams.end_date`

## Trazabilidad: tipo/parámetro ↔ endpoint backend

| Endpoint | Tipo de respuesta | Tipo de parámetros |
|---|---|---|
| `GET /api/metrics/facets` | `FacetsResponse` | Sin query params |
| `GET /api/metrics/alerts` | `AlertsResponse` | `AlertsParams` |
| `GET /api/metrics/categories/top` | `TopCategoriesResponse` | `TopCategoriesParams` |
| `GET /api/metrics/summary` | `SummaryResponse` | `SummaryParams` |
| `GET /api/metrics/comparison` | `ComparisonResponse` | `ComparisonParams` |

## Validación de contrato usada para esta especificación

- Se validaron rutas, modelos y query params contra:
  - backend (`app/routes.py`)
  - pruebas de contrato (`backend/tests/test_routes.py`)
  - esquema OpenAPI expuesto por FastAPI (`/openapi.json`, fuente de `/docs`).
