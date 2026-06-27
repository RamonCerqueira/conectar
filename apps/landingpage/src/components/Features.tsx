"use client";

import { Users2, FileHeart, LayoutGrid, HeartHandshake } from "lucide-react";

export default function Features() {
  const cards = [
    {
      icon: <Users2 className="w-6 h-6" />,
      title: "Equipe Multidisciplinar Alinhada",
      description: "Terapeutas de diversas áreas conversam e alinham o plano de intervenção semanalmente. O paciente é atendido de forma global e coordenada."
    },
    {
      icon: <FileHeart className="w-6 h-6" />,
      title: "Transparência Total (Portal dos Pais)",
      description: "Acesso exclusivo para pais acompanharem resumos das evoluções diárias das terapias, frequência, atividades recomendadas e relatórios clínicos."
    },
    {
      icon: <LayoutGrid className="w-6 h-6" />,
      title: "Salas Temáticas e Lúdicas",
      description: "Consultórios ambientados especialmente para engajamento e conforto visual/sensorial de crianças e adolescentes durante o atendimento."
    },
    {
      icon: <HeartHandshake className="w-6 h-6" />,
      title: "Orientação Escolar e de Pais",
      description: "Apoiamos a integração entre a clínica, a família e a escola, auxiliando professores na adaptação pedagógica necessária para a evolução clínica."
    }
  ];

  return (
    <section id="diferenciais" className="py-24 bg-black/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-4">
          <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight">Por que escolher o Instituto Conectar?</h2>
          <p className="text-zinc-400 leading-relaxed">Nossos pilares de cuidado garantem um desenvolvimento seguro, acolhedor e totalmente acompanhado.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {cards.map((card, idx) => (
            <div 
              key={idx} 
              className="glass-card rounded-2xl p-8 flex flex-col gap-4 border border-white/5 hover:border-violet-500/20 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold font-display group-hover:text-violet-300 transition-colors">
                {card.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
