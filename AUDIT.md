# Diagnóstico de Ingeniería y Auditoría de Calidad (Fase 2)

Este documento constituye el **Informe Oficial de Auditoría de Calidad y Diagnóstico de Ingeniería** para el proyecto Financial Dashboard, elaborado según los requerimientos de la Fase 2 de [`STRATEGY.md`](./STRATEGY.md).

---

## 🟢 Part I: 5 Buenas Prácticas de Ingeniería (Preservar)

---

### 1. BP-01: Modularidad y Funciones Puras en Endpoints de API
* **Categoría:** Arquitectura / Backend
* **Archivo:** [`backend/app/routes.py`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/backend/app/routes.py#L161-L241)
* **Código de Evidencia:**
  ```python
  def summarize_movements(
      movements: list[FinancialMovement],
      group_by: GroupBy,
  ) -> list[MetricsSummaryItem]:
      summary_map: dict[str, dict[str, float]] = defaultdict(
          lambda: {"income": 0.0, "outcome": 0.0}
      )
      # ...
  ```
* **¿So what? (Impacto):** 
  Separar la lógica de negocio y agregación financiera (`summarize_movements`, `build_top_categories`, `calculate_net_value`, `detect_outcome_alerts`) de los decoradores de rutas FastAPI permite que el código sea procesable en unidades de contexto pequeñas por los modelos de IA. Facilita las pruebas unitarias y reduce la tasa de alucinación en refactorizaciones.

---

### 2. BP-02: Esquemas Estrictos de Validación con Pydantic
* **Categoría:** Naming & Contratos de API
* **Archivo:** [`backend/app/routes.py`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/backend/app/routes.py#L22-L64)
* **Código de Evidencia:**
  ```python
  class FinancialMovement(BaseModel):
      create_date: date
      amount: float
      operation_type: OperationType
      category: Category
      business_type: BusinessType
  ```
* **¿So what? (Impacto):** 
  El uso de Pydantic v2 garantiza la validación de tipos en tiempo de ejecución, genera la documentación OpenAPI de Swagger automáticamente y establece un contrato rígido para los clientes HTTP. Esto previene que la IA sugiera propiedades JSON inexistentes al consumir la API en el frontend.

---

### 3. BP-03: Configuración Centralizada de Proxy para Desarrollo
* **Categoría:** DX (Developer Experience) / Infraestructura
* **Archivo:** [`frontend/vite.config.ts`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/frontend/vite.config.ts#L9-L17)
* **Código de Evidencia:**
  ```typescript
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://backend:8000",
        changeOrigin: true,
      },
    },
  },
  ```
* **¿So what? (Impacto):** 
  El proxy inverso integrado en Vite evita la necesidad de configurar cabeceras CORS complejas en el backend para entornos locales o Docker/Codespaces. Mantiene las solicitudes HTTP relativas (`/api/...`), simplificando el despliegue y la experiencia del desarrollador.

---

### 4. BP-04: Tipado Estricto de Dominio en Frontend
* **Categoría:** Naming & TypeScript / Frontend
* **Archivo:** [`frontend/src/lib/financial-types.ts`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/frontend/src/lib/financial-types.ts#L1-L26)
* **Código de Evidencia:**
  ```typescript
  export type OperationType = 'income' | 'outcome'
  export type Category = 'suppliers' | 'sales' | 'operational' | 'administrative' | 'others'
  export type BusinessType = 'B2B' | 'B2C'

  export interface FinancialMovement {
    create_date: string // ISO date
    amount: number
    operation_type: OperationType
    category: Category
    business_type: BusinessType
  }
  ```
* **¿So what? (Impacto):** 
  Definir tipos de unión literales (`OperationType`, `Category`, `BusinessType`) alineados con la API en lugar de `string` genéricos previene errores tipográficos y permite la comprobación estática de tipos con `tsc`, lo que ayuda al asistente de IA a autocompletar propiedades válidas.

---

### 5. BP-05: Separación de Utilidades Financieras Puras
* **Categoría:** Arquitectura / Frontend
* **Archivo:** [`frontend/src/lib/financial-utils.ts`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/frontend/src/lib/financial-utils.ts#L21-L67)
* **Código de Evidencia:**
  ```typescript
  export function computeKPIs(movements: FinancialMovement[]): KPIMetrics { ... }
  export function computeMonthlyData(movements: FinancialMovement[]): MonthlyDataPoint[] { ... }
  ```
* **¿So what? (Impacto):** 
  Aislar la computación de KPIs y formateo (`formatCurrency`, `formatPercent`) en un archivo de utilidades puras evita sobrecargar el árbol de componentes React con cálculos pesados durante los rerenders y permite probar la lógica de negocio con `vitest` sin depender del DOM.

---

## 🔴 Part II: 5 Malas Prácticas / Riesgos de Ingeniería (Mitigar)

---

### 1. MP-01: Generación Redundante de Mock Data en Memoria
* **Categoría:** Arquitectura / Backend
* **Archivo:** [`backend/app/routes.py`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/backend/app/routes.py#L255)
* **Código de Evidencia:**
  ```python
  @router.get("/api/metrics", response_model=list[FinancialMovement])
  def get_metrics(...):
      movements = generate_mock_movements(seed=42)
      # ...
  ```
* **¿So what? (Impacto):** 
  `generate_mock_movements` se invoca de manera independiente en cada uno de los endpoints (`/api/metrics`, `/api/metrics/facets`, `/api/metrics/summary`, `/api/metrics/categories/top`, etc.), recalculando 360 instancias de objetos en memoria por cada llamada HTTP. Esto genera ineficiencia computacional y acopla la generación de datos mock directamente en los controladores de la API sin una capa de servicio/repositorio o caché.

---

### 2. MP-02: Hardcoding de Fechas y Periodos en Componentes de UI
* **Categoría:** DX / Frontend
* **Archivo:** [`frontend/src/App.tsx`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/frontend/src/App.tsx#L49)
* **Código de Evidencia:**
  ```tsx
  <DashboardHeader period="2024 - Full Year" />
  ```
* **¿So what? (Impacto):** 
  El valor de texto `"2024 - Full Year"` está hardcodeado en la interfaz de usuario. Sin embargo, en el backend la función `generate_mock_movements` utiliza `date.today()` ([`routes.py#L97`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/backend/app/routes.py#L97)) para calcular el rango de meses del año en curso. Esto provoca una inconsistencia entre el periodo mostrado en el encabezado y las fechas reales retornadas por la API.

---

### 3. MP-03: Manejo de Errores Genérico y Silencioso en Frontend
* **Categoría:** Error Handling / Frontend
* **Archivo:** [`frontend/src/App.tsx`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/frontend/src/App.tsx#L35-L39)
* **Código de Evidencia:**
  ```typescript
  .catch(() => {
    setError(
      "No se pudo cargar la informacion financiera. Revisa la API de backend.",
    );
  })
  ```
* **¿So what? (Impacto):** 
  El bloque `.catch()` ignora el objeto de error capturado (`error`), no registra la causa raíz ni el estado HTTP en la consola de desarrollo, y muestra un mensaje genérico. Esto imposibilita a los desarrolladores y a los asistentes de IA diagnosticar si la falla se debe a un error 500 del servidor, un error 404, un fallo de red o un error de parseo de JSON.

---

### 4. MP-04: Ausencia de Excepciones HTTP Estructuradas en Backend
* **Categoría:** Error Handling / Backend
* **Archivo:** [`backend/app/routes.py`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/backend/app/routes.py#L306-L340)
* **Código de Evidencia:**
  ```python
  @router.get("/api/metrics/comparison", response_model=MetricsComparison)
  def get_metrics_comparison(
      start_date: date = Query(...),
      end_date: date = Query(...),
      ...
  ):
      # No hay validación si start_date > end_date
  ```
* **¿So what? (Impacto):** 
  Los endpoints no validan la coherencia lógica de las fechas solicitadas (por ejemplo, si `start_date` es posterior a `end_date`) ni lanzan excepciones `HTTPException(status_code=400, detail=...)`. Ante parámetros inválidos, Python puede producir errores en tiempo de ejecución o duraciones negativas resultando en un error 500 no controlado en lugar de un código de respuesta HTTP 400 estructurado.

---

### 5. MP-05: Acoplamiento de Data Fetching y Renderizado en la Raíz de la Aplicación
* **Categoría:** Arquitectura / Frontend
* **Archivo:** [`frontend/src/App.tsx`](file:///workspaces/ai-eng-financial-dashboard-context-project-matias-idiart-viera/frontend/src/App.tsx#L15-L43)
* **Código de Evidencia:**
  ```typescript
  async function fetchFinancialData(): Promise<FinancialMovement[]> {
    const response = await fetch(`${API_BASE_URL}/api/metrics`);
    // ...
  }

  function App() {
    useEffect(() => { fetchFinancialData()... }, []);
    // ...
  }
  ```
* **¿So what? (Impacto):** 
  Viola el principio de responsabilidad única (SRP). El componente principal `App.tsx` realiza la llamada `fetch` directamente dentro de un `useEffect` en lugar de delegar el consumo a un módulo de servicio (`lib/services/financial-api.ts`) o a un Custom Hook (`useFinancialData`). Esto impide reutilizar la lógica de carga en otros componentes y complica las pruebas de integración en el frontend.
