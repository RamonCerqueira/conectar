"use client";

import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/60 py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start gap-3">
          <a href="#" className="flex items-center gap-2.5 text-white decoration-transparent font-display text-lg font-medium">
            <img 
              src="/logo.jpeg" 
              alt="Logo Instituto Conectar" 
              className="w-8 h-8 rounded-lg object-cover border border-white/10" 
              onError={(e) => {
                // Fallback if image doesn't exist yet
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="text-white">
              Instituto <strong className="font-extrabold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Conectar</strong>
            </span>
          </a>
          <div>
            <p className="text-zinc-500 text-sm text-center md:text-left">
              &copy; 2026 Instituto Conectar. Todos os direitos reservados.
            </p>
            <p className="text-zinc-600 text-[11px] text-center md:text-left mt-1">
              Diretor Técnico: Dr. Carlos Santos - CRM/SP 00000
            </p>
          </div>
        </div>

        <div className="flex gap-8 text-sm">
          <a href="#" className="text-zinc-500 hover:text-white transition-colors">Privacidade</a>
          <a href="#" className="text-zinc-500 hover:text-white transition-colors">Termos de Uso</a>
          <a href="mailto:contato@institutoconectar.com.br" className="text-zinc-500 hover:text-white transition-colors">Contato</a>
        </div>
      </div>
    </footer>
  );
}
