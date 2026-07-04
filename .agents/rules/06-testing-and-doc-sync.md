# Regla: Minimo de Testing y Sincronia de Documentacion

## Nombre
Minimo de Testing y Sincronia de Documentacion

## Alcance
- backend/tests/**/*.py
- frontend/src/**/*.test.ts
- README.md
- README.es.md

## Razon
Iterar rapido sin pruebas ni actualizaciones de documentacion aumenta riesgo de regresion y friccion en onboarding. Este repo ya tiene una base solida de tests y documentacion bilingue que vale la pena preservar.

## Regla
- Cualquier cambio en logica de negocio debe incluir como minimo:
  - una prueba de camino exitoso
  - una prueba de borde/falla
- Cualquier cambio en comandos de ejecucion, variables de entorno, comportamiento de endpoints o puertos debe actualizar README.md y README.es.md en la misma tarea.

## Verificaciones de aceptacion
- La logica nueva solo se integra con adiciones de cobertura de pruebas correspondientes.
- La documentacion refleja setup ejecutable real y uso de API.

## Validacion en el repo
- Las pruebas actuales cubren rutas de backend y utilidades financieras del frontend.
- La documentacion actual define flujo con docker compose y puertos de servicios.
- Esta regla se alinea con flujos reales de este repo y evita desalineacion.

## Notas de refinamiento
- Refactors pequenos sin cambio de comportamiento pueden omitir tests nuevos si las pruebas existentes ya cubren ese comportamiento.
- Las actualizaciones de documentacion son obligatorias solo cuando cambia el comportamiento operativo.
