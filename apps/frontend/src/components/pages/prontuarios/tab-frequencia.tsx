"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface TabFrequenciaProps {
  paciente: any;
  frequencias: any[];
  setFrequencias: React.Dispatch<React.SetStateAction<any[]>>;
}

export function TabFrequencia({
  paciente,
  frequencias,
  setFrequencias,
}: TabFrequenciaProps) {
  const filteredFrequencias = frequencias.filter((f) => f.pacienteId === paciente.id);

  // Local Modal/Form states
  const [selectedFreq, setSelectedFreq] = useState<any | null>(null);
  const [newFreqStatus, setNewFreqStatus] = useState("PRESENTE");
  const [newFreqJustificativa, setNewFreqJustificativa] = useState("");

  const handleUpdateFrequencia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFreq) return;

    setFrequencias(
      frequencias.map((f) =>
        f.id === selectedFreq.id
          ? { ...f, status: newFreqStatus as any, justificativa: newFreqJustificativa }
          : f
      )
    );
    setSelectedFreq(null);
    toast.success("Frequência atualizada!");
  };

  return (
    <div className="space-y-6 text-xs animate-in fade-in duration-200">
      <div className="overflow-hidden border rounded-2xl bg-card border-border" style={{ borderColor: "hsl(var(--border))" }}>
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider border-border">
              <th className="p-4">Data da Sessão</th>
              <th className="p-4">Profissional</th>
              <th className="p-4">Frequência</th>
              <th className="p-4">Justificativa / Notas</th>
              <th className="p-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y text-foreground/80 divide-border">
            {filteredFrequencias.map((f) => (
              <tr key={f.id} className="hover:bg-muted/10 transition-colors">
                <td className="p-4 font-semibold">{formatDate(f.data)}</td>
                <td className="p-4">{f.agendamento?.profissional?.usuario?.nome || f.profissional || "Dra. Ana Lima"}</td>
                <td className="p-4">
                  {f.status === "PRESENTE" ? (
                    <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-500/15">Presente</span>
                  ) : f.status === "FALTOU" ? (
                    <span className="text-[10px] font-bold bg-red-500/10 text-red-600 px-2 py-0.5 rounded-full border border-red-500/15">Falta</span>
                  ) : (
                    <span className="text-[10px] font-bold bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full border border-amber-500/15">Justificada</span>
                  )}
                </td>
                <td className="p-4 text-muted-foreground italic max-w-[200px] truncate">{f.justificativa || "—"}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => {
                      setSelectedFreq(f);
                      setNewFreqStatus(f.status);
                      setNewFreqJustificativa(f.justificativa);
                    }}
                    className="px-2.5 py-1 text-[11px] rounded-lg border hover:bg-muted transition-colors cursor-pointer border-border text-foreground bg-transparent"
                  >
                    Ajustar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredFrequencias.length === 0 && (
          <div className="p-12 text-center text-xs text-muted-foreground">
            Nenhum registro de presença para este paciente.
          </div>
        )}
      </div>

      {/* Modal Ajustar Frequência */}
      <AnimatePresence>
        {selectedFreq && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="absolute inset-0" onClick={() => setSelectedFreq(null)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden bg-card border-border z-50 text-left"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-foreground">Alterar Frequência</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{selectedFreq.pacienteNome}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFreq(null)}
                  className="p-1 rounded-lg hover:bg-muted text-muted-foreground cursor-pointer bg-transparent border-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateFrequencia} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Status de Presença</label>
                  <select
                    value={newFreqStatus}
                    onChange={(e) => setNewFreqStatus(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs bg-background text-foreground border-border outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="PRESENTE">Presente</option>
                    <option value="FALTOU">Falta Não Justificada</option>
                    <option value="FALTA_JUSTIFICADA">Falta Justificada</option>
                    <option value="REPOSICAO">Reposição</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Justificativa / Motivo da Falta</label>
                  <textarea
                    placeholder="Escreva a justificativa relatada pelos pais..."
                    value={newFreqJustificativa}
                    onChange={(e) => setNewFreqJustificativa(e.target.value)}
                    rows={3}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none bg-background text-foreground border-border focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-border flex justify-end gap-3 bg-card">
                  <button
                    type="button"
                    onClick={() => setSelectedFreq(null)}
                    className="px-4 py-2.5 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer border-border text-foreground bg-transparent"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer border-0"
                  >
                    Salvar Frequência
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
