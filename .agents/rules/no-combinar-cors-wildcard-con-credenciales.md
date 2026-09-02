# No combinar `allow_origins=["*"]` con `allow_credentials=True`

**Alcance:** `backend/app/main.py:7-12` (configuración de `CORSMiddleware`).

**Justificación:** el backend tiene exactamente esta combinación configurada hoy:
`allow_origins=["*"]` junto con `allow_credentials=True`. Es una combinación que
los navegadores rechazan en cuanto una petición real usa credenciales (cookies,
cabeceras de auth) — funciona ahora porque este proyecto no tiene autenticación
ni cookies de sesión, pero es un antipatrón fácil de copiar tal cual a un
proyecto que sí las tenga.

**Guía específica del proyecto:**
- Si en el futuro se añade autenticación (cookies de sesión, tokens en cabeceras
  con `credentials: 'include'` desde el frontend), cambiar `allow_origins=["*"]`
  por una lista explícita de orígenes permitidos (p. ej. `http://localhost:5173`
  y el dominio de producción).
- No copiar la configuración actual de `CORSMiddleware` en `main.py` a un nuevo
  servicio backend sin revisar primero si ese servicio manejará credenciales.
