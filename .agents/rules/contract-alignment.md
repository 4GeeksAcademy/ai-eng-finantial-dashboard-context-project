# Rule: Backend Frontend Contract Alignment

## Scope

Aplica a cualquier cambio en shapes de respuesta, enums, nombres de campos o filtros usados entre API y dashboard.

## Why

El dominio esta duplicado entre [backend/app/routes.py](backend/app/routes.py) y [frontend/src/lib/financial-types.ts](frontend/src/lib/financial-types.ts). Si una capa cambia sola, el dashboard puede romperse o degradarse sin un fallo evidente en compilacion cruzada.

## Rules

- Todo cambio de contrato en backend debe reflejarse en los tipos o mapeos del frontend dentro del mismo trabajo.
- No renombrar campos de API ni ampliar enums sin ajustar pruebas y consumo frontend.
- Si un contrato nuevo se consume en UI, debe existir al menos una verificacion automatizada de su shape o de la transformacion que lo usa.

## Repo anchors

- Contrato backend actual: [backend/app/routes.py](backend/app/routes.py).
- Tipos frontend actuales: [frontend/src/lib/financial-types.ts](frontend/src/lib/financial-types.ts).
- Consumo principal actual: [frontend/src/App.tsx](frontend/src/App.tsx).