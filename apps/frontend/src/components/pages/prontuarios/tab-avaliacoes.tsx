"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface TabAvaliacoesProps {
  paciente: any;
  avaliacoes: any[];
  isNewAvaliacaoModalOpen: boolean;
  setIsNewAvaliacaoModalOpen: (open: boolean) => void;
  onAddAvaliacao: (av: any) => void;
}

export function TabAvaliacoes({
  paciente,
  avaliacoes,
  isNewAvaliacaoModalOpen,
  setIsNewAvaliacaoModalOpen,
  onAddAvaliacao,
}: TabAvaliacoesProps) {
  const filteredAvaliacoes = avaliacoes.filter((av) => av.pacienteId === paciente.id);
  const [activeAvaliacao, setActiveAvaliacao] = useState<any | null>(null);

  // Form States - Avaliações
  const [newTipo, setNewTipo] = useState("Avaliação Psicopedagógica");
  const [newConclusao, setNewConclusao] = useState("");
  const [newQ1, setNewQ1] = useState("");
  const [newQ2, setNewQ2] = useState("");

  const handleCreateAvaliacao = (e: React.FormEvent) => {
    e.preventDefault();
    const newAv = {
      id: `av-${Date.now()}`,
      pacienteId: paciente.id,
      pacienteNome: paciente.nome,
      tipo: newTipo,
      data: new Date().toISOString().split("T")[0],
      conclusao: newConclusao,
      respostas: [
        { pergunta: "Histórico de queixas clínicas:", resposta: newQ1 },
        { pergunta: "Desempenho nas atividades diagnósticas:", resposta: newQ2 },
      ],
    };

    onAddAvaliacao(newAv);
    setIsNewAvaliacaoModalOpen(false);
    
    // Reset Form
    setNewConclusao("");
    setNewQ1("");
    setNewQ2("");
    toast.success("Avaliação registrada com sucesso!");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs animate-in fade-in duration-200">
      {/* List */}
      <div className="space-y-3 text-left">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Avaliações Clínicas Realizadas</h4>
        {filteredAvaliacoes.map((av) => (
          <div
            key={av.id}
            className="p-5 rounded-2xl border bg-card space-y-3 shadow-xs hover:border-purple-500/30 transition-all border-border"
          >
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-md">
                {av.tipo}
              </span>
              <span className="text-[10px] text-muted-foreground">{formatDate(av.data)}</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-3 italic">
              "{av.conclusao}"
            </p>
            <button
              onClick={() => setActiveAvaliacao(av)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer border-border text-foreground"
            >
              <Brain className="h-3.5 w-3.5 text-purple-500" />
              Ver Detalhes do Teste
            </button>
          </div>
        ))}
        {filteredAvaliacoes.length === 0 && (
          <div className="p-12 text-center text-xs text-muted-foreground border rounded-2xl bg-card border-border">
            Nenhum teste de escala ou anamnese cadastrado.
          </div>
        )}
      </div>

      {/* Detail View */}
      <div>
        <div className="p-6 rounded-2xl border bg-card space-y-5 shadow-sm text-left border-border">
          <h4 className="font-bold text-xs text-foreground uppercase tracking-wide flex items-center gap-1.5">
            <Brain className="h-4 w-4 text-purple-500" /> Detalhes do Parecer Técnico
          </h4>
          {activeAvaliacao ? (
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[9px] bg-purple-500/10 text-purple-600 px-2 py-0.5 rounded font-bold">
                  {activeAvaliacao.tipo}
                </span>
                <p className="text-[10px] text-muted-foreground mt-1.5 font-mono">Aplicado em: {formatDate(activeAvaliacao.data)}</p>
              </div>

              <div className="space-y-3">
                {activeAvaliacao.respostas?.map((item: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl border bg-muted/20 space-y-1 border-border">
                    <p className="font-bold text-foreground">
                      Q{idx + 1}: {item.pergunta}
                    </p>
                    <p className="text-muted-foreground italic">"{item.resposta}"</p>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-border">
                <p className="font-bold text-foreground mb-1">Conclusão Clínico / Conduta:</p>
                <p className="p-3 bg-purple-500/5 border border-purple-500/20 text-purple-700 dark:text-purple-300 rounded-xl leading-relaxed font-semibold">
                  {activeAvaliacao.conclusao}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic text-center py-12">
              Selecione uma avaliação ao lado para visualizar as respostas completas e o parecer clínico.
            </p>
          )}
        </div>
      </div>

      {/* Modal Nova Avaliação */}
      <AnimatePresence>
        {isNewAvaliacaoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="absolute inset-0" onClick={() => setIsNewAvaliacaoModalOpen(false)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden bg-card border-border"
            >
              <div className="p-6 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-foreground">Registrar Avaliação Técnica</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Preencha o protocolo de teste ou anamnese.</p>
                </div>
                <button
                  onClick={() => setIsNewAvaliacaoModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-muted text-muted-foreground cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAvaliacao} className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-muted-foreground">Modelo de Protocolo</label>
                  <select
                    value={newTipo}
                    onChange={(e) => setNewTipo(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs bg-background outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="Avaliação Psicopedagógica">Avaliação Psicopedagógica</option>
                    <option value="Anamnese Infantil de Desenvolvimento">Anamnese Infantil de Desenvolvimento</option>
                    <option value="Avaliação Fonoaudiológica Inicial">Avaliação Fonoaudiológica Inicial</option>
                    <option value="Escala M-CHAT (TEA)">Escala M-CHAT (TEA)</option>
                  </select>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-muted-foreground">Histórico de queixas clínicas (Q1)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Apresenta atraso na fala desde os 2 anos..."
                    value={newQ1}
                    onChange={(e) => setNewQ1(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none bg-background focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-muted-foreground">Desempenho nas atividades diagnósticas (Q2)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Apresentou boa engajabilidade nas pistas visuais..."
                    value={newQ2}
                    onChange={(e) => setNewQ2(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none bg-background focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-muted-foreground">Parecer Final / Conclusão</label>
                  <textarea
                    required
                    placeholder="Escreva a conclusão da avaliação clínica..."
                    value={newConclusao}
                    onChange={(e) => setNewConclusao(e.target.value)}
                    rows={4}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none bg-background focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div className="pt-4 border-t flex justify-end gap-3 bg-card">
                  <button
                    type="button"
                    onClick={() => setIsNewAvaliacaoModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
                  >
                    Salvar Avaliação
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
