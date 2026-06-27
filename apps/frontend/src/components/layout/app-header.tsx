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
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState, useEffect } from "react";
import { api, setAccessToken } from "@/lib/api";
import { toast } from "sonner";

export function AppHeader() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName, setUserName] = useState("Administrador");
  const [userRole, setUserRole] = useState("ADMINISTRADOR");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Obter dados do usuário logado
    const storedName = localStorage.getItem("userName");
    const storedRole = localStorage.getItem("userRole");
    if (storedName) setUserName(storedName);
    if (storedRole) setUserRole(storedRole);
    
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
        {/* Novo Agendamento */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white gradient-primary shadow-sm"
          id="btn-novo-agendamento"
        >
          <Plus className="h-4 w-4" />
          <span>Novo</span>
        </motion.button>

        {/* QR Code */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg transition-colors"
          style={{
            background: "hsl(var(--muted))",
            color: "hsl(var(--muted-foreground))",
          }}
          title="Check-in por QR Code"
          id="btn-qrcode-checkin"
        >
          <QrCode className="h-4 w-4" />
        </motion.button>

        {/* Notificações */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-lg transition-colors"
          style={{
            background: "hsl(var(--muted))",
            color: "hsl(var(--muted-foreground))",
          }}
          id="btn-notificacoes"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500"></span>
        </motion.button>

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
    </header>
  );
}
