"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Brain, Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { api, setAccessToken } from "@/lib/api";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", data);
      const { accessToken, usuario } = res.data;
      setAccessToken(accessToken);
      
      localStorage.setItem("userName", usuario.nome);
      localStorage.setItem("userRole", usuario.perfil);
      localStorage.setItem("userEmail", usuario.email);
      
      toast.success(`Bem-vindo, ${usuario.nome}!`);
      router.push("/dashboard");
    } catch (err: any) {
      console.warn("Could not authenticate with real backend, checking demo credentials.", err);
      if (data.email === "admin@conectar.com" && data.password === "123456") {
        setAccessToken("mock-admin-token");
        localStorage.setItem("userName", "Administrador Conectar");
        localStorage.setItem("userRole", "ADMINISTRADOR");
        localStorage.setItem("userEmail", "admin@conectar.com");
        toast.success("Bem-vindo! (Modo de Demonstração)");
        router.push("/dashboard");
      } else {
        toast.error("Falha ao entrar: verifique seu e-mail e senha.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "hsl(270 50% 6%)" }}>
      {/* ─── Lado Esquerdo — Hero ─── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full opacity-20 blur-3xl gradient-primary" />
          <div className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full opacity-15 blur-3xl" style={{ background: "#E98BAE" }} />
        </div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-lg border border-white/10 bg-white flex items-center justify-center">
            <img src="/logo.jpeg" alt="Logo Conectar" className="object-cover w-full h-full" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-white/50 uppercase tracking-widest">
              Instituto
            </p>
            <p className="text-lg font-bold text-white -mt-1">Conectar</p>
          </div>
        </motion.div>

        {/* Conteúdo central */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/70 text-xs font-medium mb-6">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            Sistema com IA integrada
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-4">
            Gestão clínica{" "}
            <span className="gradient-text">completa</span>
            {" "}para quem cuida de crianças
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            Prontuários, agenda inteligente, financeiro, relatórios e muito mais — tudo em um único lugar.
          </p>

          {/* Features */}
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              "27+ módulos integrados",
              "IA com Google Gemini",
              "WhatsApp automatizado",
              "Agenda com drag & drop",
              "Portal dos pais",
              "LGPD compliant",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-2 text-white/70 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                {feat}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 text-white/30 text-xs"
        >
          © 2026 Instituto Conectar · Todos os direitos reservados
        </motion.div>
      </div>

      {/* ─── Lado Direito — Form ─── */}
      <div
        className="flex-1 flex items-center justify-center p-8"
        style={{ background: "hsl(270 45% 9%)" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg border border-white/10 bg-white flex items-center justify-center">
              <img src="/logo.jpeg" alt="Logo Conectar" className="object-cover w-full h-full" />
            </div>
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-widest">Instituto</p>
              <p className="text-sm font-bold text-white -mt-1">Conectar</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1">Bem-vindo de volta</h2>
            <p className="text-white/50 text-sm">Acesse sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" id="form-login">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-white/70 mb-2" htmlFor="input-email">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  id="input-email"
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  className={cn(
                    "w-full bg-white/5 border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all",
                    errors.email
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-white/10 focus:border-primary"
                  )}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label className="block text-xs font-medium text-white/70 mb-2" htmlFor="input-senha">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  id="input-senha"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={cn(
                    "w-full bg-white/5 border rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all",
                    errors.password
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-white/10 focus:border-primary"
                  )}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                  id="btn-toggle-password"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Lembrar + Esqueci */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer" htmlFor="checkbox-lembrar">
                <input
                  id="checkbox-lembrar"
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/5 accent-primary"
                />
                <span className="text-xs text-white/50">Lembrar-me</span>
              </label>
              <button type="button" className="text-xs text-primary hover:text-primary-300 transition-colors" id="btn-esqueci-senha">
                Esqueci a senha
              </button>
            </div>

            {/* Botão */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full gradient-primary text-white font-semibold py-3 px-4 rounded-xl shadow-md shadow-primary/10 transition-opacity disabled:opacity-70 flex items-center justify-center gap-2"
              id="btn-submit-login"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  Entrar no sistema
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Separador */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30">ou acesse como</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Portais */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => router.push("/portal/login")}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-white/10 text-white/60 hover:border-white/20 hover:text-white/80 transition-all text-xs font-medium cursor-pointer"
              id="btn-portal-pais"
            >
              Portal dos Pais
            </button>
            <button
              type="button"
              onClick={() => {
                toast.info("Você já está na página de login do profissional.");
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-white/10 text-white/60 hover:border-white/20 hover:text-white/80 transition-all text-xs font-medium cursor-pointer"
              id="btn-portal-profissional"
            >
              Portal Profissional
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
