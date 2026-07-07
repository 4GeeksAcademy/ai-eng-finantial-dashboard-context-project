# Frontend Specs: Contratos y Tipos (Funcionalidades 1, 2 y 3)

Este directorio define la capa de especificacion frontend: contratos de API, tipos TypeScript y descomposicion de componentes.

## Archivos de especificacion
- `api-types.ts`: tipos de respuestas API.
- `param-types.ts`: tipos de query params.
- `components.md`: desglose de componentes por funcionalidad.

## Funcionalidad 1: Filtro por rango de fechas

### Endpoint(s)
- `GET /api/metrics`
- `GET /api/metrics/facets`

Rutas verificadas contra backend en `backend/app/routes.py`.

### Tipos usados
- Respuesta: `FacetsResponse` (para rango disponible).
- Parametros: `DateRangeFilter`.

### Parametros y restricciones
- `start_date?: string` formato `YYYY-MM-DD`.
- `end_date?: string` formato `YYYY-MM-DD`.
- Ambos opcionales.
- Validacion de frontend recomendada: si ambos existen, `start_date <= end_date`.

### Casos edge (UI esperada)
1. Ambos campos vacios:
- UI muestra todos los datos del historico.
- No se envian `start_date` ni `end_date`.

2. Rango invalido (`start_date > end_date`):
- UI muestra error de validacion.
- No dispara request con rango invalido.

## Funcionalidad 2: Tabla de alertas de anomalias

### Endpoint(s)
- `GET /api/metrics/alerts`

Ruta verificada contra backend en `backend/app/routes.py`.

### Tipos usados
- Respuesta: `AlertEntry`, `AlertsResponse`.
- Parametros: `AlertsParams` + `DateRangeFilter`.

### Parametros y restricciones
- `threshold: number` obligatorio para esta funcionalidad.
- Restriccion de frontend: `0.01 <= threshold <= 1.0`.
- `start_date` y `end_date` opcionales, formato `YYYY-MM-DD`.

### Casos edge (UI esperada)
1. Respuesta vacia (`[]`):
- La tabla sigue visible.
- Mensaje explicito: no se detectaron anomalias para el umbral actual.

2. Umbral fuera de rango:
- UI muestra error de validacion de umbral.
- No envia request invalida.

## Funcionalidad 3: Vista comparativa B2B vs B2C

### Endpoint(s)
- `GET /api/metrics/categories/top?operation_type=income&limit=5`
- `GET /api/metrics/facets`

Rutas verificadas contra backend en `backend/app/routes.py`.

### Tipos usados
- Respuesta: `CategoryEntry`, `TopCategoriesResponse`, `FacetsResponse`.
- Parametros: `TopCategoriesParams` + `DateRangeFilter`.

### Parametros y restricciones
- `operation_type: "income" | "outcome"`.
- Para esta funcionalidad: `operation_type = "income"`.
- `limit: number` con restriccion de API observada entre 1 y 20; en UI se usa 5.
- `start_date` y `end_date` opcionales, formato `YYYY-MM-DD`.

### Casos edge (UI esperada)
1. Una linea sin categorias en el rango:
- Tabla de esa linea visible con estado vacio.
- Grafico compara totales disponibles (incluyendo 0 si aplica).

2. Facetas con categorias globales no segmentadas por linea:
- UI muestra facetas como referencia de categorias disponibles.
- Ranking especifico por linea se obtiene de `categories/top` por filtro de negocio.

## Notas de alcance
- Este README documenta especificacion de capa frontend, no implementacion.
- No incluye componentes React ejecutables ni llamadas HTTP reales.
