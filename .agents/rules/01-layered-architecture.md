# Regla: Arquitectura por Capas segun Responsabilidad

## Nombre
Arquitectura por Capas segun Responsabilidad

## Alcance
- backend/app/*.py
- frontend/src/App.tsx
- frontend/src/components/**/*.tsx
- frontend/src/lib/**/*.ts

## Razon
Cuando la carga de datos, los calculos de negocio y el renderizado de UI se mezclan en un mismo lugar, los cambios se vuelven lentos y riesgosos. Esta regla preserva una estructura clara que ya existe en este repo.

## Regla
- Mantener las responsabilidades de transporte en handlers de rutas API y funciones fetch.
- Mantener los calculos de negocio en funciones dedicadas de utilidad/servicio.
- Mantener los componentes enfocados en renderizado y estado de vista.
- Si una funcion calcula valores de dominio y tambien renderiza UI, dividirla.

## Verificaciones de aceptacion
- Los archivos App/pagina orquestan llamadas, pero no contienen calculos financieros pesados.
- Los modulos de utilidades exponen funciones puras para KPI y transformaciones mensuales.
- Los handlers de rutas componen helpers en vez de incrustar logica extensa inline.

## Validacion en el repo
- La orquestacion de frontend existe en frontend/src/App.tsx.
- Los calculos financieros estan centralizados en frontend/src/lib/financial-utils.ts.
- Las rutas de backend componen funciones helper en backend/app/routes.py.

## Notas de refinamiento
- "Calculo pesado" significa bucles/agregaciones repetidas sobre datos de movimientos.
- Se permite formateo simple de valores dentro de componentes.
