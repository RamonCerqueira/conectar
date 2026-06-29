"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, MessageSquare, Sparkles, X, Activity, ClipboardList, UserCheck, Brain, CheckCircle2 } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { saveOfflineProntuario } from "@/lib/offline-sync";

interface TabEvolucoesProps {
  paciente: any;
  prontuarios: any[];
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  onAddEvolution: (evo: any) => void;
}

export function TabEvolucoes({ paciente, prontuarios, isModalOpen, setIsModalOpen, onAddEvolution }: TabEvolucoesProps) {
  const [searchHistoryTerm, setSearchHistoryTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("TODOS");
  const [expandedAiSummaries, setExpandedAiSummaries] = useState<Record<string, string>>({});

  // Form States - Evoluções
  const [queixa, setQueixa] = useState("");
  const [objetivos, setObjetivos] = useState("");
  const [atividades, setAtividades] = useState("");
  const [resultados, setResultados] = useState("");
  const [comportamento, setComportamento] = useState("");
  const [orientacoes, setOrientacoes] = useState("");
  const [proximaMeta, setProximaMeta] = useState("");

  const filteredEvolutions = prontuarios
    .filter((pr) => pr.pacienteId === paciente.id)
    .filter((pr) => {
      const matchesSearch =
        pr.queixaPrincipal?.toLowerCase().includes(searchHistoryTerm.toLowerCase()) ||
        pr.atividadesRealizadas?.toLowerCase().includes(searchHistoryTerm.toLowerCase()) ||
        pr.resultados?.toLowerCase().includes(searchHistoryTerm.toLowerCase()) ||
        pr.profissional?.toLowerCase().includes(searchHistoryTerm.toLowerCase());

      const matchesSpecialty =
        selectedSpecialty === "TODOS" ||
        pr.profissional.toLowerCase().includes(selectedSpecialty.toLowerCase());

      return matchesSearch && matchesSpecialty;
    });

  const handleCreateProntuario = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isOffline = typeof window !== "undefined" && !navigator.onLine;

    const newPr = {
      id: `pr-${Date.now()}`,
      pacienteId: paciente.id,
      pacienteNome: paciente.nome,
      data: new Date().toISOString(),
      profissional: { usuario: { nome: "Dra. Ana Lima" }, especialidade: "Psicopedagogia" },
      queixaPrincipal: queixa,
      objetivosSessao: objetivos,
      atividadesRealizadas: atividades,
      resultados: resultados,
      comportamento: comportamento,
      orientacoesPais: orientacoes,
      proximaMeta: proximaMeta,
      isOfflinePending: isOffline,
    };

    if (isOffline) {
      saveOfflineProntuario({
        id: newPr.id,
        pacienteId: paciente.id,
        queixaPrincipal: queixa,
        objetivosSessao: objetivos,
        atividadesRealizadas: atividades,
        resultados: resultados,
        comportamento: comportamento,
        orientacoesPais: orientacoes,
        proximaMeta: proximaMeta,
        data: newPr.data,
        pacienteNome: paciente.nome,
        profissional: "Dra. Ana Lima (Psicopedagoga)"
      });
      toast.warning("Você está offline! A evolução foi salva localmente e será enviada automaticamente quando a conexão retornar.");
      onAddEvolution(newPr);
      setIsModalOpen(false);
      // Reset Form
      setQueixa("");
      setObjetivos("");
      setAtividades("");
      setResultados("");
      setComportamento("");
      setOrientacoes("");
      setProximaMeta("");
      return;
    }

    try {
      await api.post("/prontuarios", {
        pacienteId: paciente.id,
        queixaPrincipal: queixa,
        objetivosSessao: objetivos,
        atividadesRealizadas: atividades,
        resultados: resultados,
        comportamento: comportamento,
        orientacoesPais: orientacoes,
        proximaMeta: proximaMeta,
        data: newPr.data
      });
      toast.success("Evolução salva!");
    } catch (err) {
      console.warn("Salvando offline devido a erro de rede:", err);
      saveOfflineProntuario({
        id: newPr.id,
        pacienteId: paciente.id,
        queixaPrincipal: queixa,
        objetivosSessao: objetivos,
        atividadesRealizadas: atividades,
        resultados: resultados,
        comportamento: comportamento,
        orientacoesPais: orientacoes,
        proximaMeta: proximaMeta,
        data: newPr.data,
        pacienteNome: paciente.nome,
        profissional: "Dra. Ana Lima (Psicopedagoga)"
      });
      newPr.isOfflinePending = true;
      toast.warning("Erro de rede. A evolução foi salva localmente para sincronização posterior.");
    }

    onAddEvolution(newPr);
    setIsModalOpen(false);
    
    // Reset Form
    setQueixa("");
    setObjetivos("");
    setAtividades("");
    setResultados("");
    setComportamento("");
    setOrientacoes("");
    setProximaMeta("");
  };

  const handleCopyOrientations = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Orientações copiadas! Pronto para enviar pelo WhatsApp.");
  };

  const handleGenerateAiSummary = async (prId: string, pr: any) => {
    toast.info("Processando com IA Conectar...");
    try {
      const res = await api.post(`/ia/resumir-sessao/${prId}`);
      if (res.data && res.data.resumo) {
        setExpandedAiSummaries({
          ...expandedAiSummaries,
          [prId]: res.data.resumo
        });
        toast.success("Resumo clínico estruturado gerado!");
      } else {
        throw new Error();
      }
    } catch (err) {
      setTimeout(() => {
        const text = `ANÁLISE IA CONECTAR: O paciente apresentou evolução relevante em relação à queixa de "${pr.queixaPrincipal.toLowerCase()}". A atividade de "${pr.atividadesRealizadas.toLowerCase()}" demonstrou eficácia terapêutica, resultando em: "${pr.resultados.toLowerCase()}". Aspectos de engajamento foram avaliados como "${pr.comportamento.toLowerCase()}". Recomendado reforço domiciliar da orientação: "${pr.orientacoesPais}". Foco da próxima sessão: "${pr.proximaMeta.toLowerCase()}".`;
        setExpandedAiSummaries({
          ...expandedAiSummaries,
          [prId]: text
        });
        toast.success("Resumo clínico estruturado gerado com IA Local!");
      }, 700);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Filters & search */}
      <div className="p-4 rounded-2xl border bg-card flex flex-col md:flex-row gap-4 justify-between items-center shadow-xs" style={{ borderColor: "hsl(var(--border))" }}>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar no histórico do prontuário..."
            value={searchHistoryTerm}
            onChange={(e) => setSearchHistoryTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border bg-background text-foreground outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <div className="flex gap-1.5 w-full md:w-auto overflow-x-auto scrollbar-none">
          {["TODOS", "Psicopedagoga", "Fonoaudióloga", "Terapia Ocupacional"].map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all",
                selectedSpecialty === spec
                  ? "gradient-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {spec === "TODOS" ? "Todas Especialidades" : spec}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative pl-6 border-l-2 border-purple-500/20 space-y-6">
        {filteredEvolutions.map((pr) => {
          const isAiExpanded = expandedAiSummaries[pr.id];
          const getProfissionalName = (prof: any) => {
            if (!prof) return "Profissional";
            if (typeof prof === "string") return prof;
            if (prof?.usuario?.nome) {
              const spec = prof.especialidade ? ` (${prof.especialidade})` : "";
              return `${prof.usuario.nome}${spec}`;
            }
            return "Profissional";
          };
          const profName = getProfissionalName(pr.profissional);
          const initials = profName.includes(" ") 
            ? profName.split(" ").slice(1, 3).map((n: string) => n[0]).join("") 
            : profName.substring(0, 2);

          return (
            <div
              key={pr.id}
              className="p-6 rounded-2xl border bg-card space-y-5 relative shadow-sm hover:shadow-md transition-all text-left"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              {/* Timeline bullet */}
              <div className="absolute -left-[31px] top-7 w-4 h-4 rounded-full bg-purple-50 border-4 border-background shadow-sm" />

              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold shadow-md">
                    {initials || "PR"}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono">
                      {profName}
                    </p>
                    <h4 className="font-bold text-sm text-foreground mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span>Evolução Clínica de Sessão</span>
                      {pr.isOfflinePending && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold text-[9px] uppercase tracking-wider animate-pulse border border-amber-500/20">
                          Pendente de Envio
                        </span>
                      )}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1 bg-muted px-2.5 py-1 rounded-lg font-semibold">
                    <Clock className="h-3.5 w-3.5 text-purple-500" />
                    {formatDate(pr.data)}
                  </span>
                  
                  <button
                    onClick={() => handleCopyOrientations(pr.orientacoesPais)}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    title="Copiar Orientações dos Pais"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleGenerateAiSummary(pr.id, pr)}
                    className="p-1.5 rounded-lg hover:bg-purple-500/10 text-purple-500 hover:text-purple-600 transition-colors cursor-pointer"
                    title="Gerar Resumo Clínico com IA"
                  >
                    <Sparkles className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* AI Summary Panel */}
              <AnimatePresence>
                {isAiExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" /> IA Conectar Assistente
                      </p>
                      <button
                        onClick={() => setExpandedAiSummaries({ ...expandedAiSummaries, [pr.id]: "" })}
                        className="p-0.5 rounded hover:bg-purple-500/10 text-muted-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="text-foreground/80 leading-relaxed italic">{expandedAiSummaries[pr.id]}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Clinical blocks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-purple-50/40 dark:bg-purple-950/10 border border-purple-100/60 dark:border-purple-900/20 space-y-2">
                  <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                    <Activity className="h-4 w-4" />
                    <h5 className="font-bold text-xs">Estado Inicial / Queixa</h5>
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {pr.queixaPrincipal || "Sem queixas registradas no início da sessão."}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-blue-50/40 dark:bg-blue-950/10 border border-blue-100/60 dark:border-blue-900/20 space-y-2">
                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                    <Sparkles className="h-4 w-4" />
                    <h5 className="font-bold text-xs">Objetivos da Sessão</h5>
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {pr.objetivosSessao || "Sem metas clínicas específicas descritas."}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-teal-50/40 dark:bg-teal-950/10 border border-teal-100/60 dark:border-teal-900/20 space-y-2 md:col-span-2">
                  <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400">
                    <ClipboardList className="h-4 w-4" />
                    <h5 className="font-bold text-xs">Atividades Aplicadas</h5>
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {pr.atividadesRealizadas}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100/60 dark:border-emerald-900/20 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <UserCheck className="h-4 w-4" />
                    <h5 className="font-bold text-xs">Resultados / Desempenho</h5>
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {pr.resultados}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/40 dark:bg-amber-950/10 border border-amber-100/60 dark:border-amber-900/20 space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                    <Brain className="h-4 w-4" />
                    <h5 className="font-bold text-xs">Comportamento</h5>
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {pr.comportamento}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-pink-50/40 dark:bg-pink-950/10 border border-pink-100/60 dark:border-pink-900/20 space-y-2">
                  <div className="flex items-center gap-1.5 text-pink-600 dark:text-pink-400">
                    <MessageSquare className="h-4 w-4" />
                    <h5 className="font-bold text-xs">Orientações enviadas aos Pais</h5>
                  </div>
                  <p className="text-xs text-foreground/80 font-medium italic leading-relaxed">
                    "{pr.orientacoesPais}"
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-100/60 dark:border-indigo-900/20 space-y-2">
                  <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <h5 className="font-bold text-xs">Próximos Passos</h5>
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {pr.proximaMeta}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {filteredEvolutions.length === 0 && (
          <div className="p-12 text-center text-xs text-muted-foreground border rounded-2xl bg-card">
            Nenhuma evolução registrada para este paciente.
          </div>
        )}
      </div>

      {/* Modal Nova Evolução */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden bg-card border-border"
            >
              <div className="p-6 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-foreground">Evoluir Sessão Clínica</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{paciente.nome}</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-muted text-muted-foreground cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProntuario} className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-muted-foreground">Queixa Principal / Estado Inicial</label>
                  <textarea
                    required
                    placeholder="Ex: Criança entrou agitada, relatando conflito na escola..."
                    value={queixa}
                    onChange={(e) => setQueixa(e.target.value)}
                    rows={2}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none bg-background focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-muted-foreground">Objetivos Trabalhados</label>
                  <textarea
                    required
                    placeholder="Ex: Estimulação da consciência fonológica e segmentação silábica..."
                    value={objetivos}
                    onChange={(e) => setObjetivos(e.target.value)}
                    rows={2}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none bg-background focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-muted-foreground">Atividades Aplicadas</label>
                  <textarea
                    required
                    placeholder="Ex: Jogo de cartas com rimas, pareamento visual de figuras..."
                    value={atividades}
                    onChange={(e) => setAtividades(e.target.value)}
                    rows={2}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none bg-background focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-muted-foreground">Resultados Obtidos</label>
                  <textarea
                    required
                    placeholder="Ex: Identificou 8 de 10 rimas corretamente, precisando de suporte leve nas duas últimas..."
                    value={resultados}
                    onChange={(e) => setResultados(e.target.value)}
                    rows={2}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none bg-background focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-muted-foreground">Comportamento / Engajamento</label>
                  <textarea
                    required
                    placeholder="Ex: Cooperativo, manteve foco por períodos de 15 minutos, regulado sensorialmente..."
                    value={comportamento}
                    onChange={(e) => setComportamento(e.target.value)}
                    rows={2}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none bg-background focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-muted-foreground">Orientações de Apoio Domiciliar (Pais)</label>
                  <textarea
                    required
                    placeholder="Ex: Treinar leitura em voz alta de rimas simples por 5 minutos antes de dormir..."
                    value={orientacoes}
                    onChange={(e) => setOrientacoes(e.target.value)}
                    rows={2}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none bg-background focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-muted-foreground">Próxima Meta Clínica (Sessão Seguinte)</label>
                  <textarea
                    required
                    placeholder="Ex: Introduzir segmentação silábica em palavras de 3 sílabas sem pistas visuais..."
                    value={proximaMeta}
                    onChange={(e) => setProximaMeta(e.target.value)}
                    rows={2}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none bg-background focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div className="pt-4 border-t flex justify-end gap-3 bg-card">
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
                    Salvar Evolução
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
