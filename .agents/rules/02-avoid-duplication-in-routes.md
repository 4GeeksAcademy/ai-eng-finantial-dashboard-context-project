# Regla: Evitar Duplicacion en Rutas de Backend

## Nombre
Evitar Duplicacion en Rutas de Backend

## Alcance
- backend/app/routes.py

## Razon
La logica duplicada en rutas genera desalineacion: se corrige un endpoint mientras otro queda desactualizado. Este repo ya tiene patrones de endpoint similares y se beneficia de helpers compartidos.

## Regla
- Si dos endpoints difieren solo por un filtro (ejemplo: business_type), extraer una funcion compartida.
- Los handlers de ruta deben declarar entradas, llamar logica compartida y devolver modelos tipados.
- Los endpoints nuevos deben reutilizar helpers existentes de filtrado y orden cuando sea posible.

## Verificaciones de aceptacion
- No debe haber bloques copy-paste de mas de 5 lineas entre handlers de ruta para el mismo flujo.
- Los pasos de filtrado compartidos deben usar funciones helper comunes.

## Validacion en el repo
- Ya existe reutilizacion de helpers: filter_movements y ensure_chronological_order en backend/app/routes.py.
- Existe riesgo de duplicacion entre handlers /api/metrics/b2b y /api/metrics/b2c en backend/app/routes.py, por lo que la regla es accionable de forma directa.

## Notas de refinamiento
- La duplicacion de declaraciones de path es aceptable.
- La duplicacion de bloques de logica de negocio no es aceptable.
