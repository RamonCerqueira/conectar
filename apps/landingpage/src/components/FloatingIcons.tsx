"use client";

import { motion } from "framer-motion";

export default function FloatingIcons() {
  return (
    <>
      {/* Floating Heart */}
      <motion.div
        animate={{
          y: [0, -12, 0],
          rotate: [0, 8, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-12 left-4 bg-white p-3 rounded-2xl shadow-xl border border-zinc-100 text-[10px] font-bold flex items-center gap-1.5 text-zinc-700 pointer-events-none select-none z-10"
      >
        <span className="text-[#E98BAE]">❤️</span> Acolhimento transdisciplinar
      </motion.div>

      {/* Floating Leaf */}
      <motion.div
        animate={{
          y: [0, 10, 0],
          rotate: [0, -6, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute -bottom-4 right-12 text-[#69C4B5]/20 opacity-70 pointer-events-none select-none z-10"
      >
        <svg width="60" height="60" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 8C8 10 5.9 16.1 5 21c4.9-.9 11-3 13-12h-1zm2-5c-6.8 0-13 5.2-14.7 12.3C2.5 16.2 1 18.9 1 21c0 1.1.9 2 2 2 2.1 0 4.8-1.5 5.7-3.3C15.8 18 21 11.8 21 5c0-1.1-.9-2-2-2z"/>
        </svg>
      </motion.div>

      {/* Floating Sparkles */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 right-8 text-[#F3B357]/30 pointer-events-none select-none z-10"
      >
        <svg width="45" height="45" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/>
        </svg>
      </motion.div>
    </>
  );
}
