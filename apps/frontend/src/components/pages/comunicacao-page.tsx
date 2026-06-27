"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Mail,
  Send,
  X,
  Clock,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Plus,
  Info,
  Users,
  Bot,
  Trash2,
  Edit3,
  Smartphone,
  Check,
  ChevronRight,
  Settings
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

const templates = [
  { 
    id: "t-1", 
    titulo: "Confirmação de Agendamento", 
    canal: "WHATSAPP", 
    texto: "Olá! Confirmamos o agendamento de {{paciente}} para o dia/hora {{dataHora}}." 
  },
  { 
    id: "t-2", 
    titulo: "Lembrete de Cobrança", 
    canal: "WHATSAPP", 
    texto: "Olá! Lembramos que a mensalidade de R$ {{valor}} vence em {{vencimento}}. Chave PIX: financeiro@conectar.com.br" 
  },
  { 
    id: "t-3", 
    titulo: "Termo Pendente LGPD", 
    canal: "EMAIL", 
    texto: "Prezados responsáveis, o Termo de Consentimento LGPD está pronto para assinatura digital no portal Conectar." 
  }
];

export function ComunicacaoPage() {
  const [activeMainTab, setActiveMainTab] = useState<"disparos" | "leads" | "chatbot">("disparos");
  const [logs, setLogs] = useState<any[]>([]);
  const [activeCanal, setActiveCanal] = useState("TODOS");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states (Disparar)
  const [canal, setCanal] = useState("WHATSAPP");
  const [destino, setDestino] = useState("");
  const [texto, setTexto] = useState("");

  // CRM Leads states
  const [leads, setLeads] = useState<any[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);

  // Chatbot Steps states
  const [steps, setSteps] = useState<any[]>([]);
  const [stepsLoading, setStepsLoading] = useState(false);
  const [isStepModalOpen, setIsStepModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<any | null>(null);

  // Step Form states
  const [stepOrdem, setStepOrdem] = useState("1");
  const [stepPergunta, setStepPergunta] = useState("");
  const [stepCampoChave, setStepCampoChave] = useState("nomeCrianca");

  // Chatbot Simulator state
  const [simulatingLead, setSimulatingLead] = useState<any | null>(null);
  const [simText, setSimText] = useState("");
  const [simChatHistory, setSimChatHistory] = useState<any[]>([]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/comunicacao/whatsapp/fila");
      const formatted = (res.data || []).map((l: any) => ({
        id: l.id,
        canal: "WHATSAPP",
        destino: l.destinatario,
        texto: l.mensagem,
        status: l.status,
        data: l.criadoEm
      }));
      setLogs(formatted);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadLeads = async () => {
    setLeadsLoading(true);
    try {
      const res = await api.get("/comunicacao/chatbot/leads");
      setLeads(res.data || []);
    } catch (e) {
      console.error(e);
      toast.error("Erro ao carregar leads.");
    } finally {
      setLeadsLoading(false);
    }
  };

  const loadSteps = async () => {
    setStepsLoading(true);
    try {
      const res = await api.get("/comunicacao/chatbot/passos");
      setSteps(res.data || []);
    } catch (e) {
      console.error(e);
      toast.error("Erro ao carregar chatbot.");
    } finally {
      setStepsLoading(false);
    }
  };

  useEffect(() => {
    if (activeMainTab === "disparos") {
      loadLogs();
    } else if (activeMainTab === "leads") {
      loadLeads();
    } else if (activeMainTab === "chatbot") {
      loadSteps();
    }
  }, [activeMainTab]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destino || !texto) return;

    try {
      if (canal === "WHATSAPP") {
        await api.post("/comunicacao/whatsapp", { phone: destino, text: texto });
      } else {
        await api.post("/comunicacao/email", { to: destino, subject: "Aviso Clínico Conectar", content: texto });
      }

      toast.success("Mensagem disparada com sucesso!");
      setIsModalOpen(false);
      setDestino("");
      setTexto("");
      loadLogs();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar mensagem pelo servidor.");
    }
  };

  const handleCreateOrUpdateStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stepPergunta || !stepCampoChave) return;

    try {
      await api.post("/comunicacao/chatbot/passos", {
        id: editingStep?.id || undefined,
        ordem: parseInt(stepOrdem) || 1,
        pergunta: stepPergunta,
        campoChave: stepCampoChave
      });

      toast.success(editingStep ? "Pergunta atualizada!" : "Pergunta adicionada ao Chatbot!");
      setIsStepModalOpen(false);
      setEditingStep(null);
      setStepPergunta("");
      loadSteps();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar configuração do Chatbot.");
    }
  };

  const handleDeleteStep = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta pergunta do fluxo de triagem?")) return;
    try {
      await api.delete(`/comunicacao/chatbot/passos/${id}`);
      toast.success("Pergunta removida do fluxo.");
      loadSteps();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir pergunta.");
    }
  };

  const handleUpdateLeadStatus = async (id: string, newStatus: string) => {
    try {
      await api.post("/comunicacao/chatbot/leads", {
        id,
        status: newStatus
      });
      toast.success("Status do lead atualizado!");
      loadLeads();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar status do lead.");
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Excluir este lead de triagem do banco?")) return;
    try {
      await api.delete(`/comunicacao/chatbot/leads/${id}`);
      toast.success("Lead excluído.");
      loadLeads();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir lead.");
    }
  };

  // Simular interação do Chatbot
  const startSimulator = (lead: any) => {
    setSimulatingLead(lead);
    setSimChatHistory([
      { sender: "bot", text: "Olá! Seja muito bem-vindo(a) ao Instituto Conectar. 🌟 Para iniciarmos a triagem, qual o nome completo da criança ou adolescente?" }
    ]);
    setSimText("");
  };

  const handleSimSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simText.trim() || !simulatingLead) return;

    const userMsg = simText;
    setSimChatHistory((prev) => [...prev, { sender: "user", text: userMsg }]);
    setSimText("");

    try {
      const res = await api.post("/comunicacao/chatbot/interagir", {
        phone: simulatingLead.telefone,
        text: userMsg
      });

      // Bot responds
      setTimeout(() => {
        setSimChatHistory((prev) => [...prev, { sender: "bot", text: res.data.respostaBot }]);
        // Refresh leads list under the hood
        loadLeads();
      }, 700);
    } catch (err) {
      console.error(err);
      toast.error("Erro na simulação do chatbot.");
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesCanal = activeCanal === "TODOS" || log.canal === activeCanal;
    return matchesCanal;
  });

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground" style={{ fontFamily: "var(--font-sans)" }}>
            Módulo de Comunicação & Disparos
          </h1>
          <p className="text-sm text-muted-foreground">
            Envio de avisos manuais, fila de disparos de WhatsApp e triagem de novos pacientes pelo chatbot.
          </p>
        </div>

        {activeMainTab === "disparos" && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer border-0"
          >
            <Send className="h-4 w-4" />
            <span>Disparar Mensagem</span>
          </motion.button>
        )}
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-border">
        {[
          { id: "disparos", label: "Disparos & Logs", icon: Send },
          { id: "leads", label: "Triagem & CRM Leads", icon: Users },
          { id: "chatbot", label: "Configurar Chatbot", icon: Bot },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMainTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-0 bg-transparent",
                activeMainTab === tab.id
                  ? "border-purple-500 text-purple-400 font-extrabold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ─── TAB 1: DISPAROS & LOGS (WHATSAPP OUTBOUND) ──────────────────── */}
      {activeMainTab === "disparos" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl border bg-card flex items-start gap-3" style={{ borderColor: "hsl(var(--border))" }}>
            <Info className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-foreground">💡 Fila de Envio Integrada</p>
              <p className="text-muted-foreground leading-relaxed">
                Todas as mensagens automáticas (agendamentos, lembretes de PIX, etc) enviadas da clínica são auditadas e listadas aqui.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wide">
                <Sparkles className="h-4 w-4 text-purple-500" /> Templates Salvos
              </h3>
              <div className="space-y-3">
                {templates.map((temp) => (
                  <div
                    key={temp.id}
                    className="p-4 rounded-xl border bg-card space-y-2"
                    style={{ borderColor: "hsl(var(--border))" }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foreground">{temp.titulo}</span>
                      <span className="text-[10px] font-semibold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-md">
                        {temp.canal}
                      </span>
                    </div>
                    <p className="text-muted-foreground italic leading-relaxed">
                      "{temp.texto}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wide">
                  <Clock className="h-4 w-4 text-purple-500" /> Histórico de Disparos
                </h3>
                <div className="flex gap-1">
                  {["TODOS", "WHATSAPP", "EMAIL"].map((can) => (
                    <button
                      key={can}
                      onClick={() => setActiveCanal(can)}
                      className={cn(
                        "px-3 py-1 rounded-lg font-semibold capitalize transition-all cursor-pointer border-0",
                        activeCanal === can ? "bg-purple-500 text-white" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {can.toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="flex h-32 items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-purple-500 border-t-transparent" />
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 rounded-xl border bg-card flex justify-between gap-4"
                      style={{ borderColor: "hsl(var(--border))" }}
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-md text-[9px]">
                            {log.canal}
                          </span>
                          <span className="text-foreground font-semibold">{log.destino}</span>
                          <span className="text-[10px] text-muted-foreground">• {formatDate(log.data)}</span>
                        </div>
                        <p className="text-muted-foreground line-clamp-2 leading-relaxed">{log.texto}</p>
                      </div>

                      <div className="shrink-0 flex items-center">
                        {log.status === "ENVIADO" ? (
                          <span className="flex items-center gap-1 font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wide border border-emerald-500/20">
                            <CheckCircle className="h-3 w-3" /> Enviado
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 font-bold text-red-500 bg-red-500/10 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wide border border-red-500/20">
                            <AlertCircle className="h-3 w-3" /> Falha
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {filteredLogs.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground border border-dashed rounded-xl">
                      Nenhuma mensagem enviada localizada nesta categoria.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: CRM LEADS & TRIAGEM ──────────────────────────────────── */}
      {activeMainTab === "leads" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl border bg-card flex items-start gap-3" style={{ borderColor: "hsl(var(--border))" }}>
            <Users className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-foreground">Triagem de Novos Clientes (Landing Page & WhatsApp)</p>
              <p className="text-muted-foreground leading-relaxed">
                Aqui são listadas as fichas de triagem iniciadas por novos clientes. O robô automatizado colhe as primeiras queixas pelo WhatsApp e você assume o atendimento para agendar as avaliações presenciais.
              </p>
            </div>
          </div>

          {leadsLoading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-purple-500 border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Leads List */}
              <div className="lg:col-span-3 space-y-4">
                <div className="overflow-hidden border rounded-2xl bg-card" style={{ borderColor: "hsl(var(--border))" }}>
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider text-[9px]">
                        <th className="p-4">Criança / Contato</th>
                        <th className="p-4">Idade</th>
                        <th className="p-4">Queixa Principal / Motivo</th>
                        <th className="p-4">Período Preferido</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {leads.map((l) => (
                        <tr key={l.id} className="hover:bg-muted/5 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-foreground">{l.nomeCrianca || "Em preenchimento..."}</p>
                            <p className="text-[10px] text-muted-foreground font-mono flex items-center gap-1 mt-0.5">
                              <Smartphone className="h-3 w-3" /> {l.telefone}
                            </p>
                          </td>
                          <td className="p-4 font-semibold text-foreground">{l.idade || "—"}</td>
                          <td className="p-4">
                            <p className="text-muted-foreground max-w-xs truncate" title={l.queixa}>
                              {l.queixa || "Aguardando resposta do chatbot..."}
                            </p>
                          </td>
                          <td className="p-4 font-semibold text-purple-400">{l.periodo || "—"}</td>
                          <td className="p-4">
                            <select
                              value={l.status}
                              onChange={(e) => handleUpdateLeadStatus(l.id, e.target.value)}
                              className={cn(
                                "p-1 rounded-md font-bold text-[9px] uppercase border outline-none cursor-pointer",
                                l.status === "PENDENTE"
                                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                  : l.status === "EM_ATENDIMENTO"
                                  ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                                  : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              )}
                            >
                              <option value="PENDENTE">Aguardando Triagem</option>
                              <option value="EM_ATENDIMENTO">Em Atendimento</option>
                              <option value="FINALIZADO">Triagem Concluída</option>
                            </select>
                          </td>
                          <td className="p-4 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => startSimulator(l)}
                              className="px-2.5 py-1 rounded bg-purple-500 text-white font-bold hover:bg-purple-600 transition-colors text-[9px] uppercase border-0 cursor-pointer"
                              title="Simular interação de WhatsApp"
                            >
                              Simular Chatbot
                            </button>
                            <button
                              onClick={() => handleDeleteLead(l.id)}
                              className="p-1 hover:bg-red-500/10 text-red-500 rounded border-0 bg-transparent cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {leads.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-muted-foreground">Nenhum lead de triagem capturado ainda.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Chatbot Simulator Panel right */}
              <div className="lg:col-span-1">
                {simulatingLead ? (
                  <div className="border bg-card rounded-2xl p-4 flex flex-col justify-between h-[360px]" style={{ borderColor: "hsl(var(--border))" }}>
                    <div className="border-b pb-2 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-foreground">Simulador de WhatsApp</h4>
                        <p className="text-[9px] text-muted-foreground">{simulatingLead.telefone}</p>
                      </div>
                      <button
                        onClick={() => setSimulatingLead(null)}
                        className="p-1 hover:bg-muted rounded text-muted-foreground border-0 bg-transparent cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex-1 my-3 overflow-y-auto space-y-2 p-2 bg-muted/20 rounded-xl max-h-[220px]">
                      {simChatHistory.map((msg, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "p-2 rounded-xl max-w-[85%] text-[10px] leading-relaxed",
                            msg.sender === "bot"
                              ? "bg-purple-500/15 text-foreground mr-auto text-left"
                              : "bg-purple-500 text-white ml-auto text-right"
                          )}
                        >
                          {msg.text}
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSimSendMessage} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Digite a resposta do cliente..."
                        value={simText}
                        onChange={(e) => setSimText(e.target.value)}
                        className="flex-1 p-2 rounded-lg border text-[10px] bg-background text-foreground outline-none"
                      />
                      <button
                        type="submit"
                        className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 border-0 cursor-pointer"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="border border-dashed rounded-2xl p-8 text-center text-muted-foreground flex flex-col items-center justify-center h-[360px] gap-2">
                    <Smartphone className="h-8 w-8 text-purple-400 animate-pulse" />
                    <p className="font-bold text-xs">Simulador de Chatbot</p>
                    <p className="text-[10px] max-w-[180px] leading-relaxed">Clique no botão "Simular Chatbot" em qualquer lead para testar as perguntas interativas do robô.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 3: CONFIGURAR CHATBOT ───────────────────────────────────── */}
      {activeMainTab === "chatbot" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl border bg-card flex justify-between items-center" style={{ borderColor: "hsl(var(--border))" }}>
            <div className="flex items-start gap-3">
              <Bot className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-foreground">Gerenciar Fluxo de Triagem Automatizada</p>
                <p className="text-muted-foreground leading-relaxed">
                  Crie e reordene perguntas do robô. Cada resposta enviada pelos pais no primeiro contato preenche uma coluna específica do lead no CRM.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingStep(null);
                setStepOrdem(String(steps.length + 1));
                setStepPergunta("");
                setStepCampoChave("nomeCrianca");
                setIsStepModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl font-semibold text-white gradient-primary shadow-lg border-0 cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Novo Passo
            </button>
          </div>

          {stepsLoading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-purple-500 border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {steps.map((st) => (
                <div
                  key={st.id}
                  className="p-5 rounded-2xl border bg-card flex flex-col justify-between space-y-4"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-white bg-purple-500 px-2.5 py-0.5 rounded-full text-[9px] uppercase">
                        Passo {st.ordem}
                      </span>
                      <span className="text-[10px] font-bold text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded-md">
                        Salva em: {st.campoChave}
                      </span>
                    </div>
                    <p className="text-foreground leading-relaxed italic">
                      "{st.pergunta}"
                    </p>
                  </div>

                  <div className="flex gap-2 justify-end border-t pt-3">
                    <button
                      onClick={() => {
                        setEditingStep(st);
                        setStepOrdem(String(st.ordem));
                        setStepPergunta(st.pergunta);
                        setStepCampoChave(st.campoChave);
                        setIsStepModalOpen(true);
                      }}
                      className="p-1 hover:bg-purple-500/10 text-purple-400 rounded border-0 bg-transparent cursor-pointer"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteStep(st.id)}
                      className="p-1 hover:bg-red-500/10 text-red-500 rounded border-0 bg-transparent cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── MODAL DISPARAR ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden bg-card"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-foreground">Disparar Notificação Manual</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Envie e-mail ou WhatsApp para os responsáveis.</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-muted text-muted-foreground cursor-pointer border-0 bg-transparent"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSendMessage} className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Canal de Envio</label>
                    <select
                      value={canal}
                      onChange={(e) => setCanal(e.target.value)}
                      className="w-full p-2.5 rounded-xl border text-xs bg-card text-foreground outline-none cursor-pointer"
                    >
                      <option value="WHATSAPP">WhatsApp</option>
                      <option value="EMAIL">E-mail</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Destinatário</label>
                    <input
                      type="text"
                      required
                      placeholder={canal === "WHATSAPP" ? "DDD + Telefone" : "Email"}
                      value={destino}
                      onChange={(e) => setDestino(e.target.value)}
                      className="w-full p-2.5 rounded-xl border text-xs bg-background text-foreground outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Mensagem</label>
                  <textarea
                    required
                    placeholder="Escreva o corpo da mensagem..."
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    rows={4}
                    className="w-full p-2.5 rounded-xl border text-xs bg-background text-foreground outline-none resize-none leading-relaxed"
                  />
                </div>

                <div className="pt-4 border-t flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer bg-transparent"
                    style={{ borderColor: "hsl(var(--border))" }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer border-0"
                  >
                    Disparar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL STEP CONFIG (CHATBOT BUILDER) ─────────────────────────── */}
      <AnimatePresence>
        {isStepModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="absolute inset-0" onClick={() => setIsStepModalOpen(false)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden bg-card"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-foreground">
                    {editingStep ? "Editar Pergunta do Chatbot" : "Adicionar Passo de Triagem"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Defina a pergunta e a coluna de destino no CRM.</p>
                </div>
                <button
                  onClick={() => setIsStepModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-muted text-muted-foreground cursor-pointer border-0 bg-transparent"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateOrUpdateStep} className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Ordem da Pergunta</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={stepOrdem}
                      onChange={(e) => setStepOrdem(e.target.value)}
                      className="w-full p-2.5 rounded-xl border text-xs bg-background text-foreground outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Coluna de Destino (CRM)</label>
                    <select
                      value={stepCampoChave}
                      onChange={(e) => setStepCampoChave(e.target.value)}
                      className="w-full p-2.5 rounded-xl border text-xs bg-card text-foreground outline-none cursor-pointer"
                    >
                      <option value="nomeCrianca">Nome da Criança</option>
                      <option value="idade">Idade</option>
                      <option value="queixa">Queixa Principal</option>
                      <option value="periodo">Período Preferido</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Mensagem da Pergunta</label>
                  <textarea
                    required
                    placeholder="Escreva a pergunta lúdica do chatbot..."
                    value={stepPergunta}
                    onChange={(e) => setStepPergunta(e.target.value)}
                    rows={4}
                    className="w-full p-2.5 rounded-xl border text-xs bg-background text-foreground outline-none resize-none leading-relaxed"
                  />
                </div>

                <div className="pt-4 border-t flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsStepModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer bg-transparent"
                    style={{ borderColor: "hsl(var(--border))" }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer border-0"
                  >
                    Salvar Passo
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
