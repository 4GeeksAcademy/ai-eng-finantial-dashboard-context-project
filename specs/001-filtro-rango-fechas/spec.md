# Feature Specification: Filtro de rango de fechas en el dashboard principal

**Feature branch**: `001-filtro-rango-fechas`
**Estado**: Draft — pendiente de aprobación antes de pasar a `plan.md`
**Creado**: 2026-09-04

## Input original

> Funcionalidad 1 — Filtro de rango de fechas en el dashboard principal
> El equipo de finanzas quiere centrarse en períodos concretos sin ver todos
> los datos históricos a la vez. Añade dos inputs de fecha en la parte
> superior del dashboard — una fecha de inicio y una fecha de fin — que
> filtren todos los datos que se muestran actualmente en la página. Las
> fechas se envían a la API en formato YYYY-MM-DD. Ambos inputs son
> opcionales; cuando están vacíos, el dashboard muestra todos los datos
> disponibles. El rango de fechas disponible (la fecha más antigua y la más
> reciente del dataset) debe mostrarse cerca de los inputs como referencia
> para que el usuario sepa qué rango es válido.
>
> Endpoint relevante: `GET /api/metrics/facets` (para obtener el rango de
> fechas disponible) y la extensión de filtros sobre el endpoint de métricas
> existente.

## Estado actual del sistema (verificado en el repo, no asumido)

- `GET /api/metrics` **ya acepta** `start_date`/`end_date` opcionales en
  formato fecha, además de `category`/`operation_type`
  ([routes.py:249-259](../../backend/app/routes.py#L249-L259)).
- `GET /api/metrics/facets` **ya existe** y devuelve
  `min_date`/`max_date` (y otros facets)
  ([routes.py:262-265](../../backend/app/routes.py#L262-L265)).
- El frontend (`App.tsx`) hace `fetch` a `/api/metrics` **sin ningún
  parámetro**, no tiene inputs de fecha, y no llama a `/api/metrics/facets`
  ([App.tsx](../../frontend/src/App.tsx)).
- `frontend/src/lib/financial-types.ts` no tiene un tipo para
  `MetricsFacets`.

**Conclusión**: esta feature es de frontend. El backend no necesita cambios.
Si el `plan.md` propone tocar `backend/`, debe justificar explícitamente por
qué (viola el principio 6 de la constitución si no lo hace).

## User Scenarios & Testing

### Historia principal

Como miembro del equipo de finanzas, quiero filtrar el dashboard por un
rango de fechas para poder concentrarme en un período concreto sin revisar
todo el histórico a la vez.

### Escenarios de aceptación

1. **Given** el dashboard cargado, **When** el usuario no ha tocado los
   inputs de fecha, **Then** se muestran todos los datos disponibles (sin
   cambio respecto al comportamiento actual).
2. **Given** el dashboard cargado, **When** el usuario introduce solo una
   fecha de inicio válida, **Then** el dashboard muestra únicamente
   movimientos desde esa fecha en adelante.
3. **Given** el dashboard cargado, **When** el usuario introduce fecha de
   inicio y fin válidas (inicio ≤ fin), **Then** los KPIs y ambos gráficos
   (ingresos/egresos y % de rentabilidad) se recalculan usando solo los
   movimientos dentro de ese rango.
4. **Given** un filtro ya aplicado, **When** el usuario borra ambas fechas,
   **Then** el dashboard vuelve a mostrar todos los datos disponibles.
5. **Given** ambas fechas presentes, **When** la fecha de inicio es
   posterior a la de fin, **Then** no se dispara ninguna petición nueva y se
   muestra un mensaje de error inline indicando que el rango es inválido,
   hasta que el usuario lo corrija.
6. **Given** la carga inicial del dashboard, **When** termina de cargar,
   **Then** se muestra cerca de los inputs el rango de fechas disponible
   (fecha más antigua – fecha más reciente), obtenido de
   `GET /api/metrics/facets`.

### Edge cases

- Rango disponible de un solo día (`min_date == max_date`): los inputs
  deben seguir siendo usables y válidos.
- Fecha introducida fuera del rango disponible (anterior a `min_date` o
  posterior a `max_date`): el backend ya filtra sin error (puede devolver
  lista vacía o parcial); el frontend debe manejar un dataset vacío en
  KPIs/gráficos sin romperse.
- Falla la llamada a `/api/metrics/facets`: no debe bloquear el resto del
  dashboard; se degrada ocultando el texto de rango disponible, sin impedir
  que el usuario escriba fechas manualmente.
- El usuario cambia una fecha mientras una petición de filtro anterior
  sigue en curso: la petición más reciente es la que debe determinar lo que
  se pinta (evitar que una respuesta desactualizada sobrescriba una más
  nueva).

## Requirements

### Functional requirements

- **FR-001**: El dashboard MUST mostrar dos inputs de fecha (inicio y fin)
  cerca del encabezado, ambos opcionales.
- **FR-002**: Al cargar el dashboard, el sistema MUST obtener y mostrar el
  rango de fechas disponible (`min_date`, `max_date`) desde
  `GET /api/metrics/facets`, cerca de los inputs.
- **FR-003**: Cuando el usuario introduce/cambia una fecha válida, el
  sistema MUST volver a pedir los datos a `GET /api/metrics` incluyendo
  `start_date` y/o `end_date` (formato `YYYY-MM-DD`) automáticamente, sin
  necesidad de un botón "Aplicar".
- **FR-004**: Cuando ambos inputs están vacíos, el sistema MUST mostrar
  todos los datos disponibles (comportamiento equivalente al actual, sin
  parámetros de fecha en la petición).
- **FR-005**: Cuando `start_date > end_date` (ambas presentes), el sistema
  MUST bloquear el fetch y mostrar un mensaje de error inline hasta que el
  usuario corrija el rango.
- **FR-006**: Los KPIs (`KPIRow`) y ambos gráficos (`IncomeOutcomeChart`,
  `ProfitPercentChart`) MUST reflejar siempre el mismo conjunto de datos
  filtrado — no deben quedar desincronizados entre sí.
- **FR-007**: El sistema MUST seguir mostrando el mensaje de error existente
  si la llamada a `/api/metrics` (filtrada o no) falla, sin romper la
  página.
- **FR-008**: El sistema MUST descartar/ignorar respuestas de fetch
  obsoletas cuando el usuario cambia el filtro antes de que la petición
  anterior resuelva.

### Key entities

No se introducen entidades de dominio nuevas. Se reutiliza
`FinancialMovement` (ya tipado en frontend) y `MetricsFacets` (ya modelado
en backend, pendiente de tipar en frontend si `plan.md` lo requiere).

## Fuera de alcance (explícitamente no incluido)

- Filtro por categoría, tipo de operación o `business_type` (el backend ya
  lo soporta, pero no se pidió en esta funcionalidad).
- Persistir el filtro en la URL o en `localStorage`.
- Selección visual de rango vía librería de date-picker — un
  `<input type="date">` nativo es suficiente salvo que `plan.md` justifique
  lo contrario.

## Clarificaciones resueltas

- Rango inválido (`start > end`): se **bloquea** con mensaje de error
  inline (no se autocorrige).
- Momento de aplicar el filtro: **automático** al cambiar una fecha válida,
  sin botón "Aplicar".

## Review checklist

- [x] Requisitos revisados y aprobados por el usuario
- [x] Estado actual del backend verificado contra el código (no asumido)
- [x] Ambigüedades de comportamiento resueltas (ver "Clarificaciones
      resueltas")
- [ ] Sin dependencias externas nuevas necesarias (a confirmar en
      `plan.md`)
