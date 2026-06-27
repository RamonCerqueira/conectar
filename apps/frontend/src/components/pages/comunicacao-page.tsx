"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Mail,
  Send,
  X,
  Clock,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

export function ComunicacaoPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [activeCanal, setActiveCanal] = useState("TODOS");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [canal, setCanal] = useState("WHATSAPP");
  const [destino, setDestino] = useState("");
  const [texto, setTexto] = useState("");

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destino || !texto) return;

    try {
      if (canal === "WHATSAPP") {
        await api.post("/comunicacao/whatsapp", { phone: destino, text: texto });
      } else {
        await api.post("/comunicacao/email", { to: destino, subject: "Aviso Clínico Conectar", content: texto });
      }

      toast.success("Mensagem disparada com sucesso!");

      const newLog = {
        id: `l-${Date.now()}`,
        canal: canal as any,
        destino: destino,
        texto: texto,
        status: "ENVIADO" as const,
        data: new Date().toISOString(),
      };

      setLogs([newLog, ...logs]);
      setIsModalOpen(false);

      // Reset
      setDestino("");
      setTexto("");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar mensagem pelo servidor.");
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesCanal = activeCanal === "TODOS" || log.canal === activeCanal;
    return matchesCanal;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "hsl(var(--foreground))" }}>
            Módulo de Comunicação & Disparos
          </h1>
          <p className="text-sm text-muted-foreground">
            Envio automatizado de avisos por WhatsApp e e-mail, controle de logs de entrega e edição de templates.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
        >
          <Send className="h-4 w-4" />
          <span>Disparar Mensagem</span>
        </motion.button>
      </div>

      {/* Grid: Templates e Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates (1 coluna) */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wide">
            <Sparkles className="h-4 w-4 text-purple-500" /> Templates Salvos
          </h3>
          <div className="space-y-3">
            {templates.map((temp) => (
              <div
                key={temp.id}
                className="p-4 rounded-xl border bg-card space-y-2 text-xs"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-foreground">{temp.titulo}</span>
                  <span className="text-[10px] font-semibold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-md">
                    {temp.canal}
                  </span>
                </div>
                <p className="text-muted-foreground italic leading-relaxed">
                  "{temp.texto}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Logs de Envio (2 colunas) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wide">
              <Clock className="h-4 w-4 text-purple-500" /> Histórico de Disparos
            </h3>

            {/* Canal filter */}
            <div className="flex gap-1 text-xs">
              {["TODOS", "WHATSAPP", "EMAIL"].map((can) => (
                <button
                  key={can}
                  onClick={() => setActiveCanal(can)}
                  className={cn(
                    "px-3 py-1 rounded-lg font-semibold capitalize transition-all cursor-pointer",
                    activeCanal === can ? "bg-purple-500 text-white" : "bg-muted text-muted-foreground"
                  )}
                >
                  {can.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-xl border bg-card text-xs flex justify-between gap-4"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-md text-[9px]">
                      {log.canal}
                    </span>
                    <span className="text-foreground font-semibold">{log.destino}</span>
                    <span className="text-[10px] text-muted-foreground">• {formatDate(log.data)}</span>
                  </div>
                  <p className="text-muted-foreground line-clamp-2 leading-relaxed">{log.texto}</p>
                </div>

                <div className="shrink-0 flex items-center">
                  {log.status === "ENVIADO" ? (
                    <span className="flex items-center gap-1 font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[9px] uppercase">
                      <CheckCircle className="h-3 w-3" /> Enviado
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full text-[9px] uppercase">
                      <AlertCircle className="h-3 w-3" /> Erro
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── MODAL DISPARAR ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden bg-card"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              {/* Header */}
              <div className="p-6 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-foreground">Disparar Notificação Manual</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Envie e-mail ou WhatsApp para os responsáveis.</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-muted text-muted-foreground cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSendMessage} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Canal de Envio</label>
                    <select
                      value={canal}
                      onChange={(e) => setCanal(e.target.value)}
                      className="w-full p-2.5 rounded-xl border text-xs bg-card outline-none"
                    >
                      <option value="WHATSAPP">WhatsApp</option>
                      <option value="EMAIL">E-mail</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Destinatário</label>
                    <input
                      type="text"
                      required
                      placeholder={canal === "WHATSAPP" ? "DDD + Telefone" : "Email"}
                      value={destino}
                      onChange={(e) => setDestino(e.target.value)}
                      className="w-full p-2.5 rounded-xl border text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Mensagem</label>
                  <textarea
                    required
                    placeholder="Escreva o corpo da mensagem..."
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    rows={4}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none"
                  />
                </div>

                <div className="pt-4 border-t flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
                  >
                    Disparar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
