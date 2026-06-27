"use client";

import { useState } from "react";
import { MessageSquare, Smartphone, Send, X, Play, Pause, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChatbotWidgetProps {
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  phone: string;
  setPhone: (phone: string) => void;
  phoneSubmitted: boolean;
  setPhoneSubmitted: (submitted: boolean) => void;
  chatText: string;
  setChatText: (text: string) => void;
  chatHistory: any[];
  setChatHistory: React.Dispatch<React.SetStateAction<any[]>>;
  botTyping: boolean;
  setBotTyping: (typing: boolean) => void;
  apiBase: string;
}

export default function ChatbotWidget({
  chatOpen,
  setChatOpen,
  phone,
  setPhone,
  phoneSubmitted,
  setPhoneSubmitted,
  chatText,
  setChatText,
  chatHistory,
  setChatHistory,
  botTyping,
  setBotTyping,
  apiBase
}: ChatbotWidgetProps) {
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setPhoneSubmitted(true);
    setBotTyping(true);

    try {
      const response = await fetch(`${apiBase}/comunicacao/chatbot/interagir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, text: "Oi" })
      });
      const data = await response.json();

      setChatHistory([
        { sender: "bot", text: data.respostaBot }
      ]);
    } catch (err) {
      console.error(err);
      setChatHistory([
        { sender: "bot", text: "Olá! Seja bem-vindo ao Instituto Conectar. Qual o nome completo do seu filho?" }
      ]);
    } finally {
      setBotTyping(false);
    }
  };

  const handleSendChatMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim()) return;

    const userText = chatText;
    setChatHistory((prev) => [...prev, { sender: "user", text: userText }]);
    setChatText("");
    setBotTyping(true);

    try {
      const response = await fetch(`${apiBase}/comunicacao/chatbot/interagir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, text: userText })
      });
      const data = await response.json();

      setTimeout(() => {
        setChatHistory((prev) => [...prev, { sender: "bot", text: data.respostaBot }]);
        setBotTyping(false);
      }, 600);
    } catch (err) {
      console.error(err);
      setBotTyping(false);
    }
  };

  const speakText = (text: string, idx: number) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (playingIdx === idx) {
      window.speechSynthesis.cancel();
      setPlayingIdx(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 1.05;
    
    utterance.onend = () => {
      setPlayingIdx(null);
    };

    setPlayingIdx(idx);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 text-xs">
      {!chatOpen ? (
        <button
          onClick={() => setChatOpen(true)}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-all border-0 cursor-pointer"
          style={{ background: "linear-gradient(90deg, #69C4B5, #58b3a4)" }}
          title="Iniciar Triagem por Chat"
          aria-label="Abrir chat de triagem clínica"
        >
          <MessageSquare className="w-6 h-6 text-white" />
        </button>
      ) : (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-80 bg-white border border-[#8e7bbe]/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col justify-between h-[380px]"
        >
          <div className="p-4 bg-gradient-to-r from-[#8e7bbe] to-[#db2777] text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                🤖
              </div>
              <div className="text-left">
                <h4 className="font-bold text-xs">Assistente Conectar</h4>
                <p className="text-[8px] text-white/80">Online • Auto-Triagem</p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="p-1 hover:bg-white/10 rounded text-white border-0 bg-transparent cursor-pointer"
              aria-label="Fechar chat"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {!phoneSubmitted ? (
            <form onSubmit={handleStartChat} className="p-6 flex-1 flex flex-col justify-center items-center gap-4 text-center">
              <Smartphone className="w-10 h-10 text-[#8e7bbe] animate-bounce" />
              <div>
                <h5 className="font-bold text-xs text-[#3c2a4d]">Triagem via WhatsApp</h5>
                <p className="text-[10px] text-zinc-500 leading-relaxed mt-1">Informe seu número de telefone para que possamos iniciar a triagem das terapias.</p>
              </div>
              <input
                type="text"
                required
                placeholder="(DD) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border text-center text-xs bg-zinc-50 text-zinc-800 outline-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-white font-bold bg-[#8e7bbe] hover:bg-[#8e7bbe]/95 border-0 cursor-pointer text-[10px] uppercase shadow-md"
              >
                Iniciar Chatbot
              </button>
            </form>
          ) : (
            <div className="flex-1 flex flex-col justify-between p-3 bg-zinc-50/50">
              <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[220px] p-1.5 scrollbar-none">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "p-2.5 rounded-xl max-w-[85%] text-[10px] leading-relaxed relative flex flex-col",
                      msg.sender === "bot"
                        ? "bg-white text-zinc-700 border mr-auto text-left shadow-xs"
                        : "bg-purple-500 text-white ml-auto text-right shadow-xs"
                    )}
                  >
                    <span>{msg.text}</span>
                    
                    {/* Simulated Voice player for Bot responses */}
                    {msg.sender === "bot" && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-100/50 w-full shrink-0">
                        <button
                          type="button"
                          onClick={() => speakText(msg.text, idx)}
                          className="w-6 h-6 rounded-full bg-green-500 text-white hover:bg-green-600 flex items-center justify-center border-0 cursor-pointer transition-colors"
                          title={playingIdx === idx ? "Pausar áudio" : "Ouvir resposta"}
                        >
                          {playingIdx === idx ? (
                            <Pause className="w-2.5 h-2.5 fill-current" />
                          ) : (
                            <Play className="w-2.5 h-2.5 fill-current" />
                          )}
                        </button>
                        <div className="flex-1 h-3 flex items-center gap-0.5 px-1 bg-zinc-50 border rounded-sm overflow-hidden">
                          <span className={cn("w-0.5 h-2.5 bg-green-500 rounded-full", playingIdx === idx && "animate-pulse")} />
                          <span className="w-0.5 h-1 bg-green-400 rounded-full" />
                          <span className={cn("w-0.5 h-3 bg-green-500 rounded-full", playingIdx === idx && "animate-pulse")} />
                          <span className="w-0.5 h-1.5 bg-green-400 rounded-full" />
                          <span className={cn("w-0.5 h-2 bg-green-500 rounded-full", playingIdx === idx && "animate-pulse")} />
                        </div>
                        <span className="text-[8px] text-zinc-400 font-bold font-mono">0:08</span>
                      </div>
                    )}
                  </div>
                ))}
                {botTyping && (
                  <div className="mr-auto text-[9px] bg-white p-2 rounded-xl border text-zinc-400 italic flex items-center gap-1.5 animate-pulse">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Digitando...</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendChatMsg} className="flex gap-2 border-t pt-3 mt-1.5">
                <input
                  type="text"
                  required
                  placeholder="Digite sua resposta..."
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  className="flex-1 p-2 border rounded-xl text-[10px] bg-white text-zinc-800 outline-none"
                />
                <button
                  type="submit"
                  className="p-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 border-0 cursor-pointer flex items-center justify-center"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
