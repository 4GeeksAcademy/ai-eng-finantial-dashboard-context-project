# Auditoría de Código y Arquitectura (Code Review)
**Proyecto:** Financial Dashboard
**Fase:** 2 - Análisis de Prácticas de Ingeniería

A continuación, se detalla la auditoría técnica del código heredado, identificando 5 prácticas sólidas a mantener y 5 riesgos arquitectónicos que requieren remediación, basados en principios SOLID y Clean Code.

---

## ✅ 5 Buenas Prácticas de Ingeniería (A Preservar)

### 1. Arquitectura y Separación de Responsabilidades (SRP)
* **Evidencia (`App.tsx`):**
    ```typescript
    import { computeKPIs, computeMonthlyData } from "@/lib/financial-utils";
    // ...
    setMetrics(computeKPIs(movements));
    setMonthlyData(computeMonthlyData(movements));
    ```
* **Criterio Senior:** El componente `App` delega la lógica de cálculo financiero a utilidades externas puestas en `/lib`. Esto respeta el Principio de Responsabilidad Única (SRP) de SOLID, aislando la lógica de negocio de la capa de presentación y facilitando el testing unitario puro.

### 2. Tipado Fuerte y Contratos Explícitos
* **Evidencia (`App.tsx` y `dashboard-header.tsx`):**
    ```typescript
    async function fetchFinancialData(): Promise<FinancialMovement[]> { ... }
    
    interface DashboardHeaderProps {
      period?: string
    }
    ```
* **Criterio Senior:** Establecer contratos estrictos (`Promise<FinancialMovement[]>`) reduce la ambigüedad estructural. Se previene que el motor de JavaScript procese datos mutados o nulos en tiempo de ejecución, reduciendo la deuda técnica.

### 3. Manejo Explícito de Estados de UI Asíncronos
* **Evidencia (`App.tsx`):**
    ```typescript
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // ... .catch / .finally
    ```
* **Criterio Senior:** No se asume que la red es infalible ("Fallacies of Distributed Computing"). El manejo explícito de banderas de carga y error previene interfaces congeladas y mejora significativamente la Experiencia de Usuario (UX) y la resiliencia del frontend.

### 4. Configuración Desacoplada por Entorno
* **Evidencia (`App.tsx`):**
    ```typescript
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
    ```
* **Criterio Senior:** Extraer la configuración del Host a variables de entorno (`.env`) garantiza que la aplicación sea agnóstica a la infraestructura. Cumple con los principios de *The Twelve-Factor App*, permitiendo despliegues seguros en Dev, Staging y Prod sin modificar el código fuente.

### 5. DX y Control de Calidad Estática
* **Evidencia (`tsconfig.app.json`):**
    ```json
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
    ```
* **Criterio Senior:** Configurar el compilador de TypeScript en modo estricto previene errores silenciosos, variables "zombie" (fugas de memoria pasivas) y asegura un estándar mínimo de limpieza de código antes de que llegue a producción.

---

## ❌ 5 Malas Prácticas y Riesgos (Code Smells a Mitigar)

### 1. Riesgo Crítico de Seguridad (CORS Excesivamente Permisivo)
* **Evidencia (`main.py`):**
    ```python
    allow_origins=["*"],
    allow_credentials=True,
    ```
* **Criterio Senior:** Es una vulnerabilidad grave. Combinar `allow_origins=["*"]` con `allow_credentials=True` rompe el principio de Mínimo Privilegio. Expone la API a ataques CSRF al permitir que cualquier dominio lea respuestas autenticadas. Debe restringirse explícitamente a la URL del frontend.

### 2. Manejo de Errores Ciego (Pérdida de Trazabilidad)
* **Evidencia (`App.tsx`):**
    ```typescript
    .catch(() => {
      setError("No se pudo cargar la informacion financiera. Revisa la API de backend.");
    })
    ```
* **Criterio Senior:** Al usar un `catch` vacío que ignora el objeto de error, se destruye la traza original (Network error, 401, 500, timeout). Esto imposibilita la observabilidad y el *troubleshooting* en producción. El error real debe ser capturado y enviado a un logger o consola.

### 3. Efectos Asíncronos No Confiables (Fugas de Memoria)
* **Evidencia (`App.tsx`):**
    ```typescript
    useEffect(() => {
      fetchFinancialData().then((movements) => {
        setMetrics(computeKPIs(movements));
        // ...
    ```
* **Criterio Senior:** Hacer data-fetching directo en un `useEffect` sin un mecanismo de cancelación (`AbortController`) o función de limpieza (*cleanup function*) genera condiciones de carrera (*race conditions*). Si el componente se desmonta antes de que la promesa se resuelva, React intentará mutar un estado inexistente.

### 4. Acoplamiento Arquitectónico de Presentación (Theming)
* **Evidencia (`App.tsx`):**
    ```html
    <main className="dark min-h-screen bg-background text-foreground">
    ```
* **Criterio Senior:** Forzar ("hardcodear") la clase `dark` en el nodo raíz viola el principio de Abierto/Cerrado (OCP). Impide que la UI reaccione a las preferencias del sistema del usuario o al contexto dinámico del tema, reduciendo la extensibilidad del diseño.

### 5. Inconsistencia de Dominio (Magic Strings y Typos)
* **Evidencia (Múltiples archivos):**
    ```typescript
    // dashboard-header.tsx
    export function DashboardHeader({ period = '2024 — Full Year' })
    // App.tsx
    <DashboardHeader period="2024 - Full Year" />
    ```
* **Criterio Senior:** La discrepancia tipográfica (guion largo vs. guion corto) en el mismo valor de dominio revela la ausencia de una *Single Source of Truth* (SSOT). El uso de *Magic Strings* es propenso a errores humanos y rompe las comparaciones de igualdad estricta. Debería usarse un archivo de constantes compartidas.