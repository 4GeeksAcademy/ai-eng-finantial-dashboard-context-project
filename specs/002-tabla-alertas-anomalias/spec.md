# Feature Specification: Tabla de alertas de anomalías en el dashboard principal

**Feature branch**: `002-tabla-alertas-anomalias`
**Estado**: Draft — pendiente de revisión (afirmaciones de API marcadas para corregir)
**Creado**: 2026-09-04

## Input original

> Funcionalidad 2 — Tabla de alertas de anomalías en el dashboard principal
> Bajo los gráficos existentes, añade una tabla que destaque los períodos en
> los que el gasto subió de forma inesperada. La tabla tiene cuatro
> columnas: período, outcome registrado, media móvil de los 3 períodos
> anteriores e incremento porcentual. El umbral de alerta es configurable
> por el usuario mediante un input numérico (un ratio entre 0.01 y 1.0, por
> defecto 0.3). Si no se detectan anomalías para el umbral actual, la tabla
> debe mostrar un mensaje explícito de estado vacío — no simplemente
> desaparecer. La tabla también debe respetar el rango de fechas
> establecido en la Funcionalidad 1 si está activo.
>
> Endpoint relevante: `GET /api/metrics/alerts?threshold=<ratio>`

## Verificación de API (contra `docs/openapi.json`)

| Afirmación del PM | Estado | Detalle |
|---|---|---|
| Existe `GET /api/metrics/alerts` con parámetro `threshold` | ✅ | `docs/openapi.json` → `paths./api/metrics/alerts.get`. También acepta `group_by`, `start_date`, `end_date`, `business_type` (no mencionados por el PM, ver más abajo). |
| La tabla tiene columnas período, outcome, media móvil, incremento % | ✅ (campos existen) | `MetricsAlert` = `{ period, outcome_total, baseline_average, increase_ratio }` — cuatro campos, uno por columna pedida. |
| `threshold` es "un ratio entre 0.01 y 1.0" | ❌ | El schema solo declara `minimum: 0` (sin `maximum`), `default: 0.3`. El backend **no** impone el rango 0.01–1.0 — acepta `0` o `5.0` sin error. Si el rango 0.01–1.0 importa, hay que **aplicarlo en el frontend**, no asumir que el backend lo rechaza. |
| "Media móvil de los 3 períodos anteriores" | ❌ | Verificado leyendo la lógica real (el schema OpenAPI no expone semántica de negocio, solo tipos): `detect_outcome_alerts` (`backend/app/routes.py:219-240`) calcula `baseline = sum(historical_outcomes) / len(historical_outcomes)` sobre **todos** los períodos anteriores acumulados desde el inicio del dataset, no una ventana fija de 3. `baseline_average` es un **promedio acumulado (expanding average)**, no una media móvil de 3 períodos. Ver "Discrepancia a resolver" abajo. |
| La tabla respeta el rango de fechas de la Funcionalidad 1 | ✅ | El endpoint acepta `start_date`/`end_date` (mismo formato `YYYY-MM-DD` que `/api/metrics`). |
| Agrupación temporal de "período" | ❓ | El endpoint acepta `group_by` (`day`/`week`/`month`, default `month`). El PM no lo menciona. Propongo dejarlo fijo en `month` (coincide con la agrupación ya usada en los gráficos de la Funcionalidad 1) — confirmar si se quiere exponer al usuario. |
| El primer período del rango nunca puede generar alerta | ❓ (comportamiento, no bug) | No hay `historical_outcomes` previos para el primer período de la serie, así que nunca dispara alerta aunque su outcome sea alto. Es consecuencia directa del cálculo acumulado, no un caso a "arreglar" — documentado como edge case. |

### Discrepancia a resolver: "media móvil de 3 períodos" vs. comportamiento real

El backend ya implementado no calcula lo que pide el enunciado. Dos
caminos, y **propongo el primero** por ser el que no requiere tocar
backend ni añadir lógica de negocio en el frontend (violaría el principio
1 de la constitución — la lógica de detección de anomalías es del
backend, no debería recalcularse en el cliente):

1. **(Propuesto)** Usar `baseline_average` tal cual lo da la API, y titular
   la columna de forma honesta ("Outcome promedio anterior" o similar) en
   vez de "media móvil (3 períodos)" para no prometer algo que el dato no
   es. La detección de anomalías (qué períodos aparecen en la tabla) ya la
   hace el backend con ese mismo baseline, así que el criterio de alerta
   es consistente aunque el nombre de columna cambie.
2. **(Alternativa, no recomendada aquí)** Pedir que el backend implemente
   una ventana real de 3 períodos — cambiaría qué períodos cuentan como
   anomalía, no es un cambio cosmético de frontend. Fuera de alcance de
   este spec si no se decide explícitamente.

Si el número exacto de períodos de la media importa para el negocio,
confirmar antes de aprobar este spec — si no, sigo con la opción 1.

## Estado actual del sistema (verificado en el repo, no asumido)

- `GET /api/metrics/alerts` **ya existe y ya soporta** `threshold`,
  `group_by`, `start_date`, `end_date`, `business_type`
  ([routes.py:342-359](../../backend/app/routes.py#L342-L359)).
- No hay ningún componente de tabla en `frontend/src/components/ui/`
  (solo `card.tsx` y `skeleton.tsx`) — se necesita un componente de tabla
  nuevo, no hay uno que reutilizar.
- `frontend/src/lib/financial-types.ts` no tiene un tipo para
  `MetricsAlert`.
- `App.tsx` ya tiene `startDate`/`endDate` como estado (de la Funcionalidad
  1) — esta tabla debe leer ese mismo estado, no crear uno propio.

**Conclusión**: como en la Funcionalidad 1, no se necesitan cambios de
backend — es una feature de frontend que consume un endpoint que ya
existe con todo lo necesario.

## User Scenarios & Testing

### Historia principal

Como miembro del equipo de finanzas, quiero ver una tabla de alertas de
gasto anómalo bajo los gráficos para detectar rápidamente en qué períodos
el gasto se disparó por encima de lo esperado, con un umbral que puedo
ajustar.

### Escenarios de aceptación

1. **Given** el dashboard cargado, **When** hay períodos con incremento de
   gasto por encima del umbral por defecto (0.3), **Then** la tabla
   muestra una fila por cada anomalía con período, outcome, promedio
   anterior e incremento porcentual.
2. **Given** la tabla con alertas visibles, **When** el usuario sube el
   umbral (por ejemplo a 0.8), **Then** la tabla se recalcula y puede
   mostrar menos filas (o ninguna).
3. **Given** el umbral actual no genera ninguna anomalía, **When** la
   tabla se actualiza, **Then** se muestra un mensaje de estado vacío
   explícito (no la tabla desaparece ni queda en blanco).
4. **Given** un rango de fechas activo (Funcionalidad 1), **When** se
   consulta la tabla de alertas, **Then** solo se consideran movimientos
   dentro de ese rango (misma semántica de `start_date`/`end_date` que
   `/api/metrics`).
5. **Given** el rango de fechas cambia (Funcionalidad 1) mientras el
   umbral se mantiene, **Then** la tabla de alertas se recalcula también,
   sin que el usuario tenga que reconfigurar el umbral.
6. **Given** el usuario introduce un umbral fuera de 0.01–1.0 o no
   numérico, **When** intenta aplicarlo, **Then** se bloquea con un
   mensaje de error inline y no se dispara ninguna petición (mismo patrón
   ya usado para el rango de fechas inválido en la Funcionalidad 1 — ver
   `specs/001-filtro-rango-fechas/spec.md` FR-005).

### Edge cases

- Umbral en el límite exacto (`increase_ratio == threshold`): el backend
  usa `>` estricto, no `>=` — un período con incremento exactamente igual
  al umbral **no** aparece como alerta. Documentado, no es un bug a
  corregir en frontend.
- Primer período del rango filtrado: nunca puede ser alerta (no tiene
  histórico previo dentro del rango) — ver tabla de verificación arriba.
- Cambiar el umbral y el rango de fechas casi simultáneamente: misma
  condición de carrera que en la Funcionalidad 1 — la respuesta aplicada
  debe corresponder siempre a la combinación `(threshold, startDate,
  endDate)` más reciente.
- Fallo de red en `/api/metrics/alerts`: no debe romper el resto del
  dashboard (KPIs/gráficos siguen funcionando); se muestra un error
  específico de esta sección, no el banner genérico de `/api/metrics`.

## Requirements

### Functional requirements

- **FR-001**: Bajo los gráficos existentes, el dashboard MUST mostrar una
  tabla con columnas: período, outcome registrado, promedio de períodos
  anteriores, incremento porcentual.
- **FR-002**: El dashboard MUST ofrecer un input numérico para el umbral
  de alerta, rango 0.01–1.0, valor por defecto 0.3, validado en el
  frontend (el backend no impone ese rango — ver verificación de API).
- **FR-003**: Al cambiar el umbral a un valor válido, el sistema MUST
  volver a pedir `/api/metrics/alerts` con ese `threshold` automáticamente
  (mismo patrón "automático al cambiar" que la Funcionalidad 1, sin botón
  "Aplicar" — consistencia de interacción entre ambos filtros).
- **FR-004**: Cuando la respuesta no tiene alertas (`[]`), el sistema MUST
  mostrar un mensaje de estado vacío explícito en el lugar de la tabla,
  nunca ocultar la sección sin más.
- **FR-005**: La tabla MUST incluir `start_date`/`end_date` en la petición
  cuando el filtro de fecha de la Funcionalidad 1 esté activo, y
  recalcularse cuando ese rango cambie.
- **FR-006**: Cuando el umbral introducido es inválido (fuera de
  0.01–1.0, vacío o no numérico), el sistema MUST bloquear la petición y
  mostrar un error inline hasta que se corrija.
- **FR-007**: Un fallo de red en `/api/metrics/alerts` MUST mostrarse como
  un error propio de la sección, sin afectar KPIs ni gráficos.
- **FR-008**: El sistema MUST descartar respuestas obsoletas cuando
  `threshold`, `startDate` o `endDate` cambian antes de que una petición
  anterior resuelva (mismo mecanismo que FR-008 de la Funcionalidad 1).

### Key entities

- `MetricsAlert` (nuevo tipo a añadir en `financial-types.ts`, mirror
  1:1 del modelo del backend): `{ period: string; outcome_total: number;
  baseline_average: number; increase_ratio: number }`.
- No hay entidades nuevas de dominio — reutiliza lo ya expuesto por el
  backend.

## Fuera de alcance (explícitamente no incluido)

- Control de `group_by` (día/semana/mes) — fijo en `month` salvo que se
  confirme lo contrario (ver tabla de verificación).
- Control de `business_type` en esta tabla — el endpoint lo soporta pero
  el PM no lo pidió.
- Recalcular una media móvil real de 3 períodos en el frontend — ver
  "Discrepancia a resolver".
- Ordenar/paginar la tabla, exportarla, o acciones sobre las filas.

## Review checklist

- [x] Discrepancia "media móvil de 3 períodos" resuelta con el usuario —
      opción 1 aprobada (usar `baseline_average` tal cual, renombrar
      columna)
- [x] Rango 0.01–1.0 del umbral confirmado como validación solo-frontend
- [x] `group_by` fijo en `month` confirmado
- [x] Requisitos revisados y aprobados
