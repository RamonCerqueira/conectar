"use client";

import { CheckCircle2 } from "lucide-react";

export default function Infrastructure() {
  return (
    <section id="estrutura" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="flex justify-center order-2 lg:order-1">
            <div className="w-full max-w-[460px] glass-card rounded-2xl p-8 flex flex-col gap-5 border border-white/5">
              <div className="bg-white/2 p-4 rounded-xl border border-white/5">
                <strong className="text-base font-bold text-white block mb-1">Sala Sensorial</strong>
                <span className="text-xs text-zinc-400 leading-relaxed">Com balanços suspensos, piscina de bolinhas e materiais texturizados para integração sensorial de T.O.</span>
              </div>
              <div className="bg-white/2 p-4 rounded-xl border border-white/5">
                <strong className="text-base font-bold text-white block mb-1">Salas Temáticas (Amarela e Azul)</strong>
                <span className="text-xs text-zinc-400 leading-relaxed">Voltadas a atendimentos lúdicos e acolhedores de fonoaudiologia, pedagogia e psicologia.</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 order-1 lg:order-2">
            <span className="text-sm font-semibold text-violet-400 uppercase tracking-widest block font-display">Espaço Físico</span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight">Nossa Estrutura Acolhedora</h2>
            <p className="text-zinc-400 leading-relaxed">
              Acreditamos que o ambiente físico faz parte do sucesso terapêutico. Contamos com consultórios equipados com recursos pedagógicos, jogos terapêuticos e equipamentos sensoriais suspensos certificados para garantir total segurança física.
            </p>
            <ul className="flex flex-col gap-3.5 mb-2">
              <li className="flex items-center gap-3 text-sm font-semibold"><CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0" /> Equipamentos sensoriais inspecionados regularmente</li>
              <li className="flex items-center gap-3 text-sm font-semibold"><CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0" /> Ambientes organizados e livres de ruídos perturbadores</li>
              <li className="flex items-center gap-3 text-sm font-semibold"><CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0" /> Espaço de recepção confortável e acolhedor para pais</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
