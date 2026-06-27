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
      className="relative w-full h-[420px] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/parallax_clinic_room.png')",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Semi-transparent overlay with light blur for premium contrast */}
      <div className="absolute inset-0 bg-[#3c2a4d]/45 backdrop-blur-[2px] z-0" />

      {/* Centered Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-6 text-white">
        <motion.span 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[10px] font-black uppercase tracking-widest text-[#E98BAE] block"
        >
          Espaço Integrado Sensorial
        </motion.span>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl md:text-4xl font-black leading-tight tracking-tight max-w-2xl mx-auto"
        >
          Ambiente planejado para potencializar o desenvolvimento do seu filho.
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/90 text-xs md:text-sm leading-relaxed max-w-xl mx-auto font-medium"
        >
          Salas lúdicas de estimulação sensorial, consultórios adaptados e brinquedoteca integrados sob a supervisão de terapeutas qualificados para garantir segurança, diversão e evolução clínica em cada sessão.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-2"
        >
          <GradientButton onClick={onAgendar} variant="secondary">
            Agendar Visita Guiada
          </GradientButton>
        </motion.div>
      </div>

    </section>
  );
}
