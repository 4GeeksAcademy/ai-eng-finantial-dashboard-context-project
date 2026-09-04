# Component specs

Especificación de componentes por funcionalidad — **no implementados en
esta rama** (`feature/frontend-specs`). Un coding agent debe poder
construir estos componentes leyendo solo este documento más
`frontend/specs/api-types.ts` y `frontend/specs/param-types.ts`, sin
tener que volver a preguntar nada sobre forma de datos, casos límite o
comportamiento condicional.

Convenciones ya existentes en el repo que estos componentes deben seguir
(verificadas en `frontend/src/components/` y `frontend/src/App.tsx` en
esta misma rama):

- Alias `@/` para imports internos.
- Lógica de negocio (validación, cálculo de porcentajes, construcción de
  query params) en funciones puras de `frontend/src/lib/*.ts`, nunca
  dentro del componente — mismo patrón que
  `frontend/src/lib/financial-utils.ts`.
- `Card`/`CardHeader`/`CardTitle`/`CardDescription`/`CardContent` de
  `@/components/ui/card` para el contenedor visual de cada sección;
  `Skeleton` de `@/components/ui/skeleton` para el estado de carga.
- Fetch con `AbortController`, cancelado en el cleanup del `useEffect`
  correspondiente, para que una respuesta obsoleta nunca sobrescriba una
  más reciente (patrón ya usado en `fetchFinancialData` de `App.tsx`,
  aunque hoy sin `AbortController` — al añadir fetch parametrizado por
  filtros que cambian, sí hace falta).
- Mensaje de error existente en `App.tsx` como referencia de tono:
  *"No se pudo cargar la informacion financiera. Revisa la API de
  backend."*

---

## Funcionalidad 1 — Filtro de rango de fechas

### Componente: `DateRangeFilter`

| Prop | Tipo | Descripción |
|---|---|---|
| `startDate` | `string` | Valor controlado del input de inicio. Cadena vacía = sin límite inferior. |
| `endDate` | `string` | Valor controlado del input de fin. Cadena vacía = sin límite superior. |
| `onStartDateChange` | `(value: string) => void` | Llamado en cada cambio del input de inicio. |
| `onEndDateChange` | `(value: string) => void` | Llamado en cada cambio del input de fin. |
| `availableRange` | `{ minDate: string; maxDate: string } \| null` | Derivado de `FacetsResponse.min_date`/`max_date` (`api-types.ts`). `null` mientras carga o si la petición a `/api/metrics/facets` falla. |
| `errorMessage` | `string \| null` | Mensaje de validación de rango inválido, o `null` si no hay error. |

Dos `<input type="date">` nativos (formato `YYYY-MM-DD` ya nativo del
input), sin librería de date-picker.

### Renderizado condicional (explícito)

- **Ambos vacíos** (`startDate === '' && endDate === ''`): no se envían
  `start_date`/`end_date` en la query — el backend devuelve todo el
  dataset. Este es el estado inicial.
- **Solo `startDate` con valor, `endDate` vacío**: se envía únicamente
  `start_date` en la query (sin `end_date`) — el backend interpreta esto
  como "desde `startDate` en adelante, sin límite superior". El
  componente NO debe rellenar `endDate` automáticamente ni bloquear el
  fetch — es un estado válido por sí mismo.
- **Solo `endDate` con valor, `startDate` vacío**: simétrico al caso
  anterior — se envía únicamente `end_date`, "hasta `endDate`, sin
  límite inferior".
- **`availableRange` es `null`**: no se muestra el texto de rango
  disponible (se omite silenciosamente), pero los inputs de fecha siguen
  siendo editables — un fallo en `/api/metrics/facets` no debe impedir
  que el usuario filtre manualmente.
- **`errorMessage` no es `null`** (ambos inputs tienen valor y
  `startDate > endDate`): se muestra el mensaje en rojo junto a los
  inputs, y el componente que orquesta el fetch (`App.tsx` u otro) NO
  debe disparar ninguna petición mientras esta condición se mantenga —
  la validación (`isValidDateRange`, o equivalente) vive en
  `frontend/src/lib/`, no dentro de este componente.

---

## Funcionalidad 2 — Tabla de alertas de anomalías

### Componente: `AnomalyAlertsTable`

| Prop | Tipo | Descripción |
|---|---|---|
| `alerts` | `AlertsResponse` (de `api-types.ts`) | Filas a renderizar. |
| `threshold` | `string` | Valor controlado del input numérico (string, no number, para permitir estados intermedios de edición como `"0."`). |
| `onThresholdChange` | `(value: string) => void` | Llamado en cada cambio del input. |
| `thresholdError` | `string \| null` | Mensaje cuando `threshold` no es un número válido en 0.01–1.0 (ver `AlertsParams` en `param-types.ts` — este rango NO lo impone el backend, se valida aquí). |
| `loading` | `boolean?` | Verdadero mientras la petición está en vuelo. |
| `error` | `string \| null?` | Mensaje de fallo de red específico de esta sección (no el error genérico de `/api/metrics`). |

Columnas de la tabla, en este orden: **Period** (`AlertEntry.period`),
**Outcome** (`AlertEntry.outcome_total`, formateado como moneda),
**Previous average** (`AlertEntry.baseline_average`, formateado como
moneda — nombrar así, no "3-period moving average", ver discrepancia en
`api-types.ts`), **Increase** (`AlertEntry.increase_ratio * 100`,
formateado como porcentaje).

### Estado vacío (explícito, obligatorio)

Este componente tiene **tres estados mutuamente excluyentes** en el área
de contenido, en este orden de prioridad:

1. `loading === true` → `Skeleton` (no se evalúa nada más).
2. `error !== null` → mensaje de error en el área de contenido (color
   `destructive`), la tabla no se renderiza.
3. `loading === false && error === null && alerts.length === 0` →
   **estado vacío explícito**: un mensaje en el área donde iría la
   tabla, por ejemplo *"No se detectaron anomalías para el umbral
   actual."* — con el mismo alto aproximado que tendría la tabla (para
   no producir un salto de layout brusco al cambiar el umbral). **Nunca**
   se debe ocultar la sección completa ni dejarla en blanco — un
   `alerts.length === 0` es un resultado válido y esperado (sobre todo
   con umbrales altos), no un error.
4. Cualquier otro caso (`alerts.length > 0`) → la tabla con una fila por
   alerta.

`thresholdError` es independiente de estos tres estados: se muestra
siempre que no sea `null`, junto al input, sin importar qué esté
renderizado en el área de contenido (que en ese caso muestra el último
resultado válido conocido, porque no se dispara una petición nueva
mientras el umbral es inválido).

---

## Funcionalidad 3 — Vista comparativa B2B vs B2C

### Componente: `ViewNav`

| Prop | Tipo | Descripción |
|---|---|---|
| `currentView` | `'dashboard' \| 'comparison'` | Vista activa. |
| `onViewChange` | `(view: 'dashboard' \| 'comparison') => void` | Cambia de vista. |

Sin routing (no hay `react-router` en el proyecto — ver
`frontend/package.json`): alternar vista es un cambio de estado en el
componente que orquesta todo (p. ej. `App.tsx`), no una navegación de
URL. Cambiar de vista desmonta la vista anterior — no hay caché de datos
entre idas y vueltas.

### Componente: `TopCategoriesTable` (una instancia por línea de negocio)

| Prop | Tipo | Descripción |
|---|---|---|
| `title` | `string` | `"B2B"` o `"B2C"` — qué línea de negocio representa esta instancia. |
| `items` | `TopCategoriesResponse` (de `api-types.ts`) | Respuesta cruda de `GET /api/metrics/categories/top?business_type=...` para esta línea. |
| `loading` | `boolean?` | |
| `error` | `string \| null?` | Error de red específico de esta llamada (independiente de la otra línea de negocio). |

El componente calcula el porcentaje internamente (no lo recibe ya
calculado): `percentage = item.total_amount / sum(items.map(i =>
i.total_amount)) * 100` — ver la nota de por qué esto es seguro
(`items` siempre completo) en `CategoryEntry` de `api-types.ts`.
Columnas: **Category**, **Income** (moneda), **% of group**.

### Renderizado vacío de "top 5" (explícito, obligatorio — ambos paneles)

`items` casi nunca tendrá 5 filas con el dataset actual (ver
discrepancia #2 en `CategoryEntry`, `api-types.ts`: los movimientos de
ingreso solo generan categoría `sales` u `others`). Esto aplica **por
igual a la instancia B2B y a la instancia B2C** — no es una diferencia
entre ellas, es una propiedad del dataset de ingresos en general:

- `items.length === 0`: mensaje de estado vacío explícito, mismo
  criterio que la Funcionalidad 2 — p. ej. *"No hay ingresos registrados
  para B2B en este rango."* (usar `title` en el mensaje). No ocultar el
  panel.
- `items.length` entre 1 y 4 (el caso típico hoy: normalmente 2): se
  renderiza una tabla normal con esas filas, **sin** rellenar filas
  vacías hasta llegar a 5 y **sin** ningún copy que diga "mostrando N de
  5" — el título de la sección puede decir "Top income categories" (sin
  el número "5" hardcodeado en el copy visible, precisamente porque casi
  nunca son 5).
- `items.length === 5`: caso posible si el dataset cambiara en el
  futuro — se renderizan las 5 filas normalmente, mismo componente, sin
  rama de código especial.

### Componente: `BusinessTypeComparisonChart`

| Prop | Tipo | Descripción |
|---|---|---|
| `b2bTotal` | `number` | Suma de `total_amount` de todos los `CategoryEntry` de B2B — `sum(b2bItems.map(i => i.total_amount))`, no una llamada nueva a la API. |
| `b2cTotal` | `number` | Análogo para B2C. |
| `loading` | `boolean?` | Verdadero si cualquiera de las dos peticiones (B2B o B2C) sigue en vuelo. |

Gráfico de 2 barras (B2B, B2C). Si ambas llamadas fallan, este
componente no recibe totales fiables (`b2bTotal`/`b2cTotal` serían `0`
por defecto en el componente padre) — el componente que orquesta la
vista debe evitar pasarle datos a este gráfico cuando ambas fuentes
fallaron, mostrando en su lugar el mismo tipo de mensaje de error que
las tablas, para no pintar un gráfico con barras en cero que parezca un
dato real.

### Componente orquestador: `ComparisonView`

| Prop | Tipo | Descripción |
|---|---|---|
| `availableRange` | `{ minDate: string; maxDate: string } \| null` | Reutilizado del mismo `FacetsResponse` ya obtenido para la Funcionalidad 1 — no se repite la llamada a `/api/metrics/facets`. |

Mantiene su **propio** `startDate`/`endDate` (independiente del filtro
de la Funcionalidad 1 — son vistas/contextos distintos), reutiliza
`<DateRangeFilter>` de la Funcionalidad 1 pasándole `availableRange`
recibido por props, y dispara dos fetch independientes (uno por
`business_type`, cada uno con su propio `AbortController`) cada vez que
`startDate`/`endDate` cambian a un valor válido.
