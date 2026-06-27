"use client";

import { motion } from "framer-motion";
import { Phone, Users, Smile, Heart, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="pt-44 pb-20 relative">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="md:col-span-7 flex flex-col gap-8"
        >
          <div>
            <span className="inline-flex items-center gap-2 bg-violet-600/10 border border-violet-500/30 text-violet-300 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-ping" />
              Clínica Multidisciplinar de Saúde
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-extrabold leading-[1.1] tracking-tight">
            Cuidado integrado para o <br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
              desenvolvimento infantil
            </span>
          </h1>

          <p className="text-lg text-zinc-400 leading-relaxed max-w-xl">
            Acolhimento humanizado e terapias especializadas em Psicologia, Fonoaudiologia, Terapia Ocupacional e Psicopedagogia. Apoiamos famílias na jornada do desenvolvimento e evolução de quem você ama.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <a
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-violet-500/20 hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300"
            >
              <Phone className="w-5 h-5" />
              <span>Agendar Consulta</span>
            </a>
            <a
              href="http://localhost:5000/portal/login"
              className="flex items-center justify-center gap-2 bg-white/5 border border-white/8 hover:bg-white/10 hover:border-white/20 text-white font-semibold px-8 py-4 rounded-2xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <Users className="w-5 h-5" />
              <span>Portal da Família</span>
            </a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="md:col-span-5 flex justify-center"
        >
          <div className="w-full max-w-[480px] glass-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative z-10">
            <div className="h-10 bg-black/30 border-b border-white/5 flex items-center px-4">
              <span className="text-xs text-white/30 font-medium">Instituto Conectar</span>
            </div>
            <div className="p-8 flex flex-col justify-between h-[300px]">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-white">Atendimento Integrado</h4>
                <p className="text-xs text-zinc-400 mt-1">Nossa rede de suporte para o paciente</p>
              </div>

              <div className="flex items-center justify-between my-4 px-2">
                <div className="flex flex-col items-center gap-2.5 w-20 text-center text-violet-400">
                  <div className="w-12 h-12 rounded-full bg-violet-500/5 border border-violet-500/20 flex items-center justify-center shadow-lg shadow-violet-500/10 hover:scale-105 transition-transform">
                    <Smile className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold">Paciente</span>
                </div>

                <div className="flex-1 h-[1px] bg-gradient-to-r from-white/5 via-white/25 to-white/5 mx-2 relative">
                  <span className="absolute top-[-2px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/30" />
                </div>

                <div className="flex flex-col items-center gap-2.5 w-20 text-center text-emerald-400">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/10 hover:scale-105 transition-transform">
                    <Heart className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold">Terapeutas</span>
                </div>

                <div className="flex-1 h-[1px] bg-gradient-to-r from-white/5 via-white/25 to-white/5 mx-2 relative">
                  <span className="absolute top-[-2px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/30" />
                </div>

                <div className="flex flex-col items-center gap-2.5 w-20 text-center text-blue-400">
                  <div className="w-12 h-12 rounded-full bg-blue-500/5 border border-blue-500/20 flex items-center justify-center shadow-lg shadow-blue-500/10 hover:scale-105 transition-transform">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold">Família</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-zinc-400 bg-white/[0.02] border border-white/5 py-2 px-4 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Prontuário integrado & evolução transparente</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
