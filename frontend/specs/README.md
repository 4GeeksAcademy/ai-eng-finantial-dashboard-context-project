# Frontend specs — contrato de datos

Este documento, junto con [`api-types.ts`](./api-types.ts),
[`param-types.ts`](./param-types.ts) y [`components.md`](./components.md),
es todo lo que hace falta para implementar las tres funcionalidades del
dashboard sin tener que volver a explorar la API ni hacer preguntas de
seguimiento sobre forma de datos o casos límite.

**Esta rama (`feature/frontend-specs`) no implementa nada** — cero
componentes React, cero llamadas `fetch`, cero cambios de backend. Los
tipos y specs de aquí son el contrato que una implementación futura debe
seguir.

Fuente de verdad de la API: [`docs/openapi.json`](../../docs/openapi.json)
(exportado directamente del backend — ver
[`docs/README.md`](../../docs/README.md) para regenerarlo si
`backend/app/routes.py` cambia). Todo lo que dice este documento sobre
endpoints, campos y parámetros está verificado contra ese archivo, no
inventado a partir del wording del PM.

Base URL: `import.meta.env.VITE_API_BASE_URL ?? ''` (mismo patrón que
`frontend/src/App.tsx` ya usa hoy — en dev, el proxy de Vite reenvía
`/api/*` a `http://backend:8000`).

---

## Funcionalidad 1 — Filtro de rango de fechas

### Endpoints

- `GET /api/metrics` — ya soporta `start_date`/`end_date` opcionales
  (además de `category`/`operation_type`, no usados por esta
  funcionalidad). Devuelve `FinancialMovement[]` (tipo ya existente en
  `frontend/src/lib/financial-types.ts`, sin cambios).
- `GET /api/metrics/facets` — sin parámetros. Devuelve `FacetsResponse`
  (`api-types.ts`) — esta funcionalidad solo usa `min_date`/`max_date` de
  la respuesta, ver Funcionalidad 3 para la discrepancia sobre
  `categories`.

### Tipos

- Query: `DateRangeFilter` (`param-types.ts`) para `/api/metrics`.
- Respuesta: `FinancialMovement[]` (`financial-types.ts`, sin cambios) y
  `FacetsResponse` (`api-types.ts`).

### Parámetros — valores válidos

- `start_date`, `end_date`: `string` en formato `YYYY-MM-DD`, ambos
  opcionales e independientes entre sí. Sin restricción de que uno sea
  anterior al otro *en el backend* — esa validación es 100% frontend
  (ver casos límite).

### Casos límite (mínimo 2, verificados)

1. **`start_date > end_date` (ambos presentes)**: el backend no lo
   rechaza — devolvería simplemente una lista vacía (ningún movimiento
   cae en un rango invertido), sin error HTTP. La UI **no debe confiar
   en esto**: debe validar en frontend y bloquear el envío de la
   petición antes de llegar a ese estado, mostrando un error inline
   (ver `DateRangeFilter` en `components.md`) — así se evita depender de
   que "lista vacía" signifique siempre "rango inválido" en vez de
   "rango válido sin datos".
2. **Solo uno de los dos presente**: comportamiento especificado
   explícitamente en `components.md` → filtro de un solo lado (desde
   X en adelante, o hasta X), no un error ni un placeholder.

---

## Funcionalidad 2 — Tabla de alertas de anomalías

### Endpoints

- `GET /api/metrics/alerts` — devuelve `AlertsResponse` (`api-types.ts`),
  ya filtrado server-side a solo los períodos que superan `threshold`.

### Tipos

- Query: `AlertsParams` (`param-types.ts`).
- Respuesta: `AlertsResponse` = `AlertEntry[]` (`api-types.ts`).

### Parámetros — valores válidos

- `threshold`: número. **Backend solo exige `>= 0`, sin máximo.** El PM
  pide un rango de 0.01–1.0 — eso se valida en frontend, el backend lo
  aceptaría fuera de ese rango sin quejarse. Default servidor: `0.3`.
- `group_by`: `"day" | "week" | "month"`, default `"month"` — esta
  funcionalidad no lo expone al usuario, se deja el default.
- `start_date`/`end_date`: igual que la Funcionalidad 1 — reutilizar el
  mismo filtro si el usuario ya tiene uno activo en el dashboard.

### Casos límite (mínimo 2, verificados)

1. **`alerts.length === 0`** (umbral alto, sin anomalías en el rango):
   estado vacío explícito, especificado en `components.md` — nunca
   ocultar la tabla ni dejarla en blanco.
2. **`threshold` inválido** (fuera de 0.01–1.0, vacío, o no numérico):
   bloquear el envío de la petición, error inline junto al input, la
   tabla mantiene el último resultado válido visible en vez de
   vaciarse.
3. **(Adicional, documentado para que no sorprenda en implementación)**
   El primer período de cualquier rango filtrado **nunca** puede
   generar una alerta — `detect_outcome_alerts` en
   `backend/app/routes.py` necesita al menos un período anterior para
   calcular `baseline_average`. No es un bug a reportar si ocurre.

---

## Funcionalidad 3 — Vista comparativa B2B vs B2C

### Endpoints

- `GET /api/metrics/categories/top` — llamado **dos veces**, una por
  `business_type` (`B2B` y `B2C`), cada vez con `operation_type=income`
  y `limit=5` fijos. Devuelve `TopCategoriesResponse` (`api-types.ts`)
  por llamada.
- `GET /api/metrics/facets` — reutilizar la respuesta ya obtenida para
  la Funcionalidad 1 (mismo `min_date`/`max_date`), no repetir la
  llamada. **No usar `FacetsResponse.categories` para esta
  funcionalidad** — ver discrepancia abajo.

### Tipos

- Query: `TopCategoriesParams` (`param-types.ts`), una instancia de
  parámetros por `business_type`.
- Respuesta: `TopCategoriesResponse` = `CategoryEntry[]` (`api-types.ts`),
  una por `business_type`. El total de ingresos por grupo (para el
  gráfico comparativo) se deriva sumando `total_amount` de cada
  respuesta — no hay endpoint dedicado a ese total.

### Parámetros — valores válidos

- `operation_type`: fijo en `"income"` para esta funcionalidad (el PM
  pide específicamente rendimiento de ingresos).
- `limit`: fijo en `5` — aunque, ver casos límite, casi nunca se llenan
  las 5 filas con el dataset actual.
- `business_type`: `"B2B" | "B2C"` — **obligatorio en la práctica** para
  esta funcionalidad aunque la query de ejemplo del PM no lo incluya;
  sin él no hay forma de separar las dos líneas de negocio.
- `start_date`/`end_date`: igual que las Funcionalidades 1 y 2.

### Discrepancia: el endpoint de facetas NO da categorías por grupo

El PM brief dice "las categorías disponibles para cada grupo deben
obtenerse del endpoint de facetas". Verificado en
`build_metrics_facets` (`backend/app/routes.py`): `categories` es una
lista **global**, sin segmentar por `business_type` ni por
`operation_type` — no sirve para saber qué categorías tiene el ingreso
de B2B específicamente. Esa información ya viene directamente en la
respuesta de `/api/metrics/categories/top?business_type=B2B&...` (cada
`CategoryEntry.category`), en el mismo request que ya hace falta para
los totales — no se necesita ningún uso adicional de facetas más allá
del rango de fechas.

### Casos límite (mínimo 2, verificados — ver detalle completo en `components.md`)

1. **Menos de 5 categorías en la respuesta** (el caso normal: los
   movimientos de ingreso solo generan categoría `sales` u `others` en
   `_build_movement`, `backend/app/routes.py` — nunca `suppliers`,
   `operational` ni `administrative`, esas son exclusivas de `outcome`).
   Con `limit=5` y solo 5 valores posibles de categoría, la respuesta
   **siempre está completa** (nunca truncada) — es seguro calcular el
   porcentaje sobre el total del grupo sumando la propia respuesta. Debe
   especificarse explícitamente en ambos paneles (B2B y B2C) qué se
   renderiza con menos de 5 filas — ver `components.md`.
2. **Una de las dos llamadas (B2B o B2C) falla**: la tabla de ese grupo
   muestra su propio error; la otra tabla y el gráfico comparativo no
   deben verse afectados si su llamada sí tuvo éxito.
3. **Ambas llamadas fallan**: el gráfico comparativo no debe recibir
   `0`/`0` como si fueran totales reales — debe mostrar su propio estado
   de error, no un gráfico con barras en cero.

---

## Verificación de TypeScript

```bash
cd frontend
npx tsc --noEmit
```

`specs/` está incluido en `tsconfig.app.json` (`include: ["src",
"specs"]`) precisamente para que este comando cubra estos archivos.
Confirmado sin errores en esta rama.
