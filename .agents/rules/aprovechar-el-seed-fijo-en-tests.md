# Aprovechar el `seed=42` fijo para aserciones exactas en tests de backend

**Alcance:** `backend/tests/test_routes.py` y cualquier test nuevo sobre
endpoints de `/api/metrics*`.

**Justificación:** `generate_mock_movements(seed=42)` es determinista — ya
verificado en este proyecto (dos llamadas consecutivas a `/api/metrics` devuelven
los mismos 360 movimientos, byte a byte). El test
`test_generate_mock_movements_returns_full_year_sorted_data`
(`backend/tests/test_routes.py:12-16`) ya se apoya en esto para afirmar
`len(movements) == 360` de forma exacta, no solo "no vacío".

**Guía específica del proyecto:**
- Al escribir un test nuevo sobre un endpoint de métricas, preferir aserciones
  exactas (cantidades, totales, fechas concretas) en vez de solo comprobar que
  la respuesta "no está vacía", aprovechando que el dataset es siempre el mismo.
- Si en algún momento se cambia el `seed` o se sustituye el generador mock por
  datos reales, revisar y actualizar estos tests exactos, ya que dejarán de ser
  válidos automáticamente.
