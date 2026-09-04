# Constitución del proyecto

Principios que cualquier spec/plan/tasks de `specs/` debe respetar. No
duplica reglas — para el detalle completo con justificación y ejemplos, ver
[.agents/rules/](../.agents/rules/README.md) y
[memory-bank/conventions-and-rules.md](../memory-bank/conventions-and-rules.md).
Si un plan choca con un principio de aquí, el plan debe decirlo
explícitamente y justificar la excepción, no ignorarlo en silencio.

## Principios

1. **Lógica de negocio separada de routing/UI.** Backend: funciones puras en
   `routes.py` (`filter_movements`, `summarize_movements`, etc.), no lógica
   dentro de los handlers. Frontend: funciones puras en `lib/*.ts`
   (`financial-utils.ts`), no lógica de negocio dentro de componentes React.
   Ambas deben ser testeables sin levantar servidor/DOM.

2. **Una sola fuente de verdad para tipos de dominio.** Las categorías,
   `operation_type`, `business_type` viven como `Literal[...]` en
   `backend/app/routes.py` y deben reflejarse en
   `frontend/src/lib/financial-types.ts`. No se introduce un tipo nuevo en un
   lado sin sincronizarlo en el otro.

3. **Datos mock deterministas.** `generate_mock_movements(seed=42)` debe
   seguir produciendo el mismo dataset en cada request. Cualquier uso nuevo
   de `random` se aísla (`random.Random(seed)`), nunca se muta el estado
   global de forma que rompa el determinismo.

4. **No mezclar CORS wildcard con credenciales.** Si una feature añade
   autenticación/cookies, `allow_origins=["*"]` en `backend/app/main.py` deja
   de ser válido y debe restringirse.

5. **Alias `@/` para imports internos del frontend.** No usar rutas
   relativas largas (`../../lib/...`) cuando el alias ya cubre el caso.

6. **Verificar el estado real antes de especificar/planificar.** Antes de
   escribir un spec o un plan, comprobar en el código si lo pedido ya existe
   parcial o totalmente (endpoints, tipos, componentes) en vez de asumir que
   hay que construirlo desde cero. `docs/` y `specs/` deben quedar alineados
   con lo que el repo realmente tiene.

7. **Toda afirmación de API en un spec se verifica contra `docs/openapi.json`.**
   Cada vez que un spec dice algo sobre un endpoint (existe, campos,
   parámetros, tipos), se marca inline: ✅ verificado contra
   `docs/openapi.json`, ❌ incorrecto, o ❓ sin verificar — nunca se asume en
   silencio. Ver [docs/README.md](../docs/README.md) para cómo regenerar el
   esquema si el backend cambió.

8. **Spec-driven development en este proyecto es spec-only.** Los artefactos
   de `specs/<feature>/` (spec, plan, tasks, tipos, contrato de datos) no
   incluyen implementar componentes React ni llamadas a la API — eso es
   trabajo de otra fase, fuera de este flujo, salvo que el usuario pida
   explícitamente lo contrario para una feature concreta.

## Cómo se usa esta constitución

- **`/specify`**: el spec no debe contradecir estos principios; si lo hace,
  debe marcarse como excepción explícita a revisar.
- **`/plan`**: el plan técnico se valida contra esta lista antes de pasar a
  `/tasks`.
- Actualizar este archivo cuando se descubra un principio nuevo confirmado
  en la práctica (no aspiracional) — ver criterio en
  `memory-bank/conventions-and-rules.md`.
