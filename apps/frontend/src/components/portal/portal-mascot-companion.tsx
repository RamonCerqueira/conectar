"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ENCOURAGING_MESSAGES = [
  "Vocês estão fazendo um trabalho incrível! 💜",
  "Cada passo conta no desenvolvimento! 🌱",
  "Estamos aqui para apoiar sua família! ✨",
  "Acolhimento e carinho em cada conquista! 🌟",
  "A consistência do amor transforma tudo! 💖",
];

export function PortalMascotCompanion() {
  const [bubbleIndex, setBubbleIndex] = useState<number | null>(null);

  const handleClick = () => {
    setBubbleIndex((prev) => (prev === null ? 0 : (prev + 1) % ENCOURAGING_MESSAGES.length));
  };

  return (
    <div className="hidden md:block absolute -bottom-3 -right-3 pointer-events-auto z-40 select-none">
      {/* Balão de Fala Acolhedor com Animação */}
      <AnimatePresence>
        {bubbleIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.8 }}
            className="absolute bottom-20 right-2 w-48 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-[#EEE8FA] shadow-xl text-[#29232F] text-[11px] font-bold leading-snug z-50 pointer-events-auto"
          >
            <p>{ENCOURAGING_MESSAGES[bubbleIndex]}</p>
            {/* Pontinha do balão */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white rotate-45 border-r border-b border-[#EEE8FA]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascote de 64px com Overlap e Microinteração de Flutuação */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        whileHover={{ scale: 1.15, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
        className="w-16 h-16 cursor-pointer drop-shadow-md"
        title="Clique para receber uma mensagem de carinho! 💜"
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="compGradMascot" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8D5BD1" />
              <stop offset="1" stopColor="#6C3FB8" />
            </linearGradient>
          </defs>
          {/* Corpinho fofo roxo */}
          <circle cx="50" cy="50" r="38" fill="url(#compGradMascot)" />
          {/* Orelhinhas / Asinhas acolhedoras */}
          <circle cx="20" cy="28" r="12" fill="#E8DEFF" />
          <circle cx="80" cy="28" r="12" fill="#E8DEFF" />
          <circle cx="20" cy="28" r="7" fill="#8D5BD1" />
          <circle cx="80" cy="28" r="7" fill="#8D5BD1" />
          {/* Olhos espertos e carinhosos */}
          <circle cx="38" cy="48" r="5" fill="#FFFFFF" />
          <circle cx="62" cy="48" r="5" fill="#FFFFFF" />
          <circle cx="40" cy="48" r="2.5" fill="#29232F" />
          <circle cx="64" cy="48" r="2.5" fill="#29232F" />
          <circle cx="41" cy="46" r="1" fill="#FFFFFF" />
          <circle cx="65" cy="46" r="1" fill="#FFFFFF" />
          {/* Bochechinhas rosadas */}
          <ellipse cx="28" cy="56" rx="4" ry="2.5" fill="#FFAEC0" />
          <ellipse cx="72" cy="56" rx="4" ry="2.5" fill="#FFAEC0" />
          {/* Boquinha sorrindo */}
          <path d="M44 58 Q50 64 56 58" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Estrelinha de incentivo */}
          <path d="M50 18 L52 23 L57 24 L53 28 L54 33 L50 30 L46 33 L47 28 L43 24 L48 23 Z" fill="#FDE047" />
        </svg>
      </motion.div>
    </div>
  );
}
