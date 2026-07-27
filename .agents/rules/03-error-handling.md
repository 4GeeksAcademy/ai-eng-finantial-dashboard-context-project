# Regla 03: Protocolo Global de Manejo de Errores y Excepciones

## Propósito y Contexto
Esta regla define el protocolo unificado de gestión de excepciones tanto para el backend (FastAPI) como para el frontend (React). Mitiga los riesgos identificados en la auditoría (**MP-03** y **MP-04**) previniendo la emisión de errores 500 no estructurados en el servidor y evitando el descarte silencioso de fallas en el cliente.

---

## Reglas Obligatorias

### 1. Manejo Defensivo de Excepciones en Backend (FastAPI)
- **Uso Obligatorio de `HTTPException`:** Todo error de validación de negocio o parámetro inválido debe lanzar explícitamente una excepción `fastapi.HTTPException` con un código de estado HTTP estándar (400 Bad Request, 404 Not Found, 422 Unprocessable Entity).
- **Estructura de Mensaje de Error:** El campo `detail` debe contener una explicación descriptiva del problema (ejemplo: `detail="start_date must be before or equal to end_date"`).
- **Prohibición de Excepciones No Atrapadas:** Queda prohibido permitir que errores de lógica de cálculo produzcan respuestas 500 (Internal Server Error) no capturadas.

### 2. Manejo Transparente de Errores en Frontend (React)
- **Verificación de Estados HTTP:** Toda llamada a la API debe comprobar `response.ok` y capturar el estado numérico (`response.status`) antes de procesar el JSON.
- **Registro en Consola:** Los bloques `.catch()` deben registrar el objeto de error completo en la consola mediante `console.error('[API Error]:', err)` para facilitar el diagnóstico por desarrolladores o asistentes de IA.
- **Feedback al Usuario y Reintento:** La UI debe mostrar un mensaje claro sobre el tipo de falla y ofrecer una acción de reintento (`Retry`) al usuario, sin dejar la pantalla en un estado bloqueado o indefinido.

---

## Ejemplo Correcto (Compliance)

```python
# ✅ BIEN: Validación explícita con HTTPException en FastAPI
@router.get("/api/metrics/comparison", response_model=MetricsComparison)
def get_metrics_comparison(start_date: date = Query(...), end_date: date = Query(...)):
    if start_date > end_date:
        raise HTTPException(
            status_code=400,
            detail="start_date cannot be later than end_date"
        )
    # Lógica de comparación...
```

```typescript
// ✅ BIEN: Captura de error con registro de consola y respuesta tipada en React
try {
  const movements = await fetchFinancialData();
  setMovements(movements);
} catch (err) {
  console.error("[Financial Dashboard API Failure]:", err);
  setError(err instanceof Error ? err.message : "Error al conectar con el servidor.");
}
```

## Ejemplo Incorrecto (Violation)

```typescript
// ❌ MAL: Bloque catch genérico que oculta la causa raíz (MP-03)
fetch('/api/metrics')
  .then(res => res.json())
  .catch(() => {
    setError("Error genérico."); // Error descartado silenciosamente
  });
```
