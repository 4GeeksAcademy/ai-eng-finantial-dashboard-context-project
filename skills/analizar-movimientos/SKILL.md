# Analizar Movimientos Financieros

## Descripción
Esta habilidad permite al agente de IA procesar e interpretar la estructura de datos de los movimientos financieros (`FinancialMovement`) del Dashboard.

## Contexto
El frontend utiliza una utilidad llamada `computeKPIs` y `computeMonthlyData` en `lib/financial-utils.ts`. 

## Pasos para ejecutar (Instrucciones)
1. Cuando se te pida analizar datos financieros, verifica primero la interfaz `FinancialMovement`.
2. Identifica si el movimiento es un ingreso o un egreso basándote en la convención del código.
3. Al sugerir nuevos cálculos, utiliza el patrón Verbo + Sustantivo en camelCase para las funciones (ej. `calculateNetProfit`) y mantén la lógica aislada de los componentes React, respetando el Principio de Responsabilidad Única (SRP).
