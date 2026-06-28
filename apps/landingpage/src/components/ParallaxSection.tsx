"use client";

import { motion } from "framer-motion";
import GradientButton from "./GradientButton";

interface ParallaxSectionProps {
  onAgendar: () => void;
}

export default function ParallaxSection({ onAgendar }: ParallaxSectionProps) {
  return (
    <section 
      id="estrutura"
      className="relative w-full min-h-[460px] py-12 md:py-20 flex items-center justify-center overflow-hidden bg-scroll md:bg-fixed bg-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: "url('/parallax_clinic_room.png')"
      }}
    >
      {/* Semi-transparent dark overlay for background contrast */}
      <div className="absolute inset-0 bg-[#2D1F38]/50 z-0" />

      {/* Premium Glassmorphic Card wrapping content */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-2xl mx-auto px-6 py-8 md:py-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-[2.5rem] shadow-premium-lg text-center space-y-6 text-white mx-4 my-2"
      >
        <span className="text-[10px] font-black uppercase tracking-widest text-[#E98BAE] block">
          Espaço Integrado Sensorial
        </span>

        <h2 className="text-xl md:text-3xl font-bold leading-tight tracking-tight max-w-xl mx-auto">
          Ambiente planejado para potencializar o desenvolvimento do seu filho.
        </h2>

        <p className="text-white/90 text-[11px] md:text-xs leading-relaxed max-w-lg mx-auto font-medium">
          Salas lúdicas de estimulação sensorial, consultórios adaptados e brinquedoteca integrados sob a supervisão de terapeutas qualificados para garantir segurança, diversão e evolução clínica em cada sessão.
        </p>

        <div className="pt-2">
          <GradientButton onClick={onAgendar} variant="secondary">
            Agendar Visita Guiada
          </GradientButton>
        </div>
      </motion.div>

    </section>
  );
}
