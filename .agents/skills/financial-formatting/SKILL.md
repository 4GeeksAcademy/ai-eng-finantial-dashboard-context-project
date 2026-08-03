---
name: financial-formatting
description: Guía y estándar para la presentación de valores financieros, monedas y porcentajes en dashboards. Usar al desarrollar, refactorizar o auditar código de la UI que muestre montos monetarios o métricas financieras.
metadata:
  version: 1.0.0
---

# Financial Formatting Skill

Esta skill define las reglas obligatorias para el formateo de datos financieros dentro del Financial Dashboard.

## 🎯 Objetivo
Garantizar la consistencia visual, la precisión semántica y la internacionalización en la presentación de montos monetarios, porcentajes y variaciones financieras en componentes React.

## 📥 Inputs Definidos
- Archivos JSX/TSX (`.tsx`) en `frontend/src/components/` y `frontend/src/App.tsx`.
- Utilidades helper en `frontend/src/lib/`.

## 📤 Output Esperado
Código React/TypeScript limpio que cumpla estrictamente con las reglas de formateo semántico sin concatenaciones manuales ni símbolos de moneda/porcentaje hardcodeados en el JSX.

## 📋 Reglas y Criterios de Aceptación

### 1. Uso de Intl.NumberFormat
- **Prohibido**: Concatenar símbolos manualmente como `"$ " + amount` o `amount + "%"`.
- **Obligatorio**: Utilizar funciones de formateo estándar basadas en `Intl.NumberFormat` (ej. `formatCurrency(amount)` o `formatPercentage(rate)`).

### 2. Semántica de Color por Signo
- **Valores Positivos / Incrementos**: Aplicar clases visuales semánticas positivas (ej. `text-emerald-600` o badges de ganancias).
- **Valores Negativos / Decrementos**: Aplicar clases visuales semánticas negativas (ej. `text-red-600` o badges de pérdidas).
- **Valores Neutros / Cero**: Aplicar tonos neutros (`text-muted-foreground` o `text-slate-500`).

### 3. Precisión Numérica e Indicadores
- Los valores monetarios estándar deben mostrar 2 decimales (o enteros si es formato resumido).
- Las variaciones porcentuales deben mostrar el signo explícito de dirección (`+` o `-`).
