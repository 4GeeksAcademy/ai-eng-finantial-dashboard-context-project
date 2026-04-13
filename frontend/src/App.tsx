function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center gap-6 px-6 py-10">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
          Financial Metrics Dashboard
        </p>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h1 className="text-3xl font-semibold">Frontend base listo</h1>
          <p className="mt-2 text-slate-300">
            Stack configurado: React + TypeScript + Vite + Tailwind. Aqui se
            integrara el frontend generado en V0 en el siguiente paso.
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-medium">Siguiente paso</h2>
          <p className="mt-2 text-slate-300">
            Generar el prompt para V0, construir la UI y conectarla a la API
            mock en FastAPI.
          </p>
        </div>
      </section>
    </main>
  );
}

export default App;
