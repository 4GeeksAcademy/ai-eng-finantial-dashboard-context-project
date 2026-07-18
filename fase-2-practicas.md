- Confirmar estado real del repositorio en documentación, configuración y código ejecutable.
- Extraer evidencia con líneas de backend, frontend, tests y orquestación para sustentar cada hallazgo.
- Separar fortalezas y riesgos por impacto en arquitectura, testing, seguridad, DX y mantenibilidad.
- Proponer reglas concretas, verificables y priorizadas para agentes y desarrolladores.
- Definir un plan de adopción por horizontes para mejorar sin romper el flujo actual.

# Fase 2 - Prácticas de ingeniería

## 1) Buenas prácticas detectadas

1. Práctica: Contratos tipados de dominio en frontend y backend.
Por qué aporta valor: Reduce ambigüedad del modelo financiero y facilita validación temprana.
Evidencia: [backend/app/routes.py](backend/app/routes.py#L11), [backend/app/routes.py](backend/app/routes.py#L22), [frontend/src/lib/financial-types.ts](frontend/src/lib/financial-types.ts#L1), [frontend/src/lib/financial-types.ts](frontend/src/lib/financial-types.ts#L5).

2. Práctica: Endpoints con response_model en FastAPI.
Por qué aporta valor: Estandariza salidas, mejora documentación automática y evita respuestas inconsistentes.
Evidencia: [backend/app/routes.py](backend/app/routes.py#L248), [backend/app/routes.py](backend/app/routes.py#L262), [backend/app/routes.py](backend/app/routes.py#L305), [backend/app/routes.py](backend/app/routes.py#L342).

3. Práctica: Lógica analítica del frontend separada en funciones puras.
Por qué aporta valor: Permite testear cálculos sin depender del renderizado de React.
Evidencia: [frontend/src/lib/financial-utils.ts](frontend/src/lib/financial-utils.ts#L21), [frontend/src/lib/financial-utils.ts](frontend/src/lib/financial-utils.ts#L36), [frontend/src/App.tsx](frontend/src/App.tsx#L11), [frontend/src/App.tsx](frontend/src/App.tsx#L32).

4. Práctica: Cobertura de tests sobre casos de negocio y bordes.
Por qué aporta valor: Protege comportamientos críticos (agregaciones, orden cronológico, filtros y formato).
Evidencia: [frontend/src/lib/financial-utils.test.ts](frontend/src/lib/financial-utils.test.ts#L35), [frontend/src/lib/financial-utils.test.ts](frontend/src/lib/financial-utils.test.ts#L47), [backend/tests/test_routes.py](backend/tests/test_routes.py#L121), [backend/tests/test_routes.py](backend/tests/test_routes.py#L157).

5. Práctica: Setup de DX consistente con scripts de build, lint y test.
Por qué aporta valor: Facilita validación local y automatización en CI.
Evidencia: [frontend/package.json](frontend/package.json#L6), [frontend/package.json](frontend/package.json#L8), [frontend/package.json](frontend/package.json#L11), [frontend/package.json](frontend/package.json#L13), [backend/requirements.txt](backend/requirements.txt#L4).

6. Práctica: Integración local clara entre frontend y backend mediante proxy de Vite + Docker Compose.
Por qué aporta valor: Simplifica desarrollo local sin configuración compleja de CORS/orígenes en frontend.
Evidencia: [frontend/vite.config.ts](frontend/vite.config.ts#L11), [frontend/vite.config.ts](frontend/vite.config.ts#L13), [docker-compose.yml](docker-compose.yml#L9), [docker-compose.yml](docker-compose.yml#L19).

## 2) Malas prácticas o riesgos detectados

1. Problema/riesgo: CORS totalmente abierto en backend.
Impacto probable: Exposición innecesaria en despliegues no controlados y mayor superficie de abuso por origen.
Evidencia: [backend/app/main.py](backend/app/main.py#L9), [backend/app/main.py](backend/app/main.py#L10), [backend/app/main.py](backend/app/main.py#L11), [backend/app/main.py](backend/app/main.py#L12).
Severidad: alta.

2. Problema/riesgo: Datos de API basados en mock generado en memoria en cada endpoint.
Impacto probable: Falta de persistencia, imposibilidad de trazabilidad real y baja representatividad para escenarios productivos.
Evidencia: [backend/app/routes.py](backend/app/routes.py#L94), [backend/app/routes.py](backend/app/routes.py#L255), [backend/app/routes.py](backend/app/routes.py#L277), [backend/app/routes.py](backend/app/routes.py#L350).
Severidad: alta.

3. Problema/riesgo: Duplicación de lógica de filtrado por business_type y regeneración de datos en múltiples endpoints.
Impacto probable: Mayor costo de mantenimiento y riesgo de inconsistencias al evolucionar reglas.
Evidencia: [backend/app/routes.py](backend/app/routes.py#L278), [backend/app/routes.py](backend/app/routes.py#L296), [backend/app/routes.py](backend/app/routes.py#L312), [backend/app/routes.py](backend/app/routes.py#L369), [backend/app/routes.py](backend/app/routes.py#L385).
Severidad: media.

4. Problema/riesgo: Fetch en React sin cancelación explícita ni control de carreras de respuestas.
Impacto probable: Actualizaciones de estado tardías en desmontaje o navegación rápida; fallos intermitentes difíciles de depurar.
Evidencia: [frontend/src/App.tsx](frontend/src/App.tsx#L29), [frontend/src/App.tsx](frontend/src/App.tsx#L30), [frontend/src/App.tsx](frontend/src/App.tsx#L40).
Severidad: media.

5. Problema/riesgo: Documento principal referencia un archivo de entorno no presente.
Impacto probable: Fricción de onboarding y dudas al configurar cambios de origen API.
Evidencia: [README.md](README.md#L46). Hallazgo de ausencia en árbol actual del repo.
Severidad: media.

6. Problema/riesgo: Guía de agentes exige rutas de reglas/skills/memory-bank que no existen en este fork.
Impacto probable: Incumplimiento operativo de procesos definidos y resultados heterogéneos entre agentes.
Evidencia: [AGENTS.md](AGENTS.md#L5), [AGENTS.md](AGENTS.md#L8), [AGENTS.md](AGENTS.md#L11). Hallazgo de ausencia en árbol actual del repo.
Severidad: media.

## 3) Hallazgos agrupados por categoría

- Arquitectura:
El backend concentra modelos, generación de datos, reglas y endpoints en un solo módulo; hay buena claridad inicial pero aumenta acoplamiento al crecer. Evidencia: [backend/app/routes.py](backend/app/routes.py#L22), [backend/app/routes.py](backend/app/routes.py#L94), [backend/app/routes.py](backend/app/routes.py#L248).

- Testing:
Existe cobertura útil en frontend y backend para lógica y endpoints; la estrategia es positiva para evitar regresiones en cálculos y filtros. Evidencia: [frontend/src/lib/financial-utils.test.ts](frontend/src/lib/financial-utils.test.ts#L35), [backend/tests/test_routes.py](backend/tests/test_routes.py#L121).

- Seguridad:
Configuración de CORS permisiva adecuada para demo, riesgosa fuera de entorno controlado. Evidencia: [backend/app/main.py](backend/app/main.py#L9).

- Documentación:
README guía bien el arranque y flujo base, pero hay drift con artefactos esperados no presentes (.env.example, carpetas de agentes). Evidencia: [README.md](README.md#L39), [README.md](README.md#L46), [AGENTS.md](AGENTS.md#L5).

- DX:
Scripts de npm y proxy de Vite mejoran experiencia local; Docker Compose facilita arranque conjunto. Evidencia: [frontend/package.json](frontend/package.json#L6), [frontend/vite.config.ts](frontend/vite.config.ts#L11), [docker-compose.yml](docker-compose.yml#L1).

- Calidad de código y mantenibilidad:
Tipado fuerte y utilidades puras son un punto fuerte; la duplicación de lógica en endpoints es el principal foco de deuda técnica interna. Evidencia: [frontend/src/lib/financial-types.ts](frontend/src/lib/financial-types.ts#L1), [frontend/src/lib/financial-utils.ts](frontend/src/lib/financial-utils.ts#L21), [backend/app/routes.py](backend/app/routes.py#L278).

## 4) Reglas propuestas para el repositorio

1. Regla: Todo endpoint nuevo debe declarar response_model y pruebas de contrato mínimo (status, shape y caso de borde).
Problema que previene: Respuestas inconsistentes y regresiones silenciosas.
Ejemplo de cumplimiento en este repo: [backend/app/routes.py](backend/app/routes.py#L268), [backend/tests/test_routes.py](backend/tests/test_routes.py#L128).
Prioridad: alta.

2. Regla: No duplicar filtros o transformaciones de dominio entre endpoints; extraer helpers reutilizables cuando aparezca la segunda duplicación.
Problema que previene: Divergencia de comportamiento y deuda de mantenimiento.
Ejemplo de cumplimiento en este repo: [backend/app/routes.py](backend/app/routes.py#L125), [backend/app/routes.py](backend/app/routes.py#L146).
Prioridad: alta.

3. Regla: Mantener configuración de CORS por entorno; en desarrollo puede ser amplia, en cualquier otro entorno debe ser explícita por allow_origins.
Problema que previene: Exposición innecesaria de API.
Ejemplo de cumplimiento en este repo: [backend/app/main.py](backend/app/main.py#L7).
Prioridad: alta.

4. Regla: Cualquier referencia documental a archivos o carpetas obligatorias debe validarse en el repo (archivo existente o tarea explícita en backlog).
Problema que previene: Fricción de onboarding y documentación desactualizada.
Ejemplo de cumplimiento en este repo: [README.md](README.md#L46), [AGENTS.md](AGENTS.md#L5).
Prioridad: media.

5. Regla: En frontend, separar siempre la lógica de cálculo en módulos puros bajo src/lib y cubrirla con tests unitarios antes de usarla en componentes.
Problema que previene: Acoplamiento UI-negocio y baja testabilidad.
Ejemplo de cumplimiento en este repo: [frontend/src/lib/financial-utils.ts](frontend/src/lib/financial-utils.ts#L21), [frontend/src/lib/financial-utils.test.ts](frontend/src/lib/financial-utils.test.ts#L35).
Prioridad: media.

6. Regla: En efectos asíncronos de React, usar cancelación con AbortController o guardas de montaje en operaciones de red.
Problema que previene: Actualizaciones de estado tardías y bugs intermitentes.
Ejemplo de cumplimiento en este repo: Patrón aún no aplicado en [frontend/src/App.tsx](frontend/src/App.tsx#L29).
Prioridad: media.

7. Regla: Mantener scripts mínimos de calidad en ambos lados (lint, test, build) y documentar comando único de verificación pre-merge.
Problema que previene: Integraciones con calidad desigual entre frontend y backend.
Ejemplo de cumplimiento en este repo: [frontend/package.json](frontend/package.json#L6), [backend/requirements.txt](backend/requirements.txt#L4).
Prioridad: media.

## 5) Plan de adopción recomendado

- Quick wins (1 a 3 días):
1. Actualizar README y AGENTS para reflejar estado real o crear los artefactos faltantes mínimos.
2. Añadir archivo de entorno de ejemplo del frontend o retirar su referencia documental.
3. Definir orígenes CORS por variable de entorno con valor seguro por defecto para desarrollo.

- Mejoras de corto plazo (1 a 2 semanas):
1. Refactorizar backend/app/routes.py para extraer servicios internos de filtrado y agregación reutilizables.
2. Añadir pruebas backend que validen consistencia entre endpoints con filtros compartidos.
3. Incorporar cancelación de fetch en App para robustecer UX ante cambios de navegación.

- Mejoras estructurales (más de 2 semanas):
1. Introducir capa de persistencia real y separar claramente rutas, servicios y acceso a datos.
2. Consolidar contratos de API (OpenAPI versionado o esquema compartido) y alinear frontend a endpoints agregados del backend.
3. Formalizar gobernanza de agentes con carpeta .agents y reglas versionadas aplicables en CI.

## 6) Fuentes revisadas

- README principal: [README.md](README.md) (clave).
- Guía de agentes del repositorio: [AGENTS.md](AGENTS.md) (clave).
- Orquestación local: [docker-compose.yml](docker-compose.yml) (clave).
- Bootstrap y seguridad backend: [backend/app/main.py](backend/app/main.py) (clave).
- Lógica y endpoints backend: [backend/app/routes.py](backend/app/routes.py) (clave).
- Pruebas backend: [backend/tests/test_routes.py](backend/tests/test_routes.py) (clave).
- Dependencias backend: [backend/requirements.txt](backend/requirements.txt).
- Scripts y dependencias frontend: [frontend/package.json](frontend/package.json) (clave).
- Integración frontend-backend por proxy: [frontend/vite.config.ts](frontend/vite.config.ts).
- Reglas de lint frontend: [frontend/eslint.config.js](frontend/eslint.config.js).
- Flujo principal de UI y carga de datos: [frontend/src/App.tsx](frontend/src/App.tsx) (clave).
- Tipos de dominio frontend: [frontend/src/lib/financial-types.ts](frontend/src/lib/financial-types.ts).
- Utilidades de cálculo frontend: [frontend/src/lib/financial-utils.ts](frontend/src/lib/financial-utils.ts) (clave).
- Pruebas de utilidades frontend: [frontend/src/lib/financial-utils.test.ts](frontend/src/lib/financial-utils.test.ts) (clave).

Nota de ambigüedad detectada: existe un archivo de instrucciones global del entorno que no pudo ser leído por restricción de acceso del sistema, por lo que este análisis se fundamenta únicamente en evidencia observable dentro del repositorio.