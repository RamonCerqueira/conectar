"use client";

import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  Moon,
  Sun,
  QrCode,
  Plus,
  ChevronDown,
  LogOut,
  User,
  AlertCircle,
  CloudLightning,
  X,
  Smartphone,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState, useEffect } from "react";
import { api, setAccessToken } from "@/lib/api";
import { toast } from "sonner";
import { getOfflineProntuarios, syncOfflineProntuarios } from "@/lib/offline-sync";

export function AppHeader() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName, setUserName] = useState("Administrador");
  const [userRole, setUserRole] = useState("ADMINISTRADOR");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [totemModalOpen, setTotemModalOpen] = useState(false);

  const [isOnline, setIsOnline] = useState(true);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Obter dados do usuário logado
    const storedName = localStorage.getItem("userName");
    const storedRole = localStorage.getItem("userRole");
    if (storedName) setUserName(storedName);
    if (storedRole) setUserRole(storedRole);
    
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
      const updatePendingCount = () => {
        setPendingSyncCount(getOfflineProntuarios().length);
      };
      
      updatePendingCount();

      const handleOnline = async () => {
        setIsOnline(true);
        await syncOfflineProntuarios();
        updatePendingCount();
      };

      const handleOffline = () => {
        setIsOnline(false);
      };

      const pollTimer = setInterval(updatePendingCount, 4000);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // Tenta validar sessão no backend de forma transparente
      api.get("/auth/me")
        .then((res) => {
          if (res.data) {
            setUserName(res.data.nome);
            setUserRole(res.data.perfil);
            localStorage.setItem("userName", res.data.nome);
            localStorage.setItem("userRole", res.data.perfil);
          }
        })
        .catch((err) => {
          console.log("Using cached or local user session details.");
        });

      return () => {
        clearInterval(timer);
        clearInterval(pollTimer);
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }

    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      console.warn("Logout request failed, clearing local state", e);
    }
    setAccessToken(null);
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    toast.success("Sessão encerrada com sucesso.");
    window.location.href = "/login";
  };

  return (
    <header
      className="shrink-0 h-16 flex items-center justify-between px-6 border-b"
      style={{
        background: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
      }}
    >
      {/* Lado Esquerdo - Data/Hora */}
      <div className="flex items-center gap-4">
        <div>
          <p className="text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>
            {mounted
              ? format(currentTime, "EEEE, dd 'de' MMMM", { locale: ptBR })
              : "Carregando..."}
          </p>
          <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
            {mounted ? format(currentTime, "HH:mm:ss") : ""}
          </p>
        </div>
      </div>

      {/* Centro - Busca */}
      <div className="flex-1 max-w-md mx-6">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
          style={{
            background: "hsl(var(--muted))",
            color: "hsl(var(--muted-foreground))",
          }}
        >
          <Search className="h-4 w-4 shrink-0" />
          <input
            type="text"
            placeholder="Buscar paciente, profissional, diagnóstico..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-[hsl(var(--muted-foreground))]"
            style={{ color: "hsl(var(--foreground))" }}
          />
          <kbd
            className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono border"
            style={{
              background: "hsl(var(--card))",
              borderColor: "hsl(var(--border))",
              color: "hsl(var(--muted-foreground))",
            }}
          >
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Lado Direito - Ações */}
      <div className="flex items-center gap-2">
        {/* Indicador de Conectividade / Sincronização Offline */}
        {!isOnline && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-xs">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-500 animate-pulse" />
            <span className="hidden sm:inline">Trabalhando Offline</span>
          </div>
        )}

        {isOnline && pendingSyncCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={async () => {
              await syncOfflineProntuarios();
              setPendingSyncCount(getOfflineProntuarios().length);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-all cursor-pointer shadow-xs"
            title="Sincronizar evoluções pendentes agora"
          >
            <CloudLightning className="h-4 w-4 shrink-0 text-purple-500 animate-pulse" />
            <span>{pendingSyncCount} Evolução(ões) Pendente(s)</span>
          </motion.button>
        )}

        {/* Novo Agendamento */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/agenda")}
          className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white gradient-primary shadow-sm cursor-pointer"
          id="btn-novo-agendamento"
        >
          <Plus className="h-4 w-4" />
          <span>Novo</span>
        </motion.button>

        {/* QR Code */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTotemModalOpen(true)}
          className="p-2 rounded-lg transition-colors cursor-pointer"
          style={{
            background: "hsl(var(--muted))",
            color: "hsl(var(--muted-foreground))",
          }}
          title="Exibir Totem de Check-in QR Code"
          id="btn-qrcode-checkin"
        >
          <QrCode className="h-4 w-4" />
        </motion.button>

        {/* Notificações */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg transition-colors cursor-pointer"
            style={{
              background: "hsl(var(--muted))",
              color: "hsl(var(--muted-foreground))",
            }}
            id="btn-notificacoes"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
          </motion.button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 rounded-xl border shadow-xl z-50 p-4 space-y-3 text-left bg-card"
                  style={{
                    background: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                  }}
                >
                  <div className="flex items-center justify-between border-b pb-2">
                    <p className="font-bold text-xs uppercase tracking-wider text-foreground">Alertas e Notificações</p>
                    <button onClick={() => setNotifOpen(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  
                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
                    {[
                      { type: "financeiro", text: "8 mensalidades de pacientes com vencimento amanhã.", color: "border-amber-500" },
                      { type: "atendimento", text: "Lucas Mendes da Silva registrou 3 faltas consecutivas na terapia.", color: "border-red-500" },
                      { type: "laudo", text: "Laudo Clínico de Sofia Andrade pronto para revisão final.", color: "border-emerald-500" }
                    ].map((item, index) => (
                      <div key={index} className="p-2.5 rounded-lg bg-muted/40 text-[11px] leading-relaxed text-muted-foreground border-l-2 flex flex-col gap-1" style={{ borderLeftColor: item.type === "financeiro" ? "hsl(var(--warning))" : item.type === "atendimento" ? "hsl(var(--destructive))" : "#10b981" }}>
                        <p className="font-bold text-[9px] uppercase text-foreground leading-none">{item.type}</p>
                        <p className="font-medium text-muted-foreground">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Toggle Dark/Light */}
        {mounted && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg transition-colors"
            style={{
              background: "hsl(var(--muted))",
              color: "hsl(var(--muted-foreground))",
            }}
            id="btn-toggle-theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </motion.button>
        )}

        {/* Avatar */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg transition-colors cursor-pointer hover:bg-[hsl(var(--muted))]"
            style={{ color: "hsl(var(--foreground))" }}
            id="btn-user-menu"
          >
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold shadow-md">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden md:inline text-xs font-medium max-w-[100px] truncate">{userName}</span>
            <ChevronDown className="h-3.5 w-3.5" style={{ color: "hsl(var(--muted-foreground))" }} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <>
                {/* Backdrop cover for closing menu on outside click */}
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 rounded-xl border shadow-xl z-50 p-1.5 glass"
                  style={{
                    background: "hsl(var(--card) / 0.9)",
                    borderColor: "hsl(var(--border))",
                  }}
                >
                  <div className="px-3 py-2 border-b border-[hsl(var(--border))] mb-1">
                    <p className="text-xs font-semibold" style={{ color: "hsl(var(--foreground))" }}>{userName}</p>
                    <p className="text-[10px] uppercase tracking-wider text-violet-400 font-bold mt-0.5">{userRole}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      router.push("/perfil");
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium hover:bg-violet-500/10 hover:text-violet-400 transition-colors text-left"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    <User className="h-3.5 w-3.5 text-violet-500" />
                    Meu Perfil
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium hover:bg-red-500/10 hover:text-red-400 transition-colors text-left"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    <LogOut className="h-3.5 w-3.5 text-red-500" />
                    Sair da Conta
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Totem de Check-in Autônomo por QR Code */}
      <AnimatePresence>
        {totemModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setTotemModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border bg-card p-6 shadow-2xl z-50 text-center space-y-6"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <button
                onClick={() => setTotemModalOpen(false)}
                className="absolute right-4 top-4 rounded-lg p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer border-0 bg-transparent"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mx-auto w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                <QrCode className="h-6 w-6" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-foreground">Totem de Check-in Autônomo</h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Os responsáveis podem registrar a chegada do paciente lendo este QR Code através do Portal dos Pais.
                </p>
              </div>

              {/* QR Code Container com linhas de Scanner */}
              <div className="relative mx-auto w-52 h-52 bg-white rounded-2xl p-4 shadow-inner border border-purple-100 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-50 via-transparent to-transparent opacity-40" />
                
                {/* Scanner Laser Animado */}
                <motion.div
                  animate={{ y: [-80, 100, -80] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-0.5 bg-purple-500 z-10 shadow-[0_0_8px_#a855f7]"
                />

                {/* QR Code Mock */}
                <div className="relative w-40 h-40 border-4 border-purple-900 rounded-lg p-1.5 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="w-8 h-8 border-2 border-purple-900 bg-purple-900" />
                    <div className="w-8 h-8 border-2 border-purple-900 bg-purple-900" />
                  </div>
                  {/* Central design */}
                  <div className="flex-1 flex flex-col justify-center items-center py-2">
                    <div className="w-12 h-12 border border-purple-900 flex flex-wrap p-0.5 gap-0.5">
                      <div className="w-4 h-4 bg-purple-900" />
                      <div className="w-4 h-4 bg-purple-900" />
                      <div className="w-4 h-4 bg-purple-900" />
                      <div className="w-4 h-4 bg-purple-900/40" />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-8 h-8 border-2 border-purple-900 bg-purple-900" />
                    <div className="w-6 h-6 border border-purple-900 mt-2 flex items-center justify-center text-[7px] font-bold font-mono text-purple-950">C</div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl space-y-1">
                <p className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Smartphone className="h-3.5 w-3.5" /> Token do Totem Ativo
                </p>
                <code className="text-xs font-mono font-bold text-foreground">totem-checkin-hoje</code>
              </div>

              <div className="flex items-center gap-2 justify-center text-[10px] text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Atualiza automaticamente o status da consulta para "Presente"</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
