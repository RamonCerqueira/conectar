"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, Mail, Lock, ShieldAlert, Sparkles, Send } from "lucide-react";
import { api, setAccessToken } from "@/lib/api";

export function PortalLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Para demonstração 100% funcional, simulamos se não houver backend ativo ou chamamos a rota
      const res = await api.post("/auth/login-responsavel", { email, password }).catch(() => {
        // Fallback simulado para teste de fluxo direto
        if (email === "mariana.mendes@email.com" && password === "123456") {
          return { data: { accessToken: "mock-parent-token", responsavel: { nome: "Mariana Mendes", pacienteId: "pac-1" } } };
        }
        throw new Error("Credenciais inválidas");
      });

      const { accessToken, responsavel } = res.data;
      setAccessToken(accessToken);
      localStorage.setItem("parentName", responsavel.nome);
      localStorage.setItem("pacienteId", responsavel.pacienteId);

      router.push("/portal/dashboard");
    } catch (err: any) {
      setError(err.message || "Falha na autenticação do portal. Verifique seus dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-soft">
      {/* Lado Esquerdo - Info da Marca */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary flex-col justify-between p-12 text-white relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-lg">
            <Brain className="h-6 w-6 text-white animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-purple-200">Instituto</p>
            <p className="text-base font-bold -mt-0.5">Conectar</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 max-w-md">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider">
            Portal dos Pais
          </span>
          <h2 className="text-3xl font-extrabold leading-tight">
            Acompanhe o desenvolvimento clínico do seu filho em tempo real.
          </h2>
          <p className="text-sm text-purple-100 leading-relaxed">
            Consulte a agenda de consultas, acesse evoluções do prontuário, confira tarefas para casa e consulte histórico financeiro.
          </p>
        </div>

        {/* Footer */}
        <p className="text-xs text-purple-200">
          © {new Date().getFullYear()} Instituto Conectar. Todos os direitos reservados.
        </p>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-16 lg:px-24 bg-card relative">
        <div className="max-w-md w-full mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Acesso ao Portal
            </h1>
            <p className="text-xs text-muted-foreground">
              Para pais e responsáveis. Use o e-mail cadastrado na recepção e sua senha de acesso.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3.5 bg-red-500/10 text-red-500 rounded-xl font-semibold flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Seu E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-1 focus:ring-purple-500 bg-muted/20 focus:bg-card"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Senha do Portal</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-1 focus:ring-purple-500 bg-muted/20 focus:bg-card"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-bold text-white gradient-primary shadow-lg shadow-purple-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55"
            >
              {loading ? (
                <RotateCw className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Acessar Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Dica para demonstração */}
          <div className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl text-[10px] text-purple-600 dark:text-purple-300">
            💡 <strong>Demonstração:</strong> Use o e-mail <code>mariana.mendes@email.com</code> e a senha <code>123456</code> para logar como a mãe do Lucas Mendes.
          </div>
        </div>
      </div>
    </div>
  );
}

// Pequeno helper local para animação spin
function RotateCw(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <polyline points="21 3 21 8 16 8" />
    </svg>
  );
}
