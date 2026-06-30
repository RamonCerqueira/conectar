"use client";

import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";

interface HeaderProps {
  onAgendar: () => void;
}

export default function Header({ onAgendar }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isProd = process.env.NODE_ENV === "production";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || (isProd ? "https://app.institutoconectar.genioplay.com.br" : "http://localhost:8000");

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-zinc-100 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 decoration-none">
            <img 
              src="/logo.png" 
              alt="Logo Instituto Conectar" 
              className="w-10 h-10 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="leading-tight">
              <span className="text-[10px] uppercase tracking-widest text-[#8e7bbe] font-black block">Instituto</span>
              <strong className="text-base font-black tracking-tight text-[#3c2a4d]">CONECTAR</strong>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-6 text-[11px] uppercase tracking-wider font-extrabold text-zinc-500">
            <a href="#sobre" className="hover:text-[#8e7bbe] transition-colors">Sobre</a>
            <a href="#especialidades" className="hover:text-[#8e7bbe] transition-colors">Especialidades</a>
            <a href="#equipe" className="hover:text-[#8e7bbe] transition-colors">Nossa Equipe</a>
            <a href="#estrutura" className="hover:text-[#8e7bbe] transition-colors">Estrutura</a>
            <a href={`${appUrl}/portal/login`} target="_blank" rel="noopener noreferrer" className="hover:text-[#db2777] transition-colors">Portal dos Pais</a>
            <a href={`${appUrl}/login`} target="_blank" rel="noopener noreferrer" className="hover:text-[#3fbaab] transition-colors">Área do Profissional</a>
          </nav>

          <div className="hidden lg:flex items-center gap-2.5">
            <button
              onClick={onAgendar}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#3fbaab] hover:bg-[#349e91] shadow-md shadow-[#3fbaab]/10 border-0 cursor-pointer transition-all flex items-center gap-1.5"
            >
              Agendar Avaliação
            </button>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-[#3fbaab]/30 flex items-center justify-center text-[#3fbaab] hover:bg-[#3fbaab]/5 transition-colors"
            >
              <Phone className="w-4.5 h-4.5" />
            </a>
          </div>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-zinc-600 hover:bg-zinc-100 rounded-lg border-0 bg-transparent cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 w-full h-screen bg-white z-50 p-6 flex flex-col gap-8 lg:hidden">
          <div className="flex items-center justify-between">
            <a href="#" className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
              <strong className="text-sm font-black text-[#3c2a4d]">Instituto Conectar</strong>
            </a>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-zinc-600 hover:bg-zinc-100 rounded-lg border-0 bg-transparent cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-4 text-xs font-bold uppercase tracking-wider text-zinc-600">
            <a href="#sobre" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b">Sobre</a>
            <a href="#especialidades" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b">Especialidades</a>
            <a href="#equipe" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b">Nossa Equipe</a>
            <a href="#estrutura" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b">Estrutura</a>
            <a href={`${appUrl}/portal/login`} target="_blank" rel="noopener noreferrer" className="py-2 border-b text-[#db2777]">Portal dos Pais</a>
            <a href={`${appUrl}/login`} target="_blank" rel="noopener noreferrer" className="py-2 text-[#3fbaab]">Área do Profissional</a>
          </nav>
        </div>
      )}
    </>
  );
}
