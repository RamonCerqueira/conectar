"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SalaAssignmentModalProps {
  assignment: any | null; // If editing, otherwise null for new
  profissionais: { id: string; nome: string }[];
  onClose: () => void;
  onSave: (data: {
    id?: string;
    profissionalId: string;
    diasSemana: string[];
    horarioInicio: string;
    horarioFim: string;
  }) => void;
}

const WEEK_DAYS = [
  { id: "SEGUNDA", label: "Segunda" },
  { id: "TERCA", label: "Terça" },
  { id: "QUARTA", label: "Quarta" },
  { id: "QUINTA", label: "Quinta" },
  { id: "SEXTA", label: "Sexta" },
];

export function SalaAssignmentModal({
  assignment,
  profissionais,
  onClose,
  onSave,
}: SalaAssignmentModalProps) {
  const [profissionalId, setProfissionalId] = useState(profissionais[0]?.id || "");
  const [diasSemana, setDiasSemana] = useState<string[]>([]);
  const [horarioInicio, setHorarioInicio] = useState("08:00");
  const [horarioFim, setHorarioFim] = useState("12:00");

  // Load existing assignment details if editing
  useEffect(() => {
    if (assignment) {
      setProfissionalId(assignment.profissionalId || assignment.profissional || "");
      setDiasSemana(assignment.diasSemana || []);
      setHorarioInicio(assignment.horarioInicio || "08:00");
      setHorarioFim(assignment.horarioFim || "12:00");
    } else {
      setProfissionalId(profissionais[0]?.id || "");
      setDiasSemana([]);
      setHorarioInicio("08:00");
      setHorarioFim("12:00");
    }
  }, [assignment, profissionais]);

  const handleToggleDay = (dayId: string) => {
    if (diasSemana.includes(dayId)) {
      setDiasSemana(diasSemana.filter((d) => d !== dayId));
    } else {
      setDiasSemana([...diasSemana, dayId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profissionalId) {
      toast.error("Por favor, selecione um profissional.");
      return;
    }
    if (diasSemana.length === 0) {
      toast.error("Selecione pelo menos um dia da semana.");
      return;
    }
    if (horarioInicio >= horarioFim) {
      toast.error("O horário de início deve ser anterior ao de término.");
      return;
    }

    onSave({
      id: assignment?.id, // Keep ID if editing
      profissionalId,
      diasSemana,
      horarioInicio,
      horarioFim,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 text-left">
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden bg-card border-border z-50 text-foreground text-xs"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              {assignment ? "Alterar Ocupação de Sala" : "Vincular Nova Ocupação"}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {assignment
                ? "Modifique os horários e dias recorrentes de ocupação."
                : "Defina o médico, dias e horários em que a sala estará reservada."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-muted text-muted-foreground cursor-pointer bg-transparent border-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Professional selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Profissional de Saúde *</label>
            <select
              value={profissionalId}
              onChange={(e) => setProfissionalId(e.target.value)}
              className="w-full p-2.5 rounded-xl border text-xs bg-background text-foreground border-border outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="">Selecione um profissional...</option>
              {profissionais.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Weekly Days Checkbox/Badge grid */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">Dias da Semana *</label>
            <div className="grid grid-cols-5 gap-2">
              {WEEK_DAYS.map((day) => {
                const isSelected = diasSemana.includes(day.id);
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => handleToggleDay(day.id)}
                    className={cn(
                      "py-2 rounded-xl border text-[10px] font-bold text-center cursor-pointer transition-all border-0",
                      isSelected
                        ? "bg-purple-500/15 border-purple-500/30 text-purple-600 dark:text-purple-400 font-extrabold shadow-2xs"
                        : "bg-muted border-transparent text-muted-foreground/80 hover:bg-muted/80"
                    )}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time range inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Horário de Início *</label>
              <input
                type="time"
                required
                value={horarioInicio}
                onChange={(e) => setHorarioInicio(e.target.value)}
                className="w-full p-2.5 rounded-xl border text-xs bg-background text-foreground border-border outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Horário de Término *</label>
              <input
                type="time"
                required
                value={horarioFim}
                onChange={(e) => setHorarioFim(e.target.value)}
                className="w-full p-2.5 rounded-xl border text-xs bg-background text-foreground border-border outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-border flex justify-end gap-3 bg-card">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer border-border text-foreground bg-transparent"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer border-0"
            >
              {assignment ? "Salvar Alterações" : "Atribuir Ocupação"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
