# Usar el alias `@/` para imports internos del frontend

**Alcance:** cualquier archivo `.ts`/`.tsx` bajo `frontend/src/`.

**Justificación:** el alias `@` → `./src` está declarado tanto en
`frontend/vite.config.ts:18-22` como en `frontend/tsconfig.app.json`, y ya se usa
de forma consistente en `frontend/src/App.tsx` (`@/components/dashboard/...`,
`@/lib/financial-types`) y en `frontend/src/components/dashboard/kpi-row.tsx`
(`@/lib/financial-types`, `@/lib/financial-utils`).

**Guía específica del proyecto:**
- Para importar cualquier módulo dentro de `frontend/src/`, usar `@/...` en vez
  de rutas relativas (`../../lib/...`), salvo imports dentro del mismo directorio
  (p. ej. `./kpi-card` desde `kpi-row.tsx`, que sí usa ruta relativa por ser
  vecino directo).
- Si se añade un nuevo alias, declararlo en ambos sitios a la vez
  (`vite.config.ts` y `tsconfig.app.json`) para que build y editor coincidan.
