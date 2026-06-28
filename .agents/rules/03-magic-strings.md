# Regla: Consistencia de Dominio (Single Source of Truth)
- **Alcance:** Global (Frontend y Backend).
- **Razón:** Los "Magic Strings" dispersos causan inconsistencias visuales y bugs difíciles de rastrear (ej. "2024 - Full Year" vs "2024 — Full Year").
- **Restricción Estricta:** Prohibido hardcodear cadenas de texto de dominio o valores estáticos repetitivos en los componentes.
- **Estándar:** Extraer estos valores a un archivo de constantes global (ej. `constants.ts` o `config.py`) y referenciarlos desde allí.