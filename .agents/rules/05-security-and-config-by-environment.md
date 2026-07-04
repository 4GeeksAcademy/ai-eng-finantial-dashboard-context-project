# Regla: Seguridad y Configuracion por Entorno

## Nombre
Seguridad y Configuracion por Entorno

## Alcance
- backend/app/main.py
- frontend/src/lib/**/*.ts
- frontend/src/**/*.tsx
- docker-compose.yml

## Razon
Los valores por defecto comodos en desarrollo local pueden ser inseguros o inflexibles en produccion. Este repo ya usa comportamiento por entorno para API base URL, por lo que extender ese patron es natural.

## Regla
- Los origenes CORS deben ser explicitos en entornos no-dev.
- Evitar valores hardcodeados de locale/periodo/texto cuando afecten semantica de negocio en pantalla.
- Los ajustes guiados por entorno deben tener defaults seguros y fallback claro.

## Verificaciones de aceptacion
- La politica CORS en backend reconoce el entorno de ejecucion.
- La configuracion de formato y periodo en frontend puede ajustarse sin dispersar cambios por el codigo.

## Validacion en el repo
- CORS esta abierto actualmente en backend/app/main.py.
- Existe fallback para API base URL en frontend/src/App.tsx.
- Locale y valores de presentacion estan fijos en frontend/src/lib/financial-utils.ts y uso del dashboard header, lo que hace esta regla accionable.

## Notas de refinamiento
- Esta regla apunta a comportamiento de runtime/config, no a diseno visual.
- Texto puramente cosmetico puede permanecer local al componente.
