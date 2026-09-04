# docs/

Fuente de verdad para verificar afirmaciones de API en `frontend/specs/`.
No se documenta a mano: se exporta directamente del backend para que
nunca diverja de lo que la API realmente expone.

## `openapi.json`

Esquema OpenAPI 3.1 generado desde `backend/app/main.py` (FastAPI lo
construye a partir de los modelos Pydantic y las rutas de
`backend/app/routes.py` — es el mismo esquema que sirve `/openapi.json` y
alimenta `/docs` cuando el backend está corriendo).

Regenerar tras cualquier cambio en `backend/app/routes.py` o
`backend/app/main.py`:

```bash
cd backend
python -c "
import json
from app.main import app
with open('../docs/openapi.json', 'w', encoding='utf-8') as f:
    json.dump(app.openapi(), f, indent=2, ensure_ascii=False)
"
```

No editar `openapi.json` a mano — si está desactualizado, regenerarlo, no
parchearlo.
