# No editar `mock-data.ts` esperando que afecte al dashboard

**Alcance:** `frontend/src/lib/mock-data.ts`.

**Justificación:** una búsqueda de `mock-data` en todo `frontend/src` no
encuentra ninguna importación de ese archivo — no está conectado a `App.tsx` ni
a ningún componente de `frontend/src/components/`. La fuente de datos real de la
UI es el backend, vía `fetch` a `/api/metrics` en `App.tsx:16`, cuya respuesta
viene de `generate_mock_movements()` en `backend/app/routes.py`.

**Guía específica del proyecto:**
- Antes de modificar `mock-data.ts` para "arreglar" algo que se ve en el
  dashboard, comprobar primero si algún archivo lo importa
  (`grep -r "mock-data" frontend/src`); si sigue sin uso, el cambio no tendrá
  ningún efecto visible.
- Si se decide que el archivo es útil (p. ej. para tests futuros o Storybook),
  conectarlo explícitamente y documentar aquí su propósito. Si no, considerar
  eliminarlo para no confundir a futuros contribuidores o agentes sobre cuál es
  la fuente de datos real de la app.
