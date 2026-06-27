"use client";

import { ChevronRight } from "lucide-react";
import DoctorCard from "./DoctorCard";

const teamList = [
  { name: "Dra. Ana Paula", role: "Psicóloga", register: "CRP 06/123456", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" },
  { name: "Dra. Marina Costa", role: "Psicopedagoga", register: "CRPp 06/654321", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150" },
  { name: "Dr. Lucas Mendes", role: "Neuropsicólogo", register: "CRP 06/789012", img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150" },
  { name: "Dra. Juliana R.", role: "Fonoaudióloga", register: "CRFa 06/78545", img: "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=150" },
  { name: "Dra. Camila Alves", role: "Terapeuta Ocupacional", register: "CREFITO 12/3566", img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150" }
];

export default function Team() {
  return (
    <section id="equipe" className="py-20 bg-white text-xs">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        
        {/* Header section row */}
        <div className="flex justify-between items-end">
          <div className="text-left space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-[#8E7BBE] font-black block">NOSSA EQUIPE</span>
            <h3 className="text-2xl font-black text-[#4A4A4A] leading-none">
              Profissionais que acolhem,<br />
              orientam e transformam.
            </h3>
          </div>
          <a href="#" className="text-xs font-bold text-[#8E7BBE] hover:text-[#7e6bb0] flex items-center gap-1 hover:gap-2 transition-all shrink-0">
            <span>Ver todos os profissionais</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* 5-columns doctor grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {teamList.map((doc, idx) => (
            <DoctorCard 
              key={idx}
              name={doc.name}
              role={doc.role}
              register={doc.register}
              img={doc.img}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
