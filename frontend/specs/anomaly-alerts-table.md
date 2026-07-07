# Especificacion tecnica adicional: tabla de alertas de anomalias

## Objetivo
Agregar una tabla de alertas debajo de los graficos existentes para mostrar periodos con incremento anomalo de outcome, usando exclusivamente `GET /api/metrics/alerts`.

## Alcance funcional
- Renderizar una tabla visible en todo momento, incluso cuando no haya filas.
- Permitir configurar umbral con input numerico.
- Respetar filtros de fecha ya aplicados en dashboard.
- Manejar estados de carga, error y vacio de forma consistente.

## Contrato API utilizado
- Endpoint: `/api/metrics/alerts`
- Query params requeridos por esta funcionalidad:
  - `threshold` (ratio)
  - `start_date` (opcional)
  - `end_date` (opcional)
- Campos de respuesta:
  - `period`
  - `outcome_total`
  - `baseline_average`
  - `increase_ratio`

## Cambios tecnicos planificados

### 1) Tipado de dominio y transporte
Archivo: `frontend/src/lib/financial-types.ts`
- Agregar tipo `MetricsAlert` para mapear la respuesta del endpoint de alertas.

### 2) Utilidades de validacion y query de alertas
Archivo: `frontend/src/lib/date-range-filters.ts`
- Agregar validacion de umbral en rango [0.01, 1.0].
- Agregar helper para construir query de alertas reutilizando filtros de fecha existentes + threshold.
- Mantener funciones puras para facilitar pruebas unitarias y evitar duplicacion en `App`.

### 3) Integracion en orquestacion principal
Archivo: `frontend/src/App.tsx`
- Agregar estado para:
  - `alerts`
  - `alertsLoading`
  - `alertsError`
  - `thresholdInput`
  - `appliedThreshold`
- Implementar fetch de alertas con `AbortController` y cancelacion segura.
- Sincronizar solicitud de alertas con filtros de fecha aplicados.
- Evitar estado inconsistente en errores de red/API.

### 4) Presentacion de tabla de alertas
Archivo nuevo: `frontend/src/components/dashboard/anomaly-alerts-table.tsx`
- Tabla con columnas:
  - Periodo
  - Outcome registrado
  - Media movil de los 3 periodos anteriores
  - Incremento porcentual
- Mostrar estado vacio cuando no existan anomalias para el umbral actual.
- Mantener visible el componente en estado vacio.
- Reutilizar estilo visual del dashboard (componentes UI existentes de card/skeleton).

### 5) Pruebas frontend
Archivo nuevo o extension: `frontend/src/lib/date-range-filters.test.ts`
- Casos para umbral:
  - valor por defecto 0.3 valido
  - min 0.01 valido
  - max 1.0 valido
  - fuera de rango invalido
- Casos para query de alertas con y sin rango de fechas.

## Flujo de datos previsto
1. Usuario ajusta umbral (input numerico).
2. Se valida el valor en cliente y se aplica solo si es valido.
3. `App` dispara fetch de `/api/metrics/alerts` con `threshold` + `start_date` y/o `end_date` activos.
4. La respuesta tipada se entrega al componente de tabla.
5. La tabla renderiza filas o mensaje de estado vacio.

## Criterios tecnicos de calidad
- Sin nuevas dependencias.
- Reutilizacion de utilidades existentes de filtros de fecha.
- Sin cambios de contrato backend.
- Con control de cancelacion en efectos de fetch.
- Sin logs sensibles en consola.

## Riesgos y mitigacion
- Riesgo: exceso de re-renders por cambios de input.
  - Mitigacion: separar valor de input vs valor aplicado.
- Riesgo: inconsistencias entre filtros y alertas.
  - Mitigacion: usar un unico estado fuente para rango aplicado.
- Riesgo: formato incorrecto de porcentaje (ratio vs porcentaje).
  - Mitigacion: normalizar presentacion en el componente de tabla.

## Limitacion conocida del backend actual
- El endpoint `/api/metrics/alerts` expone `baseline_average`, pero la implementacion observada en backend calcula el promedio historico previo acumulado y no una media movil estricta de los ultimos 3 periodos.
- La UI implementada reutiliza el valor que devuelve la API actual sin cambiar contratos, por lo que para cumplir literalmente la especificacion de "media movil de los 3 periodos anteriores" se requiere ajustar backend antes o en una tarea posterior.
