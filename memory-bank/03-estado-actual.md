# Estado actual del proyecto

## Features implementadas

### Frontend

- Dashboard principal con encabezado, fila de KPIs y dos graficas.
- Fetch a /api/metrics con estados de loading y error.
- Transformacion local de datos para KPIs y serie mensual.
- Mejora dirigida de accesibilidad aplicada al dashboard (sin reescritura total):
	- Skip link para navegacion por teclado.
	- Estados de foco visibles y tamano minimo de targets interactivos.
	- `aria-pressed` en cambio de vista Overview/B2B vs B2C.
	- `role="alert"` y `aria-describedby` para errores y ayuda en formularios.
	- Iconos decorativos marcados con `aria-hidden`.
	- Ajuste de contraste en tooltip de grafica B2B vs B2C (labels con foreground de alto contraste).
- Panel de filtros ajustado para mantener botones alineados horizontalmente con inputs.
- Metadata de frontend mejorada para stack actual (Vite + React):
	- `title` y `meta description` base en `frontend/index.html`.
	- Actualizacion dinamica de `document.title` y `meta[name="description"]` por vista en `App.tsx`.
- Refactor de antipatrones React en efectos:
	- Eliminacion de actualizaciones de estado sincronas en `useEffect` moviendo resets de loading/error a handlers de interaccion.

### Backend

- Endpoint health.
- Endpoints de metricas con filtros por fecha, categoria y tipo.
- Endpoints de facets, summary, top categorias, comparacion y alertas.
- Endpoints segmentados por tipo de negocio B2B y B2C.
- Generacion de dataset mock ordenado cronologicamente.

### Testing

- Pruebas backend para endpoints principales y filtros.
- Pruebas frontend para utilidades financieras y formateadores.
- Verificacion manual reciente de calidad frontend:
	- `npm run lint` en `frontend`: sin errores tras refactor de efectos.
	- `npm run build` en `frontend`: compilacion exitosa local.
	- Intento de auditoria automatizada con axe-cli no ejecutable en contenedor por ausencia de binario Chrome.

## Habilidades usadas en esta iteracion

- `accessibility`:
	- Auditoria WCAG aplicada a navegacion por teclado, foco visible, contraste, estados de error y semantica ARIA.
- `vercel-react-best-practices`:
	- Eliminacion de antipatrones de re-render/efectos (`setState` sincronos en `useEffect`).
	- Ajustes de metadata acordes al framework real del proyecto (Vite/React en lugar de Next.js Metadata API).
- `learning-docs`:
	- Documentacion tecnica creada en `lesson2learn/2026-07-09_15-15-00-react-vite-metadata-and-antipattern-cleanup.md`.

## Cambios operativos recientes

- `.gitignore` actualizado para excluir `/lesson2learn/` de commits y push.

## Gaps conocidos basados en evidencia

- Frontend solo consume /api/metrics; el resto de endpoints no se integra en UI actual.
- No hay autenticacion/autorizacion visible en API o frontend.
- No hay persistencia de datos con base de datos; los datos se generan en memoria.
- CORS actualmente abierto para todos los origenes.
- La generacion mock usa random.seed global.
- No se observa pipeline CI/CD versionado en el repo.
- No hay verificacion automatizada de accesibilidad en CI aun (Lighthouse/axe).

## Siguientes prioridades sugeridas

1. Integrar en frontend filtros y vistas usando facets, summary, top categorias y comparacion.
2. Endurecer seguridad operativa: CORS por entorno y preparacion para auth.
3. Reemplazar seed global por generador aleatorio aislado para evitar efectos colaterales.
4. Reducir duplicacion en rutas B2B/B2C mediante helper compartido.
5. Aumentar cobertura de pruebas para flujos de error asincrono en frontend.
6. Definir una estrategia de datos persistentes para salir del modo mock.
7. Incorporar auditoria a11y automatizada en CI (axe o Lighthouse) con navegador disponible en entorno de pipeline.

## Convenciones operativas

- Los archivos de especificacion funcional del frontend se almacenan en `frontend/specs`.

## Evidencia principal

- [frontend/src/App.tsx](../frontend/src/App.tsx)
- [frontend/src/index.css](../frontend/src/index.css)
- [frontend/src/components/dashboard/anomaly-alerts-table.tsx](../frontend/src/components/dashboard/anomaly-alerts-table.tsx)
- [frontend/src/components/dashboard/business-income-comparison-chart.tsx](../frontend/src/components/dashboard/business-income-comparison-chart.tsx)
- [frontend/src/components/dashboard/dashboard-header.tsx](../frontend/src/components/dashboard/dashboard-header.tsx)
- [frontend/src/components/dashboard/kpi-card.tsx](../frontend/src/components/dashboard/kpi-card.tsx)
- [frontend/index.html](../frontend/index.html)
- [frontend/src/lib/financial-utils.test.ts](../frontend/src/lib/financial-utils.test.ts)
- [backend/app/main.py](../backend/app/main.py)
- [backend/app/routes.py](../backend/app/routes.py)
- [backend/tests/test_routes.py](../backend/tests/test_routes.py)
- [README.md](../README.md)
- [lesson2learn/2026-07-09_15-15-00-react-vite-metadata-and-antipattern-cleanup.md](../lesson2learn/2026-07-09_15-15-00-react-vite-metadata-and-antipattern-cleanup.md)
- [.gitignore](../.gitignore)
