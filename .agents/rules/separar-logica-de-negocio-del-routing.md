# Separar la lógica de negocio del routing (backend)

**Alcance:** `backend/app/routes.py` y cualquier archivo de backend que se añada
en el futuro para nuevos endpoints.

**Justificación:** el proyecto ya sigue este patrón — funciones como
`filter_movements`, `summarize_movements`, `build_top_categories` y
`detect_outcome_alerts` están definidas como funciones puras, separadas de los
handlers `@router.get`. Los tests dependen de ello: `backend/tests/test_routes.py:6`
importa `filter_movements_by_date` y `generate_mock_movements` directamente desde
`app.routes`, sin pasar por HTTP. Si la lógica se mete dentro del handler, esa vía
de testing directo deja de ser posible.

**Guía específica del proyecto:**
- Cualquier regla de negocio nueva (un filtro, un cálculo, una agregación) debe
  implementarse como función independiente en `routes.py` (o un módulo nuevo si
  crece), con su propia firma de entrada/salida tipada.
- El handler `@router.get(...)` debe limitarse a: generar/obtener los datos,
  llamar a la(s) función(es) de negocio, y devolver el resultado.
- Toda función nueva de este tipo debe tener un test que la importe y la llame
  directamente, siguiendo el estilo ya usado en `test_routes.py`.
