# Verification

Registro de comprobaciones realizadas sobre el proyecto.

- ✅ Se han revisado todos los endpoints (`backend/app/routes.py`).
- ✅ Se ha comprobado visualmente que Docker levanta tanto el frontend como el backend.
- ✅ Se ha comprobado que si se cae el backend, el frontend muestra un mensaje de error.
- ✅ Se ha comprobado manualmente que el frontend usa el puerto 5173 y el backend el 8000.
- ✅ Se ha comprobado que `/api/metrics` entrega siempre los mismos 360 movimientos (determinista por `seed=42`, no random).
- ✅ Se ha comprobado que el proyecto se ejecuta efectivamente con `docker compose up --build`.
- ✅ Se ha creado `.agents/rules/` con reglas propuestas (arquitectura, naming, testing, documentación, DX/infra, código muerto, seguridad), cada una ligada a un hecho concreto del repo.
- Se han probado las 14 reglas con un agente contra el repo: ✅ 12 con check verde, ❌ 1 con cruz roja, ⚠️ 1 con advertencia.
- ✅ Se ha implementado y verificado el filtro de rango de fechas (`specs/001-filtro-rango-fechas/`): 15/15 tests, `lint`/`build` en verde, y comprobación manual en navegador (Playwright) de los 6 escenarios de aceptación, incluida la condición de carrera.

## Hallazgos

- ⚠️ **Error al abrir `frontend/src/App.tsx` en el IDE**: no existe la carpeta `frontend/node_modules` (nunca se ejecutó `npm install` localmente). Esto impide resolver `react`, `react-dom`, sus `@types`, y los imports internos con alias `@/...` (p. ej. `@/components/dashboard/dashboard-header`, `@/lib/financial-types`), causando errores de TypeScript/ESLint en el editor. `package-lock.json` sí existe, por lo que las dependencias están definidas y solo falta instalarlas. Solución: ejecutar `npm install` dentro de `frontend/`.
  - ✅ **Resuelto**: se ejecutó `npm install` en `frontend/` (263 paquetes instalados) y se confirmó visualmente que `App.tsx` ya no da error en el IDE.

- ⚠️ **`docker compose up` fallaba**: el frontend se caía por un bug del shim de `npm` (`node.exe: not found`).
  - ✅ **Resuelto**: se cambió el `CMD` de `frontend/Dockerfile` para invocar `node node_modules/vite/bin/vite.js` directamente; frontend y backend levantan y responden OK.

- ❌ **`revisar-npm-audit-antes-de-escalar.md` no se respetó**: ante un prompt de checklist de pre-producción, el agente no mencionó `npm audit` sin que se le señalara la regla directamente.
- ⚠️ **`no-editar-mock-data-sin-confirmar-uso.md` se respetó a medias**: el agente comprobó que `mock-data.ts` no se usa en ningún sitio, pero lo editó igualmente sin avisar de que el cambio no tendría efecto visible.


