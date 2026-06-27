"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, UserCheck } from "lucide-react";
import { toast } from "sonner";

interface SalaReplaceDoctorModalProps {
  assignment: any;
  profissionais: { id: string; nome: string }[];
  onClose: () => void;
  onReplace: (newDoctorId: string) => void;
}

export function SalaReplaceDoctorModal({
  assignment,
  profissionais,
  onClose,
  onReplace,
}: SalaReplaceDoctorModalProps) {
  const otherDoctors = profissionais.filter((p) => p.id !== assignment?.profissionalId && p.nome !== assignment?.profissional);
  const [selectedDoctorId, setSelectedDoctorId] = useState(otherDoctors[0]?.id || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId) {
      toast.error("Por favor, selecione o profissional substituto.");
      return;
    }
    onReplace(selectedDoctorId);
  };

  if (!assignment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 text-left">
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-sm rounded-2xl shadow-2xl border overflow-hidden bg-card border-border z-50 text-foreground text-xs"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-purple-500" />
              Substituir Médico da Sala
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Substitua o profissional associado a esta reserva.
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
          
          {/* Current occupant details */}
          <div className="p-3 bg-muted/20 border border-border rounded-xl space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Ocupante Atual</p>
            <p className="font-extrabold text-foreground">{assignment.profissional}</p>
            <p className="text-[10px] text-muted-foreground font-medium">
              Horário: {assignment.horarioInicio} - {assignment.horarioFim} • Dias: {assignment.diasSemana?.join(", ")}
            </p>
          </div>

          {/* Replacement occupant Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Selecionar Médico Substituto *</label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full p-2.5 rounded-xl border text-xs bg-background text-foreground border-border outline-none focus:ring-1 focus:ring-purple-500"
            >
              {otherDoctors.length > 0 ? (
                otherDoctors.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))
              ) : (
                <option value="">Nenhum outro profissional disponível</option>
              )}
            </select>
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
              disabled={otherDoctors.length === 0}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar Substituição
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
