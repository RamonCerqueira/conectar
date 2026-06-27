"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Building2,
  X,
  Plus,
  Clock,
  Calendar,
  UserCheck,
  Trash2,
  Edit,
  UserCheck2
} from "lucide-react";

interface SalaDetailsModalProps {
  sala: any;
  onClose: () => void;
  onAddAssignment: () => void;
  onEditAssignment: (assignment: any) => void;
  onDeleteAssignment: (assignmentId: string) => void;
  onReplaceDoctor: (assignment: any) => void;
}

export function SalaDetailsModal({
  sala,
  onClose,
  onAddAssignment,
  onEditAssignment,
  onDeleteAssignment,
  onReplaceDoctor,
}: SalaDetailsModalProps) {
  if (!sala) return null;

  const diaSigla = (dia: string) => {
    switch (dia.toUpperCase()) {
      case "SEGUNDA": return "Seg";
      case "TERCA": return "Ter";
      case "QUARTA": return "Qua";
      case "QUINTA": return "Qui";
      case "SEXTA": return "Sex";
      default: return dia.substring(0, 3);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 text-left">
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden bg-card border-border z-50 text-foreground text-xs"
      >
        {/* Header with Room Accent Color */}
        <div
          className="p-6 text-white flex items-center justify-between shrink-0"
          style={{ backgroundColor: sala.cor }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-tight">{sala.nome}</h3>
              <p className="text-xs text-white/80 mt-0.5">Capacidade: {sala.capacidade} crianças</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-white cursor-pointer bg-transparent border-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Room Description */}
          <div className="space-y-1.5">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Descrição do Espaço</h4>
            <p className="text-xs text-foreground/80 leading-relaxed bg-muted/20 border border-border p-3.5 rounded-xl">
              {sala.descricao || "Sem descrição cadastrada."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Column 1: Today's Occupations */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-purple-600 flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> Agenda de Atendimentos (Hoje)
              </h4>
              <div className="divide-y divide-border border rounded-xl overflow-hidden bg-muted/5 border-border">
                {sala.agendaHoje && sala.agendaHoje.map((ag: any) => (
                  <div key={ag.id} className="flex justify-between items-center p-3 hover:bg-muted/10 transition-colors">
                    <div className="space-y-0.5">
                      <span className="font-bold text-foreground block text-[11px]">{ag.horario}</span>
                      <span className="text-muted-foreground block text-[10px]">Pac: {ag.paciente}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                      {ag.profissional}
                    </span>
                  </div>
                ))}
                {(!sala.agendaHoje || sala.agendaHoje.length === 0) && (
                  <p className="text-xs text-muted-foreground italic p-4 text-center">
                    Nenhum atendimento agendado para hoje.
                  </p>
                )}
              </div>
            </div>

            {/* Column 2: Weekly Reserved Slots (Ocupações do Médico) */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-purple-600 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> Alocações Semanais / Dias Ocupados
                </h4>
                <button
                  type="button"
                  onClick={onAddAssignment}
                  className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-white gradient-primary rounded-lg border-0 cursor-pointer shadow-xs hover:brightness-105"
                >
                  <Plus className="h-3 w-3" /> Vincular
                </button>
              </div>

              <div className="space-y-2.5">
                {sala.alocacoes && sala.alocacoes.map((aloc: any) => (
                  <div
                    key={aloc.id}
                    className="p-3.5 rounded-xl border border-border bg-card space-y-3 relative group shadow-2xs hover:border-purple-500/20 transition-all"
                  >
                    {/* Header: Dr. Name & Time */}
                    <div className="flex justify-between items-start pr-12">
                      <div className="space-y-0.5">
                        <p className="font-extrabold text-[11px] text-foreground leading-tight">{aloc.profissional}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3 text-purple-500" /> {aloc.horarioInicio} às {aloc.horarioFim}
                        </p>
                      </div>
                    </div>

                    {/* Days indicators */}
                    <div className="flex gap-1">
                      {["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA"].map((day) => {
                        const isActive = aloc.diasSemana.includes(day);
                        return (
                          <span
                            key={day}
                            className={cn(
                              "w-7 h-5 rounded flex items-center justify-center font-bold text-[9px] uppercase tracking-wider border",
                              isActive
                                ? "bg-purple-500/15 border-purple-500/30 text-purple-600 dark:text-purple-400"
                                : "bg-muted/30 border-transparent text-muted-foreground/55"
                            )}
                            title={day}
                          >
                            {diaSigla(day)}
                          </span>
                        );
                      })}
                    </div>

                    {/* Action buttons (Absolute at top-right or inside row) */}
                    <div className="flex gap-1.5 justify-end pt-2 border-t border-dashed border-border">
                      <button
                        type="button"
                        onClick={() => onReplaceDoctor(aloc)}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-muted hover:bg-purple-500/10 text-muted-foreground hover:text-purple-600 transition-colors border-0 cursor-pointer text-[9px] font-bold"
                        title="Substituir por outro Médico"
                      >
                        <UserCheck2 className="h-3 w-3" /> Substituir
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditAssignment(aloc)}
                        className="p-1 rounded bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors border-0 cursor-pointer"
                        title="Alterar Dias / Horários"
                      >
                        <Edit className="h-3 w-3" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteAssignment(aloc.id)}
                        className="p-1 rounded border border-red-500/15 hover:bg-red-500/10 text-red-500 transition-colors cursor-pointer bg-transparent"
                        title="Cancelar Ocupação (Liberar dias)"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {(!sala.alocacoes || sala.alocacoes.length === 0) && (
                  <div className="p-8 border border-dashed border-border rounded-xl text-center text-muted-foreground bg-muted/5 py-12">
                    Nenhum médico ou dia de ocupação vinculado a esta sala. Clique em "+ Vincular" para criar uma alocação.
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border bg-card flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border font-bold hover:bg-muted transition-colors cursor-pointer border-border text-foreground bg-transparent"
          >
            Fechar Detalhes
          </button>
        </div>
      </motion.div>
    </div>
  );
}
