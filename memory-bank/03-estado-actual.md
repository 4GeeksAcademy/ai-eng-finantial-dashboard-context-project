# Estado actual del proyecto

## Features implementadas

### Frontend

- Dashboard principal con encabezado, fila de KPIs y dos graficas.
- Fetch a /api/metrics con estados de loading y error.
- Transformacion local de datos para KPIs y serie mensual.

### Backend

- Endpoint health.
- Endpoints de metricas con filtros por fecha, categoria y tipo.
- Endpoints de facets, summary, top categorias, comparacion y alertas.
- Endpoints segmentados por tipo de negocio B2B y B2C.
- Generacion de dataset mock ordenado cronologicamente.

### Testing

- Pruebas backend para endpoints principales y filtros.
- Pruebas frontend para utilidades financieras y formateadores.

## Gaps conocidos basados en evidencia

- Frontend solo consume /api/metrics; el resto de endpoints no se integra en UI actual.
- No hay autenticacion/autorizacion visible en API o frontend.
- No hay persistencia de datos con base de datos; los datos se generan en memoria.
- CORS actualmente abierto para todos los origenes.
- La generacion mock usa random.seed global.
- No se observa pipeline CI/CD versionado en el repo.

## Siguientes prioridades sugeridas

1. Integrar en frontend filtros y vistas usando facets, summary, top categorias y comparacion.
2. Endurecer seguridad operativa: CORS por entorno y preparacion para auth.
3. Reemplazar seed global por generador aleatorio aislado para evitar efectos colaterales.
4. Reducir duplicacion en rutas B2B/B2C mediante helper compartido.
5. Aumentar cobertura de pruebas para flujos de error asincrono en frontend.
6. Definir una estrategia de datos persistentes para salir del modo mock.

## Convenciones operativas

- Los archivos de especificacion funcional del frontend se almacenan en `frontend/specs`.

## Evidencia principal

- [frontend/src/App.tsx](../frontend/src/App.tsx)
- [frontend/src/lib/financial-utils.test.ts](../frontend/src/lib/financial-utils.test.ts)
- [backend/app/main.py](../backend/app/main.py)
- [backend/app/routes.py](../backend/app/routes.py)
- [backend/tests/test_routes.py](../backend/tests/test_routes.py)
- [README.md](../README.md)
