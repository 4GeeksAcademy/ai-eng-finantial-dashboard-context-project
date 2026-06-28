# Regla: Manejo de Estado Asíncrono
- **Alcance:** Frontend (React).
- **Razón:** El uso de `useEffect` directo para llamadas a la API genera condiciones de carrera y fugas de memoria.
- **Restricción Estricta:** Queda estrictamente prohibido usar `useEffect` para hacer data-fetching.
- **Estándar:** Toda petición a la API debe extraerse a un Custom Hook o utilizar herramientas de Server State (como React Query) que manejen estados de carga, error y cancelación automáticamente.