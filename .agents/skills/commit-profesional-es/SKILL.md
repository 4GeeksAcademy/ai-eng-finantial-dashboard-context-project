---
name: commit-profesional-es
description: Redacta mensajes de commit profesionales en español siguiendo Conventional Commits, detectando el prefijo correcto (feat, fix, docs, refactor, perf, test, build, ci, chore, revert) a partir del diff real. Úsala cuando se pida "mensaje de commit", "commitea esto", "redacta el commit" o "genera el mensaje de commit".
license: MIT
metadata:
  author: ai-eng-financial-dashboard-context-project
  version: "1.0.0"
---

# Commit profesional en español

Genera mensajes de commit siguiendo la especificación [Conventional Commits](https://www.conventionalcommits.org/es/), con la descripción redactada en español y el prefijo de tipo detectado automáticamente a partir de los cambios reales, no adivinado.

## Cómo funciona

1. **Lee el diff real antes de escribir nada.** Ejecuta `git diff --staged` (o `git diff` si nada está en stage todavía). Nunca redactes el mensaje solo a partir de lo que el usuario dice que hizo — el diff es la fuente de verdad.
2. **Clasifica el tipo dominante.** Si el diff mezcla claramente dos tipos no relacionados (p. ej. una función nueva + una corrección de bug en otro módulo), recomienda dividir en commits separados en vez de forzar un solo prefijo. Si son cambios relacionados (p. ej. un fix que además necesitó un test), un solo commit está bien.
3. **Redacta el mensaje** siguiendo el formato de abajo.
4. **Muestra el mensaje propuesto al usuario antes de commitear.** Crear un commit es una acción visible y no siempre reversible sin reescribir historia — no lo ejecutes sin que el usuario vea el mensaje final primero, salvo que ya haya autorizado explícitamente "commitea sin preguntar" para esta sesión.

## Prefijos (tabla de decisión)

| Prefijo | Cuándo usarlo | Señal en el diff |
|---|---|---|
| `feat` | Nueva funcionalidad visible para quien usa el software | Nuevos componentes, endpoints, opciones de configuración usables |
| `fix` | Corrige un comportamiento incorrecto | El código anterior producía un resultado equivocado o un crash |
| `docs` | Solo documentación | Cambios en `.md`, comentarios, README, sin tocar código ejecutable |
| `style` | Formato que no cambia la lógica | Espacios, indentación, punto y coma — nunca uses esto si cambió el comportamiento |
| `refactor` | Reestructura código sin cambiar comportamiento observable ni corregir un bug | Mismo input → mismo output, pero el código interno cambió |
| `perf` | Mejora de rendimiento sin cambiar comportamiento funcional | Menos iteraciones, menos renders, caché, etc. |
| `test` | Añade o corrige tests, sin tocar código de producción | Solo archivos `*.test.*`, `*.spec.*` o carpetas de tests |
| `build` | Sistema de build o dependencias externas | `package.json`, `vite.config.*`, `Dockerfile`, lockfiles |
| `ci` | Configuración de integración continua | `.github/workflows`, scripts de pipeline |
| `chore` | Mantenimiento que no encaja en las anteriores y no toca `src` ni tests | Configuración de linters, `.gitignore`, tareas administrativas |
| `revert` | Revierte un commit anterior | Usa `revert: ` seguido del mensaje del commit revertido |

Si el diff toca tanto código de producción como sus tests para la misma funcionalidad, usa el prefijo del cambio de producción (`feat`/`fix`/`refactor`/`perf`) — no `test`, salvo que el commit sea *solo* tests.

## Formato del mensaje

```
<tipo>(<alcance opcional>): <descripción breve en español, imperativo, minúscula inicial, sin punto final>

<cuerpo opcional: explica el POR QUÉ, no el QUÉ — el diff ya muestra el qué>

<footer opcional: BREAKING CHANGE: ..., Refs #123, Closes #123>
```

Reglas de redacción:
- **Modo imperativo, no participio ni gerundio**: "corrige el cálculo de IVA", no "corregido el cálculo de IVA" ni "corrigiendo el cálculo de IVA".
- **El tipo y las palabras clave del footer (`BREAKING CHANGE`, `Refs`, `Closes`) se quedan en inglés** — son las que herramientas de release automatizado (semantic-release, etc.) parsean; el resto del mensaje va en español.
- **El alcance (`scope`) es opcional** y va entre paréntesis: `feat(dashboard): añade filtro por rango de fechas`. Úsalo cuando el proyecto tiene módulos o áreas claramente diferenciadas y ayuda a ubicar el cambio de un vistazo.
- **La descripción responde a "si se aplica este commit, ¿qué hace?"**, no a "qué se hizo" — de ahí el imperativo.
- **Sin punto final** en la línea de descripción.
- **Cuerpo solo si aporta contexto que el diff no muestra por sí solo**: una decisión de diseño, un incidente previo que motivó el cambio, una alternativa descartada y por qué. No repitas en prosa lo que el diff ya deja claro.

## Ejemplos

Correcto:
```
fix(alertas): evita división por cero cuando el umbral es 0

El cálculo de incremento porcentual dividía por baseline_average sin
comprobar que fuera mayor que cero, lo que rompía la tabla cuando no
había datos previos en el rango seleccionado.
```

```
feat(comparacion): añade vista B2B vs B2C con top de categorías
```

```
refactor(financial-utils): combina dos pasadas de filter+reduce en un único bucle
```

Incorrecto y por qué:
```
fix: arreglos varios
```
→ No dice qué se corrigió ni por qué; inútil en `git log` o `git blame` dentro de seis meses.

```
Fixed the bug in the date filter
```
→ Inglés (debe ir en español salvo el prefijo), participio en vez de imperativo, y sin prefijo de tipo.

```
feat: se añadió el nuevo componente de gráfico y también se corrigió un bug en el filtro de fechas que no validaba correctamente y se actualizó la documentación
```
→ Mezcla `feat` + `fix` + `docs` en un solo commit y mensaje; debería dividirse en tres commits.

## Nota sobre firmas/atribución automática

Esta skill controla el **contenido** del mensaje (tipo + descripción en español). No controla si el agente que la ejecuta añade una línea de atribución automática (p. ej. `Co-Authored-By: ...`) al final del commit — eso depende de la configuración del propio harness/sesión en la que se use la skill, que tiene prioridad sobre las instrucciones de cualquier skill cargada. Si quieres controlar esa firma, es una configuración del entorno donde corre el agente, no de este archivo.
