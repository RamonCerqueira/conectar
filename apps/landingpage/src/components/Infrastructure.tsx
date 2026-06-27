"use client";

import { ChevronRight, Instagram, Mail } from "lucide-react";

const team = [
  { n: "Dra. Ana Paula", r: "Psicóloga", reg: "CRP 06/123456", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" },
  { n: "Dra. Marina Costa", r: "Psicopedagoga", reg: "CRPp 06/654321", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150" },
  { n: "Dr. Lucas Mendes", r: "Neuropsicólogo", reg: "CRP 06/789012", img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150" },
  { n: "Dra. Juliana R.", r: "Fonoaudióloga", reg: "CRFa 06/78545", img: "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=150" },
  { n: "Dra. Camila Alves", r: "Terapeuta Ocupacional", reg: "CREFITO 12/3566", img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150" }
];

const rooms = [
  { name: "Recepção Acolhedora", url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300" },
  { name: "Sala Sensorial (TO)", url: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=300" },
  { name: "Consultório Infantil", url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=300" },
  { name: "Brinquedoteca Lúdica", url: "https://images.unsplash.com/photo-1566411520896-01e7ca4726af?w=300" },
  { name: "Área Sensorial", url: "https://images.unsplash.com/photo-1491308056676-205b7c9a7dc1?w=300" }
];

export default function Infrastructure() {
  return (
    <section className="py-20 bg-white space-y-24 text-xs">
      
      {/* 1. Nossa Equipe */}
      <div id="equipe" className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex justify-between items-end">
          <div className="text-left space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-[#8e7bbe] font-black">NOSSA EQUIPE</span>
            <h3 className="text-2xl font-black text-[#3c2a4d] leading-none">
              Profissionais que acolhem,<br />
              orientam e transformam.
            </h3>
          </div>
          <a href="#" className="text-xs font-bold text-[#8e7bbe] hover:text-[#7e6bb5] flex items-center gap-1 hover:gap-2 transition-all shrink-0">
            <span>Ver todos os profissionais</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Profile cards matching the screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {team.map((emp, idx) => (
            <div key={idx} className="p-6 bg-white border border-zinc-100 rounded-3xl text-center space-y-4 shadow-xs hover:shadow-md transition-shadow">
              {/* Circular profile image at the top */}
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto bg-zinc-50 border border-zinc-100">
                <img src={emp.img} alt={emp.n} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-xs text-[#3c2a4d]">{emp.n}</h4>
                <p className="text-[10px] text-zinc-400 font-bold">{emp.r}</p>
                <p className="text-[9px] text-zinc-400 font-semibold">{emp.reg}</p>
              </div>
              {/* Two pink social circles */}
              <div className="flex gap-2 justify-center pt-2">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-7 h-7 rounded-full border border-[#db2777]/25 flex items-center justify-center text-[#db2777] hover:bg-[#db2777]/5 transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
                <a 
                  href="mailto:contato@institutoconectar.com.br" 
                  className="w-7 h-7 rounded-full border border-[#db2777]/25 flex items-center justify-center text-[#db2777] hover:bg-[#db2777]/5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
