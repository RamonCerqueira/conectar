"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

// Import Modular Components matching the design specifications
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Services from "@/components/Services";
import About from "@/components/About";
import ParallaxSection from "@/components/ParallaxSection";
import Results from "@/components/Results";
import Team from "@/components/Team";
import Blog from "@/components/Blog";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import ChatbotWidget from "@/components/ChatbotWidget";
import Preloader from "@/components/Preloader";

// ─── AUTO-COPIER CLIENT MOCK RESOLVER ──────────────────────────────────────
if (typeof window === "undefined") {
  try {
    const fs = require("fs");
    const path = require("path");
    
    const src1 = "C:\\Users\\Ramon DevTec\\.gemini\\antigravity-ide\\brain\\b1a52cc7-b1f6-4f4f-ab0c-36f173906c2a\\hero_clinic_photo_1782589799634.png";
    const src2 = "C:\\Users\\Ramon DevTec\\.gemini\\antigravity-ide\\brain\\b1a52cc7-b1f6-4f4f-ab0c-36f173906c2a\\reception_clinic_photo_1782589845045.png";
    const srcLogo = "C:\\Users\\Ramon DevTec\\.gemini\\antigravity-ide\\brain\\b1a52cc7-b1f6-4f4f-ab0c-36f173906c2a\\media__1782561486091.png";
    const srcParallax = "C:\\Users\\Ramon DevTec\\.gemini\\antigravity-ide\\brain\\b1a52cc7-b1f6-4f4f-ab0c-36f173906c2a\\parallax_clinic_room_1782598318110.png";
    
    const publicDir = path.join(process.cwd(), "public");
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    
    if (fs.existsSync(src1)) fs.copyFileSync(src1, path.join(publicDir, "hero_clinic_photo.png"));
    if (fs.existsSync(src2)) fs.copyFileSync(src2, path.join(publicDir, "reception_clinic_photo.png"));
    if (fs.existsSync(srcLogo)) fs.copyFileSync(srcLogo, path.join(publicDir, "logo.png"));
    if (fs.existsSync(srcParallax)) fs.copyFileSync(srcParallax, path.join(publicDir, "parallax_clinic_room.png"));
  } catch (e) {
    console.error("Server-side asset copier skipped or error:", e);
  }
}

const apiBase = "http://localhost:3001/api";

export default function Home() {
  // Modal & Chat shared states
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Chatbot state
  const [phone, setPhone] = useState("");
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);
  const [chatText, setChatText] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [botTyping, setBotTyping] = useState(false);

  // Lead Form state
  const [leadForm, setLeadForm] = useState({
    nomeCrianca: "",
    idade: "",
    telefone: "",
    queixa: "",
    periodo: "Tarde"
  });

  // Zod-like validation errors state
  const [errors, setErrors] = useState<any>({});

  const validateLeadForm = () => {
    const newErrors: any = {};
    if (leadForm.nomeCrianca.trim().length < 3) {
      newErrors.nomeCrianca = "O nome do seu filho deve ter pelo menos 3 caracteres.";
    }
    if (!leadForm.idade.trim()) {
      newErrors.idade = "Por favor, preencha a idade do seu filho.";
    }
    const cleanPhone = leadForm.telefone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      newErrors.telefone = "Número de telefone inválido (mínimo 10 dígitos com DDD).";
    }
    if (leadForm.queixa.trim().length < 10) {
      newErrors.queixa = "Por favor, explique um pouco mais sobre as dificuldades da criança (mínimo 10 caracteres).";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitLeadForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLeadForm()) return;

    try {
      await fetch(`${apiBase}/comunicacao/chatbot/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadForm)
      });
      alert("Ficha de triagem clínica enviada com sucesso! Nossa equipe entrará em contato em breve.");
      setLeadModalOpen(false);
      setLeadForm({ nomeCrianca: "", idade: "", telefone: "", queixa: "", periodo: "Tarde" });
      setErrors({});
    } catch (err) {
      console.error(err);
      alert("Ocorreu um erro ao enviar a triagem. Por favor, tente novamente.");
    }
  };

  const handleOpenLeadModal = () => {
    setErrors({});
    setLeadModalOpen(true);
  };
  const handleOpenChat = () => setChatOpen(true);

  // Local SEO metadata structured schemas
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "name": "Instituto Conectar",
    "image": "https://conectar-clinic.com.br/logo.png",
    "description": "Atendimento especializado em Psicologia, Fonoaudiologia, Terapia Ocupacional e Psicopedagogia infantil em ambiente lúdico e seguro.",
    "telephone": "+55-11-99999-9999",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. Paulista, 1000 - Bela Vista",
      "addressLocality": "São Paulo",
      "addressRegion": "SP",
      "postalCode": "01310-100",
      "addressCountry": "BR"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "08:00",
      "closes": "20:00"
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#4A4A4A] font-sans overflow-x-hidden antialiased">
      {/* Local SEO Structured schema injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* Premium Dynamic Entrance Preloader */}
      <Preloader />

      {/* Navbar fixed */}
      <Navbar onAgendar={handleOpenLeadModal} />

      {/* Main Container */}
      <main>
        {/* 1. Hero */}
        <Hero onAgendar={handleOpenLeadModal} onChat={handleOpenChat} />

        {/* 2. Barra de diferenciais */}
        <Features />

        {/* 3. Especialidades */}
        <Services onAgendar={handleOpenLeadModal} />

        {/* 4. Sobre Nós */}
        <About onAgendar={handleOpenLeadModal} />

        {/* Parallax Section - Espaço Sensorial */}
        <ParallaxSection onAgendar={handleOpenLeadModal} />

        {/* 5. Resultados (Statistics & Testimonials) */}
        <Results />

        {/* 6. Equipe */}
        <Team />

        {/* Blog section */}
        <Blog />

        {/* 7. CTA */}
        <CTA onAgendar={handleOpenLeadModal} onChat={handleOpenChat} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Lead capture modal */}
      <AnimatePresence>
        {leadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 text-xs">
            <div className="absolute inset-0" onClick={() => setLeadModalOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm rounded-2xl shadow-2xl border bg-white p-6 space-y-4"
              style={{ borderColor: "#E7E7E7" }}
            >
              <div className="flex justify-between items-center border-b pb-2">
                <div className="text-left">
                  <h3 className="font-bold text-sm text-[#4A4A4A]">Solicitar Triagem Clínica</h3>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Preencha as informações básicas do seu filho.</p>
                </div>
                <button
                  onClick={() => setLeadModalOpen(false)}
                  className="p-1 hover:bg-zinc-100 rounded text-zinc-400 border-0 bg-transparent cursor-pointer"
                  aria-label="Fechar formulário de triagem"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleSubmitLeadForm} className="space-y-3 text-left">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase">Nome da Criança</label>
                  <input
                    type="text"
                    value={leadForm.nomeCrianca}
                    onChange={(e) => setLeadForm({ ...leadForm, nomeCrianca: e.target.value })}
                    className="w-full p-2.5 rounded-lg border bg-zinc-50 outline-none text-zinc-800"
                  />
                  {errors.nomeCrianca && (
                    <p className="text-[#E98BAE] text-[8px] font-bold mt-0.5">{errors.nomeCrianca}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase">Idade</label>
                    <input
                      type="text"
                      placeholder="Ex: 6 anos"
                      value={leadForm.idade}
                      onChange={(e) => setLeadForm({ ...leadForm, idade: e.target.value })}
                      className="w-full p-2.5 rounded-lg border bg-zinc-50 outline-none text-zinc-800"
                    />
                    {errors.idade && (
                      <p className="text-[#E98BAE] text-[8px] font-bold mt-0.5">{errors.idade}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase">Telefone Responsável</label>
                    <input
                      type="text"
                      placeholder="(DD) 99999-9999"
                      value={leadForm.telefone}
                      onChange={(e) => setLeadForm({ ...leadForm, telefone: e.target.value })}
                      className="w-full p-2.5 rounded-lg border bg-zinc-50 outline-none text-zinc-800"
                    />
                    {errors.telefone && (
                      <p className="text-[#E98BAE] text-[8px] font-bold mt-0.5">{errors.telefone}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase">Principais queixas ou dificuldades</label>
                  <textarea
                    rows={3}
                    placeholder="Ex: Atraso de fala, gagueira, hiperatividade..."
                    value={leadForm.queixa}
                    onChange={(e) => setLeadForm({ ...leadForm, queixa: e.target.value })}
                    className="w-full p-2.5 rounded-lg border bg-zinc-50 outline-none resize-none text-zinc-800"
                  />
                  {errors.queixa && (
                    <p className="text-[#E98BAE] text-[8px] font-bold mt-0.5">{errors.queixa}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase">Período de preferência</label>
                  <select
                    value={leadForm.periodo}
                    onChange={(e) => setLeadForm({ ...leadForm, periodo: e.target.value })}
                    className="w-full p-2.5 rounded-lg border bg-zinc-50 outline-none cursor-pointer text-zinc-800"
                  >
                    <option value="Manhã">Manhã</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Ambos">Ambos</option>
                  </select>
                </div>

                <div className="pt-3 border-t flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setLeadModalOpen(false)}
                    className="px-4 py-2 border rounded-xl font-bold hover:bg-zinc-100 text-[10px] uppercase transition-colors cursor-pointer bg-transparent"
                    style={{ borderColor: "#E7E7E7" }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold text-white bg-[#69C4B5] hover:bg-[#58b3a4] shadow-md border-0 cursor-pointer text-[10px] uppercase tracking-wider"
                  >
                    Enviar Solicitação
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WhatsApp Chatbot overlay widget */}
      <ChatbotWidget
        chatOpen={chatOpen}
        setChatOpen={setChatOpen}
        phone={phone}
        setPhone={setPhone}
        phoneSubmitted={phoneSubmitted}
        setPhoneSubmitted={setPhoneSubmitted}
        chatText={chatText}
        setChatText={setChatText}
        chatHistory={chatHistory}
        setChatHistory={setChatHistory}
        botTyping={botTyping}
        setBotTyping={setBotTyping}
        apiBase={apiBase}
      />
    </div>
  );
}
