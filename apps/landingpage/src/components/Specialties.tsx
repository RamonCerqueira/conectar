"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Volume2, ToyBrick, BookOpen } from "lucide-react";

type TabKey = "psicologia" | "fonoaudiologia" | "terapia" | "pedagogia";

interface TabContent {
  title: string;
  description: string;
  items: string[];
  ctaText: string;
  ctaUrl: string;
  badgeText: string;
  previewTitle: string;
  previewDesc: string;
  icon: React.ReactNode;
}

export default function Specialties() {
  const [activeTab, setActiveTab] = useState<TabKey>("psicologia");

  const contents: Record<TabKey, TabContent> = {
    psicologia: {
      title: "Psicoterapia Infantil e Neuropsicologia",
      description: "Apoio emocional para auxiliar crianças e adolescentes a compreenderem sentimentos, superarem desafios comportamentais e sociais. Realizamos avaliações neuropsicológicas completas para diagnóstico preciso e direcionamento de intervenção precoce.",
      items: [
        "Psicoterapia Comportamental Cognitiva",
        "Avaliação Neuropsicológica Completa",
        "Orientação Parental e Suporte Familiar"
      ],
      ctaText: "Falar com Especialista",
      ctaUrl: "https://wa.me/5500000000000",
      badgeText: "Área Emocional",
      previewTitle: "Foco do Tratamento",
      previewDesc: "Cognição, Emoção & Comportamento",
      icon: <CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0" />
    },
    fonoaudiologia: {
      title: "Desenvolvimento da Comunicação e Linguagem",
      description: "Tratamento especializado para distúrbios da fala, linguagem oral e escrita, processamento auditivo e motricidade orofacial. Ajudamos a desbloquear o potencial de comunicação, promovendo a autoconfiança social e escolar.",
      items: [
        "Terapia de Linguagem e Atraso de Fala",
        "Transtorno de Processamento Auditivo Central (TPAC)",
        "Intervenção na Seletividade Alimentar & Mastigação"
      ],
      ctaText: "Agendar Triagem de Fono",
      ctaUrl: "https://wa.me/5500000000000",
      badgeText: "Comunicação",
      previewTitle: "Método Clínico",
      previewDesc: "Intervenção lúdica e estimulação de sons corretos",
      icon: <Volume2 className="w-5 h-5 text-emerald-400 shrink-0" />
    },
    terapia: {
      title: "Autonomia e Integração Sensorial",
      description: "Desenvolvimento da coordenação motora fina e grossa, habilidades sensoriais e autonomia nas Atividades de Vida Diária (como vestir-se, alimentar-se e brincar). Focado no desenvolvimento da auto-regulação e processamento de estímulos.",
      items: [
        "Integração Sensorial de Ayres",
        "Habilidades de Coordenação e Motricidade",
        "Treino de Atividades de Vida Diária (AVD)"
      ],
      ctaText: "Saber mais sobre T.O.",
      ctaUrl: "https://wa.me/5500000000000",
      badgeText: "Integração Sensorial",
      previewTitle: "Respostas Adaptativas",
      previewDesc: "Estímulos proprioceptivos e vestibulares controlados",
      icon: <ToyBrick className="w-5 h-5 text-blue-400 shrink-0" />
    },
    pedagogia: {
      title: "Dificuldades de Aprendizagem e Apoio Cognitivo",
      description: "Apoio psicopedagógico focado no diagnóstico de bloqueios de aprendizagem, TDAH, dislexia e apoio no desenvolvimento acadêmico, estimulando o interesse escolar e a autonomia intelectual.",
      items: [
        "Diagnóstico Psicopedagógico Clínico",
        "Estimulação de Funções Executivas e Raciocínio",
        "Orientação Escolar e Adaptação de Estudos"
      ],
      ctaText: "Falar com Psicopedagoga",
      ctaUrl: "https://wa.me/5500000000000",
      badgeText: "Área Cognitiva",
      previewTitle: "Desenvolvimento Escolar",
      previewDesc: "Apoio direcionado na leitura, escrita e raciocínio lógico",
      icon: <BookOpen className="w-5 h-5 text-purple-400 shrink-0" />
    }
  };

  const current = contents[activeTab];

  return (
    <section id="especialidades" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-4">
          <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight">Nossos Serviços Especializados</h2>
          <p className="text-zinc-400 leading-relaxed">
            Oferecemos terapias integradas focadas em potencializar as habilidades motoras, cognitivas, emocionais e de fala de cada paciente.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="flex flex-col sm:flex-row gap-2 bg-white/[0.02] border border-white/5 p-1.5 rounded-2xl max-w-full sm:max-w-fit">
            {(Object.keys(contents) as TabKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  activeTab === key
                    ? "bg-violet-600/15 text-violet-300 shadow-[inset_0_0_0_1px_rgba(124,58,237,0.25)]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {key === "psicologia" && "Psicologia & Neuro"}
                {key === "fonoaudiologia" && "Fonoaudiologia"}
                {key === "terapia" && "Terapia Ocupacional"}
                {key === "pedagogia" && "Psicopedagogia"}
              </button>
            ))}
          </div>
        </div>

        <div className="relative min-h-[380px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-2 gap-16 items-center"
            >
              <div className="flex flex-col gap-6">
                <h3 className="text-2xl md:text-3xl font-display font-bold">{current.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{current.description}</p>
                <ul className="flex flex-col gap-3.5 mb-2">
                  {current.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm font-semibold">
                      {current.icon}
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div>
                  <a
                    href={current.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold px-6 py-3.5 rounded-xl hover:brightness-115 transition-all"
                  >
                    <span>{current.ctaText}</span>
                  </a>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-[400px] h-[250px] glass-card rounded-2xl p-8 flex items-center justify-center border border-white/5">
                  <div className="w-full flex flex-col gap-4">
                    <span className="inline-flex items-center gap-2 bg-white/5 border border-white/8 text-zinc-300 px-3.5 py-1 rounded-full text-xs font-semibold w-fit">
                      {current.badgeText}
                    </span>
                    <div className="bg-white/2 p-5 rounded-xl border border-white/5">
                      <strong className="text-xs text-zinc-500 uppercase tracking-widest block mb-1">
                        {current.previewTitle}
                      </strong>
                      <p className="text-sm text-zinc-200 font-bold leading-normal">
                        {current.previewDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
