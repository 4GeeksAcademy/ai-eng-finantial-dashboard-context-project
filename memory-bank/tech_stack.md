# Inventario del Stack Tecnológico (Memory Bank - Tech Stack)

Este documento registra el **inventario técnico oficial auditado** del proyecto, extraído directamente de los archivos de configuración fuente ([`frontend/package.json`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/frontend/package.json) y [`backend/requirements.txt`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/backend/requirements.txt)).

---

## 🎨 Frontend (UI Client)

* **Core Framework:** React v19.2.4 + React DOM v19.2.4
* **Lenguaje:** TypeScript v6.0.2 (con soporte strict mode y ESM)
* **Build Tool & Dev Server:** Vite v8.0.4 (`@vitejs/plugin-react` v6.0.1)
* **Estilos & UI:**
  - Tailwind CSS v4.2.2 (`@tailwindcss/vite` v4.2.2)
  - PostCSS v8.5.9 + Autoprefixer v10.4.27
  - Lucide React v1.8.0 (Iconos)
  - Clsx v2.1.1 + Tailwind Merge v3.5.0 + Class Variance Authority v0.7.1 (Utilidades de componentes)
* **Visualización de Datos / Gráficas:** Recharts v3.8.1
* **Testing & Calidad:**
  - Vitest v4.1.4 + `@vitest/coverage-v8` v4.1.4
  - ESLint v9.39.4 (`typescript-eslint` v8.58.0, `eslint-plugin-react-hooks` v7.0.1)

---

## ⚙️ Backend (API Server)

* **Runtime:** Python 3.13 (Imagen Docker Base `python:3.13-slim`)
* **Framework Web:** FastAPI (última versión instalada vía pip)
* **Servidor ASGI:** Uvicorn v0.34+ (instalado con dependencias estándar `uvicorn[standard]`)
* **Validación de Datos:** Pydantic v2 (incluido nativamente con FastAPI)
* **Cliente HTTP para Pruebas:** Httpx (para solicitudes asíncronas de test)
* **Testing & Cobertura:** Pytest + `pytest-cov`
* **Depuración:** `debugpy` (puerto expuesto 5678 para depuración remota)

---

## 🐳 Infraestructura y Herramientas

* **Orquestación de Contenedores:** Docker Compose v2 ([`docker-compose.yml`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/docker-compose.yml))
* **Contenedor Frontend:** Node 24-Alpine (`docker.io/library/node:24-alpine`)
* **Contenedor Backend:** Python 3.13-Slim (`docker.io/library/python:3.13-slim`)
* **Comunicación de Red:** Vite Reverse Proxy (`/api` mapeado a `http://backend:8000`)
