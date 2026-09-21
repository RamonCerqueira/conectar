"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface PortalWelcomeHeroProps {
  parentName: string;
}

export function PortalWelcomeHero({ parentName }: PortalWelcomeHeroProps) {
  const [heartsCount, setHeartsCount] = useState<number[]>([]);

  // Microinteração ao clicar no mascote: jorra corações flutuantes!
  const handleMascotClick = () => {
    setHeartsCount((prev) => [...prev, Date.now()]);
    setTimeout(() => {
      setHeartsCount((prev) => prev.slice(1));
    }, 1200);
  };

  const displayName = parentName ? parentName.split(" ")[0] : "Família";

  return (
    <div
      id="welcome-banner"
      className="relative overflow-hidden rounded-[18px] h-[104px] border border-white/60 shadow-xs flex items-center select-none"
      style={{
        background: "linear-gradient(90deg, #FFF1F5 0%, #F8EFFF 100%)",
      }}
    >
      {/* Decorative Organic Shapes de Fundo */}
      <div className="absolute -left-6 -bottom-6 w-24 h-24 rounded-full bg-white/40 pointer-events-none blur-xs" />
      <div className="absolute left-1/3 -top-6 w-20 h-20 rounded-full bg-[#E8DEFF]/30 pointer-events-none blur-xs" />

      {/* Badge Flutuante Glassmorphism */}
      <div className="absolute right-3 top-2.5 bg-white/85 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/80 shadow-2xs flex items-center gap-1 z-10 pointer-events-none">
        <Sparkles className="w-2.5 h-2.5 text-[#8D5BD1]" />
        <span className="text-[8px] font-bold text-[#8D5BD1] tracking-tight">
          Cuidado & Afeto
        </span>
      </div>

      {/* Conteúdo de Boas-Vindas (width: 62%, padding: 14) */}
      <div id="welcome-content" className="w-[62%] p-3.5 z-10 space-y-1">
        <motion.h1
          id="welcome-title"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[18px] font-extrabold text-[#29232F] leading-tight flex items-center gap-1"
        >
          <span>Olá, {displayName}!</span>
          <motion.span
            animate={{ scale: [1, 1.25, 1], rotate: [0, 8, -8, 0] }}
            transition={{ repeat: Infinity, repeatDelay: 3.5, duration: 1 }}
            className="inline-block text-[#8D5BD1]"
          >
            💜
          </motion.span>
        </motion.h1>

        <p id="welcome-description" className="text-[10px] leading-[1.4] text-[#77717E] font-medium">
          Acompanhe aqui o desenvolvimento e a rotina da sua criança com carinho.
        </p>
      </div>

      {/* Ilustração Interativa de Boas-Vindas (width: 38%, position: right) */}
      <div
        id="welcome-illustration"
        onClick={handleMascotClick}
        className="w-[38%] h-full flex items-center justify-center relative cursor-pointer group pr-1"
        title="Clique para dar carinho no Mascote! 💜"
      >
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="w-full h-full flex items-center justify-center relative"
        >
          {/* Mascote Coração Vetorial */}
          <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[92px] drop-shadow-sm">
            <defs>
              <linearGradient id="heartGradHero" x1="20" y1="10" x2="140" y2="130" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FF8596" />
                <stop offset="1" stopColor="#FF5C75" />
              </linearGradient>
            </defs>
            {/* Bracinho esquerdo dando tchau com animação suave */}
            <motion.path
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              style={{ transformOrigin: "38px 58px" }}
              d="M28 62 C15 50 10 38 12 28 C14 20 22 20 25 28 C28 35 34 50 38 58"
              stroke="#29232F"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Bracinho direito aberto */}
            <path d="M132 62 C145 52 150 40 148 30 C146 22 138 22 135 30 C132 37 126 50 122 58" stroke="#29232F" strokeWidth="3.5" strokeLinecap="round" />
            {/* Perninhas */}
            <path d="M62 118 L58 134 M98 118 L102 134" stroke="#29232F" strokeWidth="3.5" strokeLinecap="round" />
            {/* Corpinho Coração */}
            <path
              d="M80 120 C45 92 18 68 18 42 C18 22 34 10 54 10 C66 10 74 16 80 24 C86 16 94 10 106 10 C126 10 142 22 142 42 C142 68 115 92 80 120 Z"
              fill="url(#heartGradHero)"
            />
            {/* Florzinha na orelha direita */}
            <circle cx="120" cy="18" r="6" fill="#DDD6FE" />
            <circle cx="129" cy="14" r="6" fill="#DDD6FE" />
            <circle cx="133" cy="23" r="6" fill="#DDD6FE" />
            <circle cx="125" cy="28" r="6" fill="#DDD6FE" />
            <circle cx="118" cy="25" r="6" fill="#DDD6FE" />
            <circle cx="125" cy="21" r="4.5" fill="#FDE047" />
            {/* Olhos brilhantes */}
            <ellipse cx="64" cy="52" rx="4.5" ry="6.5" fill="#29232F" />
            <circle cx="66" cy="49" r="2" fill="#FFFFFF" />
            <ellipse cx="96" cy="52" rx="4.5" ry="6.5" fill="#29232F" />
            <circle cx="98" cy="49" r="2" fill="#FFFFFF" />
            {/* Cílios e Sobrancelhas */}
            <path d="M58 43 Q64 39 70 42" stroke="#29232F" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M90 42 Q96 39 102 43" stroke="#29232F" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            {/* Bochechinhas rosadas */}
            <circle cx="52" cy="62" r="5.5" fill="#FFAEC0" opacity="0.85" />
            <circle cx="108" cy="62" r="5.5" fill="#FFAEC0" opacity="0.85" />
            {/* Sorriso acolhedor */}
            <path d="M72 63 Q80 71 88 63" stroke="#29232F" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          </svg>
        </motion.div>

        {/* Efeito de microinteração: partículas de corações flutuantes ao clicar */}
        <AnimatePresence>
          {heartsCount.map((id) => (
            <motion.span
              key={id}
              initial={{ opacity: 1, scale: 0.6, y: 0, x: 0 }}
              animate={{ opacity: 0, scale: 1.3, y: -45, x: (Math.random() - 0.5) * 30 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="absolute pointer-events-none text-base select-none z-30"
            >
              💖
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
