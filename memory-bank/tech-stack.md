# Tech Stack y Arquitectura

## Infraestructura y Orquestación
- **Docker & Docker Compose:** Utilizado para la contenedorización y orquestación de los servicios locales (Frontend en puerto 5173, Backend en puerto 8000).

## Frontend (Capa de Presentación)
- **Framework:** React montado sobre Vite (Single Page Application).
- **Lenguaje:** TypeScript (configurado con reglas estrictas en `tsconfig.app.json`).
- **Estilos:** Tailwind CSS (evidenciado por el uso de clases utilitarias como `min-h-screen bg-background`).

## Backend (Capa de Servicios)
- **Lenguaje/Framework:** Python.
- **API Framework:** FastAPI (evidenciado por la autogeneración de la documentación en `/docs` y el manejo de CORS en `main.py`).