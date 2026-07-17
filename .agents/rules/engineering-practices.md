# Engineering Practices Rules

Este archivo funciona como indice de reglas del repositorio para este proyecto.

## Reglas activas

- [backend-architecture.md](backend-architecture.md): separacion de capas, reglas para rutas y logica de dominio en FastAPI.
- [contract-alignment.md](contract-alignment.md): sincronizacion entre contrato backend y tipos consumidos por frontend.
- [ui-and-data-consistency.md](ui-and-data-consistency.md): consistencia entre datos renderizados, texto visible y comportamiento del dashboard.
- [testing-and-local-dx.md](testing-and-local-dx.md): cobertura minima por cambio y reglas de desarrollo local para evitar fricciones de editor o contenedor.

## Patrones a preservar

- Modelos de respuesta tipados en backend.
- Utilidades puras y probadas para calculos financieros en frontend.
- Proxy local de Vite para reducir configuracion manual.
- Componentes de dashboard reutilizables con estados de carga consistentes.