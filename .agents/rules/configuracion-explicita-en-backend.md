# Declarar la configuración del backend explícitamente

**Alcance:** `backend/app/routes.py` (constantes como `seed`, categorías,
probabilidades) y cualquier valor de configuración nuevo del backend.

**Justificación:** existe una asimetría concreta en el repo: el frontend ya tiene
`frontend/.env.example` para declarar `VITE_API_BASE_URL` de forma explícita,
pero el backend no tiene ningún archivo de configuración equivalente —
`seed=42` está repetido como literal en las 8 llamadas a
`generate_mock_movements(seed=42)` dentro de `routes.py`, y `OUTCOME_CATEGORIES`,
los rangos de `random.uniform(...)` y las probabilidades (`0.55`, `0.9`, etc.)
están hardcodeados directamente en el cuerpo de las funciones.

**Guía específica del proyecto:**
- Si se necesita hacer configurable el `seed`, las categorías u otros parámetros
  del generador mock, extraerlos a constantes con nombre al principio de
  `routes.py` (no valores mágicos inline) y, si son variables de entorno reales,
  documentarlas en un `backend/.env.example` nuevo, siguiendo el mismo patrón
  que `frontend/.env.example`.
- No introducir un segundo lugar donde se repita `seed=42`; si se cambia el
  valor, debe cambiar en un único punto que todos los endpoints reutilicen.
