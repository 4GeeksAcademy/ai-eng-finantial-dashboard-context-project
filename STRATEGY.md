# Hoja de Ruta: Desbloqueando una Base de Código Desconocida con IA

Como Ingeniero de IA Senior, tu valor no reside en la velocidad con la que escribes código, sino en tu capacidad para auditar, comprender y gobernar sistemas complejos. En este reto, te enfrentarás al repositorio del Financial Dashboard, una base de código con documentación deficiente y un handover incompleto. Tu misión es dejar de ser un consumidor pasivo de respuestas de IA para convertirte en el arquitecto que dicta las reglas del sistema.

---

## 1. Introducción: El Cambio de Mentalidad (Mindset)

El éxito en la ingeniería moderna no depende de la confianza ciega en los modelos de lenguaje, sino en el uso de estos como generadores de hipótesis que tú, como experto, debes refutar o confirmar. La "Nota de Calidad" de este proyecto es clara: tu entrega debe ser un trabajo profesional de mantenimiento, no un conjunto de notas genéricas.

* **Filosofía Central:** Validar contra el código real, no contra suposiciones. La IA es un copiloto propenso a alucinaciones; tú eres el capitán que verifica la instrumentación antes de despegar.

### Los 3 Principios del Handover Profesional
1. **Inspección Real:** Ignora lo que el README dice que el proyecto "debería hacer". Ejecuta el código y observa qué hace realmente.
2. **Evidencia Directa:** Toda afirmación técnica debe estar respaldada por una ruta de archivo y un bloque de código específico. Si no hay evidencia, es una suposición peligrosa.
3. **Mantenibilidad:** Tu objetivo final es reducir la carga cognitiva del próximo ingeniero, institucionalizando el conocimiento que hoy estás extrayendo.

Una vez establecida esta postura crítica, el primer paso operativo es estabilizar el entorno de ejecución.

---

## 2. Fase 1: Exploración Inicial y Validación del Asistente

No puedes analizar un sistema que no puedes ejecutar. El primer paso es clonar el repositorio oficial y levantar los servicios.

### Preparación del Entorno
* **Fork y Clonación:** Realiza un fork del repositorio https://github.com/4GeeksAcademy/ai-eng-financial-dashboard-context-project a tu cuenta personal.
* **Inicialización con Docker:**
  > ⚠️ **Tip de Tech Lead:** Es común encontrar errores de permisos con `node_modules` al montar volúmenes en Docker. Si esto sucede, no intentes adivinar; copia el error exacto, entrégaselo a la IA y pídele una solución paso a paso para ajustar los permisos del contenedor.

### Validación de Servicios

| Servicio | URL de Acceso Local | Comando de Validación |
| :--- | :--- | :--- |
| **Frontend (Vite)** | `http://localhost:5173` | `npm run dev` (interno al contenedor) |
| **Backend (FastAPI)** | `http://localhost:8000` | `curl http://localhost:8000/health` |
| **Documentación API** | `http://localhost:8000/docs` | Acceso vía navegador (Swagger) |

### Interrogación Crítica a la IA
Solicita a tu LLM un resumen del proyecto: *"Analiza este repositorio y explica la arquitectura y el propósito del Dashboard Financiero"*.

* **Tu tarea de Arquitecto:** No aceptes su respuesta. Contrasta el resumen con la estructura de carpetas. Si la IA describe un sistema de autenticación que no existe en `/src/auth`, corrígela de inmediato. El proceso de "alineación" termina cuando la IA admite sus errores de percepción y se ajusta a la evidencia del código fuente.

Una base sólida de comprensión te permite pasar del simple "qué hace el código" a una auditoría rigurosa de "cómo de bien está construido".

---

## 3. Fase 2: Diagnóstico de Ingeniería (Auditoría de Calidad)

Como auditor, debes identificar los patrones que garantizan la escalabilidad y los riesgos que amenazan la estabilidad.

### Hallazgos de Ingeniería
Identifica y documenta con ejemplos exactos:

* **5 Buenas Prácticas (Preservar):**
  * *Ejemplo:* Modularización de servicios de API.
  * *¿So what?:* Un código modular permite que el LLM procese funciones pequeñas sin perder el contexto en archivos gigantescos, reduciendo errores de lógica.
* **5 Malas Prácticas o Riesgos (Mitigar):**
  * *Ejemplo:* Hardcoding de URLs o falta de tipado en las respuestas de la API.
  * *¿So what?:* El tipado débil confunde a la IA durante el autocompletado y las refactorizaciones, provocando que el asistente sugiera propiedades inexistentes (alucinaciones).

### Categorización y Gobernanza
Agrupa tus hallazgos en categorías de **Arquitectura**, **Naming**, **DX (Developer Experience)** y **Testing**. Estos no son solo comentarios; son la justificación técnica para las reglas automáticas que implementarás en el siguiente paso.

El diagnóstico de hallazgos es el insumo obligatorio para crear las reglas que gobernarán el comportamiento del equipo y de la IA.

---

## 4. Fase 3: Institucionalización de Reglas (`.agents/rules`)

Para que un estándar de ingeniería no sea "letra muerta", debe integrarse en el flujo de trabajo del asistente de IA mediante el directorio `.agents/rules`.

### Estructura de Gobernanza
Crea la carpeta y define reglas específicas. Las reglas genéricas como "haz código limpio" son inútiles; busca reglas accionables y basadas en riesgos detectados.

```text
.agents/
└── rules/
    ├── 01-api-naming-conventions.md  # Regla para evitar confusión en endpoints
    ├── 02-frontend-structure.md      # Estándar de separación UI vs Lógica
    └── 03-error-handling.md          # Protocolo de manejo de excepciones
```

### Iteración de Reglas
Una regla solo es válida si reduce un riesgo. Prueba tus reglas pidiendo a la IA: *"Genera un nuevo componente/endpoint siguiendo estrictamente la regla 01 y 02"*. Si el resultado sigue siendo ambiguo, refina la regla. La gobernanza técnica es un proceso iterativo, no estático.

Al establecer gobernanza técnica, transformamos la intuición individual en memoria operativa colectiva.

---

## 5. Fase 4: Construcción de la Memoria Operativa (Memory Bank)

El mayor costo en ingeniería es la pérdida de contexto. Crearás el `memory-bank` para asegurar que el próximo desarrollador no herede un proyecto ciego.

### Documentos Obligatorios
Crea la carpeta `memory-bank/` e incluye:

1. **`overview.md` (Producto):** Definición del Dashboard basada en las funcionalidades que realmente corren en el navegador, no en promesas.
2. **`tech_stack.md` (Tecnología):** Debes auditar el `package.json` (frontend) y `requirements.txt` o similar (backend). Lista versiones exactas de React, FastAPI, y cualquier librería de visualización financiera encontrada.
3. **`project_status.md` (Estado y Gaps):** Mapa de calor del proyecto. ¿Qué está roto? ¿Qué falta? Define las 3 prioridades técnicas inmediatas basándote en la deuda técnica detectada en la Fase 2.

Estos artefactos son la garantía de que el ciclo de "handover incompleto" termina contigo.

---

## 6. Lista de Verificación Final y Entrega Profesional

Antes de enviar tu trabajo, asegúrate de cumplir con los estándares de un Tech Lead. La falta de evidencia directa es motivo de rechazo.

- [ ] **Validación de Entorno:** ¿El proyecto levanta con `docker-compose` sin errores manuales no documentados?
- [ ] **Alineación de IA:** ¿Corregiste activamente el resumen inicial de la IA usando rutas de archivos reales?
- [ ] **Gobernanza (`.agents/rules`):** ¿Existen al menos 3 reglas específicas y accionables que mitiguen los riesgos detectados?
- [ ] **Memoria Operativa (`memory-bank`):** ¿El stack tecnológico lista las dependencias reales extraídas de los archivos de configuración?
- [ ] **Commits Granulares:** ¿Tu historial de Git muestra claramente 4 fases distintas (mínimo un commit por fase)?

### Elementos Obligatorios para la Entrega:
* **URL del Repositorio:** El fork público con todo el trabajo.
* **Historial de Git:** Evidencia del proceso de pensamiento incremental.
* **Carpeta `.agents/rules`:** El sistema de reglas configurado.
* **Carpeta `memory-bank`:** La documentación técnica de alta fidelidad.