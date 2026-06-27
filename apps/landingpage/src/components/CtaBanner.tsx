"use client";

import { Phone, Users } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="glass-card rounded-3xl p-12 text-center border border-violet-500/20 bg-gradient-to-b from-violet-500/[0.06] to-transparent relative overflow-hidden">
          <div className="relative z-10 flex flex-col gap-8 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight">
              Agende uma visita ao Instituto Conectar
            </h2>
            <p className="text-zinc-300 leading-relaxed text-base md:text-lg">
              Venha conhecer nosso espaço lúdico e conversar com nossos profissionais sobre o desenvolvimento e acolhimento de quem você mais ama.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
              <a
                href="https://wa.me/5500000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-violet-500/20 hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
                <span>Agendar via WhatsApp</span>
              </a>
              <a
                href="http://localhost:5000/portal/login"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 border border-white/8 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                <Users className="w-5 h-5" />
                <span>Portal da Família</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
