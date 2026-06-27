"use client";

import { motion } from "react";
import { Heart, Activity, ShieldCheck, Users, Milestone } from "lucide-react";
import GradientButton from "./GradientButton";

interface AboutProps {
  onAgendar: () => void;
}

export default function About({ onAgendar }: AboutProps) {
  return (
    <section id="sobre" className="py-24 bg-white relative overflow-hidden text-xs">
      {/* Background ambient glows */}
      <div className="glow-sphere-purple -top-10 -left-10 opacity-40" />
      <div className="glow-sphere-teal bottom-10 -right-10 opacity-30" />
      {/* Decorative leaf outline vector on the right */}
      <div className="absolute right-0 bottom-0 text-[#69C4B5]/10 opacity-70 pointer-events-none select-none translate-y-12">
        <svg width="220" height="220" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 8C8 10 5.9 16.1 5 21c4.9-.9 11-3 13-12h-1zm2-5c-6.8 0-13 5.2-14.7 12.3C2.5 16.2 1 18.9 1 21c0 1.1.9 2 2 2 2.1 0 4.8-1.5 5.7-3.3C15.8 18 21 11.8 21 5c0-1.1-.9-2-2-2z"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left column (Clinic reception photo with floating card) */}
        <div className="lg:col-span-5 relative">
          <div className="rounded-[2.5rem] overflow-hidden border border-[#E7E7E7] bg-zinc-50 shadow-2xl relative aspect-square max-w-sm mx-auto">
            <img
              src="/reception_clinic_photo.png"
              alt="Estrutura Instituto Conectar"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=650";
              }}
            />
          </div>
          {/* Floating pink heart card in the corner */}
          <div className="absolute -bottom-6 -right-2 md:right-8 bg-[#E98BAE] text-white p-5 rounded-2xl shadow-xl max-w-[200px] text-left border border-white/10 space-y-1">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 fill-current" />
            </div>
            <p className="text-[10px] font-black leading-relaxed">Ambiente seguro e acolhedor.</p>
          </div>
        </div>

        {/* Right column (Text, bullets & CTA) */}
        <div className="lg:col-span-7 space-y-6 text-left relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#E98BAE] block">SOBRE NÓS</span>
          
          <h2 className="text-3xl font-black text-[#4A4A4A] leading-tight">
            Mais que uma clínica,<br />
            somos parceiros da sua família.
          </h2>

          <p className="text-[#4A4A4A]/80 text-xs md:text-sm leading-relaxed">
            Acreditamos que cada criança é única e que, com o suporte certo, é possível superar desafios e construir novos caminhos para o aprendizado e o desenvolvimento pleno.
          </p>

          {/* 4 mini differentiation blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {[
              { t: "Plano terapêutico individualizado", icon: Heart, color: "text-[#E98BAE] bg-[#E98BAE]/10" },
              { t: "Acompanhamento contínuo", icon: Activity, color: "text-[#69C4B5] bg-[#69C4B5]/10" },
              { t: "Participação ativa da família", icon: Users, color: "text-[#F3B357] bg-[#F3B357]/10" },
              { t: "Comunicação com escola e profissionais", icon: Milestone, color: "text-[#8E7BBE] bg-[#8E7BBE]/10" }
            ].map((b, idx) => {
              const Icon = b.icon;
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${b.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-[#4A4A4A] leading-snug">{b.t}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-4">
            <GradientButton onClick={onAgendar} variant="purple">
              Conheça nossa história →
            </GradientButton>
          </div>
        </div>

      </div>
    </section>
  );
}
