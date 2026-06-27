"use client";

import { Instagram, Facebook, MessageCircle, Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-100 py-16 text-xs text-zinc-500 text-left">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Column 1: Logo & brand description */}
        <div className="lg:col-span-3 space-y-4">
          <a href="#" className="flex items-center gap-3 decoration-none">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
            <div className="leading-tight text-left">
              <span className="text-[10px] uppercase tracking-widest text-[#8e7bbe] font-black block">Instituto</span>
              <strong className="text-sm font-black tracking-tight text-[#3c2a4d]">CONECTAR</strong>
            </div>
          </a>
          <p className="text-[11px] text-zinc-400 leading-relaxed font-semibold">
            Conectando caminhos, desenvolvendo potencialidades e transformando vidas.
          </p>
          {/* Social media icons */}
          <div className="flex gap-2.5">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-8 h-8 rounded-full border border-[#8e7bbe]/20 flex items-center justify-center text-[#8e7bbe] hover:bg-[#8e7bbe]/5 transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-8 h-8 rounded-full border border-[#8e7bbe]/20 flex items-center justify-center text-[#8e7bbe] hover:bg-[#8e7bbe]/5 transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a 
              href="https://wa.me/5511999999999" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-8 h-8 rounded-full border border-[#8e7bbe]/20 flex items-center justify-center text-[#8e7bbe] hover:bg-[#8e7bbe]/5 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Column 2: Navegação */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="font-extrabold text-[10px] text-[#3c2a4d] uppercase tracking-wider">Navegação</h4>
          <ul className="space-y-2.5 font-bold text-zinc-400">
            <li><a href="#" className="hover:text-[#8e7bbe] transition-colors">Início</a></li>
            <li><a href="#sobre" className="hover:text-[#8e7bbe] transition-colors">Sobre</a></li>
            <li><a href="#especialidades" className="hover:text-[#8e7bbe] transition-colors">Especialidades</a></li>
            <li><a href="#equipe" className="hover:text-[#8e7bbe] transition-colors">Nossa Equipe</a></li>
            <li><a href="#estrutura" className="hover:text-[#8e7bbe] transition-colors">Estrutura</a></li>
            <li><a href="#blog" className="hover:text-[#8e7bbe] transition-colors">Blog</a></li>
            <li><a href="#faq" className="hover:text-[#8e7bbe] transition-colors">Contato</a></li>
          </ul>
        </div>

        {/* Column 3: Especialidades */}
        <div className="lg:col-span-3 space-y-4">
          <h4 className="font-extrabold text-[10px] text-[#3c2a4d] uppercase tracking-wider">Especialidades</h4>
          <ul className="space-y-2.5 font-bold text-zinc-400">
            <li><a href="#especialidades" className="hover:text-[#8e7bbe] transition-colors">Psicologia</a></li>
            <li><a href="#especialidades" className="hover:text-[#8e7bbe] transition-colors">Psicopedagogia</a></li>
            <li><a href="#especialidades" className="hover:text-[#8e7bbe] transition-colors">Fonoaudiologia</a></li>
            <li><a href="#especialidades" className="hover:text-[#8e7bbe] transition-colors">Terapia Ocupacional</a></li>
            <li><a href="#especialidades" className="hover:text-[#8e7bbe] transition-colors">Neuropsicologia</a></li>
            <li><a href="#especialidades" className="hover:text-[#8e7bbe] transition-colors">Orientação Familiar</a></li>
          </ul>
        </div>

        {/* Column 4: Contato */}
        <div className="lg:col-span-4 space-y-4">
          <h4 className="font-extrabold text-[10px] text-[#3c2a4d] uppercase tracking-wider">Contato</h4>
          <ul className="space-y-3 font-semibold text-zinc-400">
            <li className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#3fbaab] shrink-0" />
              <span>(11) 99999-9999</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#3fbaab] shrink-0" />
              <span>contato@institutoconectar.com.br</span>
            </li>
            <li className="flex gap-2">
              <MapPin className="w-4 h-4 text-[#3fbaab] shrink-0 mt-0.5" />
              <div>
                <span>Rua das Flores, 123</span>
                <span className="block text-[10px] font-medium text-zinc-400">Vila Madalena - São Paulo/SP</span>
              </div>
            </li>
            <li className="flex gap-2">
              <Clock className="w-4 h-4 text-[#3fbaab] shrink-0 mt-0.5" />
              <div>
                <span>Segunda a Sexta: 8h às 19h</span>
                <span className="block text-[10px] font-medium text-zinc-400">Sábado: 8h às 13h</span>
              </div>
            </li>
          </ul>

          {/* Map wrapper with pin and overlays */}
          <div className="rounded-[1.5rem] overflow-hidden border border-zinc-100 aspect-video w-full max-w-[280px] relative bg-zinc-50 shadow-sm mt-3 group">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.4475459345736!2d-46.6908552!3d-23.5523455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5797a7a5ea79%3A0xe5a3c945fa671!2sVila%20Madalena%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr" 
              className="w-full h-full border-0 grayscale opacity-80" 
              allowFullScreen={false} 
              loading="lazy"
            />
            {/* Como chegar white card button overlay */}
            <div className="absolute inset-0 flex items-end justify-center pb-3 pointer-events-none">
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-4 py-2 bg-white text-zinc-700 font-extrabold text-[10px] uppercase rounded-xl shadow-md border hover:bg-zinc-50 pointer-events-auto transition-all"
              >
                Como chegar
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Copyright footer bar */}
      <div className="max-w-7xl mx-auto px-6 border-t border-zinc-100 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-zinc-400 gap-4 font-bold">
        <span>© 2024 Instituto Conectar. Todos os direitos reservados.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-zinc-500 transition-colors">Política de Privacidade</a>
          <a href="#" className="hover:text-zinc-500 transition-colors">Termos de Uso</a>
          <a href="#" className="hover:text-zinc-500 transition-colors">LGPD</a>
        </div>
      </div>
    </footer>
  );
}
