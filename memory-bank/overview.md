# Visión General del Producto y Arquitectura (Memory Bank - Overview)

## Propósito del Producto
El **Financial Dashboard** (Panel de Métricas Financieras) es una aplicación web analítica desacoplada diseñada para visualizar la salud económica y los indicadores clave de rendimiento (KPIs) de una empresa o modelo de negocio. La plataforma procesa movimientos financieros (ingresos y gastos), los categoriza por área operativa (ventas, proveedores, administración, operaciones) y tipo de cliente (B2B / B2C), y genera métricas consolidadas mensuales y alertas de desviaciones de presupuesto.

---

## Arquitectura del Sistema

La arquitectura está basada en un modelo **Cliente-Servidor (Decoupled Single Page Application)** en contenedores independientes de Docker:

```text
┌────────────────────────────────────────────────────────┐
│                   Cliente Web (UI)                     │
│  - React 19 + TypeScript + Vite                        │
│  - Recharts (Visualización de Gráficas)                │
│  - Tailwind CSS (Estilos)                              │
└──────────────────────────┬─────────────────────────────┘
                           │ Proxy de desarrollo /api
                           ▼ (HTTP / JSON)
┌────────────────────────────────────────────────────────┐
│                  Servidor Backend                      │
│  - FastAPI (Python 3.13)                               │
│  - Pydantic v2 (Validación de Esquemas)                │
│  - Generador/Repositorio Mock de Movimientos           │
└────────────────────────────────────────────────────────┘
```

---

## Flujos de Datos Principales

1. **Obtención de Movimientos Financieros (`/api/metrics`):**
   - El cliente realiza una solicitud `GET /api/metrics` al backend.
   - El servidor filtra los movimientos según fechas o categorías solicitadas y devuelve una lista tipada con el esquema `FinancialMovement`.
2. **Cómputo de KPIs y Gráficas de Tendencias:**
   - La capa de utilidades del cliente (`financial-utils.ts`) procesa el arreglo de movimientos para calcular el ingreso total, egreso total, margen de ganancia (`profit`) y porcentaje de rentabilidad (`profitPercent`).
   - `IncomeOutcomeChart` renderiza la comparación mensual entre ingresos y gastos usando `Recharts`.
   - `ProfitPercentChart` muestra la evolución del porcentaje de beneficio neto.
3. **Filtros y Facetas (`/api/metrics/facets`):**
   - El backend provee el rango de fechas disponibles (`min_date`, `max_date`) y las categorías activas para dinamizar los controles de la interfaz de usuario.
