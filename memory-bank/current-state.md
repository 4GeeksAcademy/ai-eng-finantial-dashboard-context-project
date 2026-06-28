# Estado Actual del Proyecto

## Funcionalidades Implementadas
- Renderizado del Dashboard principal con cálculo de KPIs.
- Conexión básica entre el cliente (React) y el servidor (Python) para el consumo de datos asíncronos.
- Soporte para variables de entorno para desacoplar las URLs de las APIs.

## Gaps Conocidos y Deuda Técnica (Siguientes Prioridades)
- **Seguridad:** El backend tiene una configuración CORS insegura (`allow_origins=["*"]` con credenciales) que debe ser parchada inmediatamente.
- **Confiabilidad:** Las peticiones asíncronas en el frontend carecen de cancelación (`AbortController`) y de un manejo de errores robusto, lo que destruye la traza del error en la UI.
- **Mantenibilidad:** Existen *Magic Strings* y estilos *hardcodeados* (como el modo oscuro forzado) que deben extraerse a archivos de configuración globales.