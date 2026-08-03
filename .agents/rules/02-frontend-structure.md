# Regla 02: Estructura y Arquitectura Frontend (React + TypeScript)

## Propósito y Contexto
Esta regla establece los estándares de desarrollo para la interfaz de usuario en **React** con **TypeScript**. Mitiga los riesgos identificados en la auditoría (**MP-02** y **MP-05**) garantizando la separación entre la capa de presentación (UI) y la capa de consumo de datos (Services/Hooks).

---

## Reglas Obligatorias

### 1. Desacople de Data Fetching y Componentes de Vista
- **Prohibición de `fetch` Directo en Vistas:** Queda estrictamente prohibido realizar llamadas `fetch` o peticiones HTTP directas dentro de bloques `useEffect` en componentes de vista principal (ejemplo: `App.tsx`).
- **Encapsulamiento en Servicios/Hooks:** Todas las interacciones con la API deben aislarse en módulos de servicio (`frontend/src/lib/services/`) o Custom Hooks dedicados (ejemplo: `useFinancialMetrics`).

### 2. Prohibición de Hardcoding de Datos y Fechas en la UI
- **Periodos y Fechas Dinámicas:** Prohibido escribir periodos, fechas o años en duro como cadenas estáticas (ejemplo: `period="2024 - Full Year"`). Los textos de encabezado o filtros deben calcularse dinámicamente o provenir de las facetas de la API (`/api/metrics/facets`).

### 3. Tipado Estricto con TypeScript (No `any`)
- **Prohibición de `any`:** Está prohibido el uso del tipo `any` o conversiones inseguras como `as any`.
- **Uso de Tipos de Dominio:** Todos los datos recibidos de la API deben tiparse usando las interfaces e interfaces literales exportadas en `frontend/src/lib/financial-types.ts`.

### 4. Organización de Componentes Visuales
- Los componentes visuales colocados en `frontend/src/components/` deben ser componentes funcionales puros que reciban sus datos mediante `props` fuertemente tipadas, sin gestionar efectos de red directamente.

---

## Ejemplo Correcto (Compliance)

```tsx
// ✅ BIEN: Servicio de API desacoplado en src/lib/services/financial-api.ts
export async function getFinancialMovements(): Promise<FinancialMovement[]> {
  const response = await fetch(`${API_BASE_URL}/api/metrics`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

// ✅ BIEN: Componente de UI limpio que recibe props tipadas
export function DashboardHeader({ period }: { period: string }) {
  return <header><h1>Financial Dashboard - {period}</h1></header>;
}
```

## Ejemplo Incorrecto (Violation)

```tsx
// ❌ MAL: Fetch directo en componente visual con texto hardcodeado
function App() {
  const [data, setData] = useState<any[]>([]); // Uso de any prohibido
  
  useEffect(() => {
    fetch('/api/metrics').then(res => res.json()).then(setData); // Fetch no abstraído
  }, []);

  return <DashboardHeader period="2024 - Full Year" />; // Periodo hardcodeado
}
```
