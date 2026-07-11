# Fase 2 - Auditoria de practicas de ingenieria

## Objetivo
Documentar practicas observadas en el repositorio con evidencia concreta y proponer reglas accionables para mitigar riesgos.

## Buenas practicas identificadas

### 1) Determinismo de datos mock para pruebas repetibles
- Categoria: Testing / Arquitectura de datos
- Evidencia: backend/app/routes.py (uso de seed=42 en generacion de movimientos)
- Valor: Reduce flakiness en pruebas y facilita comparar resultados entre ejecuciones.

### 2) Orden cronologico explicito en resultados
- Categoria: Calidad de datos / API
- Evidencia: backend/app/routes.py (ensure_chronological_order)
- Valor: Evita regresiones visuales en series temporales del dashboard.

### 3) Separacion entre logica de dominio y presentacion en frontend
- Categoria: Arquitectura frontend
- Evidencia: frontend/src/lib/financial-utils.ts y frontend/src/components/dashboard
- Valor: Mejora mantenibilidad y testabilidad de calculos financieros.

### 4) Tipado fuerte de respuestas en endpoints
- Categoria: API design
- Evidencia: backend/app/routes.py (response_model con modelos Pydantic)
- Valor: Contratos mas claros y validacion temprana de payloads.

### 5) Cobertura de pruebas sobre filtros y endpoints clave
- Categoria: Testing
- Evidencia: backend/tests/test_routes.py y frontend/src/lib/financial-utils.test.ts
- Valor: Protege comportamiento esencial de filtros, KPIs y agregaciones.

## Malas practicas o riesgos identificados

### 1) Periodo hardcodeado en UI
- Categoria: Producto / UX
- Evidencia: frontend/src/App.tsx (period="2024 - Full Year")
- Riesgo: Inconsistencia visual cuando el backend devuelve datos de anio dinamico.

### 2) Contratos duplicados manualmente entre backend y frontend
- Categoria: Arquitectura / Integracion
- Evidencia: backend/app/routes.py y frontend/src/lib/financial-types.ts
- Riesgo: Drift de contratos al evolucionar endpoints.

### 3) CORS abierto sin restriccion por entorno
- Categoria: Seguridad / Operacion
- Evidencia: backend/app/main.py (allow_origins=["*"])
- Riesgo: Exposicion innecesaria fuera de entorno local.

### 4) Regla desalineada con comando real de tests frontend
- Categoria: DX / Gobernanza
- Evidencia: .agents/rules/fullstack-workflow.md (usa npm test con flag no compatible en este repo)
- Riesgo: Friccion operativa y validaciones fallidas por guia incorrecta.

### 5) Fragilidad temporal en prueba de comparacion
- Categoria: Testing
- Evidencia: backend/tests/test_routes.py (rango de fechas fijo)
- Riesgo: Posibles fallos en el tiempo si cambia el contexto temporal de datos.

## Reglas propuestas derivadas
1. Toda visualizacion de periodo en UI debe derivarse de datos reales o filtros activos, nunca de valores hardcodeados.
2. Cualquier cambio de contrato en API debe actualizar tipos frontend y pruebas en el mismo commit.
3. Configuraciones de CORS deben depender de entorno y usar lista de origenes permitidos en no-desarrollo.
4. Las reglas en .agents/rules deben validarse contra comandos realmente ejecutables en el repositorio.
5. Las pruebas que dependan de fechas deben usar datos controlados o ventanas relativas estables.

## Estado de aplicacion
- Este documento sirve como base para refinar reglas en .agents/rules en la siguiente iteracion.