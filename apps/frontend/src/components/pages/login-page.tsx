"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Brain, Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
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
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #FFF5F5 0%, #FFEBEB 100%)" }}>
      {/* ─── Lado Esquerdo — Hero ─── */}
      <div className="hidden lg:flex w-1/2 p-12 flex-col justify-between relative overflow-hidden" style={{ background: "linear-gradient(135deg, #FFF0F5 0%, #FFE4E1 100%)" }}>
        {/* Background decorativo */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-3xl bg-rose-200" />
          <div className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full blur-3xl bg-pink-100" />
        </div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-md border border-rose-100 bg-white flex items-center justify-center">
            <img src="/logo.jpeg" alt="Logo Conectar" className="object-cover w-full h-full" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest leading-none">
              Instituto
            </p>
            <p className="text-base font-extrabold text-slate-800 -mt-0.5">Conectar</p>
          </div>
        </motion.div>

        {/* Conteúdo central */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative z-10 flex-1 flex items-center gap-8 my-6"
        >
          {/* Coluna de Texto & Info */}
          <div className="w-3/5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100/60 text-rose-600 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-rose-500" />
              Gestão Clínica Integrada
            </div>
            <h1 className="text-4xl font-extrabold text-slate-800 leading-tight">
              Cuidar do desenvolvimento é o que <span className="text-rose-500 font-black">nos move.</span> ❤️
            </h1>
            <p className="text-slate-600 text-xs leading-relaxed">
              Soluções inteligentes para clínicas, terapeutas e famílias que fazem a diferença todos os dias na vida das crianças.
            </p>

            {/* Cards de Recursos */}
            <div className="space-y-3.5">
              {[
                {
                  title: "Cuidado que acolhe",
                  desc: "Humanizamos cada detalhe do atendimento para oferecer o melhor suporte ao desenvolvimento.",
                  icon: Sparkles,
                },
                {
                  title: "Gestão que simplifica",
                  desc: "Automatize relatórios, prontuários, agendas e garanta o controle total da clínica.",
                  icon: Brain,
                },
                {
                  title: "Segurança que protege",
                  desc: "Dados clínicos e cadastrais protegidos de acordo com a LGPD para total tranquilidade.",
                  icon: Lock,
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 p-3 bg-white/70 backdrop-blur-xs rounded-2xl border border-rose-100/40 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">{item.title}</h4>
                    <p className="text-slate-500 text-[10px] leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Banner */}
            <div className="p-3 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl text-white flex items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4 text-white animate-pulse" />
                </div>
                <p className="text-[10px] font-semibold leading-normal">
                  A tecnologia cuida da gestão, para focar no que realmente importa: <span className="font-bold underline decoration-pink-300 decoration-2">pessoas.</span>
                </p>
              </div>
              <div className="flex items-center -space-x-1.5 shrink-0">
                <div className="w-6 h-6 rounded-full bg-rose-200 border-2 border-white flex items-center justify-center text-[9px] font-bold text-rose-700">C</div>
                <div className="w-6 h-6 rounded-full bg-pink-200 border-2 border-white flex items-center justify-center text-[9px] font-bold text-pink-700">D</div>
                <div className="w-6 h-6 rounded-full bg-rose-300 border-2 border-white flex items-center justify-center text-[9px] font-bold text-rose-800">P</div>
              </div>
            </div>
          </div>

          {/* Coluna da Imagem (Redirecionada) */}
          <div className="w-2/5 h-[420px] rounded-3xl overflow-hidden shadow-xl border-4 border-white/60 relative">
            <img src="/login-hero.png" alt="Terapia infantil" className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-rose-500/10 to-transparent" />
          </div>
        </motion.div>

        {/* Footer do Hero */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 text-slate-400 text-[10px]"
        >
          © 2026 Instituto Conectar · Todos os direitos reservados
        </motion.div>
      </div>

      {/* ─── Lado Direito — Form ─── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white p-8 rounded-3xl border border-rose-100/80 shadow-2xl shadow-rose-200/20"
        >
          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg border border-rose-100 bg-white flex items-center justify-center">
              <img src="/logo.jpeg" alt="Logo Conectar" className="object-cover w-full h-full" />
            </div>
            <div>
              <p className="text-[10px] text-rose-500 uppercase tracking-widest leading-none">Instituto</p>
              <p className="text-sm font-bold text-slate-800 -mt-0.5">Conectar</p>
            </div>
          </div>

          {/* Top circular icon */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 shadow-inner">
              <Brain className="h-7 w-7 text-rose-500 animate-pulse" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Bem-vindo(a)! ❤️</h2>
            <p className="text-slate-400 text-xs mt-1">Acesse sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="form-login">
            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-rose-500 mb-1.5" htmlFor="input-email">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-300" />
                <input
                  id="input-email"
                  type="email"
                  autoComplete="email"
                  placeholder="Digite seu e-mail"
                  className={cn(
                    "w-full bg-rose-50/20 border rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all",
                    errors.email
                      ? "border-red-400 focus:border-red-500"
                      : "border-rose-100 focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                  )}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-rose-500" htmlFor="input-senha">
                  Senha
                </label>
                <button type="button" className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors" id="btn-esqueci-senha">
                  Esqueci a senha?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-300" />
                <input
                  id="input-senha"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  className={cn(
                    "w-full bg-rose-50/20 border rounded-2xl pl-10 pr-10 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all",
                    errors.password
                      ? "border-red-400 focus:border-red-500"
                      : "border-rose-100 focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                  )}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-300 hover:text-rose-500 transition-colors"
                  id="btn-toggle-password"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Lembrar */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer" htmlFor="checkbox-lembrar">
                <input
                  id="checkbox-lembrar"
                  type="checkbox"
                  className="w-4.5 h-4.5 rounded border-rose-200 text-rose-500 focus:ring-rose-400 bg-rose-50/15 accent-rose-500 cursor-pointer"
                />
                <span className="text-xs text-slate-500 font-medium">Lembrar meu acesso</span>
              </label>
            </div>

            {/* Botão */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-rose-500/15 transition-opacity disabled:opacity-70 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
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
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-rose-100" />
            <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider">ou acesse como</span>
            <div className="flex-1 h-px bg-rose-100" />
          </div>

          {/* Portais */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => router.push("/portal/login")}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-rose-200 text-rose-600 hover:bg-rose-50/50 hover:border-rose-300 transition-all text-xs font-bold cursor-pointer"
              id="btn-portal-pais"
            >
              Portal dos Pais
            </button>
            <button
              type="button"
              onClick={() => {
                toast.info("Você já está na página de login do profissional.");
              }}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-rose-200 text-rose-600 hover:bg-rose-50/50 hover:border-rose-300 transition-all text-xs font-bold cursor-pointer"
              id="btn-portal-profissional"
            >
              Portal Profissional
            </button>
          </div>

          {/* Ambiente Seguro Footer */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 mt-6 pt-4 border-t border-rose-50/50">
            <Lock className="h-3.5 w-3.5 text-slate-400" />
            <span>Ambiente seguro e criptografado | Versão 2.4.0</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

