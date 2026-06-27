"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Video, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

import { Agendamento } from "@/types";

interface AgendaGridProps {
  slotsHorarios: string[];
  filteredAgendamentos: Agendamento[];
  onSelectSlot: (ag: Agendamento) => void;
  onOpenCreateModal: () => void;
  onDropItem?: (type: "patient" | "professional", item: any, slotTime: string, dateStr?: string) => void;
  onOpenCreateModalWithSlot?: (slot: string, dateStr?: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "PRESENTE":
      return "bg-emerald-500 text-white border-emerald-600";
    case "FALTOU":
      return "bg-red-500 text-white border-red-600";
    case "CONFIRMADO":
      return "bg-indigo-500 text-white border-indigo-600";
    case "CANCELADO":
      return "bg-gray-400 text-white border-gray-500";
    default:
      return "bg-purple-500 text-white border-purple-600";
  }
};

const diasSemana = [
  { nome: "Seg", dataStr: "2026-06-22" },
  { nome: "Ter", dataStr: "2026-06-23" },
  { nome: "Qua", dataStr: "2026-06-24" },
  { nome: "Qui", dataStr: "2026-06-25" },
  { nome: "Sex", dataStr: "2026-06-26" },
  { nome: "Sáb", dataStr: "2026-06-27" },
];

const diasSemanaCompleta = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const diasMes = Array.from({ length: 35 }, (_, i) => {
  const dayNum = i; // i = 0 é Domingo, 31 de Maio
  if (dayNum === 0) {
    return { dia: 31, dataStr: "2026-05-31", isCurrentMonth: false };
  } else if (dayNum <= 30) {
    return { dia: dayNum, dataStr: `2026-06-${String(dayNum).padStart(2, "0")}`, isCurrentMonth: true };
  } else {
    return { dia: dayNum - 30, dataStr: `2026-07-${String(dayNum - 30).padStart(2, "0")}`, isCurrentMonth: false };
  }
});

export function AgendaGrid({
  slotsHorarios,
  filteredAgendamentos,
  onSelectSlot,
  onOpenCreateModal,
  onDropItem,
  onOpenCreateModalWithSlot,
}: AgendaGridProps) {
  const [view, setView] = useState<"dia" | "semana" | "mes">("dia");
  const [dragOverCell, setDragOverCell] = useState<{ slot: string; day: string } | null>(null);

  const handleDragOver = (e: React.DragEvent, slot: string, day: string = "2026-06-26") => {
    e.preventDefault();
    setDragOverCell({ slot, day });
  };

  const handleDragLeave = () => {
    setDragOverCell(null);
  };

  const handleDrop = (e: React.DragEvent, slot: string, day: string = "2026-06-26") => {
    e.preventDefault();
    setDragOverCell(null);
    try {
      const dataStrPayload = e.dataTransfer.getData("text/plain");
      if (!dataStrPayload) return;
      const data = JSON.parse(dataStrPayload);
      onDropItem?.(data.type, data.item, slot, day);
    } catch (err) {
      console.error("Error parsing dropped data", err);
    }
  };

  return (
    <div
      className="flex flex-col xl:col-span-3 h-full border rounded-2xl bg-card overflow-hidden"
      style={{ borderColor: "hsl(var(--border))" }}
    >
      {/* Topo da Agenda */}
      <div className="p-4 border-b flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl hover:bg-muted border border-border cursor-pointer">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-bold text-sm text-foreground select-none">
            {view === "dia" && "Sexta-feira, 26 de Junho de 2026"}
            {view === "semana" && "Semana de 22 a 28 de Junho de 2026"}
            {view === "mes" && "Junho de 2026"}
          </span>
          <button className="p-2 rounded-xl hover:bg-muted border border-border cursor-pointer">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setView("dia")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all",
              view === "dia" ? "bg-purple-500 text-white shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            Dia
          </button>
          <button
            onClick={() => setView("semana")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all",
              view === "semana" ? "bg-purple-500 text-white shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            Semana
          </button>
          <button
            onClick={() => setView("mes")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all",
              view === "mes" ? "bg-purple-500 text-white shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            Mês
          </button>
          <button
            onClick={onOpenCreateModal}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white gradient-primary flex items-center gap-1 shadow-md shadow-purple-500/10 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Agendar
          </button>
        </div>
      </div>

      {/* ─── VISUALIZAÇÃO: DIA ─── */}
      {view === "dia" && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {slotsHorarios.map((slot) => {
            const agsNoSlot = filteredAgendamentos.filter((a) => {
              const d = a.data.split("T")[0];
              const hora = a.data.split("T")[1].slice(0, 5);
              return d === "2026-06-26" && hora === slot;
            });

            const isOver = dragOverCell?.slot === slot && dragOverCell?.day === "2026-06-26";

            return (
              <div key={slot} className="flex gap-4 items-start min-h-[80px]">
                {/* Horário */}
                <div className="w-12 text-right text-xs font-bold text-muted-foreground pt-1.5 shrink-0 select-none">
                  {slot}
                </div>

                {/* Linha Divisória & Container dos Agendamentos */}
                <div
                  className={cn(
                    "flex-1 min-h-[60px] border-t border-dashed border-border pt-2 flex gap-4 transition-all duration-200 rounded-xl px-2",
                    isOver && "bg-purple-500/10 border-solid border-purple-400 scale-[1.005]"
                  )}
                  onDragOver={(e) => handleDragOver(e, slot, "2026-06-26")}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, slot, "2026-06-26")}
                >
                  {agsNoSlot.map((ag) => (
                    <motion.div
                      layout
                      onClick={() => onSelectSlot(ag)}
                      key={ag.id}
                      whileHover={{ scale: 1.01 }}
                      className={cn(
                        "flex-1 p-3 rounded-xl border flex flex-col justify-between shadow-sm cursor-pointer relative overflow-hidden transition-all text-xs",
                        getStatusColor(ag.status)
                      )}
                      style={{ borderLeftWidth: "6px", borderLeftColor: ag.cor }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-white text-sm">{ag.paciente}</p>
                          <p className="text-[10px] text-white/80 font-medium mt-0.5">
                            {ag.profissional} • {ag.sala}
                          </p>
                        </div>
                        <span className="text-[9px] font-bold uppercase bg-white/20 text-white px-2 py-0.5 rounded-full">
                          {ag.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-white/90">
                        <Clock className="h-3 w-3" />
                        <span>
                          {ag.data.split("T")[1].slice(0, 5)} - {ag.dataFim.split("T")[1].slice(0, 5)}
                        </span>
                        {ag.tipo === "ONLINE" && (
                          <span className="flex items-center gap-0.5 bg-sky-500/30 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider text-[8px]">
                            <Video className="h-2.5 w-2.5" /> Online
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {agsNoSlot.length === 0 && (
                    <div
                      onClick={() => onOpenCreateModalWithSlot?.(slot, "2026-06-26")}
                      className="w-full text-xs text-muted-foreground/30 italic pt-1.5 hover:text-purple-400 hover:font-bold transition-all cursor-pointer select-none"
                    >
                      Slot disponível para consulta...
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── VISUALIZAÇÃO: SEMANA ─── */}
      {view === "semana" && (
        <div className="flex-1 flex flex-col overflow-hidden p-4">
          {/* Cabeçalho de dias */}
          <div className="grid grid-cols-7 border-b border-border bg-muted/20 text-xs font-bold text-muted-foreground py-2 text-center select-none rounded-t-xl">
            <div className="w-12 shrink-0"></div>
            {diasSemana.map((dia) => (
              <div
                key={dia.dataStr}
                className={cn(
                  "py-1 rounded-md",
                  dia.dataStr === "2026-06-26" ? "text-purple-600 bg-purple-500/10 font-extrabold" : ""
                )}
              >
                {dia.nome} {dia.dataStr.split("-")[2]}
              </div>
            ))}
          </div>

          {/* Grid de horários e dias */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/60">
            {slotsHorarios.map((slot) => (
              <div key={slot} className="grid grid-cols-7 min-h-[85px] items-stretch">
                {/* Horário */}
                <div className="w-12 text-right text-[10px] font-bold text-muted-foreground pr-2 pt-2 border-r border-border shrink-0 select-none">
                  {slot}
                </div>

                {/* Células para cada dia */}
                {diasSemana.map((dia) => {
                  const ags = filteredAgendamentos.filter((a) => {
                    const d = a.data.split("T")[0];
                    const h = a.data.split("T")[1].slice(0, 5);
                    return d === dia.dataStr && h === slot;
                  });

                  const isOver = dragOverCell?.slot === slot && dragOverCell?.day === dia.dataStr;

                  return (
                    <div
                      key={dia.dataStr}
                      className={cn(
                        "border-r border-border/40 p-1 flex flex-col gap-1 transition-all relative group/cell",
                        isOver && "bg-purple-500/10"
                      )}
                      onDragOver={(e) => handleDragOver(e, slot, dia.dataStr)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, slot, dia.dataStr)}
                    >
                      {ags.map((ag) => (
                        <div
                          onClick={() => onSelectSlot(ag)}
                          key={ag.id}
                          className={cn(
                            "p-1.5 rounded-lg border text-[10px] font-bold shadow-xs cursor-pointer overflow-hidden leading-tight flex flex-col justify-between h-full select-none hover:scale-[1.02] transition-transform",
                            getStatusColor(ag.status)
                          )}
                          style={{ borderLeftWidth: "4px", borderLeftColor: ag.cor }}
                        >
                          <p className="truncate text-white">{ag.paciente}</p>
                          <p className="truncate text-white/80 text-[8px] font-normal mt-0.5">
                            {ag.profissional.split(" ").slice(1).join(" ")}
                          </p>
                        </div>
                      ))}

                      {ags.length === 0 && (
                        <div
                          onClick={() => onOpenCreateModalWithSlot?.(slot, dia.dataStr)}
                          className="absolute inset-0 cursor-pointer opacity-0 group-hover/cell:opacity-100 bg-purple-500/5 transition-opacity flex items-center justify-center text-[9px] text-purple-500 font-bold"
                        >
                          + Agendar
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── VISUALIZAÇÃO: MÊS ─── */}
      {view === "mes" && (
        <div className="flex-1 flex flex-col overflow-hidden p-4">
          {/* Cabeçalho de dias completos */}
          <div className="grid grid-cols-7 border-b border-border bg-muted/20 text-xs font-bold text-muted-foreground py-2 text-center select-none rounded-t-xl">
            {diasSemanaCompleta.map((dia) => (
              <div key={dia}>{dia}</div>
            ))}
          </div>

          {/* Grid do mês */}
          <div className="flex-1 grid grid-cols-7 grid-rows-5 overflow-y-auto divide-x divide-y divide-border/60">
            {diasMes.map((day) => {
              const ags = filteredAgendamentos.filter((a) => a.data.split("T")[0] === day.dataStr);
              const isToday = day.dataStr === "2026-06-26";
              const isOver = dragOverCell?.slot === "09:00" && dragOverCell?.day === day.dataStr;

              return (
                <div
                  key={day.dataStr}
                  className={cn(
                    "p-1.5 flex flex-col gap-1 min-h-[90px] transition-all relative group/month-cell",
                    !day.isCurrentMonth && "bg-muted/10 opacity-60",
                    isToday && "bg-purple-500/5",
                    isOver && "bg-purple-500/10"
                  )}
                  onDragOver={(e) => handleDragOver(e, "09:00", day.dataStr)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, "09:00", day.dataStr)}
                >
                  {/* Número do Dia */}
                  <div className="flex justify-between items-center mb-1">
                    <span
                      className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded-full select-none",
                        isToday ? "bg-purple-500 text-white" : "text-muted-foreground"
                      )}
                    >
                      {day.dia}
                    </span>
                    {ags.length > 0 && (
                      <span className="text-[8px] font-bold text-purple-600 bg-purple-500/10 px-1.5 py-0.2 rounded-full shrink-0">
                        {ags.length} {ags.length === 1 ? "Atend." : "Atends."}
                      </span>
                    )}
                  </div>

                  {/* Listagem de Consultas do Dia */}
                  <div className="flex-1 overflow-y-auto space-y-1 pr-0.5">
                    {ags.map((ag) => (
                      <div
                        onClick={() => onSelectSlot(ag)}
                        key={ag.id}
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[8px] font-bold truncate cursor-pointer hover:brightness-95 select-none text-white border-l-2",
                          getStatusColor(ag.status)
                        )}
                        style={{ borderLeftColor: ag.cor }}
                        title={`${ag.data.split("T")[1].slice(0, 5)} - ${ag.paciente} (${ag.profissional})`}
                      >
                        {ag.data.split("T")[1].slice(0, 5)} {ag.paciente}
                      </div>
                    ))}
                  </div>

                  {/* Botão de Criação */}
                  <div
                    onClick={() => onOpenCreateModalWithSlot?.("09:00", day.dataStr)}
                    className="absolute inset-0 cursor-pointer opacity-0 group-hover/month-cell:opacity-100 bg-purple-500/5 transition-opacity flex items-center justify-center text-[9px] text-purple-500 font-bold z-10"
                  >
                    + Agendar
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
