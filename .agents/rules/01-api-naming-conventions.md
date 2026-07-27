# Regla 01: Convenciones de Nombres y Diseño de la API (Backend FastAPI)

## Propósito y Contexto
Esta regla establece los estándares obligatorios para el diseño, nombrado e implementación de rutas y esquemas en la API backend utilizando **FastAPI**. Fue creada para mitigar los riesgos identificados en la auditoría (MP-01 y MP-04) y prevenir inconsitencias entre el servidor y el cliente.

---

## Reglas Obligatorias

### 1. Nombrado de Endpoints RESTful
- **Sustantivos en Plural:** Todas las rutas deben utilizar recursos en sustantivo plural y en minúsculas (ejemplo: `/api/metrics`, `/api/metrics/facets`, `/api/metrics/summary`).
- **Prefijo Global:** Toda ruta de API pública debe comenzar con `/api/`.
- **Estilo de Query Parameters:** Todos los parámetros de consulta deben escribirse estrictamente en `snake_case` (ejemplo: `start_date`, `end_date`, `operation_type`, `business_type`).

### 2. Esquemas de Datos Pydantic
- **Nombres de Clases:** Usar `PascalCase` para todos los modelos Pydantic (ejemplo: `FinancialMovement`, `MetricsSummaryItem`).
- **Campos en JSON:** Los nombres de atributos enviados y recibidos en JSON deben ser explícitos y coincidir 1:1 con el modelo Pydantic en `snake_case`.
- **Prohibición de Dictionarios Genéricos:** Queda estrictamente prohibido retornar `dict` genéricos desestructurados en las respuestas de endpoints. Siempre se debe especificar `response_model` en los decoradores de FastAPI.

### 3. Aislamiento de Lógica y Datos Mock
- **Separación de Controladores y Lógica Pura:** Los controladores de FastAPI (`@router.get(...)`) deben limitarse a la recepción de parámetros, invocación de funciones puras de servicio y manejo de respuesta.
- **Prohibición de Generación Mock Redundante:** No se debe recalcular datasets mock pesados en memoria directamente dentro de los controladores sin pasar por un repositorio, servicio singleton o mecanismo de almacenamiento/caché.

---

## Ejemplo Correcto (Compliance)

```python
# ✅ BIEN: Endpoint estandarizado con Pydantic y parámetros en snake_case
@router.get("/api/metrics/summary", response_model=list[MetricsSummaryItem])
def get_metrics_summary(
    group_by: GroupBy = Query(default="month"),
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    operation_type: OperationType | None = Query(default=None),
) -> list[MetricsSummaryItem]:
    movements = get_cached_movements()
    filtered = filter_movements(movements, start_date, end_date, operation_type=operation_type)
    return summarize_movements(filtered, group_by)
```

## Ejemplo Incorrecto (Violation)

```python
# ❌ MAL: Nombre de ruta en singular, falta de response_model y parámetros inútiles
@router.get("/api/getMetric")
def get_metric(startDate: str): # camelCase no permitido en Python/FastAPI
    data = {"result": 123} # Retorno de dict genérico sin validación Pydantic
    return data
```
