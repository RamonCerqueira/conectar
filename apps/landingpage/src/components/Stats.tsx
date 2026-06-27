"use client";

export default function Stats() {
  const stats = [
    { number: "4+", label: "Áreas Terapêuticas" },
    { number: "100%", label: "Atendimento Humanizado" },
    { number: "Salas", label: "Climatizadas e Equipadas" },
    { number: "Portal", label: "Acompanhamento dos Pais" }
  ];

  return (
    <section className="py-12 bg-black/40 border-y border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col gap-1">
            <span className="text-3xl font-display font-extrabold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              {stat.number}
            </span>
            <span className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
