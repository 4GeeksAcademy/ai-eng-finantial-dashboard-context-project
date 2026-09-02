# Registrar categorías y tipos nuevos en los `Literal` del backend primero

**Alcance:** `backend/app/routes.py:11-15` (`Category`, `OperationType`,
`BusinessType`, `GroupBy`) y cualquier lugar del frontend que consuma esos
valores (`frontend/src/lib/financial-types.ts`, componentes de dashboard).

**Justificación:** estos cuatro tipos están definidos como `Literal[...]` en
`routes.py:11-15`, y FastAPI valida automáticamente los query params contra ellos,
devolviendo 422 si no coinciden. `frontend/src/lib/financial-types.ts` define los
mismos valores por separado (`Category`, `OperationType`, `BusinessType`) como
tipos de TypeScript. Si se añade una categoría en un lado y no en el otro, el
frontend puede mostrar datos que el backend rechaza, o viceversa.

**Guía específica del proyecto:**
- Antes de usar una categoría, tipo de operación o tipo de negocio nuevo en
  cualquier endpoint, añadirlo primero al `Literal` correspondiente en
  `backend/app/routes.py:11-15`.
- Reflejar el mismo valor en `frontend/src/lib/financial-types.ts` para mantener
  ambos tipados sincronizados.
- Si la lista de categorías cambia, revisar también `OUTCOME_CATEGORIES`
  (`routes.py:17`) y `_build_movement()`, que la usan para generar datos mock.
