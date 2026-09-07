# Mantener `AGENTS.md` alineado con las carpetas que realmente existen

**Alcance:** `AGENTS.md` (raíz del repo), `.agents/rules/`, `.agents/skills/`,
`memory-bank/`.

**Justificación:** `AGENTS.md` instruye a cualquier agente a revisar
`./.agents/rules`, `./.agents/skills` y `./memory-bank` antes de actuar. Estado
actual, comprobado directamente: `.agents/rules/` existe (14 reglas + índice),
`memory-bank/` existe (creado con `project-overview.md`, `decisions-and-fixes.md`,
`conventions-and-rules.md`, `open-items.md`, `progress.md`); `.agents/skills/`
existe desde la rama `feature/agent-skills` con una skill propia
(`commit-profesional-es/SKILL.md`, ver `memory-bank/progress.md`). Un agente
que confíe ciegamente en `AGENTS.md` sin comprobar el contenido real de
`.agents/skills/` puede asumir que hay más (o menos) skills de las que
realmente existen.

**Guía específica del proyecto:**
- Antes de asumir que existen skills, comprobarlo (`ls .agents/skills`) en vez
  de fallar silenciosamente o inventar contenido.
- Antes de actuar, leer `memory-bank/` — ya contiene el estado sintetizado del
  proyecto (arquitectura, decisiones y fixes ya aplicados, resultado de
  validar las reglas, pendientes conocidos); evita redescubrir lo que ya está
  documentado ahí.
- Si se crea `.agents/skills/`, o si `memory-bank/` se reestructura de forma
  incompatible con lo descrito aquí, actualizar esta regla para reflejar el
  nuevo estado real del repo.
- Cualquier regla nueva que se añada a `.agents/rules/` debe seguir el patrón de
  nombre de archivo descriptivo en kebab-case, como se usa en este mismo
  directorio.
