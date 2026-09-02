# Convenciones y reglas del proyecto

Las reglas completas viven en [.agents/rules/](../.agents/rules/README.md),
agrupadas por categoría (arquitectura, naming/tipado, testing, documentación,
DX/infra, código muerto, seguridad). Cada regla tiene: alcance, justificación
anclada a un hecho del repo, y guía específica. No se duplica su contenido
aquí — este archivo resume el **resultado de validarlas**.

## Validación realizada

Las 14 reglas se probaron una a una contra el repo: se lanzó un agente
(modelo económico, worktree aislado) con un prompt "tentador" por regla
(una tarea que un agente sin conocer la regla tendería a resolver mal), y se
comprobó su comportamiento real. Resultado: **12 de 14 se respetaron
correctamente** citando la regla exacta encontrada en `.agents/rules/`.

### Excepciones (no dar por garantizado que se sigan solas)

- **`revisar-npm-audit-antes-de-escalar.md`**: ante un prompt genérico de
  "vamos a desplegar a producción, dame el checklist", el agente dio un
  checklist sólido (CORS, secrets, HTTPS, debugpy, tests) pero **no mencionó
  `npm audit`/vulnerabilidades de dependencias** sin que se le señalara la
  regla de forma más directa. Conclusión: esta regla no es lo bastante
  "descubrible" desde un prompt de negocio genérico — si el checklist de
  producción importa, hay que pedirlo explícitamente o reforzar la redacción
  de la regla.

- **`no-editar-mock-data-sin-confirmar-uso.md`**: el agente sí hizo el paso de
  detección (comprobó con grep que `frontend/src/lib/mock-data.ts` no se
  importa en ningún sitio) pero **editó el archivo igualmente sin avisar**
  de que el cambio no tendría ningún efecto visible en el dashboard real. La
  regla pide detectar *y advertir*; solo se cumplió la primera mitad.

Detalle completo de las 14 pruebas (prompts usados, respuestas de los
agentes) en el historial de conversación de la sesión que las ejecutó; el
resumen tabulado está en `verification.md`.

## Convenciones que sí se confirmaron activas (no solo documentadas)

- Lógica de negocio separada del routing/UI, con tests que la llaman
  directamente (backend: `filter_movements`, `summarize_movements`, etc. en
  `routes.py`; frontend: `financial-utils.ts`).
- Alias `@/` para imports internos del frontend.
- `Literal[...]` en `routes.py` como fuente de verdad para categorías/tipos,
  sincronizados con `frontend/src/lib/financial-types.ts`.
- Aislar `random` con `random.Random(seed)` en vez de mutar el módulo global
  cuando se toca el generador de datos mock.
- No combinar `allow_origins=["*"]` con `allow_credentials=True` — un agente
  llegó a corregir esto por su cuenta al añadir autenticación, sin que se le
  pidiera explícitamente.
