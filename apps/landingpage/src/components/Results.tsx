"use client";

import { useState } from "react";
import { Users, TrendingUp, Star, Award } from "lucide-react";
import StatisticCard from "./StatisticCard";
import TestimonialCard from "./TestimonialCard";

const stats = [
  { val: "+200", label: "Famílias atendidas", icon: Users, color: "text-[#69C4B5] bg-[#69C4B5]/10" },
  { val: "+3000", label: "Sessões realizadas", icon: TrendingUp, color: "text-[#E98BAE] bg-[#E98BAE]/10" },
  { val: "95%", label: "Índice de satisfação", icon: Star, color: "text-[#F3B357] bg-[#F3B357]/10" },
  { val: "10+", label: "Anos de experiência", icon: Award, color: "text-[#8E7BBE] bg-[#8E7BBE]/10" }
];

const testimonialsList = [
  {
    quote: "O Instituto Conectar transformou a vida do meu filho e da nossa família. Hoje ele tem mais confiança, aprende com prazer e se desenvolve a cada dia!",
    author: "Juliana S.",
    role: "Mãe do Pedro",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    illustration: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=250"
  },
  {
    quote: "Profissionais extremamente competentes e dedicados. O acolhimento fez toda a diferença no diagnóstico e no início das terapias do meu pequeno.",
    author: "Carla Mendes",
    role: "Mãe do Gabriel",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
    illustration: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=250"
  }
];

export default function Results() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonialsList.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonialsList.length) % testimonialsList.length);
  };

  const activeTest = testimonialsList[activeTestimonial];

  return (
    <section className="py-20 bg-white border-y border-[#E7E7E7]/30 text-xs">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        
        {/* Left block (Results) */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 text-left lg:border-r lg:border-[#E7E7E7] lg:pr-12">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#8E7BBE] block">RESULTADOS QUE INSPIRAM</span>
            <h2 className="text-3xl font-black text-[#4A4A4A] leading-tight">
              Cada conquista<br />
              é um novo começo.
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {stats.map((stat, idx) => (
              <StatisticCard 
                key={idx}
                value={stat.val}
                label={stat.label}
                icon={stat.icon}
                color={stat.color}
              />
            ))}
          </div>
        </div>

        {/* Right block (Testimonial Card) */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 text-left lg:pl-12">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#8E7BBE] block">O QUE DIZEM AS FAMÍLIAS</span>
          
          <TestimonialCard 
            quote={activeTest.quote}
            author={activeTest.author}
            role={activeTest.role}
            img={activeTest.img}
            illustration={activeTest.illustration}
            onNext={nextTestimonial}
            onPrev={prevTestimonial}
            activeIdx={activeTestimonial}
            total={5} // Mock pagination length to match 5 circles in the layout screenshot
          />
        </div>

      </div>
    </section>
  );
}
