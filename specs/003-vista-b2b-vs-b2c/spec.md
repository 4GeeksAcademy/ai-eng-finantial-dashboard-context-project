# Feature Specification: Vista comparativa B2B vs B2C

**Feature branch**: `003-vista-b2b-vs-b2c`
**Estado**: Draft — pendiente de revisión (afirmaciones de API marcadas para corregir)
**Creado**: 2026-09-04

## Input original

> Funcionalidad 3 — Vista comparativa B2B vs B2C
> Crea una nueva página en el dashboard para comparar el rendimiento de
> ingresos entre las dos líneas de negocio: B2B y B2C. La vista tiene dos
> secciones en paralelo. Cada sección muestra una tabla con las 5
> categorías de ingreso principales de esa línea de negocio, mostrando
> nombre de categoría, total de ingresos y porcentaje sobre el total del
> grupo. Bajo ambas secciones, un único gráfico compara visualmente el
> total de ingresos de B2B frente a B2C. El usuario puede filtrar la
> comparativa por un rango de fechas (mismo formato YYYY-MM-DD). Las
> categorías disponibles para cada grupo deben obtenerse del endpoint de
> facetas.
>
> Endpoints relevantes: `GET /api/metrics/categories/top?operation_type=income&limit=5`
> y `GET /api/metrics/facets`

## Verificación de API (contra `docs/openapi.json`)

| Afirmación del PM | Estado | Detalle |
|---|---|---|
| `GET /api/metrics/categories/top` existe con `operation_type`, `limit` | ✅ | `docs/openapi.json` → `paths./api/metrics/categories/top.get`. |
| Se puede pedir por línea de negocio (B2B/B2C) | ✅ | El endpoint también acepta `business_type` y `start_date`/`end_date` — **no mencionados en la query de ejemplo del PM**, pero necesarios: sin `business_type` no hay forma de separar B2B de B2C. |
| La tabla muestra "porcentaje sobre el total del grupo" | ❌ | `TopCategoryItem` = `{ category, operation_type, total_amount }` — **no incluye ningún campo de porcentaje**. Hay que calcularlo en el frontend a partir de los `total_amount` ya recibidos. Es seguro hacerlo así porque `Category` solo tiene 5 valores posibles y se pide `limit=5` — la respuesta siempre contiene *todas* las categorías con ingresos de ese grupo, nunca un subconjunto truncado, así que `total_amount / suma(total_amount de la respuesta)` sí es el porcentaje real sobre el grupo. |
| "Las 5 categorías de ingreso principales" | ❌ | Verificado en la lógica real del generador (`_build_movement`, `backend/app/routes.py:70-88`): un movimiento de **ingreso** solo puede tener categoría `sales` (90%) u `others` (10%) — nunca `suppliers`, `operational` ni `administrative` (esas solo aparecen en `outcome`). Con este dataset, la tabla de "top 5 categorías de ingreso" mostrará **como mucho 2 filas**, no 5. No es un bug ni algo que "arreglar" — es como está generado el dataset — pero el copy de la UI no debe prometer "5" categorías si normalmente habrá 2. |
| "Las categorías disponibles para cada grupo deben obtenerse del endpoint de facetas" | ❌ | `MetricsFacets.categories` es una lista **global**, no segmentada por `business_type` ni por `operation_type` (`build_metrics_facets` en `backend/app/routes.py:150-158` recorre *todos* los movimientos sin filtrar). Pedir facetas no dice qué categorías tiene el ingreso de B2B específicamente — eso solo lo da la propia respuesta de `/api/metrics/categories/top?business_type=B2B&operation_type=income`, que ya trae categoría + total en un solo paso. Propongo **no usar `/api/metrics/facets` para categorías** — sí seguir usándolo para el rango de fechas disponible (min/max), igual que en la Funcionalidad 1. |
| "Un único gráfico compara el total de ingresos de B2B frente a B2C" | ✅ (derivable) | No hace falta una llamada nueva: el total de ingresos de cada grupo es la suma de los `total_amount` que ya devuelve `/api/metrics/categories/top` para ese `business_type` (mismo razonamiento que el porcentaje — la respuesta ya es completa). |

### Decisión de arquitectura a confirmar: no hay routing en el frontend

Verificado: `frontend/package.json` no tiene `react-router` ni ninguna
librería de rutas, y `frontend/src/main.tsx` monta `<App />` directamente
sin `<BrowserRouter>`. El PM pide "una nueva página" — **propongo no
añadir una librería de routing** (violaría la idea de no meter
dependencias nuevas para algo que se resuelve más simple) y en su lugar
un selector de vista con estado (`currentView: 'dashboard' |
'comparison'`) dentro de `App.tsx`, con un control de navegación pequeño
(dos botones/tabs) arriba del todo. Cambiar de vista desmonta la vista
anterior (no hay URL propia, no hay deep-linking, no se preserva scroll)
— aceptable para el tamaño actual de la app. Si se necesita URL propia o
persistencia entre recargas, eso sí requeriría introducir routing de
verdad — confirmar si es necesario antes de aprobar.

## Estado actual del sistema (verificado en el repo, no asumido)

- `GET /api/metrics/categories/top` **ya soporta** todo lo necesario
  (`operation_type`, `limit`, `start_date`, `end_date`, `business_type`) —
  [routes.py:287-302](../../backend/app/routes.py#L287-L302).
- No existe ninguna librería de routing en el frontend.
- `App.tsx` ya tiene un patrón establecido y reutilizable: `DateRangeFilter`
  (Funcionalidad 1) + fetch con `AbortController` + estado
  loading/error por sección (Funcionalidad 2) — esta feature reutiliza
  ambos patrones, no inventa uno nuevo.
- `DashboardHeader` tiene el título ("Financial Overview") y subtítulo
  ("Executive metrics dashboard") **hardcodeados**, no como props — para
  reusarlo en la nueva vista con un título distinto hace falta
  parametrizarlo (cambio pequeño, no ruptura: valores por defecto iguales
  a los actuales).
- No hay componente de tabla reutilizable en `components/ui/` (mismo
  hallazgo que la Funcionalidad 2) — se reutiliza el patrón de `<table>`
  con Tailwind ya usado en `anomaly-alerts-table.tsx`, no una librería
  nueva.
- `recharts` (ya es dependencia del proyecto) tiene `BarChart`, suficiente
  para el gráfico comparativo — no hace falta añadir nada.

**Conclusión**: no se necesitan cambios de backend. Sí hay una decisión de
arquitectura de frontend (routing vs. selector de vista) marcada arriba
para confirmar.

## User Scenarios & Testing

### Historia principal

Como miembro del equipo de finanzas, quiero una vista dedicada que
compare el ingreso de B2B contra B2C, con el desglose de categorías de
cada línea de negocio, para entender qué segmento y qué categorías
impulsan más ingreso.

### Escenarios de aceptación

1. **Given** el usuario navega a la vista de comparación, **When** carga,
   **Then** se muestran dos tablas en paralelo (B2B y B2C) con categoría,
   total de ingresos y porcentaje sobre el total de ese grupo, más un
   gráfico debajo comparando el total de ingresos B2B vs B2C.
2. **Given** la vista de comparación cargada, **When** el usuario aplica
   un rango de fechas, **Then** ambas tablas y el gráfico se recalculan
   usando solo movimientos dentro de ese rango.
3. **Given** un grupo (B2B o B2C) sin ingresos en el rango filtrado,
   **When** se recalcula, **Then** esa tabla muestra un mensaje de estado
   vacío explícito (mismo patrón que la Funcionalidad 2), no queda en
   blanco ni desaparece.
4. **Given** el rango de fechas introducido es inválido (inicio > fin),
   **When** el usuario lo aplica, **Then** se bloquea sin disparar
   peticiones y se muestra un error inline (mismo patrón que la
   Funcionalidad 1).
5. **Given** el usuario cambia entre la vista de dashboard y la de
   comparación, **When** vuelve a la de comparación, **Then** sus datos
   se vuelven a pedir (no hay caché entre cambios de vista — ver decisión
   de arquitectura).

### Edge cases

- Con el dataset actual, cada tabla mostrará como mucho 2 filas (`sales`,
  `others`) en vez de 5 — no es un error, el copy de la UI no debe decir
  "top 5" de forma literal si van a ser menos.
- Cambiar el rango de fechas mientras las peticiones de B2B y B2C siguen
  en vuelo: cada tabla usa su propio `AbortController`, independiente una
  de otra — una respuesta lenta de B2B no debe bloquear que B2C se
  actualice.
- Fallo de red en una de las dos llamadas (B2B u C2C): esa tabla muestra
  su propio error, la otra tabla y el gráfico no se ven afectados si sus
  datos sí llegaron.
- Si ambas llamadas fallan, el gráfico no tiene datos que comparar: debe
  mostrar su propio estado vacío/error, no un gráfico con barras en cero
  que parezca un dato real.

## Requirements

### Functional requirements

- **FR-001**: El sistema MUST ofrecer una forma de navegar entre el
  dashboard principal (Funcionalidades 1-2) y la nueva vista de
  comparación B2B vs B2C.
- **FR-002**: La vista de comparación MUST mostrar dos tablas en
  paralelo, una por línea de negocio, cada una con columnas: categoría,
  total de ingresos, porcentaje sobre el total de ingresos de ese grupo.
- **FR-003**: El porcentaje MUST calcularse en el frontend a partir de
  los `total_amount` devueltos por `/api/metrics/categories/top` para ese
  grupo (ver verificación de API) — no se inventa un endpoint nuevo.
- **FR-004**: Bajo ambas tablas, el sistema MUST mostrar un único gráfico
  comparando el total de ingresos de B2B frente a B2C, derivado de sumar
  los `total_amount` de cada grupo.
- **FR-005**: El sistema MUST ofrecer un filtro de rango de fechas
  (mismo componente y validación que la Funcionalidad 1) que afecte a
  ambas tablas y al gráfico simultáneamente.
- **FR-006**: Cuando una tabla no tiene categorías con ingresos en el
  rango filtrado, el sistema MUST mostrar un mensaje de estado vacío
  explícito en esa tabla, no ocultarla.
- **FR-007**: Un fallo de red en la llamada de un grupo MUST mostrarse
  como error propio de esa tabla, sin afectar la otra tabla si su llamada
  sí tuvo éxito.
- **FR-008**: El sistema MUST descartar respuestas obsoletas cuando el
  rango de fechas cambia antes de que una petición anterior resuelva
  (mismo mecanismo `AbortController` que las Funcionalidades 1 y 2),
  aplicado de forma independiente a B2B y a B2C.

### Key entities

- `TopCategoryItem` (nuevo tipo, mirror 1:1 del backend): `{ category:
  Category; operation_type: OperationType; total_amount: number }`.
- Valor derivado (no es un tipo de API, se calcula en frontend): cada
  `TopCategoryItem` con un `percentage: number` añadido para su fila en
  la tabla.
- No se reutiliza `MetricsFacets.categories` para nada en esta feature
  (ver verificación de API) — sí se reutiliza `MetricsFacets.min_date`/
  `max_date` para el texto de rango disponible del filtro de fechas.

## Fuera de alcance (explícitamente no incluido)

- Routing real (URLs propias por vista, deep-linking, botón atrás del
  navegador) — ver decisión de arquitectura.
- Filtrar la comparación por categoría u otro criterio adicional al
  rango de fechas.
- Comparar `outcome` además de `income` — el PM pide específicamente
  rendimiento de *ingresos*.
- Persistir la vista seleccionada entre recargas de página.
- Cachear los datos de una vista al cambiar a la otra y volver.

## Review checklist

- [x] Decisión de "selector de vista sin routing" confirmada
- [x] Cálculo de porcentaje en frontend (no en backend) confirmado
- [x] Uso de facetas limitado a min/max date (no categorías) confirmado
- [x] Requisitos revisados y aprobados
