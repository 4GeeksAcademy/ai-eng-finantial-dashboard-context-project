# Regla: Resiliencia de Fetch en Frontend

## Nombre
Resiliencia de Fetch en Frontend

## Alcance
- frontend/src/App.tsx
- frontend/src/** donde se use fetch

## Razon
El estado de UI puede quedar inconsistente cuando solicitudes asincronas se resuelven despues del unmount o despues de solicitudes mas nuevas. Esta regla preserva el buen UX actual de loading/error y reduce condiciones de carrera.

## Regla
- Cada fetch en efectos de React debe soportar cancelacion via AbortController.
- Distinguir cancelacion de errores reales de red/servidor.
- Mantener estados explicitos de loading y error en componentes de nivel UI.

## Verificaciones de aceptacion
- Cada effect con fetch devuelve una funcion de cleanup que aborta solicitudes.
- Los mensajes de error se muestran solo para fallas reales, no para solicitudes canceladas.

## Validacion en el repo
- El manejo actual de loading/error existe en frontend/src/App.tsx.
- El cleanup con abort no esta presente en frontend/src/App.tsx, por lo que la regla es util de forma directa.

## Notas de refinamiento
- Esta regla no requiere introducir una libreria nueva de datos.
- fetch nativo + AbortController es suficiente.
