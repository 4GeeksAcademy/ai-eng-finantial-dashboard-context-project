# Fase 2 - Revisión de código y reglas propuestas

## Objetivo

Documentar hallazgos del estado actual del proyecto, identificando:

- Al menos 5 buenas prácticas.
- Al menos 5 malas prácticas o riesgos.
- Hallazgos agrupados por categoría.
- Un set de reglas propuestas para mitigar riesgos y preservar patrones útiles.

---

## Malas prácticas / riesgos identificados

### 1) Seguridad: CORS demasiado permisivo

- Evidencia: `allow_origins=["*"]` y `allow_credentials=True` en backend.
- Riesgo: en escenarios reales puede exponer datos/sesiones a orígenes no confiables.

### 2) Arquitectura de datos: uso directo de mock en endpoints productivos

- Evidencia: múltiples endpoints generan datos en runtime con `generate_mock_movements(seed=42)`.
- Riesgo: no existe separación clara entre modo demo y modo real; limita evolución hacia persistencia.

### 3) Mantenibilidad: duplicación de lógica B2B/B2C

- Evidencia: endpoints separados para B2B y B2C con lógica similar.
- Riesgo: más costo de mantenimiento y posibilidad de comportamientos divergentes.

### 4) Consistencia e i18n: mezcla de idiomas y locale fijo

- Evidencia: UI con mensajes en español e inglés, y formato de fecha/currency atado a `en-US`.
- Riesgo: experiencia inconsistente para usuarios hispanohablantes y deuda técnica de localización.

### 5) Testing: faltan pruebas de integración frontend-backend

- Evidencia: hay tests unitarios y de rutas, pero no integración end-to-end entre fetch, contrato API y render.
- Riesgo: regresiones en la integración pueden pasar sin detectarse.

### 6) DX/Gobernanza: reglas de agentes no claramente operacionalizadas

- Evidencia: AGENTS exige estructura de reglas/memoria, pero su aplicación no es explícita en el flujo diario.
- Riesgo: variabilidad de prácticas entre colaboradores/agentes.

---

## Buenas prácticas identificadas

### 1) Separación entre capa HTTP y lógica de dominio

- El backend tiene funciones de negocio (filtrado, agregación, alertas) separadas de los endpoints.

### 2) Tipado fuerte en contratos de API

- Uso consistente de modelos Pydantic y `response_model` para validar y documentar respuestas.

### 3) Reproducibilidad con semilla fija

- Uso de `seed=42` facilita pruebas estables y debugging reproducible.

### 4) Frontend con utilidades y tipos reutilizables

- Cálculos de KPIs y series mensuales están aislados en utilidades tipadas.

### 5) Manejo explícito de loading y error en UI

- La app contempla estados de carga y error con fallback visual claro.

### 6) Buena base de tests backend y utilitarios frontend

- Hay cobertura de endpoints clave, filtros y casos de cálculo en utilidades.

### 7) DX inicial sólida

- README en español/inglés y ejecución local simple con `docker compose up --build`.

---

## Hallazgos agrupados por categoría

## Arquitectura

- Bueno: funciones de dominio separadas de controladores.
- Riesgo: datos mock acoplados a handlers y duplicidad B2B/B2C.

## Seguridad

- Bueno: configuración CORS explícita.
- Riesgo: configuración abierta para un contexto no-demo.

## Naming e i18n

- Bueno: nombres descriptivos en funciones y tipos.
- Riesgo: copy mixto (ES/EN) y locale hardcodeado.

## Testing

- Bueno: pruebas unitarias y de rutas bien encaminadas.
- Riesgo: faltan pruebas de integración API-frontend/contrato.

## Documentación y DX

- Bueno: documentación bilingüe y onboarding claro.
- Riesgo: lineamientos de agentes y memoria aún no institucionalizados plenamente.

---

## Set de reglas propuestas

## 1) Seguridad de API

- Prohibir `allow_origins=["*"]` en entornos productivos.
- No permitir `allow_credentials=True` con origen wildcard.
- Gestionar CORS por variables de entorno y perfiles (dev/staging/prod).

## 2) Fuente de datos y capas

- Definir interfaz de proveedor de datos (ejemplo: `DataProvider`).
- Implementar dos proveedores: `MockProvider` y `PersistedProvider`.
- Evitar llamadas directas a generación mock dentro de endpoints.

## 3) Diseño de endpoints

- Consolidar B2B/B2C en un filtro `business_type` en endpoint común.
- Reutilizar esquema de filtros compartidos.
- Mantener `response_model` obligatorio en cada ruta.

## 4) Internacionalización y consistencia de UI

- Definir idioma principal del producto.
- Centralizar textos en diccionario de traducciones.
- Evitar locale fijo (`en-US`) en utilidades; usar configuración por usuario o entorno.

## 5) Estrategia de testing

- Mantener tests unitarios actuales.
- Agregar tests de integración frontend-backend.
- Agregar contract tests para validar campos/tipos entre API y frontend.
- Definir umbral mínimo de cobertura en CI para backend y frontend.

## 6) Documentación y DX

- Documentar explícitamente modo demo vs modo real.
- Añadir ejemplos de consumo para endpoints avanzados (`summary`, `comparison`, `alerts`).
- Alinear AGENTS con la estructura real del repositorio y proceso de trabajo.

## 7) Calidad y mantenimiento

- Regla de no duplicación: endpoints nuevos deben reutilizar servicios existentes.
- Regla de trazabilidad: cada cambio de endpoint debe incluir test.
- Regla de compatibilidad: cambios de contrato API deben actualizar tipos frontend en el mismo PR.

---

## Conclusión

El proyecto tiene una base técnica sólida para crecer (tipado, separación de lógica, tests iniciales), pero necesita reforzar seguridad, consistencia de producto (idioma/locale), estrategia de integración y gobernanza de prácticas para escalar con menos riesgo.