"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Reuses the heart character and wink from the family portal. */
export default function LandingMascot() {
  const gradientId = useId();
  const reducedMotion = useReducedMotion();
  const [mascotWinking, setMascotWinking] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  function greet() {
    if (timer.current) clearTimeout(timer.current);
    setMascotWinking(true);
    setCelebrating(true);
    timer.current = setTimeout(() => { setMascotWinking(false); setCelebrating(false); }, 1800);
  }
  return <div className="landing-mascot">
    <button type="button" onClick={greet} className="landing-mascot-button" aria-label="Dar carinho ao mascote Conectar">
          <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="landing-mascot-art" aria-hidden="true">
            <defs>
              <linearGradient id={gradientId} x1="20" y1="10" x2="140" y2="130" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FF8596" />
                <stop offset="1" stopColor="#FF5C75" />
              </linearGradient>
            </defs>
            {/* Bracinho esquerdo dando tchau */}
            <motion.path
              animate={reducedMotion ? { rotate: 0 } : { rotate: [0, 14, -14, 0] }}
              transition={{ repeat: reducedMotion ? 0 : Infinity, duration: 1.8, ease: "easeInOut" }}
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
              fill={`url(#${gradientId})`}
            />
            {/* Florzinha na orelha direita */}
            <circle cx="120" cy="18" r="6" fill="#DDD6FE" />
            <circle cx="129" cy="14" r="6" fill="#DDD6FE" />
            <circle cx="133" cy="23" r="6" fill="#DDD6FE" />
            <circle cx="125" cy="28" r="6" fill="#DDD6FE" />
            <circle cx="118" cy="25" r="6" fill="#DDD6FE" />
            <circle cx="125" cy="21" r="4.5" fill="#FDE047" />

            {/* Olho Esquerdo (Piscando se mascotWinking for true) */}
            {mascotWinking ? (
              <path d="M60 52 Q64 47 68 52" stroke="#29232F" strokeWidth="3" strokeLinecap="round" fill="none" />
            ) : (
              <>
                <ellipse cx="64" cy="52" rx="4.5" ry="6.5" fill="#29232F" />
                <circle cx="66" cy="49" r="2" fill="#FFFFFF" />
              </>
            )}

            {/* Olho Direito com brilho */}
            <ellipse cx="96" cy="52" rx="4.5" ry="6.5" fill="#29232F" />
            <circle cx="98" cy="49" r="2" fill="#FFFFFF" />

            {/* Cílios e Sobrancelhas */}
            <path d="M58 43 Q64 39 70 42" stroke="#29232F" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M90 42 Q96 39 102 43" stroke="#29232F" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            {/* Bochechinhas rosadas que pulsam */}
            <motion.circle
              animate={reducedMotion ? { scale: 1 } : { scale: [1, 1.15, 1] }}
              transition={{ repeat: reducedMotion ? 0 : Infinity, duration: 2 }}
              cx="52"
              cy="62"
              r="5.5"
              fill="#FFAEC0"
              opacity="0.9"
            />
            <motion.circle
              animate={reducedMotion ? { scale: 1 } : { scale: [1, 1.15, 1] }}
              transition={{ repeat: reducedMotion ? 0 : Infinity, duration: 2 }}
              cx="108"
              cy="62"
              r="5.5"
              fill="#FFAEC0"
              opacity="0.9"
            />
            {/* Sorriso acolhedor */}
            <path d="M72 63 Q80 71 88 63" stroke="#29232F" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          </svg>
      {celebrating && !reducedMotion && <span className="mascot-affection" aria-hidden="true"><span>💜</span><span>✨</span><span>💖</span></span>}
    </button>
    <div className="landing-mascot-message" role="status">{celebrating ? "Cada conexão faz a diferença! 💜" : "Um toque de carinho?"}</div>
  </div>;
}
