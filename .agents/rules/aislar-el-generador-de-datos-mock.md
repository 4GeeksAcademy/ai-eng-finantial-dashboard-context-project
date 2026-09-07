# Aislar el estado aleatorio del generador de datos mock

**Alcance:** `generate_mock_movements()` y `_build_movement()` en
`backend/app/routes.py`.

**Justificación:** `generate_mock_movements()` llama a `random.seed(seed)` sobre
el módulo global `random` (`backend/app/routes.py:95-96`), y esta función se
invoca en cada uno de los 8 endpoints del router (líneas 255, 264, 277, 295, 311,
350, 369, 385). Al mutar un estado compartido por proceso en vez de usar una
instancia aislada, cualquier código futuro que también use `random` (otro
endpoint, un test, una librería) puede verse afectado por este `seed`, y bajo
concurrencia real (varios requests simultáneos en distintos workers/threads) el
estado global no está protegido.

**Guía específica del proyecto:**
- Sustituir `random.seed(seed)` + funciones del módulo `random` por una instancia
  local: `rng = random.Random(seed)` y usar `rng.random()`, `rng.randint(...)`,
  `rng.uniform(...)`, `rng.choice(...)` en `_build_movement()` y
  `generate_mock_movements()`.
- No añadir nuevos usos de `random.seed()` global en ningún otro punto del
  backend; si se necesita aleatoriedad reproducible en código nuevo, pasar
  siempre una instancia `random.Random(seed)` explícita.
- Si se optimiza el rendimiento (evitar recalcular 360 movimientos en cada
  request), documentar el cambio aquí mismo, ya que hoy es un comportamiento
  esperado y cubierto por tests (`test_generate_mock_movements_returns_full_year_sorted_data`).
