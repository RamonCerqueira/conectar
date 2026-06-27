"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface PlanoMetaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { objetivo: string; descricao: string; prazo: string }) => void;
}

export function PlanoMetaModal({ isOpen, onClose, onSubmit }: PlanoMetaModalProps) {
  const [objetivo, setObjetivo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prazo, setPrazo] = useState("2026-12-31");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!objetivo) return;

    onSubmit({ objetivo, descricao, prazo });

    // Reset
    setObjetivo("");
    setDescricao("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="absolute inset-0" onClick={onClose} />

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
                <h3 className="font-bold text-base text-foreground">Adicionar Meta Terapêutica</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Defina um novo marco clínico no PTS da criança.</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-muted text-muted-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Objetivo / Meta</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Identificar 10 letras do alfabeto..."
                  value={objetivo}
                  onChange={(e) => setObjetivo(e.target.value)}
                  className="w-full p-2.5 rounded-xl border text-xs outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Detalhamento / Conduta</label>
                <textarea
                  placeholder="Descreva as tarefas e apoios necessários para a realização..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl border text-xs outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Data Alvo (Prazo)</label>
                <input
                  type="date"
                  required
                  value={prazo}
                  onChange={(e) => setPrazo(e.target.value)}
                  className="w-full p-2.5 rounded-xl border text-xs bg-card outline-none"
                />
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
                >
                  Criar Meta
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface PlanoProgressoModalProps {
  isOpen: boolean;
  currentProgresso: number;
  onClose: () => void;
  onSubmit: (data: { progressoVal: number; progressoNota: string }) => void;
}

export function PlanoProgressoModal({
  isOpen,
  currentProgresso,
  onClose,
  onSubmit,
}: PlanoProgressoModalProps) {
  const [progressoVal, setProgressoVal] = useState(currentProgresso);
  const [progressoNota, setProgressoNota] = useState("");

  useEffect(() => {
    if (isOpen) {
      setProgressoVal(currentProgresso);
      setProgressoNota("");
    }
  }, [isOpen, currentProgresso]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ progressoVal, progressoNota });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden bg-card"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="font-bold text-base text-foreground">Atualizar Progresso da Meta</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground flex justify-between">
                  <span>Progresso atual (%):</span>
                  <span className="font-bold text-purple-600">{progressoVal}%</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={progressoVal}
                  onChange={(e) => setProgressoVal(parseInt(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Nota de Evolução / Observação</label>
                <textarea
                  required
                  placeholder="Descreva o que a criança desenvolveu para alcançar este percentual..."
                  value={progressoNota}
                  onChange={(e) => setProgressoNota(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl border text-xs outline-none"
                />
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
                >
                  Confirmar Evolução
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
