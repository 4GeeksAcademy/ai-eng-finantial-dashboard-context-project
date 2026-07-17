# Especificacion 01: Filtro de rango de fechas en dashboard principal

## Objetivo funcional
Permitir que el usuario limite los datos del dashboard principal por fecha de inicio y fecha de fin sin perder el comportamiento actual cuando no hay filtros.

## Endpoints y contrato API (verificado en /docs)

### GET /api/metrics/facets
- Sin parametros.
- Respuesta 200 (objeto):
  - operation_types: array de "income" | "outcome"
  - business_types: array de "B2B" | "B2C"
  - categories: array de "administrative" | "operational" | "others" | "sales" | "suppliers"
  - min_date: string con formato date (YYYY-MM-DD)
  - max_date: string con formato date (YYYY-MM-DD)

### GET /api/metrics
- Parametros query opcionales:
  - start_date: date YYYY-MM-DD
  - end_date: date YYYY-MM-DD
  - category: enum category
  - operation_type: income | outcome
- Respuesta 200: array de FinancialMovement
  - create_date: date YYYY-MM-DD
  - amount: number
  - operation_type: income | outcome
  - category: suppliers | sales | operational | administrative | others
  - business_type: B2B | B2C

## Reglas de UI
- Mostrar 2 inputs de fecha en el encabezado del dashboard principal:
  - Fecha inicio
  - Fecha fin
- Mostrar junto a los inputs el rango disponible usando facets:
  - "Rango disponible: {min_date} a {max_date}"
- Ambos inputs son opcionales.

## Reglas de request
- Estado inicial:
  - Cargar facets y metrics al montar la pantalla.
  - Request metrics inicial sin start_date/end_date.
- Si solo hay fecha inicio:
  - Enviar solo start_date.
- Si solo hay fecha fin:
  - Enviar solo end_date.
- Si hay inicio y fin:
  - Enviar ambos parametros.
- Si inicio > fin:
  - No llamar a API.
  - Mostrar validacion inline: "La fecha inicio no puede ser mayor a la fecha fin".
- Si se limpian ambos campos:
  - Volver a solicitar metrics sin filtros de fecha.

## Reglas de estado y errores
- Si falla facets:
  - Mantener dashboard funcional con metrics.
  - Mostrar texto auxiliar: "No se pudo cargar el rango disponible".
- Si falla metrics:
  - Mantener comportamiento de error global actual del dashboard.
- Error de formato de fecha en API:
  - API devuelve 422.
  - Frontend debe prevenir formato invalido usando input date nativo.

## Criterios de aceptacion
1. Sin fechas seleccionadas, se muestra el dataset completo.
2. Con una fecha o un rango valido, los KPIs y graficos se recalculan con los datos filtrados.
3. El rango min/max visible coincide exactamente con /api/metrics/facets.
4. Nunca se envia una request con start_date > end_date.
5. Al limpiar filtros, el dashboard vuelve al estado completo.

## Casos de prueba minimos
1. Carga inicial: facets 200 + metrics 200.
2. Filtro por solo start_date.
3. Filtro por solo end_date.
4. Filtro por rango valido start_date/end_date.
5. Validacion local por start_date > end_date.
6. Facets error y metrics ok.
7. Metrics 422 por fecha invalida (via test de request builder, no por UI manual).