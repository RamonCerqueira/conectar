"use client";

import { useState } from "react";
import { ChevronRight, Brain, BookOpen, Volume2, Hand, Heart, Users, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const especialidades = [
  {
    id: "psicologia",
    titulo: "Psicologia",
    icone: Brain,
    descShort: "Apoio emocional e comportamental para o desenvolvimento saudável.",
    descLong: "A psicoterapia infantil foca no acolhimento de questões emocionais, de comportamento e socialização. Através do lúdico, ajudamos a criança a expressar sentimentos, regular emoções e superar conflitos internos em parceria com a família."
  },
  {
    id: "psicopedagogia",
    titulo: "Psicopedagogia",
    icone: BookOpen,
    descShort: "Avaliação e intervenção nas dificuldades de aprendizagem.",
    descLong: "Identifica como a criança aprende e quais os obstáculos na leitura, escrita ou raciocínio. Desenvolve estratégias de estudo personalizadas e estimula funções cognitivas fundamentais para o sucesso escolar."
  },
  {
    id: "fonoaudiologia",
    titulo: "Fonoaudiologia",
    icone: Volume2,
    descShort: "Desenvolvimento da comunicação, fala, linguagem e audição.",
    descLong: "Tratamento para atrasos de fala, trocas na escrita, gagueira e processamento auditivo central. Estimula as habilidades de comunicação expressiva e compreensiva com foco na socialização."
  },
  {
    id: "terapia-ocupacional",
    titulo: "Terapia Ocupacional",
    icone: Hand,
    descShort: "Estimula habilidades para autonomia e participação diária.",
    descLong: "Trabalha com integração sensorial, coordenação motora fina/ampla e atividades de vida diária (AVD). Indicado para crianças com dificuldades de regulação e que necessitam de maior autonomia."
  },
  {
    id: "neuropsicologia",
    titulo: "Neuropsicologia",
    icone: Heart,
    descShort: "Avaliação das funções cognitivas e comportamentais.",
    descLong: "Realização de testes padronizados para mapear atenção, memória, raciocínio e funções executivas. Essencial para o diagnóstico diferencial de TEA, TDAH e dificuldades específicas de aprendizagem."
  },
  {
    id: "orientacao-familiar",
    titulo: "Orientação Familiar",
    icone: Users,
    descShort: "Apoio e direcionamento contínuo para os pais e cuidadores.",
    descLong: "Espaço dedicado para instrumentalizar os pais na condução das rotinas infantis, controle de comportamentos desafiadores e fortalecimento dos vínculos afetivos saudáveis no lar."
  }
];

interface SpecialtiesProps {
  onAgendar: () => void;
}

export default function Specialties({ onAgendar }: SpecialtiesProps) {
  const [selectedSpec, setSelectedSpec] = useState<any | null>(null);

  return (
    <section id="especialidades" className="py-24 bg-zinc-50/50">
      <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
        <div className="max-w-xl mx-auto space-y-3">
          <span className="text-[10px] uppercase tracking-widest text-[#db2777] font-black">Nossas Especialidades</span>
          <h2 className="text-3xl font-black text-[#3c2a4d]">
            Cuidado completo para cada fase do desenvolvimento.
          </h2>
          <p className="text-zinc-500 text-xs leading-relaxed">
            Equipe clínica transdisciplinar altamente qualificada nas áreas de aprendizagem infantil, comportamento e reabilitação sensorial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {especialidades.map((spec) => {
            const Icon = spec.icone;
            return (
              <div
                key={spec.id}
                onClick={() => setSelectedSpec(spec)}
                className="p-6 bg-white border border-[#8e7bbe]/15 rounded-2xl text-left space-y-4 hover:border-[#8e7bbe]/45 hover:shadow-xl hover:shadow-[#8e7bbe]/5 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#8e7bbe]/10 flex items-center justify-center text-[#8e7bbe] group-hover:bg-[#8e7bbe] group-hover:text-white transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-sm text-[#3c2a4d]">{spec.titulo}</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed">{spec.descShort}</p>
                </div>
                <span className="text-[10px] font-bold text-[#8e7bbe] flex items-center gap-1 group-hover:gap-2 transition-all">
                  Saiba mais <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedSpec && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="absolute inset-0" onClick={() => setSelectedSpec(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm rounded-2xl shadow-2xl border bg-white p-6 space-y-4"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-bold text-sm text-[#3c2a4d]">{selectedSpec.titulo}</h3>
                <button
                  onClick={() => setSelectedSpec(null)}
                  className="p-1 hover:bg-zinc-100 rounded text-zinc-400 border-0 bg-transparent cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
              <p className="text-zinc-600 text-xs leading-relaxed text-left">
                {selectedSpec.descLong}
              </p>
              <div className="pt-3 border-t flex justify-end">
                <button
                  onClick={() => {
                    setSelectedSpec(null);
                    onAgendar();
                  }}
                  className="px-5 py-2 rounded-xl font-bold text-white bg-[#8e7bbe] hover:bg-[#8e7bbe]/90 border-0 cursor-pointer text-[10px] uppercase"
                >
                  Agendar Avaliação
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
