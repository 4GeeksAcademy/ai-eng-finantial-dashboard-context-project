# Regla: Aleatoriedad Segura para Datos Mock

## Nombre

Aleatoriedad Segura para Datos Mock

## Alcance

- backend/app/routes.py
- backend/tests/**/*.py

## Razon

El estado global de random puede crear acoplamientos ocultos entre pruebas y comportamiento en ejecucion. Este repo genera datos mock con frecuencia, por eso la aleatoriedad deterministica y aislada es importante.

## Regla

- No llamar random.seed(...) en rutas de ejecucion compartidas/globales.
- Usar un objeto generador aleatorio aislado por cada generacion de dataset.
- Mantener comportamiento deterministico inyectando seed al generador aislado.

## Verificaciones de aceptacion

- La generacion mock es reproducible cuando se provee seed.
- Otros flujos de codigo no se ven afectados por llamadas de generacion mock.

## Validacion en el repo

- El generate_mock_movements(seed=...) actual en backend/app/routes.py llama random.seed(seed), lo que muta estado global.
- Las pruebas dependen de salidas deterministicas en backend/tests/test_routes.py, por lo que un generador local con seed preservaria el comportamiento y reduciria riesgo.

## Notas de refinamiento

- Esta regla aplica solo al manejo de aleatoriedad.
- No requiere cambiar contratos de endpoints.
