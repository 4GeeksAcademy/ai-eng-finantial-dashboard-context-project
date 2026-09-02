# Mantener `AGENTS.md` alineado con las carpetas que realmente existen

**Alcance:** `AGENTS.md` (raíz del repo), `.agents/rules/`, `.agents/skills/`,
`memory-bank/`.

**Justificación:** `AGENTS.md` instruye a cualquier agente a revisar
`./.agents/rules`, `./.agents/skills` y `./memory-bank` antes de actuar. En este
fork, comprobado directamente, solo `.agents/rules` existe; `.agents/skills` y
`memory-bank/` todavía no se han creado. Esto es esperado según los "Recommended
steps" del `README.md` (fork → inspeccionar → documentar reglas y memory bank),
pero un agente que confíe ciegamente en `AGENTS.md` puede asumir que esas
carpetas ya tienen contenido.

**Guía específica del proyecto:**
- Antes de asumir que existen skills o memory bank, comprobarlo (`ls .agents/skills`,
  `ls memory-bank`) en vez de fallar silenciosamente o inventar contenido.
- Si se crea `.agents/skills/` o `memory-bank/`, actualizar esta regla (o
  eliminarla) para reflejar el nuevo estado real del repo.
- Cualquier regla nueva que se añada a `.agents/rules/` debe seguir el patrón de
  nombre de archivo descriptivo en kebab-case, como se usa en este mismo
  directorio.
