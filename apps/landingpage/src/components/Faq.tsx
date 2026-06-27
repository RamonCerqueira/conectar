"use client";

import { useState } from "react";
import { ChevronDown, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  { q: "Atendem convênio?", a: "Trabalhamos de forma particular e fornecemos relatórios e notas fiscais para solicitação de reembolso no seu convênio." },
  { q: "Qual a duração das sessões?", a: "As sessões individuais duram 45 minutos de intervenção direta e 5 minutos de feedback para os pais." },
  { q: "Como funciona a avaliação?", a: "O processo inicia com entrevista de anamnese com os pais, seguida por sessões lúdicas e testes padronizados com o paciente." },
  { q: "Qual a idade atendida?", a: "Atendemos bebês e crianças a partir de 1 ano de idade (intervenção precoce) até adolescentes de 16 anos." },
  { q: "Precisa de encaminhamento médico?", a: "Não. Os pais podem marcar uma avaliação diagnóstica de forma direta e independente." }
];

const testimonials = [
  {
    text: "Desde que meu filho começou o acompanhamento, percebemos uma evolução incrível na atenção e no aprendizado. Somos muito gratos por todo o carinho e dedicação da equipe!",
    author: "Juliana S.",
    role: "Mãe do Pedro",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
  },
  {
    text: "O ambiente é acolhedor, os profissionais são excelentes e sempre muito atenciosos. Meu filho ama vir para as sessões!",
    author: "Carla Mendes",
    role: "Mãe do Gabriel",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100"
  },
  {
    text: "Aqui encontramos não apenas profissionais competentes, mas pessoas que realmente se importam com o desenvolvimento das crianças.",
    author: "Fernanda A.",
    role: "Mãe da Laura",
    img: "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=100"
  }
];

export default function Faq() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-zinc-50/50 border-y border-zinc-100 text-xs">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: O que as famílias dizem */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <span className="text-[9px] uppercase tracking-widest text-[#8e7bbe] font-black block">FEEDBACK</span>
          <h3 className="text-2xl font-black text-[#3c2a4d]">O que as famílias dizem</h3>
          
          <div className="space-y-4">
            {testimonials.map((t, idx) => (
              <div key={idx} className="p-4 bg-white border border-zinc-100 rounded-2xl shadow-xs space-y-3">
                <p className="text-zinc-500 italic leading-relaxed">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <img src={t.img} alt={t.author} className="w-8 h-8 rounded-full object-cover border" />
                  <div>
                    <h4 className="font-bold text-[10px] text-[#3c2a4d]">{t.author}</h4>
                    <p className="text-[9px] text-zinc-400 font-bold">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Perguntas Frequentes accordions */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-widest text-[#8e7bbe] font-black">SUPORTE</span>
              <h3 className="text-2xl font-black text-[#3c2a4d]">Perguntas frequentes</h3>
            </div>
            <a href="#" className="text-xs font-bold text-[#8e7bbe] hover:text-[#7e6bb5] transition-all">Ver todas</a>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border rounded-2xl overflow-hidden bg-white border-zinc-100 shadow-xs">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 flex justify-between items-center text-xs font-bold text-[#3c2a4d] bg-transparent border-0 cursor-pointer text-left"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={cn("w-4 h-4 text-[#8e7bbe] transition-transform", activeFaq === idx && "rotate-180")} />
                </button>
                {activeFaq === idx && (
                  <div className="p-4 bg-zinc-50/50 border-t border-zinc-100 text-[10px] text-zinc-500 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
