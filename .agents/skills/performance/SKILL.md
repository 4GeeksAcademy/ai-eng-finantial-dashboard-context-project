---
name: performance
description: Audita y optimiza rendimiento en aplicaciones React y Next.js sin alterar comportamiento funcional. Usar cuando se pida mejora de performance, Core Web Vitals, bundle size, renders innecesarios, memoizacion, lazy loading o optimizacion de imagenes.
metadata:
  version: 1.0.0
---

# Performance Skill

## Objetivo

Actuar como un auditor de rendimiento para aplicaciones React y Next.js, detectando oportunidades de optimizacion y aplicando unicamente cambios que mejoren el rendimiento sin modificar el comportamiento funcional de la aplicacion.

## Inputs

- Codigo fuente del proyecto.
- Componentes React.
- Paginas y layouts.
- Configuracion de Next.js.
- Recursos estaticos (imagenes, fuentes, iconos).
- package.json.

## Output esperado

Generar un informe que incluya:

1. Problemas encontrados.
2. Explicacion del impacto de cada problema.
3. Solucion propuesta.
4. Cambios aplicados.
5. Beneficio esperado en rendimiento.

## Flujo de trabajo recomendado

1. Levantar contexto tecnico del proyecto
- Identificar framework: React puro, Vite o Next.js.
- Revisar scripts en package.json (`build`, `lint`, `test`).
- Detectar librerias pesadas y dependencias potencialmente innecesarias.

2. Auditoria de rendimiento
- Revisar renderizado y re-renderizado de componentes.
- Detectar componentes costosos sin memoizacion cuando aplica.
- Revisar uso de `useMemo`, `useCallback`, `React.memo`, y dependencias de hooks.
- Encontrar imports no utilizados, estados no usados y codigo duplicado.
- Validar uso de carga diferida (`lazy`, `dynamic import`, `next/dynamic`) para modulos pesados.
- Revisar optimizacion de imagenes y fuentes.
- Evaluar bundle size y particionado de chunks.

3. Aplicacion de mejoras seguras
- Priorizar cambios de bajo riesgo con alto impacto.
- No alterar contratos, reglas de negocio ni UX funcional.
- Evitar refactors amplios no solicitados.

4. Verificacion
- Compilar con `npm run build`.
- Confirmar ausencia de regresiones funcionales por inspeccion de flujo y contratos.
- Reportar advertencias relevantes de bundle/performance.

## Criterios de aceptacion

Antes de finalizar la revision, comprobar que:

- ✅ No existen imagenes sin optimizar.
- ✅ No se usan etiquetas `<img>` cuando puede utilizarse `next/image`.
- ✅ Los componentes costosos estan memoizados cuando es apropiado.
- ✅ No existen renders innecesarios.
- ✅ Los componentes pesados utilizan lazy loading cuando corresponde.
- ✅ No hay imports, estados o dependencias sin utilizar.
- ✅ Se evita codigo duplicado que afecte al rendimiento.
- ✅ El bundle no contiene librerias innecesarias.
- ✅ La aplicacion compila correctamente mediante `npm run build`.
- ✅ Ningun cambio modifica la funcionalidad existente.

## Reglas de seguridad para cambios

- No cambiar nombres de endpoints, contratos de datos ni props publicas sin requerimiento explicito.
- No eliminar funcionalidad para mejorar metricas.
- Si una optimizacion implica trade-off funcional, documentarla y pedir confirmacion antes de aplicar.

## Formato de reporte sugerido

### 1) Resumen ejecutivo
- Estado general de performance.
- Top 3 problemas de mayor impacto.

### 2) Hallazgos
Para cada hallazgo incluir:
- Problema
- Impacto
- Evidencia
- Solucion propuesta
- Cambio aplicado
- Beneficio esperado

### 3) Validacion
- Resultado de `npm run build`.
- Riesgos residuales.
- Siguientes pasos opcionales.

## Notas de aplicabilidad

- En proyectos que no usan Next.js, reemplazar recomendaciones de `next/image` por optimizacion equivalente del stack actual (por ejemplo, imagenes responsivas, formatos modernos y lazy loading nativo).
- Si no hay imagenes en el codigo fuente, registrar el criterio como "cumplido por no aplicabilidad" con evidencia.
