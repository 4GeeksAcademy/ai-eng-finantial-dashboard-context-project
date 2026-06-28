# Regla: Seguridad y CORS
- **Alcance:** Backend (Python/FastAPI).
- **Razón:** Permitir orígenes abiertos (`*`) con credenciales expone la API a ataques críticos de seguridad.
- **Restricción Estricta:** Nunca usar `allow_origins=["*"]` en configuración de CORS si `allow_credentials=True`.
- **Estándar:** Los orígenes permitidos deben leerse siempre de una variable de entorno estricta (ej. `FRONTEND_URL`), aplicando el principio de Mínimo Privilegio.