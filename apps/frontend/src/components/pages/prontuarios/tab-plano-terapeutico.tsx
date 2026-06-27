"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Calendar, TrendingUp, X, Plus } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface TabPlanoTerapeuticoProps {
  paciente: any;
  planos: any[];
  isNewMetaModalOpen: boolean;
  setIsNewMetaModalOpen: (open: boolean) => void;
  onAddMeta: (planoId: string, meta: any) => void;
  onUpdateMetaProgress: (planoId: string, metaId: string, val: number, nota: string) => void;
}

export function TabPlanoTerapeutico({
  paciente,
  planos,
  isNewMetaModalOpen,
  setIsNewMetaModalOpen,
  onAddMeta,
  onUpdateMetaProgress,
}: TabPlanoTerapeuticoProps) {
  const activePlano = planos.find((p) => p.pacienteId === paciente.id);
  const [selectedMetaHistory, setSelectedMetaHistory] = useState<any | null>(null);

  // Modal State - Update Progress
  const [isEditProgressoOpen, setIsEditProgressoOpen] = useState(false);
  const [editingMetaId, setEditingMetaId] = useState("");
  const [newProgressoVal, setNewProgressoVal] = useState(50);
  const [newProgressoNota, setNewProgressoNota] = useState("");

  // Form States - Meta
  const [metaObjetivo, setMetaObjetivo] = useState("");
  const [metaDescricao, setMetaDescricao] = useState("");
  const [metaPrazo, setMetaPrazo] = useState("");

  const handleCreateMeta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePlano) {
      toast.error("Nenhum plano ativo para associar esta meta.");
      return;
    }
    const newMeta = {
      id: `meta-${Date.now()}`,
      objetivo: metaObjetivo,
      descricao: metaDescricao,
      progresso: 0,
      status: "NAO_INICIADO",
      prazo: metaPrazo || new Date().toISOString().split("T")[0],
      historico: [],
    };

    onAddMeta(activePlano.id, newMeta);
    setIsNewMetaModalOpen(false);
    setMetaObjetivo("");
    setMetaDescricao("");
    setMetaPrazo("");
  };

  const handleUpdateProgresso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePlano) return;

    onUpdateMetaProgress(activePlano.id, editingMetaId, newProgressoVal, newProgressoNota);
    
    // Update local history preview if active
    if (selectedMetaHistory && selectedMetaHistory.id === editingMetaId) {
      const histItem = {
        data: new Date().toISOString().split("T")[0],
        valor: newProgressoVal,
        nota: newProgressoNota || "Progresso atualizado.",
      };
      setSelectedMetaHistory({
        ...selectedMetaHistory,
        progresso: newProgressoVal,
        status: newProgressoVal >= 100 ? "CONCLUIDO" : "EM_ANDAMENTO",
        historico: [histItem, ...selectedMetaHistory.historico],
      });
    }

    setIsEditProgressoOpen(false);
    setNewProgressoNota("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
      {/* Left: Metas list */}
      <div className="lg:col-span-2 space-y-6">
        {activePlano ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-1 text-left">
              <h3 className="font-bold text-sm text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" /> {activePlano.titulo}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {activePlano.descricao}
              </p>
            </div>

            <div className="space-y-3">
              {activePlano.metas.map((meta: any) => (
                <div
                  key={meta.id}
                  className="p-5 rounded-2xl border bg-card space-y-4 shadow-xs text-left"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-xs text-foreground">{meta.objetivo}</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{meta.descricao}</p>
                    </div>
                    <span className={cn(
                      "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0",
                      meta.status === "CONCLUIDO" ? "bg-emerald-500/10 text-emerald-500" : "bg-purple-500/10 text-purple-500"
                    )}>
                      {meta.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Prazo: {formatDate(meta.prazo)}
                      </span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">{meta.progresso}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all duration-300"
                        style={{ width: `${meta.progresso}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 text-xs">
                    <button
                      onClick={() => {
                        setEditingMetaId(meta.id);
                        setNewProgressoVal(meta.progresso);
                        setIsEditProgressoOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border hover:bg-muted transition-colors cursor-pointer"
                      style={{ borderColor: "hsl(var(--border))" }}
                    >
                      Atualizar Progresso
                    </button>
                    <button
                      onClick={() => setSelectedMetaHistory(meta)}
                      className="px-3 py-1.5 rounded-lg border hover:bg-muted transition-colors cursor-pointer font-semibold text-foreground"
                      style={{ borderColor: "hsl(var(--border))" }}
                    >
                      Histórico
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-muted-foreground border rounded-2xl bg-card">
            Nenhum plano terapêutico ativo encontrado.
          </div>
        )}
      </div>

      {/* Right: Selected Goal History logs */}
      <div className="lg:col-span-1">
        <div className="p-5 rounded-2xl border bg-card space-y-4 shadow-sm text-left" style={{ borderColor: "hsl(var(--border))" }}>
          <h4 className="font-bold text-xs text-foreground flex items-center gap-2 uppercase tracking-wide">
            <TrendingUp className="h-4 w-4 text-purple-500" /> Linha de Progresso
          </h4>
          {selectedMetaHistory ? (
            <div className="space-y-4 text-xs">
              <div>
                <p className="font-bold text-foreground">{selectedMetaHistory.objetivo}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">Prazo: {formatDate(selectedMetaHistory.prazo)}</p>
              </div>

              <div className="relative pl-4 border-l border-purple-500/20 space-y-4">
                {selectedMetaHistory.historico.map((h: any, idx: number) => (
                  <div key={idx} className="relative space-y-1 text-xs">
                    <div className="absolute -left-[20.5px] top-1.5 w-2 h-2 rounded-full bg-purple-500 border border-card" />
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-muted-foreground">{formatDate(h.data)}</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">{h.valor}%</span>
                    </div>
                    <p className="text-muted-foreground italic leading-relaxed">
                      "{h.nota}"
                    </p>
                  </div>
                ))}
                {selectedMetaHistory.historico.length === 0 && (
                  <p className="text-[10px] text-muted-foreground italic">Nenhum progresso registrado.</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic text-center py-8">
              Selecione uma meta ao lado para ver o histórico de evolução de progresso.
            </p>
          )}
        </div>
      </div>

      {/* Modal Atualizar Progresso */}
      <AnimatePresence>
        {isEditProgressoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="absolute inset-0" onClick={() => setIsEditProgressoOpen(false)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden bg-card border-border"
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="font-bold text-base text-foreground">Atualizar Progresso da Meta</h3>
                <button
                  onClick={() => setIsEditProgressoOpen(false)}
                  className="p-1 rounded-lg hover:bg-muted text-muted-foreground cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateProgresso} className="p-6 space-y-4">
                <div className="space-y-2 text-left">
                  <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                    <span>Novo Progresso (%)</span>
                    <span className="text-purple-600 font-bold">{newProgressoVal}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={newProgressoVal}
                    onChange={(e) => setNewProgressoVal(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-muted-foreground">Nota de Progresso Clínico</label>
                  <textarea
                    required
                    placeholder="Descreva o que o paciente desenvolveu para atingir esta nova marca..."
                    value={newProgressoNota}
                    onChange={(e) => setNewProgressoNota(e.target.value)}
                    rows={3}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none bg-background focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div className="pt-4 border-t flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditProgressoOpen(false)}
                    className="px-4 py-2.5 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
                  >
                    Salvar Progresso
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Nova Meta (triggered from parent) */}
      <AnimatePresence>
        {isNewMetaModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="absolute inset-0" onClick={() => setIsNewMetaModalOpen(false)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden bg-card border-border"
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="font-bold text-base text-foreground">Definir Nova Meta Clínica (PTS)</h3>
                <button
                  onClick={() => setIsNewMetaModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-muted text-muted-foreground cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateMeta} className="p-6 space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-muted-foreground">Objetivo Principal *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Leitura fluida de pequenas frases..."
                    value={metaObjetivo}
                    onChange={(e) => setMetaObjetivo(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none bg-background focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-muted-foreground">Detalhamento / Descrição *</label>
                  <textarea
                    required
                    placeholder="Ex: Ler frases completas de até 10 palavras..."
                    value={metaDescricao}
                    onChange={(e) => setMetaDescricao(e.target.value)}
                    rows={2}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none bg-background focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-muted-foreground">Prazo de Conclusão</label>
                  <input
                    type="date"
                    required
                    value={metaPrazo}
                    onChange={(e) => setMetaPrazo(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none bg-background focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="pt-4 border-t flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsNewMetaModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
                  >
                    Cadastrar Meta
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
