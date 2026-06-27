"use client";

import { useState } from "react";
import { Sparkles, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0c]/75 backdrop-blur-md border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 text-white decoration-transparent font-display text-xl font-medium">
            <img 
              src="/logo.jpeg" 
              alt="Logo Instituto Conectar" 
              className="w-9 h-9 rounded-xl object-cover border border-white/10" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="text-white">
              Instituto <strong className="font-extrabold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Conectar</strong>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#especialidades" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">Especialidades</a>
            <a href="#diferenciais" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">Diferenciais</a>
            <a href="#estrutura" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">Estrutura</a>
            <a href="#faq" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">Dúvidas</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a href="http://localhost:5000/login" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-white/5 border border-white/8 hover:bg-white/10 transition-all duration-300">
              Área do Profissional
            </a>
            <a href="http://localhost:5000/portal/login" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-lg hover:shadow-violet-500/20 hover:brightness-110 transition-all duration-300">
              Portal dos Pais
            </a>
          </div>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 text-white hover:bg-white/5 rounded-lg"
            aria-label="Abrir Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 w-full h-screen bg-[#0a0a0c] z-50 p-6 flex flex-col gap-12"
          >
            <div className="flex items-center justify-between">
              <a href="#" className="flex items-center gap-2.5 font-display text-xl font-medium">
                <img 
                  src="/logo.jpeg" 
                  alt="Logo Instituto Conectar" 
                  className="w-9 h-9 rounded-xl object-cover border border-white/10" 
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="text-white">
                  Instituto <strong className="font-extrabold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Conectar</strong>
                </span>
              </a>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-white hover:bg-white/5 rounded-lg"
                aria-label="Fechar Menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-6 text-lg font-semibold">
              <a href="#especialidades" onClick={() => setMobileMenuOpen(false)} className="text-zinc-400 hover:text-white transition-colors">Especialidades</a>
              <a href="#diferenciais" onClick={() => setMobileMenuOpen(false)} className="text-zinc-400 hover:text-white transition-colors">Diferenciais</a>
              <a href="#estrutura" onClick={() => setMobileMenuOpen(false)} className="text-zinc-400 hover:text-white transition-colors">Estrutura</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-zinc-400 hover:text-white transition-colors">Dúvidas</a>
              <hr className="border-white/10 my-2" />
              <a href="http://localhost:5000/login" className="w-full py-3 rounded-xl text-center text-sm font-semibold text-white bg-white/5 border border-white/8 hover:bg-white/10 transition-all">
                Área do Profissional
              </a>
              <a href="http://localhost:5000/portal/login" className="w-full py-3 rounded-xl text-center text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 transition-all">
                Portal dos Pais
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
