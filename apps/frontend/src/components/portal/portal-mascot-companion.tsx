"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { soundEffects } from "@/lib/sound-effects";

const ENCOURAGING_MESSAGES = [
  "Vocês estão fazendo um trabalho incrível! 💜",
  "Cada pequeno passo da criança é gigante! 🌱",
  "A equipe Conectar está com vocês em tudo! ✨",
  "Acolhimento e paciência transformam o dia! 🌟",
  "A consistência do afeto em família cura! 💖",
];

export function PortalMascotCompanion() {
  const [bubbleIndex, setBubbleIndex] = useState<number | null>(null);
  const [hearts, setHearts] = useState<Array<{ id: number; char: string }>>([]);
  const [jumping, setJumping] = useState(false);

  const handleClick = () => {
    soundEffects.playChirp();
    setJumping(true);
    setTimeout(() => setJumping(false), 600);

    setBubbleIndex((prev) => (prev === null ? 0 : (prev + 1) % ENCOURAGING_MESSAGES.length));

    const chars = ["💜", "🌟", "✨", "🎉", "💖", "🌸"];
    const chosen = chars[Math.floor(Math.random() * chars.length)];
    const newId = Date.now();
    setHearts((prev) => [...prev, { id: newId, char: chosen }]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newId));
    }, 1000);
  };

  return (
    <div className="fixed md:absolute bottom-[72px] right-2.5 md:-bottom-3 md:-right-3 pointer-events-auto z-40 select-none">
      {/* Balão de Fala Acolhedor */}
      <AnimatePresence>
        {bubbleIndex !== null && (
          <motion.div
            key={bubbleIndex}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 450, damping: 22 }}
            className="absolute bottom-16 right-1 w-48 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl border border-[#EEE8FA] shadow-xl text-[#29232F] text-[10.5px] font-extrabold leading-snug z-50 pointer-events-auto"
          >
            <p>{ENCOURAGING_MESSAGES[bubbleIndex]}</p>
            <div className="absolute -bottom-1.5 right-5 w-3 h-3 bg-white rotate-45 border-r border-b border-[#EEE8FA]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Partículas de afeto flutuantes ao tocar */}
      <AnimatePresence>
        {hearts.map((h) => (
          <motion.span
            key={h.id}
            initial={{ opacity: 1, scale: 0.5, y: 0, x: 0 }}
            animate={{ opacity: 0, scale: 1.4, y: -45, x: (Math.random() - 0.5) * 35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute -top-3 left-6 pointer-events-none text-base select-none z-50"
          >
            {h.char}
          </motion.span>
        ))}
      </AnimatePresence>

      {/* Mascote de 64px com Overlap e Microinteração de Flutuação e Pulo */}
      <motion.div
        animate={
          jumping
            ? { y: [0, -18, 0], rotate: [0, -10, 10, 0] }
            : { y: [0, -5, 0] }
        }
        transition={
          jumping
            ? { duration: 0.5, ease: "easeInOut" }
            : { repeat: Infinity, duration: 3, ease: "easeInOut" }
        }
        whileHover={{ scale: 1.15, rotate: 6 }}
        whileTap={{ scale: 0.88 }}
        onClick={handleClick}
        className="w-16 h-16 cursor-pointer drop-shadow-md relative"
        title="Clique para receber uma palavra de carinho! 💜"
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="compGradMascot2" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8D5BD1" />
              <stop offset="1" stopColor="#6C3FB8" />
            </linearGradient>
          </defs>
          {/* Corpinho fofo roxo */}
          <circle cx="50" cy="50" r="38" fill="url(#compGradMascot2)" />
          {/* Orelhinhas / Asinhas acolhedoras */}
          <circle cx="20" cy="28" r="12" fill="#E8DEFF" />
          <circle cx="80" cy="28" r="12" fill="#E8DEFF" />
          <circle cx="20" cy="28" r="7" fill="#8D5BD1" />
          <circle cx="80" cy="28" r="7" fill="#8D5BD1" />

          {/* Olhinhos que piscam naturalmente */}
          <circle cx="38" cy="48" r="5" fill="#FFFFFF" />
          <circle cx="62" cy="48" r="5" fill="#FFFFFF" />

          <motion.circle
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{ repeat: Infinity, repeatDelay: 4, duration: 0.3 }}
            cx="40"
            cy="48"
            r="2.5"
            fill="#29232F"
          />
          <motion.circle
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{ repeat: Infinity, repeatDelay: 4, duration: 0.3 }}
            cx="64"
            cy="48"
            r="2.5"
            fill="#29232F"
          />

          <circle cx="41" cy="46" r="1" fill="#FFFFFF" />
          <circle cx="65" cy="46" r="1" fill="#FFFFFF" />

          {/* Bochechinhas rosadas que pulsam */}
          <motion.ellipse
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
            cx="28"
            cy="56"
            rx="4"
            ry="2.5"
            fill="#FFAEC0"
          />
          <motion.ellipse
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
            cx="72"
            cy="56"
            rx="4"
            ry="2.5"
            fill="#FFAEC0"
          />

          {/* Boquinha sorrindo */}
          <path d="M44 58 Q50 64 56 58" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Estrelinha de afeto */}
          <motion.path
            animate={{ rotate: [0, 20, -20, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ transformOrigin: "50px 25px" }}
            d="M50 18 L52 23 L57 24 L53 28 L54 33 L50 30 L46 33 L47 28 L43 24 L48 23 Z"
            fill="#FDE047"
          />
        </svg>
      </motion.div>
    </div>
  );
}
