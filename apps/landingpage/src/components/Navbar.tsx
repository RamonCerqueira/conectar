"use client";

import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import GradientButton from "./GradientButton";

interface NavbarProps {
  onAgendar: () => void;
}

export default function Navbar({ onAgendar }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 h-[90px] flex items-center ${
          scrolled 
            ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-[#E7E7E7]/30" 
            : "bg-white border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 decoration-none shrink-0">
            <img 
              src="/logo.png" 
              alt="Logo Instituto Conectar" 
              className="w-10 h-10 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="leading-tight text-left">
              <span className="text-[10px] uppercase tracking-widest text-[#8E7BBE] font-black block">Instituto</span>
              <strong className="text-base font-black tracking-tight text-[#4A4A4A]">CONECTAR</strong>
            </div>
          </a>

          {/* Center Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-[11px] uppercase tracking-wider font-black text-zinc-500">
            <a href="#" className="hover:text-[#8E7BBE] transition-colors">Início</a>
            <a href="#sobre" className="hover:text-[#8E7BBE] transition-colors">Sobre</a>
            <a href="#especialidades" className="hover:text-[#8E7BBE] transition-colors">Especialidades</a>
            <a href="#equipe" className="hover:text-[#8E7BBE] transition-colors">Nossa Equipe</a>
            <a href="#estrutura" className="hover:text-[#8E7BBE] transition-colors">Estrutura</a>
            <a href="#blog" className="hover:text-[#8E7BBE] transition-colors">Blog</a>
            <a href="#faq" className="hover:text-[#8E7BBE] transition-colors">Contato</a>
          </nav>

          {/* Right Action buttons */}
          <div className="hidden lg:flex items-center gap-2.5">
            <GradientButton onClick={onAgendar} variant="primary">
              Agendar Avaliação
            </GradientButton>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-[#69C4B5]/30 flex items-center justify-center text-[#69C4B5] hover:bg-[#69C4B5]/5 transition-colors shrink-0"
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

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 w-full h-screen bg-white z-50 p-6 flex flex-col gap-8 lg:hidden">
          <div className="flex items-center justify-between">
            <a href="#" className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
              <strong className="text-sm font-black text-[#4A4A4A]">Instituto Conectar</strong>
            </a>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-zinc-600 hover:bg-zinc-100 rounded-lg border-0 bg-transparent cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-4 text-xs font-bold uppercase tracking-wider text-zinc-600 text-left">
            <a href="#" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b">Início</a>
            <a href="#sobre" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b">Sobre</a>
            <a href="#especialidades" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b">Especialidades</a>
            <a href="#equipe" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b">Nossa Equipe</a>
            <a href="#estrutura" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b">Estrutura</a>
            <a href="#blog" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b">Blog</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="py-2">Contato</a>
          </nav>
        </div>
      )}
    </>
  );
}
