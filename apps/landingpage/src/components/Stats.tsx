"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Users, TrendingUp, Star, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    id: 1,
    quote: "O Instituto Conectar transformou a vida do meu filho e da nossa família. Hoje ele tem mais confiança, aprende com prazer e se desenvolve a cada dia!",
    author: "Juliana S.",
    role: "Mãe do Pedro",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    illustration: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=250" // Mother and child smiling
  },
  {
    id: 2,
    quote: "Profissionais extremamente competentes e dedicados. O acolhimento fez toda a diferença no diagnóstico e no início das terapias do meu pequeno.",
    author: "Carla Mendes",
    role: "Mãe do Gabriel",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
    illustration: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=250"
  }
];

export default function Stats() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const t = testimonials[activeTestimonial];

  return (
    <section className="py-20 bg-white border-y border-zinc-100 text-xs">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        
        {/* Left column (Stats Dashboard) */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 text-left lg:border-r lg:border-zinc-100 lg:pr-12">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-[#8e7bbe] font-black block">RESULTADOS QUE INSPIRAM</span>
            <h2 className="text-3xl font-black text-[#3c2a4d] leading-tight">
              Cada conquista<br />
              é um novo começo.
            </h2>
          </div>
          
          {/* Horizontal row of 4 cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {/* Card 1 */}
            <div className="p-4 bg-white border border-zinc-100 rounded-3xl text-center space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-[#3fbaab]">
                <Users className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xl font-black text-[#3fbaab]">+200</p>
                <p className="text-zinc-400 font-extrabold text-[9px] leading-tight">Famílias atendidas</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-4 bg-white border border-zinc-100 rounded-3xl text-center space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto text-[#db2777]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xl font-black text-[#db2777]">+3.000</p>
                <p className="text-zinc-400 font-extrabold text-[9px] leading-tight">Sessões realizadas</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-4 bg-white border border-zinc-100 rounded-3xl text-center space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto text-amber-500">
                <Star className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xl font-black text-[#8e7bbe]">+95%</p>
                <p className="text-zinc-400 font-extrabold text-[9px] leading-tight">Índice de satisfação</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-4 bg-white border border-zinc-100 rounded-3xl text-center space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto text-[#8e7bbe]">
                <Award className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xl font-black text-[#8e7bbe]">+10</p>
                <p className="text-zinc-400 font-extrabold text-[9px] leading-tight">Anos de experiência</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column (Testimonial Card) */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 text-left lg:pl-12">
          <span className="text-[10px] uppercase tracking-widest text-[#8e7bbe] font-black block">O QUE DIZEM AS FAMÍLIAS</span>
          
          <div className="bg-white border border-zinc-100 rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[180px]">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left text column */}
              <div className="md:col-span-8 space-y-4">
                <div className="text-[#db2777] font-serif text-5xl leading-none font-bold select-none h-6">
                  “
                </div>
                <p className="text-[#3c2a4d] italic font-semibold leading-relaxed text-[11px] text-left">
                  {t.quote}
                </p>
                {/* Author profile */}
                <div className="flex items-center gap-3">
                  <img 
                    src={t.img} 
                    alt={t.author} 
                    className="w-8 h-8 rounded-full object-cover border border-zinc-100" 
                  />
                  <div>
                    <h4 className="font-bold text-[10px] text-[#3c2a4d]">{t.author}</h4>
                    <p className="text-[9px] text-zinc-400 font-bold leading-none">{t.role}</p>
                  </div>
                </div>
              </div>

              {/* Right image column */}
              <div className="md:col-span-4 flex justify-center shrink-0">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-zinc-50">
                  <img 
                    src={t.illustration} 
                    alt="Mãe e filho sorrindo" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            </div>

            {/* Bottom control bar inside the card */}
            <div className="flex justify-between items-center border-t border-zinc-100 pt-4 mt-6">
              {/* Pagination Dots */}
              <div className="flex gap-1.5">
                {[0, 1, 2, 3, 4].map((dot) => (
                  <span
                    key={dot}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all",
                      activeTestimonial === dot ? "bg-[#8e7bbe]" : "bg-zinc-200"
                    )}
                  />
                ))}
              </div>

              {/* Navigation Arrows */}
              <div className="flex gap-1">
                <button
                  onClick={prevTestimonial}
                  className="w-7 h-7 rounded-full border bg-white flex items-center justify-center hover:bg-zinc-50 text-[#8e7bbe] border-zinc-200 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-7 h-7 rounded-full border bg-white flex items-center justify-center hover:bg-zinc-50 text-[#8e7bbe] border-zinc-200 cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
