# Especificacion 02: Tabla de alertas de anomalias en dashboard principal

## Objetivo funcional
Agregar una tabla debajo de los graficos que muestre periodos con incrementos atipicos de gasto (outcome) respecto de una linea base historica.

## Endpoint y contrato API (verificado en /docs)

### GET /api/metrics/alerts
- Parametros query opcionales:
  - threshold: number, default 0.3, minimo 0
  - group_by: day | week | month, default month
  - start_date: date YYYY-MM-DD
  - end_date: date YYYY-MM-DD
  - business_type: B2B | B2C
- Respuesta 200: array de MetricsAlert
  - period: string
  - outcome_total: number
  - baseline_average: number
  - increase_ratio: number
- Comportamiento real:
  - Puede devolver array vacio ([]).
  - threshold < 0 devuelve 422.

## Reglas de UI
- Ubicacion: debajo del bloque de graficos del dashboard principal.
- Controles:
  - Input numerico de umbral.
  - Valor inicial: 0.3.
  - Paso recomendado: 0.01.
- Columnas obligatorias de tabla:
  - Periodo (period)
  - Outcome registrado (outcome_total)
  - Media movil de referencia (baseline_average)
  - Incremento porcentual (increase_ratio * 100)

## Reglas de negocio y request
- group_by fijo en month para esta pantalla (salvo que producto pida selector mas adelante).
- Si existe filtro de fechas activo en funcionalidad 01:
  - Reutilizar start_date y end_date en esta request.
- Construccion de request:
  - Siempre enviar threshold y group_by.
  - Enviar start_date/end_date solo si existen.

## Formato visual de datos
- outcome_total y baseline_average:
  - Formato moneda con 2 decimales.
- increase_ratio:
  - Mostrar como porcentaje con 2 decimales.
  - Ejemplo: 0.3585 se visualiza como 35.85%.

## Estado vacio y errores
- Si la respuesta es []:
  - Mostrar estado vacio explicito dentro del modulo.
  - Mensaje: "No se detectaron anomalias para el umbral seleccionado".
- Si la API responde 422 por threshold invalido:
  - Mostrar mensaje de validacion y no romper el resto del dashboard.
- Si hay error de red/5xx:
  - Mostrar mensaje de error del modulo y opcion de reintento.

## Nota de alineacion producto vs API
- Solicitud de producto: ratio 0.01 a 1.0.
- Contrato API actual: acepta threshold >= 0 (sin maximo).
- Implementacion requerida:
  - Validar en UI el rango de producto (0.01 a 1.0).
  - Mantener manejo de 422 por robustez, porque la API solo garantiza minimo 0.

## Criterios de aceptacion
1. La tabla aparece debajo de los graficos y muestra 4 columnas obligatorias.
2. El modulo usa /api/metrics/alerts con threshold configurable.
3. Si hay rango de fechas activo, la tabla respeta ese rango.
4. Si no hay anomalias, se muestra mensaje de estado vacio y no se oculta el modulo.
5. El porcentaje mostrado corresponde a increase_ratio * 100.
6. El valor por defecto del umbral es 0.3.

## Casos de prueba minimos
1. threshold por defecto 0.3 y respuesta con items.
2. threshold alto (ejemplo 999) y respuesta [].
3. Propagacion de start_date/end_date desde filtro principal.
4. threshold invalido (< 0) con manejo de 422.
5. Formateo correcto de monto y porcentaje.