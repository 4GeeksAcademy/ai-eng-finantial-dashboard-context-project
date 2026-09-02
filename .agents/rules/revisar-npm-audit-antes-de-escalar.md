# Revisar `npm audit` antes de escalar el proyecto más allá de lo educativo

**Alcance:** dependencias de `frontend/package.json` / `frontend/package-lock.json`.

**Justificación:** `npm install` en `frontend/` reporta 8 vulnerabilidades sin
resolver (1 baja, 1 moderada, 6 altas), confirmado en esta sesión al instalar
dependencias y al reconstruir la imagen Docker del frontend. No se ha ejecutado
`npm audit fix` en ningún momento del historial de este fork.

**Guía específica del proyecto:**
- Antes de usar este proyecto como base para algo más que el ejercicio educativo
  (por ejemplo, desplegarlo con datos reales o exponerlo públicamente), ejecutar
  `npm audit` en `frontend/` y revisar si las vulnerabilidades altas afectan
  dependencias realmente usadas en producción (build) o solo en devDependencies.
- Si se aplica `npm audit fix` o `npm audit fix --force`, verificar después que
  `npm run build` y `npm run test` siguen pasando, ya que puede haber saltos de
  versión mayor en dependencias como `vite` o `vitest`.
