# Especificacion tecnica adicional: vista B2B vs B2C

## Objetivo
Agregar una nueva vista interna en el dashboard para comparar el rendimiento de ingresos entre B2B y B2C sin introducir dependencias nuevas de routing.

## Enfoque de navegacion
- Se implementa una navegacion interna entre dos vistas:
  - `overview`
  - `comparison`
- No se agrega `react-router` porque el proyecto actual no tiene infraestructura de rutas y la restriccion de dependencias favorece una solucion local y minima.

## Contratos API utilizados
- `GET /api/metrics/facets`
- `GET /api/metrics/categories/top?operation_type=income&limit=5&business_type=<B2B|B2C>`
- `GET /api/metrics/b2b?operation_type=income`
- `GET /api/metrics/b2c?operation_type=income`

## Cambios tecnicos implementados

### 1) Tipos de dominio
Archivo: `frontend/src/lib/financial-types.ts`
- `TopCategoryItem`
- `BusinessCategoryShare`
- `DashboardView`

### 2) Utilidades de transporte y filtros
Archivo: `frontend/src/lib/date-range-filters.ts`
- `buildTopCategoriesQuery`
- `buildBusinessMetricsQuery`
- Reutilizacion de filtros de fecha ya existentes

### 3) Utilidades de calculo
Archivo: `frontend/src/lib/financial-utils.ts`
- `computeIncomeTotal`
- `computeCategoryShareRows`

### 4) Componentes nuevos
- `frontend/src/components/dashboard/business-income-table.tsx`
- `frontend/src/components/dashboard/business-income-comparison-chart.tsx`

### 5) Integracion principal
Archivo: `frontend/src/App.tsx`
- Estado para vista activa
- Fetch condicional por vista para evitar requests innecesarios
- Reutilizacion del mismo rango de fechas ya aplicado en overview
- Comparacion paralela de B2B y B2C

### 6) Header
Archivo: `frontend/src/components/dashboard/dashboard-header.tsx`
- Header reutilizable con `title` y `subtitle` opcionales para distinguir la vista de comparacion

## Flujo de datos
1. El usuario cambia a la vista `B2B vs B2C`.
2. Se reutilizan `start_date` y `end_date` ya aplicados globalmente.
3. El frontend solicita en paralelo:
   - top categorias de ingreso B2B
   - top categorias de ingreso B2C
   - movimientos income B2B para calcular total del grupo
   - movimientos income B2C para calcular total del grupo
4. Se calculan porcentajes por categoria sobre el total de cada grupo.
5. Se renderizan dos tablas y un grafico comparativo unico.

## Decisiones de diseño
- La vista de comparacion no altera la vista overview.
- El filtro de fechas es global y compartido entre vistas.
- Las categorias visibles en cada tabla se acompañan con la lista disponible proveniente de `facets`.

## Limitacion conocida
- El endpoint `facets` actual expone categorias globales, no segmentadas por tipo de negocio ni por tipo de operacion. Por eso la UI muestra la base de categorias disponible segun `facets`, mientras el ranking especifico por B2B/B2C se obtiene desde `categories/top`.
