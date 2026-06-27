"use client";

import { motion } from "framer-motion";
import GradientButton from "./GradientButton";
import FloatingIcons from "./FloatingIcons";

interface HeroProps {
  onAgendar: () => void;
  onChat: () => void;
}

export default function Hero({ onAgendar, onChat }: HeroProps) {
  return (
    <section className="pt-[140px] pb-20 bg-gradient-to-b from-[#8E7BBE]/5 via-white to-white relative overflow-hidden text-xs">
      {/* Background ambient glows for top-tier master UI/UX depth */}
      <div className="glow-sphere-purple -top-20 -left-20 opacity-70" />
      <div className="glow-sphere-teal bottom-0 right-10 opacity-60" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-[#8E7BBE] leading-[1.12]"
          >
            Conectando caminhos,<br />
            <span className="font-cursive text-[#E98BAE] text-[1.25em] px-1">desenvolvendo</span> potencialidades.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#4A4A4A] text-xs md:text-sm leading-relaxed max-w-lg font-semibold"
          >
            Atendimento especializado para crianças e adolescentes com dificuldades de aprendizagem, desenvolvimento e comportamento, oferecendo um cuidado individualizado para que cada criança alcance seu máximo potencial.
          </motion.p>

          {/* Action buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-3.5"
          >
            <GradientButton onClick={onAgendar} variant="primary">
              Agendar Avaliação
            </GradientButton>
            <GradientButton onClick={onChat} variant="secondary">
              Falar no WhatsApp
            </GradientButton>
          </motion.div>

          {/* Trust Row */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-4 border-t border-[#E7E7E7] flex items-center gap-3.5"
          >
            <div className="flex -space-x-2">
              <img className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100" alt="Avatar 1" />
              <img className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100" alt="Avatar 2" />
              <img className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100" alt="Avatar 3" />
            </div>
            <p className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wide">
              Mais de <span className="text-[#8E7BBE] font-black">200 famílias</span> já confiam em nosso trabalho.
            </p>
          </motion.div>
        </div>

        {/* Right Column (Blob Mask Image) */}
        <div className="lg:col-span-6 relative flex justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Gradient border effect background blob */}
            <div 
              className="absolute inset-0 -m-2 opacity-25 blur-lg pointer-events-none" 
              style={{ 
                borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
                background: "linear-gradient(90deg, #8E7BBE, #E98BAE, #69C4B5, #F3B357)" 
              }}
            />
            
            {/* The main blob mask image */}
            <div 
              className="w-80 h-80 md:w-96 md:h-96 overflow-hidden border-8 border-white shadow-2xl relative bg-zinc-100"
              style={{ borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%" }}
            >
              <img
                src="/hero_clinic_photo.png"
                alt="Terapeuta e Criança"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600";
                }}
              />
            </div>

            {/* Floating Hearts, Leaves & Sparkles */}
            <FloatingIcons />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
