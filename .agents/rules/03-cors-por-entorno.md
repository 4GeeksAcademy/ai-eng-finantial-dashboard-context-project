# Regla: CORS por entorno

## Proposito
Evitar exposicion innecesaria de la API manteniendo flexibilidad en desarrollo local.

## Alcance
- Configuracion de FastAPI en `backend/app/main.py`.
- Variables de entorno de backend.

## Regla concreta y verificable
La configuracion de CORS debe depender del entorno:
1. Desarrollo local: puede permitir origen amplio para velocidad de iteracion.
2. Entornos no locales: `allow_origins` debe ser explicito y restringido.

## Justificacion
Mitiga riesgo de uso no autorizado de la API desde origenes no previstos.

## Ejemplos aplicados al repo
- Estado actual a mejorar: `allow_origins=["*"]` en `backend/app/main.py`.

## Criterios de validacion
- Existe una via de configuracion por entorno (env var o settings).
- No se usa `*` fuera de desarrollo local.
- La documentacion indica como configurar origenes permitidos.

## Anti-patrones
- Dejar `allow_origins=["*"]` como valor fijo para cualquier despliegue.
- Hardcodear origenes productivos sin forma de sobreescribir por entorno.
