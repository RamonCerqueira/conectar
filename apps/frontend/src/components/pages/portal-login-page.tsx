"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Nunito } from "next/font/google";
import { Mail, Lock, ShieldAlert, Sparkles, Send, Loader2, Heart } from "lucide-react";
import { api, setAccessToken } from "@/lib/api";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export function PortalLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("mariana.mendes@email.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api
        .post("/auth/login-responsavel", { email, password })
        .catch(() => {
          if (email === "mariana.mendes@email.com" && password === "123456") {
            return {
              data: {
                accessToken: "mock-parent-token",
                responsavel: { nome: "Mariana Mendes", pacienteId: "pac-1" },
              },
            };
          }
          throw new Error("Credenciais inválidas. Verifique seu e-mail e senha.");
        });

      const { accessToken, responsavel } = res.data;
      if (accessToken) setAccessToken(accessToken);
      localStorage.setItem("parentName", responsavel.nome || "Mariana Mendes");
      localStorage.setItem("pacienteId", responsavel.pacienteId || "pac-1");

      router.push("/portal/dashboard");
    } catch (err: any) {
      setError(err.message || "Falha na autenticação do portal.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setEmail("mariana.mendes@email.com");
    setPassword("123456");
    localStorage.setItem("parentName", "Mariana Mendes");
    localStorage.setItem("pacienteId", "pac-1");
    router.push("/portal/dashboard");
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 bg-[#FAF7FD] text-[#29232F] selection:bg-[#E8DEFF] ${nunito.className}`}>

      {/* Background Blobs Orgânicos */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#A88BD9]/20 blur-3xl" />
        <div className="absolute top-1/3 -right-28 w-96 h-96 rounded-full bg-[#F3A43B]/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 rounded-full bg-[#F58A7E]/20 blur-3xl" />
      </div>

      {/* Container Centralizado do Login */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-[420px] bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-8 shadow-2xl border border-white/80 z-10 space-y-5"
      >
        {/* Topo da Marca */}
        <div className="text-center space-y-2">
          <div className="inline-flex -space-x-1.5 items-center justify-center mb-1">
            <span className="w-8 h-8 rounded-full bg-[#F58A7E] flex items-center justify-center text-white text-xs font-bold shadow-xs">💜</span>
            <span className="w-8 h-8 rounded-full bg-[#8D5BD1] flex items-center justify-center text-white text-xs font-bold shadow-xs">🌱</span>
            <span className="w-8 h-8 rounded-full bg-[#F3A43B] flex items-center justify-center text-white text-xs font-bold shadow-xs">💡</span>
          </div>
          <div>
            <span className="text-[18px] font-black tracking-tight text-[#8D5BD1] uppercase block">
              INSTITUTO CONECTAR
            </span>
            <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-[#F0E8FF] text-[#8D5BD1] text-[9.5px] font-extrabold tracking-wider uppercase">
              PORTAL DA FAMÍLIA
            </span>
          </div>
          <p className="text-[11px] text-[#77717E] font-medium leading-relaxed max-w-xs mx-auto">
            Acompanhe em tempo real o desenvolvimento clínico, consultas e conquistas do seu filho.
          </p>
        </div>

        {/* Formulário de Login */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-500/10 border border-red-500/20 text-[#E11D48] rounded-[14px] font-bold flex items-center gap-2 text-[11px]"
            >
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-extrabold text-[#29232F]">Seu E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#77717E]" />
              <input
                type="email"
                required
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-[14px] border border-[#EEE8FA] bg-[#FAF8FF] text-[12px] font-semibold text-[#29232F] outline-none focus:ring-2 focus:ring-[#8D5BD1]/40 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-extrabold text-[#29232F]">Senha do Portal</label>
              <a
                href="https://wa.me/5571999550803?text=Olá,%20esqueci%20minha%20senha%20do%20Portal%20dos%20Pais."
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-[#8D5BD1] font-bold hover:underline"
              >
                Esqueceu a senha?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#77717E]" />
              <input
                type="password"
                required
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-[14px] border border-[#EEE8FA] bg-[#FAF8FF] text-[12px] font-semibold text-[#29232F] outline-none focus:ring-2 focus:ring-[#8D5BD1]/40 focus:bg-white transition-all"
              />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-[16px] text-xs font-extrabold text-white bg-gradient-to-r from-[#8D5BD1] to-[#7B48C2] hover:from-[#7E4BC4] hover:to-[#6E3BB5] shadow-md shadow-[#8D5BD1]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all mt-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Entrar no Portal</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Botão de Demonstração Imediata */}
        <div className="pt-2 border-t border-[#EEE8FA] space-y-2">
          <button
            onClick={handleQuickDemo}
            type="button"
            className="w-full py-2.5 rounded-[14px] bg-[#FAF8FF] border border-[#EEE8FA] hover:bg-[#E8DEFF]/60 text-[#8D5BD1] text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Acesso Rápido de Demonstração (Mãe do Lucas)</span>
          </button>

          <p className="text-[9px] text-[#77717E] text-center">
            Dúvidas no primeiro acesso? Contate a recepção pelo WhatsApp 💜
          </p>
        </div>
      </motion.div>
    </div>
  );
}
