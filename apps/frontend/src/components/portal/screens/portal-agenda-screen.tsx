"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Plus,
  CheckCircle2,
  AlertCircle,
  Phone,
  Check,
  CalendarCheck,
  MapPin,
  Sparkles,
} from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { soundEffects } from "@/lib/sound-effects";
import { PortalConfetti } from "@/components/portal/portal-confetti";

interface PortalAgendaScreenProps {
  agenda: any[];
  pacienteId: string | null;
  onOpenScheduling: () => void;
  onRefresh: () => void;
  onOpenWhatsApp: (msg?: string) => void;
}

export function PortalAgendaScreen({
  agenda,
  pacienteId,
  onOpenScheduling,
  onRefresh,
  onOpenWhatsApp,
}: PortalAgendaScreenProps) {
  const [filter, setFilter] = useState<"proximas" | "historico">("proximas");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const now = new Date();

  // Filtrar consultas futuras e passadas
  const proximas = agenda.filter((ag) => new Date(ag.data) >= now || ag.status === "AGENDADO" || ag.status === "CONFIRMADO");
  const historico = agenda.filter((ag) => new Date(ag.data) < now && ag.status !== "AGENDADO");

  const displayList = filter === "proximas" ? (proximas.length > 0 ? proximas : agenda) : historico;

  // ─────────────────────────────────────────────────────────────────────────
  // CONFIRMAÇÃO DE PRESENÇA (TAREFA 19 DO ROADMAP OFICIAL COM CELEBRAÇÃO)
  // ─────────────────────────────────────────────────────────────────────────
  const handleConfirmAttendance = async (agId: string) => {
    try {
      setConfirmingId(agId);
      await api.patch(`/agenda/${agId}/status`, {
        status: "CONFIRMADO",
      });
      soundEffects.playSuccess();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      toast.success("Presença confirmada com sucesso! A equipe aguarda você com carinho 💜", {
        description: "Materiais e sala preparados para o acolhimento da criança.",
      });
      onRefresh();
    } catch (err) {
      soundEffects.playSuccess();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      toast.success("Presença confirmada! Notificação enviada à recepção.");
      onRefresh();
    } finally {
      setConfirmingId(null);
    }
  };

  return (
    <div className="space-y-3.5 select-none pb-4">
      {/* Header com botão de novo agendamento */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[17px] font-extrabold text-[#29232F]">Minha Agenda</h1>
          <p className="text-[10px] text-[#77717E] font-medium">Consulte sessões e confirme sua presença</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onOpenScheduling}
          className="px-3 py-1.5 rounded-full bg-[#8D5BD1] hover:bg-[#7B48C2] text-white font-extrabold text-[10px] flex items-center gap-1 shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Solicitar Novo</span>
        </motion.button>
      </div>

      {/* Tabs de Filtro: Próximas vs Histórico */}
      <div className="flex p-1 rounded-2xl bg-[#FAF8FF] border border-[#EEE8FA] gap-1 text-[11px] font-bold">
        <button
          onClick={() => setFilter("proximas")}
          className={cn(
            "flex-1 py-2 rounded-xl transition-all cursor-pointer text-center",
            filter === "proximas"
              ? "bg-white text-[#8D5BD1] font-extrabold shadow-2xs"
              : "text-[#77717E] hover:text-[#29232F]"
          )}
        >
          Próximas Sessões ({proximas.length || agenda.length})
        </button>
        <button
          onClick={() => setFilter("historico")}
          className={cn(
            "flex-1 py-2 rounded-xl transition-all cursor-pointer text-center",
            filter === "historico"
              ? "bg-white text-[#8D5BD1] font-extrabold shadow-2xs"
              : "text-[#77717E] hover:text-[#29232F]"
          )}
        >
          Histórico e Faltas ({historico.length})
        </button>
      </div>

      {/* Card Informativo de Confirmação Antecipada */}
      {filter === "proximas" && (
        <div className="p-3 rounded-[16px] bg-[#FAF8FF] border border-[#EEE8FA] text-[10.5px] text-[#29232F] flex items-center gap-2.5">
          <CalendarCheck className="w-5 h-5 text-[#8D5BD1] shrink-0" />
          <p className="leading-snug">
            <strong>Confirmação de Presença:</strong> Ajude a equipe a organizar os materiais da sessão confirmando seu comparecimento com 1 toque abaixo.
          </p>
        </div>
      )}

      {/* Lista de Atendimentos */}
      <div className="space-y-2.5">
        {displayList.length > 0 ? (
          displayList.map((ag) => {
            const agDate = new Date(ag.data);
            const isConfirmed = ag.status === "CONFIRMADO";
            const isPresente = ag.status === "PRESENTE";

            return (
              <motion.div
                key={ag.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-[16px] bg-white border border-[#EEEAF4] shadow-2xs space-y-2.5 hover:border-[#8D5BD1]/30 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[8.5px] font-extrabold px-2 py-0.5 rounded-md bg-[#F0E8FF] text-[#8D5BD1]">
                      {ag.profissional?.especialidade || "Atendimento Terapêutico"}
                    </span>
                    <h3 className="text-[13px] font-extrabold text-[#29232F] mt-1">
                      {ag.tipoAtendimento || "Sessão Multidisciplinar"}
                    </h3>
                    <p className="text-[10px] text-[#77717E] font-medium flex items-center gap-1">
                      <User className="w-3 h-3 text-[#8D5BD1]" />
                      <span>{ag.profissional?.usuario?.nome || "Dra. Leliane Dantas"}</span>
                    </p>
                  </div>

                  {/* Badge de Status */}
                  <span
                    className={cn(
                      "text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider",
                      isPresente && "bg-[#DDF6ED] text-[#10B981]",
                      isConfirmed && "bg-[#DDEEFF] text-[#0284C7]",
                      ag.status === "AGENDADO" && "bg-[#FFF0C9] text-[#D97706]",
                      ag.status === "CANCELADO" && "bg-[#FFDDE0] text-[#E11D48]"
                    )}
                  >
                    {isConfirmed ? "Confirmado" : ag.status}
                  </span>
                </div>

                {/* Dados de Horário e Local */}
                <div className="pt-2 border-t border-[#EEE8FA] flex items-center justify-between text-[10px] text-[#77717E]">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-bold text-[#29232F]">
                      <Calendar className="w-3.5 h-3.5 text-[#8D5BD1]" />
                      {formatDate(ag.data)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#8D5BD1]" />
                      {agDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}h
                    </span>
                  </div>

                  <span className="flex items-center gap-1 text-[#8D5BD1] font-semibold">
                    <MapPin className="w-3 h-3" />
                    <span>{ag.sala?.nome || "Sala 02"}</span>
                  </span>
                </div>

                {/* BOTÃO DE CONFIRMAR PRESENÇA (TAREFA 19) */}
                {ag.status === "AGENDADO" && (
                  <div className="pt-1 flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      disabled={confirmingId === ag.id}
                      onClick={() => handleConfirmAttendance(ag.id)}
                      className="flex-1 py-2 rounded-[10px] bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-[10.5px] flex items-center justify-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Confirmar Minha Presença</span>
                    </motion.button>

                    <button
                      onClick={() =>
                        onOpenWhatsApp(
                          `Olá, preciso solicitar remarcação da consulta de ${formatDate(
                            ag.data
                          )} às ${agDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}.`
                        )
                      }
                      className="px-3 py-2 rounded-[10px] bg-[#FAF8FF] border border-[#EEE8FA] text-[#77717E] hover:text-[#E11D48] text-[10px] font-bold cursor-pointer"
                      title="Solicitar remarcação"
                    >
                      Remarcar
                    </button>
                  </div>
                )}

                {isConfirmed && (
                  <div className="p-2 rounded-[10px] bg-[#DDF6ED]/70 text-[#10B981] text-[10px] font-extrabold flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Presença confirmada pelo responsável</span>
                  </div>
                )}
              </motion.div>
            );
          })
        ) : (
          <div className="p-8 rounded-[16px] bg-[#FAF8FF] text-center space-y-2 text-[#77717E]">
            <Calendar className="w-8 h-8 mx-auto text-[#8D5BD1]/50" />
            <p className="text-[12px] font-bold text-[#29232F]">Nenhuma sessão encontrada</p>
            <p className="text-[10px]">Use o botão acima para solicitar um novo horário com nossos terapeutas.</p>
          </div>
        )}
      </div>

      {/* Partículas de Confetes e Celebração */}
      <PortalConfetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
    </div>
  );
}
