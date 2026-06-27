"use client";

import { Calendar, Phone } from "lucide-react";

interface CtaBannerProps {
  onAgendar: () => void;
  onChat: () => void;
}

export default function CtaBanner({ onAgendar, onChat }: CtaBannerProps) {
  return (
    <section className="py-12 px-6">
      <div 
        className="max-w-7xl mx-auto rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 text-left"
        style={{ background: "linear-gradient(to right, #8e7bbe 0%, #db2777 33%, #f3a856 66%, #3fbaab 100%)" }}
      >
        
        {/* Left container */}
        <div className="flex items-center gap-6 relative z-10 w-full lg:w-auto">
          {/* White square calendar box */}
          <div className="w-20 h-20 rounded-[1.5rem] bg-white flex items-center justify-center text-[#8e7bbe] shrink-0 shadow-lg">
            <Calendar className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight leading-snug max-w-xl">
              Vamos construir juntos novos caminhos para o desenvolvimento do seu filho.
            </h2>
          </div>
        </div>

        {/* Buttons and Hearts container */}
        <div className="flex items-center gap-8 shrink-0 w-full lg:w-auto relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* White button with green text & calendar icon */}
            <button
              onClick={onAgendar}
              className="w-full sm:w-auto px-6 py-3 rounded-full font-bold bg-white text-[#3fbaab] hover:bg-zinc-50 border-0 cursor-pointer text-xs flex items-center justify-center gap-2 shadow-md transition-all shrink-0"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Avaliação</span>
            </button>
            {/* Transparent outline button with phone icon */}
            <button
              onClick={onChat}
              className="w-full sm:w-auto px-6 py-3 rounded-full font-bold border-2 border-white bg-transparent text-white hover:bg-white/5 cursor-pointer text-xs flex items-center justify-center gap-2 transition-all shrink-0"
            >
              <Phone className="w-4 h-4" />
              <span>Falar no WhatsApp</span>
            </button>
          </div>

          {/* Outlined hearts far right */}
          <div className="hidden xl:flex items-center gap-2 shrink-0 select-none">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <div className="flex flex-col gap-1.5">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
