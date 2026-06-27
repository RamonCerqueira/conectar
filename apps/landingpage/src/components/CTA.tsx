"use client";

import { Calendar, Phone } from "lucide-react";
import GradientButton from "./GradientButton";

interface CTAProps {
  onAgendar: () => void;
  onChat: () => void;
}

export default function CTA({ onAgendar, onChat }: CTAProps) {
  return (
    <section className="py-12 px-6">
      <div 
        className="max-w-7xl mx-auto rounded-[2rem] h-auto lg:h-[180px] p-8 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl text-left text-white"
        style={{ background: "linear-gradient(90deg, #8E7BBE, #E98BAE, #69C4B5, #F3B357)" }}
      >
        {/* Outlined heart background shapes with low opacity */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 text-white/10 pointer-events-none select-none flex gap-3 z-0">
          <svg width="140" height="140" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" transform="scale(6) translate(-2, -2)" />
          </svg>
        </div>

        {/* Left column */}
        <div className="flex items-center gap-6 relative z-10 w-full lg:w-auto">
          {/* White square calendar box */}
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-[#8E7BBE] shrink-0 shadow-lg">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight leading-tight max-w-xl">
              Vamos construir juntos novos caminhos para o desenvolvimento do seu filho.
            </h2>
          </div>
        </div>

        {/* Right column (Buttons) */}
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto relative z-10">
          <button
            onClick={onAgendar}
            className="w-full sm:w-auto px-7 py-3 rounded-full font-bold bg-white text-[#69C4B5] hover:bg-zinc-50 border-0 cursor-pointer text-xs uppercase tracking-wider shadow-md transition-all shrink-0 flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar Avaliação</span>
          </button>
          <button
            onClick={onChat}
            className="w-full sm:w-auto px-7 py-3 rounded-full font-bold border-2 border-white bg-transparent text-white hover:bg-white/5 cursor-pointer text-xs uppercase tracking-wider transition-all shrink-0 flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>
        </div>

      </div>
    </section>
  );
}
