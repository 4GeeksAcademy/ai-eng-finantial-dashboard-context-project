# Resumen ejecutivo técnico del repositorio:

    Framework de frontend

    Se usa React (v19) como framework de interfaz.
    El entorno de desarrollo/build es Vite.
    El frontend está tipado con TypeScript.

    Framework y lenguaje de backend

    Se usa FastAPI como framework backend.
    El lenguaje es Python.
    El servidor de ejecución es Uvicorn (ASGI).

    Servicios o bases de datos que levanta Docker

    Docker Compose levanta 2 servicios:

    frontend
    backend

    No se define ninguna base de datos (ni PostgreSQL, MySQL, MongoDB, Redis, etc.) en la configuración actual.

    3 dependencias clave por lado

## Frontend (clave):

    react: base de la UI del dashboard.
    recharts: gráficos para visualización financiera.
    vite: herramienta de desarrollo y build rápida del frontend.

## Backend (clave):

    fastapi: framework API para endpoints del dashboard.
    uvicorn[standard]: servidor ASGI para ejecutar FastAPI.
    pytest: framework de testing para validación del backend.

## Lectura de Tech Lead:

    La arquitectura es una SPA en React consumiendo una API en FastAPI, orquestada con Docker Compose en modo desarrollo.
    El proyecto tiene buena base de calidad (lint/test en frontend y tests/cobertura en backend), pero hoy no incluye capa de persistencia declarada en infraestructura.
