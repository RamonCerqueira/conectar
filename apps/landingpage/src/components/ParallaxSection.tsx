"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Smile, Heart } from "lucide-react";

export default function ParallaxSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax shifts
  const yText = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const yBg = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const yOrb1 = useTransform(scrollYProgress, [0, 1], [-150, 150]);
  const yOrb2 = useTransform(scrollYProgress, [0, 1], [120, -120]);

  return (
    <section 
      ref={containerRef} 
      className="relative my-16 py-32 md:py-48 overflow-hidden bg-black/60 border-y border-white/5 flex items-center justify-center min-h-[400px]"
    >
      {/* Background elements */}
      <motion.div 
        style={{ y: yBg }} 
        className="absolute inset-0 bg-[radial-gradient(rgba(124,58,237,0.06)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40"
      />
      
      {/* Floating Shapes / Doodles */}
      <motion.div 
        style={{ y: yOrb1 }}
        className="absolute top-1/4 left-1/4 w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 rotate-12 blur-[1px] md:blur-0"
      >
        <Heart className="w-5 h-5" />
      </motion.div>

      <motion.div 
        style={{ y: yOrb2 }}
        className="absolute bottom-1/4 right-1/4 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500/10 to-emerald-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 -rotate-12 blur-[1px] md:blur-0"
      >
        <Smile className="w-6 h-6" />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div 
          style={{ y: yText }}
          className="max-w-4xl mx-auto flex flex-col gap-6 items-center"
        >
          <span className="bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/30 text-violet-300 px-4.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            Nosso Propósito
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold leading-tight tracking-tight max-w-3xl">
            "Acolhimento que conecta, tecnologia que aproxima e terapias que <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">transformam vidas</span>."
          </h2>
          <p className="text-sm md:text-base text-zinc-400 font-semibold tracking-wide uppercase mt-2">
            Instituto Conectar — Cuidado Integrado
          </p>
        </motion.div>
      </div>
    </section>
  );
}
