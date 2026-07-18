# Regla: Documentacion sin referencias rotas

## Proposito
Mantener onboarding confiable y reducir friccion al ejecutar el proyecto.

## Alcance
- Documentacion en raiz (`README.md`, `README.es.md`, `AGENTS.md`).
- Referencias a archivos y carpetas operativas.

## Regla concreta y verificable
Toda referencia a archivo o carpeta obligatoria en la documentacion debe cumplir una de dos condiciones:
1. El recurso existe en el repo.
2. Se marca explicitamente como pendiente con accion y responsable.

## Justificacion
Evita drift documental y pasos de setup que fallan por artefactos inexistentes.

## Ejemplos aplicados al repo
- Caso a validar: referencia a `frontend/.env.example`.
- Caso a validar: rutas `./.agents/rules`, `./.agents/skills`, `./memory-bank` en `AGENTS.md`.

## Criterios de validacion
- No hay links o rutas rotas en docs principales.
- Si un archivo no existe, queda marcado como pendiente con nota explicita.
- Cambios de estructura se reflejan en docs en el mismo PR.

## Anti-patrones
- Documentar comandos o rutas que no existen.
- Aceptar PR con cambios estructurales sin actualizar README/AGENTS.
