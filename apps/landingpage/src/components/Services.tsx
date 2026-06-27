"use client";

import { useState } from "react";
import { Brain, BookOpen, Volume2, Hand, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import SectionTitle from "./SectionTitle";
import ServiceCard from "./ServiceCard";
import GradientButton from "./GradientButton";

const specialtiesList = [
  { title: "Psicologia", desc: "Apoio emocional e comportamental para o desenvolvimento saudável.", icon: Brain, color: "text-[#8E7BBE] bg-[#8E7BBE]/10" },
  { title: "Psicopedagogia", desc: "Avaliação e intervenção nas dificuldades de aprendizagem.", icon: BookOpen, color: "text-[#E98BAE] bg-[#E98BAE]/10" },
  { title: "Fonoaudiologia", desc: "Desenvolvimento da comunicação, fala, linguagem e audição.", icon: Volume2, color: "text-[#69C4B5] bg-[#69C4B5]/10" },
  { title: "Terapia Ocupacional", desc: "Estimula habilidades para autonomia e participação.", icon: Hand, color: "text-[#F3B357] bg-[#F3B357]/10" },
  { title: "Neuropsicologia", desc: "Avaliação e intervenção das funções cognitivas e comportamentais.", icon: Heart, color: "text-[#8E7BBE] bg-[#8E7BBE]/10" }
];

interface ServicesProps {
  onAgendar: () => void;
}

export default function Services({ onAgendar }: ServicesProps) {
  const [slideOffset, setSlideOffset] = useState(0);

  return (
    <section id="especialidades" className="py-24 bg-white border-y border-[#E7E7E7]/30 text-xs">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left text column */}
        <div className="lg:col-span-4 space-y-6 text-left">
          <SectionTitle 
            subtitle="NOSSAS ESPECIALIDADES"
            title="Cuidado completo para cada fase do desenvolvimento."
            coloredWord="desenvolvimento"
            coloredWordColor="text-[#69C4B5]"
            description="Uma abordagem interdisciplinar e personalizada para estimular habilidades, superar desafios e promover mais autonomia e qualidade de vida."
          />
          <div className="pt-2">
            <GradientButton onClick={onAgendar} variant="purple">
              Conheça todas as especialidades →
            </GradientButton>
          </div>
        </div>

        {/* Right cards list grid column */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {specialtiesList.map((spec, idx) => (
              <ServiceCard 
                key={idx}
                title={spec.title}
                description={spec.desc}
                icon={spec.icon}
                color={spec.color}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
