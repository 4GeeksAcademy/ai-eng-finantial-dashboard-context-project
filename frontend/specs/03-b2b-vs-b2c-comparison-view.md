# Especificacion 03: Vista comparativa B2B vs B2C

## Objetivo funcional
Crear una pagina dedicada para comparar ingresos entre B2B y B2C con dos tablas laterales y un grafico unico de comparativa total.

## Endpoints y contrato API (verificado en /docs)

### GET /api/metrics/categories/top
- Parametros query opcionales:
  - operation_type: income | outcome, default outcome
  - limit: integer, default 5, minimo 1, maximo 20
  - start_date: date YYYY-MM-DD
  - end_date: date YYYY-MM-DD
  - business_type: B2B | B2C
- Respuesta 200: array de TopCategoryItem
  - category: suppliers | sales | operational | administrative | others
  - operation_type: income | outcome
  - total_amount: number

### GET /api/metrics/facets
- Usar para:
  - Obtener el rango de fechas disponible (min_date, max_date).
  - Obtener lista de categorias permitidas para labels/validacion.

## Estructura de pantalla
- Nueva ruta de pagina: /comparison/b2b-vs-b2c.
- Seccion superior:
  - Titulo de pagina.
  - Filtro de fechas (inicio, fin) con formato YYYY-MM-DD.
  - Texto con rango disponible desde facets.
- Seccion central en 2 columnas:
  - Tabla B2B (top 5 categorias de ingresos).
  - Tabla B2C (top 5 categorias de ingresos).
- Seccion inferior:
  - Grafico unico comparando total de ingresos B2B vs B2C.

## Reglas de request
- Tabla B2B:
  - GET /api/metrics/categories/top?operation_type=income&limit=5&business_type=B2B
  - Si hay filtro de fechas, agregar start_date/end_date.
- Tabla B2C:
  - GET /api/metrics/categories/top?operation_type=income&limit=5&business_type=B2C
  - Si hay filtro de fechas, agregar start_date/end_date.
- Grafico comparativo total:
  - Para evitar truncamiento por top 5, calcular total con una segunda llamada por grupo usando limit=20:
    - B2B: operation_type=income, business_type=B2B, limit=20
    - B2C: operation_type=income, business_type=B2C, limit=20
  - Total por grupo = suma de total_amount.

## Reglas de tabla
- Columnas en cada tabla:
  - Categoria
  - Ingreso total
  - Porcentaje sobre total del grupo
- Formula de porcentaje por fila:
  - total_amount_fila / suma_total_grupo * 100
- Orden:
  - Descendente por total_amount (ya viene ordenado por API, no reordenar salvo fallback).
- Limite visual:
  - Mostrar hasta 5 filas por grupo.

## Reglas de filtro de fechas
- Ambos campos opcionales.
- Si inicio > fin:
  - No ejecutar requests y mostrar validacion inline.
- Si se limpian campos:
  - Volver a cargar sin start_date/end_date.
- Si una request retorna []:
  - Mostrar estado vacio en el bloque afectado (tabla o grafico), no romper la vista completa.

## Criterios de aceptacion
1. Existe una pagina dedicada con dos tablas y un grafico unico comparativo.
2. Cada tabla usa business_type correspondiente (B2B o B2C).
3. Cada tabla muestra top 5 categorias de ingresos (operation_type=income, limit=5).
4. El grafico compara total de ingresos B2B vs B2C con datos completos por grupo (limit=20).
5. El filtro de fechas aplica de forma consistente a tablas y grafico.
6. La pagina muestra rango de fechas disponible usando facets.

## Casos de prueba minimos
1. Carga inicial de facets + tablas B2B/B2C + grafico.
2. Filtro por rango valido y recarga de los 3 bloques.
3. Estado vacio para uno o ambos grupos.
4. Validacion local por inicio > fin.
5. Verificacion de calculo de porcentaje por fila.
6. Verificacion de total del grafico como suma de total_amount por grupo.