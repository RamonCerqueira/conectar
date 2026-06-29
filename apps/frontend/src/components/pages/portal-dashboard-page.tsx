"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Calendar,
  Clock,
  ClipboardList,
  DollarSign,
  BookOpen,
  FileText,
  LogOut,
  Sparkles,
  CheckCircle,
  HelpCircle,
  User,
  MessageSquare,
  AlertCircle,
  X,
  CreditCard,
  Copy,
  Check,
  Plus,
  Send,
  Loader2,
  Bell,
  Briefcase,
  AlertTriangle,
  QrCode,
  Camera,
} from "lucide-react";
import { cn, formatDate, calculateAge, formatCurrency } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function PortalDashboardPage() {
  const router = useRouter();
  
  // Dados de Sessão
  const [pacienteId, setPacienteId] = useState<string | null>(null);
  const [parentName, setParentName] = useState<string>("Mariana Mendes");
  
  // Estados de Dados da API
  const [pacienteData, setPacienteData] = useState<any>(null);
  const [agenda, setAgenda] = useState<any[]>([]);
  const [evolucoes, setEvolucoes] = useState<any[]>([]);
  const [financeiro, setFinanceiro] = useState<any[]>([]);
  const [exercicios, setExercicios] = useState<any[]>([]);
  const [arquivos, setArquivos] = useState<any[]>([]);

  // Estados de UI e Controle
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState("agenda");
  const [notifications, setNotifications] = useState<any[]>([
    { id: 1, text: "Bem-vindo ao Portal dos Pais do Instituto Conectar!", read: false },
    { id: 2, text: "Acompanhe as tarefas e atividades de casa prescritas para seu filho.", read: false }
  ]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  // Estados do Modal de Agendamento
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  const [profissionais, setProfissionais] = useState<any[]>([]);
  const [selectedProfId, setSelectedProfId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTipo, setSelectedTipo] = useState<"PRESENCIAL" | "ONLINE">("PRESENCIAL");
  const [observacoes, setObservacoes] = useState("");
  const [schedulingError, setSchedulingError] = useState<string | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);

  // Estados do Modal de Feedback do Exercício
  const [showExFeedbackModal, setShowExFeedbackModal] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<any>(null);
  const [exerciseComment, setExerciseComment] = useState("");
  const [isUpdatingEx, setIsUpdatingEx] = useState(false);

  // Estados do Modal de PIX
  const [showPixModal, setShowPixModal] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<any>(null);
  const [pixCopied, setPixCopied] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // Estados do Scanner QR Code
  const [showQrScanModal, setShowQrScanModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  // WhatsApp de Suporte da Clínica (Mock)
  const clinicaWhatsNumber = "5511999999999";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("parentName");
      const storedPacienteId = localStorage.getItem("pacienteId");
      
      if (storedName) setParentName(storedName);
      
      if (storedPacienteId) {
        setPacienteId(storedPacienteId);
        loadPortalData(storedPacienteId);
      } else {
        toast.error("Sessão inválida. Por favor, faça login novamente.");
        router.push("/portal/login");
      }
    }
  }, []);

  const loadPortalData = async (pId: string) => {
    try {
      setLoading(true);
      const [pacRes, agendaRes, prontRes, finRes, exRes, arqRes] = await Promise.all([
        api.get(`/pacientes/${pId}`).catch(() => ({ data: null })),
        api.get(`/pacientes/${pId}/agendamentos`).catch(() => ({ data: [] })),
        api.get(`/prontuarios/paciente/${pId}`).catch(() => ({ data: [] })),
        api.get(`/pacientes/${pId}/financeiro`).catch(() => ({ data: [] })),
        api.get(`/exercicios/paciente/${pId}`).catch(() => ({ data: [] })),
        api.get(`/arquivos/paciente/${pId}`).catch(() => ({ data: [] })),
      ]);

      setPacienteData(pacRes.data);
      
      // Ordenar consultas por data
      const sortedAgenda = (agendaRes.data || []).sort(
        (a: any, b: any) => new Date(a.data).getTime() - new Date(b.data).getTime()
      );
      setAgenda(sortedAgenda);
      
      setEvolucoes(prontRes.data || []);
      setFinanceiro(finRes.data || []);
      
      // Ordenar exercícios (não realizados primeiro)
      const sortedEx = (exRes.data || []).sort((a: any, b: any) => {
        if (a.realizado === b.realizado) return 0;
        return a.realizado ? 1 : -1;
      });
      setExercicios(sortedEx);
      setArquivos(arqRes.data || []);

      // Atualizar notificações dinâmicas
      const pendentesFin = (finRes.data || []).filter((f: any) => f.status !== "PAGO").length;
      const pendentesEx = (exRes.data || []).filter((e: any) => !e.realizado).length;
      
      const newNotifs = [
        { id: 1, text: "Bem-vindo ao Portal dos Pais do Instituto Conectar!", read: false },
      ];
      
      if (pendentesFin > 0) {
        newNotifs.push({
          id: 2,
          text: `Você possui ${pendentesFin} pendência(s) financeira(s) pendente de pagamento.`,
          read: false,
        });
      }
      if (pendentesEx > 0) {
        newNotifs.push({
          id: 3,
          text: `Seu filho possui ${pendentesEx} tarefa(s) para fazer em casa.`,
          read: false,
        });
      }
      setNotifications(newNotifs);

    } catch (error) {
      console.error("Erro carregando dados do portal dos pais:", error);
      toast.error("Ocorreu um erro ao atualizar os dados do portal.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("parentName");
    localStorage.removeItem("pacienteId");
    router.push("/portal/login");
  };

  // WhatsApp Action
  const handleSpeakWithClinic = (message = "Olá, preciso falar com a recepção do Instituto Conectar.") => {
    const fullMsg = `${message} (Responsável: ${parentName}, Paciente: ${pacienteData?.nome || "Lucas"})`;
    window.open(`https://wa.me/${clinicaWhatsNumber}?text=${encodeURIComponent(fullMsg)}`, "_blank");
  };

  // Verificar se há consulta futura ativa
  const getFutureAppointment = () => {
    return agenda.find(
      (ag) =>
        ag.status !== "CANCELADO" &&
        ag.status !== "FALTOU" &&
        new Date(ag.data) > new Date()
    );
  };

  const handleOpenScheduling = async () => {
    setShowSchedulingModal(true);
    setSchedulingError(null);
    setSelectedProfId("");
    setSelectedDate("");
    setSelectedTime("");
    setSelectedTipo("PRESENCIAL");
    setObservacoes("");
    
    try {
      const res = await api.get("/profissionais");
      setProfissionais(res.data || []);
    } catch (err) {
      console.error("Erro ao buscar profissionais:", err);
      toast.error("Não foi possível carregar a lista de profissionais.");
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSchedulingError(null);

    if (!selectedProfId || !selectedDate || !selectedTime) {
      setSchedulingError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const proposedDateTime = new Date(`${selectedDate}T${selectedTime}:00`);

    // Validação da Regra de Negócio: Se já houver consulta futura, não deixar agendar em data anterior
    const futureAppt = getFutureAppointment();
    if (futureAppt) {
      const futureDate = new Date(futureAppt.data);
      if (proposedDateTime < futureDate) {
        setSchedulingError(
          `Restrição de Agendamento: Seu filho possui uma consulta de retorno futura agendada para o dia ${formatDate(
            futureDate
          )} às ${futureDate.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}. Não é permitido agendar uma consulta em data anterior. Caso precise reagendar ou cancelar, solicite a desmarcação da consulta futura ao corpo administrativo.`
        );
        return;
      }
    }

    try {
      setIsScheduling(true);
      // Duração padrão: 1 hora
      const dataFimDate = new Date(proposedDateTime.getTime() + 60 * 60 * 1000);
      
      const payload = {
        pacienteId,
        profissionalId: selectedProfId,
        data: proposedDateTime.toISOString(),
        dataFim: dataFimDate.toISOString(),
        tipo: selectedTipo,
        observacoes,
      };

      await api.post("/agenda", payload);
      toast.success("Consulta agendada com sucesso!");
      setShowSchedulingModal(false);
      if (pacienteId) loadPortalData(pacienteId);
    } catch (err: any) {
      console.error("Erro ao agendar consulta:", err);
      setSchedulingError(
        err.response?.data?.message ||
          "Erro ao realizar o agendamento. Verifique se o profissional possui disponibilidade no horário."
      );
    } finally {
      setIsScheduling(false);
    }
  };

  // Ações de Exercício
  const handleToggleExercise = async (ex: any) => {
    if (ex.realizado) {
      // Desmarcar diretamente
      try {
        await api.put(`/exercicios/${ex.id}`, { realizado: false, observacaoResponsavel: null });
        toast.success("Atividade marcada como pendente.");
        if (pacienteId) loadPortalData(pacienteId);
      } catch (err) {
        console.error("Erro ao desmarcar exercício:", err);
        toast.error("Erro ao atualizar status do exercício.");
      }
    } else {
      // Abrir modal de feedback para inserir comentário
      setCurrentExercise(ex);
      setExerciseComment("");
      setShowExFeedbackModal(true);
    }
  };

  const handleSaveExerciseFeedback = async () => {
    if (!currentExercise) return;
    try {
      setIsUpdatingEx(true);
      await api.put(`/exercicios/${currentExercise.id}`, {
        realizado: true,
        observacaoResponsavel: exerciseComment.trim() || null,
      });
      toast.success("Atividade marcada como realizada!");
      setShowExFeedbackModal(false);
      setCurrentExercise(null);
      if (pacienteId) loadPortalData(pacienteId);
    } catch (err) {
      console.error("Erro ao salvar feedback do exercício:", err);
      toast.error("Erro ao concluir o exercício.");
    } finally {
      setIsUpdatingEx(false);
    }
  };

  // Ações de PIX
  const handleOpenPix = (invoice: any) => {
    setCurrentInvoice(invoice);
    setPixCopied(false);
    setShowPixModal(true);
  };

  const handleCopyPix = () => {
    if (!currentInvoice) return;
    const valueStr = Number(currentInvoice.valor).toFixed(2);
    const mockPixKey = `00020101021226880014br.gov.bcb.pix2566pix.conectar-clinica.com.br/qr/v2/c9a44b7a-ef80-4b2a-8ef0-038c115fdca25204000053039865407${valueStr}5802BR5918Instituto Conectar6009Sao Paulo62070503***6304d9c7`;
    navigator.clipboard.writeText(mockPixKey);
    setPixCopied(true);
    toast.success("PIX Copia e Cola copiado!");
  };

  const handleQrScan = async () => {
    if (!pacienteId) return;
    setIsScanning(true);
    setScanSuccess(false);
    
    // Simulate 2.5 seconds camera focus and scanning
    setTimeout(async () => {
      try {
        const res = await api.post("/agenda/checkin-qrcode", {
          pacienteId: pacienteId,
          token: "totem-checkin-hoje"
        });
        
        setIsScanning(false);
        setScanSuccess(true);
        toast.success("Presença confirmada! Seu check-in foi registrado na recepção.");
        
        // Reload today's appointments status locally
        setAgenda((prev) =>
          prev.map((ag) => {
            const isToday = new Date(ag.data).toDateString() === new Date().toDateString();
            if (isToday && (ag.status === "AGENDADO" || ag.status === "CONFIRMADO")) {
              return { ...ag, status: "PRESENTE" };
            }
            return ag;
          })
        );
        
        // Play success visual confirmation for 1.5 seconds then close
        setTimeout(() => {
          setShowQrScanModal(false);
          setScanSuccess(false);
        }, 1500);
        
      } catch (err: any) {
        setIsScanning(false);
        const errMsg = err.response?.data?.message || "Nenhum agendamento ativo encontrado para hoje. Fale com a recepção.";
        toast.error(errMsg);
      }
    }, 2500);
  };

  const handleSimulatePayment = async () => {
    if (!currentInvoice) return;
    try {
      setIsPaying(true);
      await api.put(`/financeiro/${currentInvoice.id}`, {
        status: "PAGO",
        pagamento: new Date().toISOString(),
      });
      toast.success("Pagamento confirmado com sucesso!");
      setShowPixModal(false);
      setCurrentInvoice(null);
      if (pacienteId) loadPortalData(pacienteId);
    } catch (err) {
      console.error("Erro ao liquidar pagamento:", err);
      toast.error("Não foi possível registrar o pagamento.");
    } finally {
      setIsPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background-soft">
        <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
        <p className="mt-4 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Carregando Portal dos Pais...
        </p>
      </div>
    );
  }

  const idade = pacienteData?.dataNascimento ? calculateAge(pacienteData.dataNascimento) : 0;
  const diagnosticosList = pacienteData?.diagnosticos?.map((d: any) => d.descricao || d.cid) || [];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background-soft text-xs">
      
      {/* ─── HEADER PRINCIPAL ─── */}
      <header className="h-16 flex items-center justify-between px-6 border-b shrink-0 bg-card" style={{ borderColor: "hsl(var(--border))" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Portal dos Pais</p>
            <p className="text-sm font-bold text-foreground">Instituto Conectar</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          
          {/* Sino de Notificações */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="p-2 rounded-lg hover:bg-muted/70 text-muted-foreground relative cursor-pointer"
            >
              <Bell className="h-4 w-4" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
              )}
            </button>
            
            <AnimatePresence>
              {showNotifDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifDropdown(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-72 rounded-xl border bg-card shadow-lg p-4 z-50 text-left space-y-3"
                    style={{ borderColor: "hsl(var(--border))" }}
                  >
                    <p className="font-bold text-foreground text-xs uppercase tracking-wider">Avisos e Notificações</p>
                    <div className="h-[1px] bg-border" />
                    <div className="space-y-2">
                      {notifications.map((notif) => (
                        <div key={notif.id} className="p-2 rounded-lg bg-muted/40 text-[11px] leading-relaxed text-muted-foreground">
                          {notif.text}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => {
              setShowQrScanModal(true);
            }}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-purple-500/20 text-purple-600 bg-purple-500/5 hover:bg-purple-500/10 transition-all font-semibold cursor-pointer"
          >
            <QrCode className="h-4 w-4 text-purple-500" />
            <span>Check-in QR Code</span>
          </button>

          <button
            onClick={() => handleSpeakWithClinic()}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-emerald-500/20 text-emerald-600 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all font-semibold cursor-pointer"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Falar c/ Recepção</span>
          </button>

          <span className="text-muted-foreground">
            Responsável: <strong>{parentName}</strong>
          </span>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 py-1.5 px-3 rounded-lg border text-red-500 hover:bg-red-500/10 hover:border-red-500 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </button>
        </div>
      </header>

      {/* ─── LAYOUT CENTRAL ─── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Sidebar Lateral */}
        <aside className="w-full md:w-64 border-r shrink-0 flex flex-col p-5 space-y-3 bg-card" style={{ borderColor: "hsl(var(--border))" }}>
          
          {/* Card da Criança */}
          <div className="p-4 bg-purple-500/5 rounded-2xl border border-purple-500/10 space-y-2 mb-2">
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Paciente Acompanhado:</p>
            <h3 className="font-bold text-sm text-purple-600 leading-none">{pacienteData?.nome}</h3>
            <p className="text-[10px] text-muted-foreground">
              Idade: {idade} anos
            </p>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {diagnosticosList.map((diag: string, i: number) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 font-semibold text-[9px] uppercase tracking-wider">
                  {diag}
                </span>
              ))}
              {diagnosticosList.length === 0 && (
                <span className="text-[9px] text-muted-foreground italic">Sem diagnósticos cadastrados</span>
              )}
            </div>
          </div>

          {/* Menus/Tabs */}
          {[
            { id: "agenda", label: "Agenda & Consultas", icon: Calendar },
            { id: "evolucoes", label: "Evoluções do Filho", icon: ClipboardList },
            { id: "tarefas", label: "Tarefas para Casa", icon: BookOpen },
            { id: "docs", label: "Documentos e Laudos", icon: FileText },
            { id: "financeiro", label: "Histórico Financeiro", icon: DollarSign },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold uppercase tracking-wider transition-all text-left cursor-pointer",
                activeTab === tab.id
                  ? "gradient-primary text-white shadow-md shadow-purple-500/15"
                  : "bg-muted/50 hover:bg-muted text-muted-foreground"
              )}
            >
              <tab.icon className="h-4 w-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* Área de Conteúdo */}
        <main className="flex-1 overflow-y-auto p-6 bg-background-soft space-y-6">
          <AnimatePresence mode="wait">
            
            {/* TAB: AGENDA & CONSULTAS */}
            {activeTab === "agenda" && (
              <motion.div
                key="agenda"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-foreground">Consultas Agendadas</h2>
                    <p className="text-[10px] text-muted-foreground">Monitore as sessões e agende novos retornos clínicos.</p>
                  </div>
                  <button
                    onClick={handleOpenScheduling}
                    className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold text-white gradient-primary shadow-lg shadow-purple-500/15 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Agendar Nova Consulta</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {agenda.map((ag) => {
                    const isFuture = new Date(ag.data) > new Date();
                    return (
                      <div
                        key={ag.id}
                        className="p-5 rounded-2xl border bg-card space-y-4 shadow-sm"
                        style={{ borderColor: "hsl(var(--border))" }}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[9px] font-bold bg-purple-500/10 text-purple-600 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                              {ag.profissional?.especialidade || "Terapeuta"}
                            </span>
                            <h3 className="font-bold text-sm text-foreground mt-2">
                              {ag.profissional?.usuario?.nome || "Profissional"}
                            </h3>
                          </div>
                          <span
                            className={cn(
                              "text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider",
                              ag.status === "PRESENTE" && "bg-emerald-500/10 text-emerald-500",
                              ag.status === "CONFIRMADO" && "bg-blue-500/10 text-blue-500",
                              ag.status === "AGENDADO" && "bg-purple-500/10 text-purple-600",
                              ag.status === "CANCELADO" && "bg-red-500/10 text-red-500",
                              ag.status === "FALTOU" && "bg-amber-500/10 text-amber-500"
                            )}
                          >
                            {ag.status}
                          </span>
                        </div>

                        <div className="h-[1px] bg-border" />

                        <div className="space-y-2 text-muted-foreground font-medium">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-purple-500" />
                            <span className="text-foreground">{formatDate(ag.data)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-purple-500" />
                            <span className="text-foreground">
                              {new Date(ag.data).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}h até {new Date(ag.dataFim).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}h
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-purple-500" />
                            <span className="text-foreground">{ag.tipo} {ag.sala ? `— ${ag.sala.nome}` : ""}</span>
                          </div>
                        </div>

                        {/* Botão de Cancelamento Administrativo */}
                        {isFuture && ag.status !== "CANCELADO" && (
                          <div className="pt-2">
                            <button
                              onClick={() =>
                                handleSpeakWithClinic(
                                  `Solicitação de Cancelamento/Remarcação: Olá, preciso reagendar ou desmarcar a consulta com o(a) terapeuta ${ag.profissional?.usuario?.nome} marcada para o dia ${formatDate(
                                    ag.data
                                  )}.`
                                )
                              }
                              className="w-full py-1.5 border border-red-500/20 text-red-500 bg-red-500/5 hover:bg-red-500/10 text-center rounded-lg font-bold transition-all cursor-pointer"
                            >
                              Solicitar Cancelamento (Administração)
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {agenda.length === 0 && (
                    <div className="col-span-full p-8 border border-dashed rounded-2xl bg-card text-center text-muted-foreground">
                      Nenhuma consulta agendada cadastrada no sistema.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB: EVOLUÇÕES DO FILHO */}
            {activeTab === "evolucoes" && (
              <motion.div
                key="evolucoes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="text-base font-bold text-foreground">Relatos e Evoluções Terapêuticas</h2>
                  <p className="text-[10px] text-muted-foreground">Orientações de casa e acompanhamento clínico publicados pelos médicos e terapeutas.</p>
                </div>

                <div className="relative pl-6 border-l border-purple-500/20 space-y-6">
                  {evolucoes.map((ev) => (
                    <div key={ev.id} className="relative p-5 rounded-2xl border bg-card space-y-3 shadow-sm">
                      <div className="absolute -left-[29px] top-6 w-2.5 h-2.5 rounded-full bg-purple-500 border border-card" />
                      <div className="flex justify-between items-center text-[10px] border-b pb-2">
                        <span className="font-bold text-purple-600">
                          {ev.profissional?.usuario?.nome || "Terapeuta"} • {ev.profissional?.especialidade}
                        </span>
                        <span className="text-muted-foreground font-semibold">{formatDate(ev.data)}</span>
                      </div>
                      
                      <div className="space-y-2">
                        {ev.atividadesRealizadas && (
                          <div>
                            <p className="font-bold text-foreground">Atividades Realizadas na Sessão:</p>
                            <p className="text-muted-foreground text-[11px] leading-relaxed mt-0.5">{ev.atividadesRealizadas}</p>
                          </div>
                        )}
                        {ev.orientacoesPais && (
                          <div className="p-3 bg-purple-500/5 rounded-xl border border-purple-500/10">
                            <p className="font-bold text-purple-700 flex items-center gap-1">
                              <Sparkles className="h-3.5 w-3.5" />
                              <span>Orientações aos Pais:</span>
                            </p>
                            <p className="text-purple-900 text-[11px] leading-relaxed italic mt-1 font-medium">
                              "{ev.orientacoesPais}"
                            </p>
                          </div>
                        )}
                        {!ev.atividadesRealizadas && !ev.orientacoesPais && (
                          <p className="text-muted-foreground italic text-[11px]">Sessão de acompanhamento registrada.</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {evolucoes.length === 0 && (
                    <div className="p-8 border border-dashed rounded-2xl bg-card text-center text-muted-foreground">
                      Nenhuma evolução ou orientação registrada para esta criança até o momento.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB: TAREFAS PARA CASA */}
            {activeTab === "tarefas" && (
              <motion.div
                key="tarefas"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="text-base font-bold text-foreground">Exercícios e Atividades Domiciliares</h2>
                  <p className="text-[10px] text-muted-foreground">Estimule o desenvolvimento do seu filho em casa e compartilhe o progresso com o médico.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exercicios.map((ex) => (
                    <div
                      key={ex.id}
                      className="p-5 rounded-2xl border bg-card flex flex-col justify-between shadow-sm space-y-4"
                      style={{ borderColor: "hsl(var(--border))" }}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded uppercase tracking-wider">
                            Tipo: {ex.tipo}
                          </span>
                          <span
                            className={cn(
                              "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                              ex.realizado ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                            )}
                          >
                            {ex.realizado ? "Realizado" : "Pendente"}
                          </span>
                        </div>
                        <h4 className="font-bold text-foreground text-sm">{ex.titulo}</h4>
                        {ex.descricao && (
                          <p className="text-muted-foreground text-[11px] leading-relaxed font-medium">
                            {ex.descricao}
                          </p>
                        )}
                        {ex.observacaoResponsavel && (
                          <div className="p-2.5 bg-muted/40 rounded-xl mt-2 font-medium">
                            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Comentário enviado por você:</p>
                            <p className="text-muted-foreground italic text-[11px] mt-0.5">"{ex.observacaoResponsavel}"</p>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t flex justify-end">
                        <label className="flex items-center gap-2 cursor-pointer font-bold text-foreground hover:text-purple-600 transition-colors">
                          <input
                            type="checkbox"
                            checked={!!ex.realizado}
                            onChange={() => handleToggleExercise(ex)}
                            className="rounded border-border text-purple-500 focus:ring-purple-500 h-4.5 w-4.5 cursor-pointer"
                          />
                          <span>{ex.realizado ? "Marcar como Pendente" : "Marcar como Concluído"}</span>
                        </label>
                      </div>
                    </div>
                  ))}

                  {exercicios.length === 0 && (
                    <div className="col-span-full p-8 border border-dashed rounded-2xl bg-card text-center text-muted-foreground">
                      Não há exercícios ou atividades domiciliárias passadas para fazer em casa.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB: DOCUMENTOS E LAUDOS */}
            {activeTab === "docs" && (
              <motion.div
                key="docs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="text-base font-bold text-foreground">Declarações, Laudos e Documentos</h2>
                  <p className="text-[10px] text-muted-foreground">Acesse relatórios clínicos e guias emitidas de forma oficial.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {arquivos.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-xl border bg-card flex items-center justify-between shadow-sm"
                      style={{ borderColor: "hsl(var(--border))" }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-500">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{doc.nomeOriginal || doc.nome}</p>
                          <p className="text-[9px] text-muted-foreground mt-0.5">
                            Data: {formatDate(doc.criadoEm)} • {(doc.tamanho / 1024).toFixed(0)} KB
                          </p>
                        </div>
                      </div>

                      <a
                        href={doc.caminho ? `${api.defaults.baseURL}/storage/${doc.caminho}` : "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="py-1 px-3 border rounded text-[10px] font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
                        style={{ borderColor: "hsl(var(--border))" }}
                      >
                        Visualizar
                      </a>
                    </div>
                  ))}

                  {arquivos.length === 0 && (
                    <div className="col-span-full p-8 border border-dashed rounded-2xl bg-card text-center text-muted-foreground">
                      Não há laudos ou arquivos anexados a este paciente.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB: HISTÓRICO FINANCEIRO */}
            {activeTab === "financeiro" && (
              <motion.div
                key="financeiro"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="text-base font-bold text-foreground">Histórico de Cobranças e Mensalidades</h2>
                  <p className="text-[10px] text-muted-foreground">Confira mensalidades clínicas e realize pagamentos online.</p>
                </div>

                <div className="overflow-hidden border rounded-2xl bg-card shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="bg-muted/40 border-b text-muted-foreground font-bold uppercase tracking-wider text-[9px]">
                          <th className="p-3.5">Descrição</th>
                          <th className="p-3.5">Vencimento</th>
                          <th className="p-3.5">Valor</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {financeiro.map((lanc) => (
                          <tr key={lanc.id} className="hover:bg-muted/10 transition-colors">
                            <td className="p-3.5 font-bold text-foreground">{lanc.descricao}</td>
                            <td className="p-3.5 text-muted-foreground font-semibold">
                              {lanc.vencimento ? formatDate(lanc.vencimento) : "N/D"}
                            </td>
                            <td className="p-3.5 font-extrabold text-foreground">
                              {formatCurrency(Number(lanc.valor))}
                            </td>
                            <td className="p-3.5">
                              <span
                                className={cn(
                                  "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider",
                                  lanc.status === "PAGO" && "bg-emerald-500/10 text-emerald-500",
                                  lanc.status === "PENDENTE" && "bg-amber-500/10 text-amber-500",
                                  lanc.status === "ATRASADO" && "bg-red-500/10 text-red-500"
                                )}
                              >
                                {lanc.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              {lanc.status !== "PAGO" ? (
                                <button
                                  onClick={() => handleOpenPix(lanc)}
                                  className="py-1 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-all cursor-pointer text-[10px]"
                                >
                                  Pagar com PIX
                                </button>
                              ) : (
                                <span className="text-[10px] text-muted-foreground font-bold flex items-center justify-end gap-1 text-emerald-600">
                                  <CheckCircle className="h-3.5 w-3.5" /> Pago em {formatDate(lanc.pagamento)}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}

                        {financeiro.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-muted-foreground border-dashed">
                              Nenhuma cobrança registrada para o paciente.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* ─── MODAL: AGENDAR CONSULTA ─── */}
      <AnimatePresence>
        {showSchedulingModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card rounded-2xl shadow-xl w-full max-w-md p-6 relative border"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <button
                onClick={() => setShowSchedulingModal(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                <Calendar className="h-4 w-4 text-purple-600" />
                <span>Agendar Nova Consulta / Retorno</span>
              </h3>
              <p className="text-[10px] text-muted-foreground mt-1">Marque uma consulta com um profissional clínico habilitado.</p>

              <form onSubmit={handleScheduleSubmit} className="space-y-4 mt-4">
                {schedulingError && (
                  <div className="p-3 bg-red-500/10 text-red-500 rounded-xl flex items-start gap-2 font-semibold">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span className="leading-relaxed text-[10px]">{schedulingError}</span>
                  </div>
                )}

                {/* Profissional */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Médico / Terapeuta *</label>
                  <select
                    required
                    value={selectedProfId}
                    onChange={(e) => setSelectedProfId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none bg-muted/20 focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="">Selecione o Profissional...</option>
                    {profissionais.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.usuario?.nome} ({p.especialidade || "Especialista"})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Data e Hora */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Data Desejada *</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border text-xs outline-none bg-muted/20 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Horário *</label>
                    <select
                      required
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border text-xs outline-none bg-muted/20 focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="">Horário...</option>
                      {["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map((t) => (
                        <option key={t} value={t}>
                          {t}h
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tipo de Atendimento */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tipo de Atendimento</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                      <input
                        type="radio"
                        name="tipo"
                        checked={selectedTipo === "PRESENCIAL"}
                        onChange={() => setSelectedTipo("PRESENCIAL")}
                        className="text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                      <span>Presencial</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                      <input
                        type="radio"
                        name="tipo"
                        checked={selectedTipo === "ONLINE"}
                        onChange={() => setSelectedTipo("ONLINE")}
                        className="text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                      <span>Online (Vídeo)</span>
                    </label>
                  </div>
                </div>

                {/* Observações */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Observações/Motivo (Opcional)</label>
                  <textarea
                    rows={3}
                    placeholder="Alguma queixa ou detalhe importante sobre o agendamento de retorno..."
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none bg-muted/20 focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl text-[10px] text-purple-700 font-semibold flex gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-purple-500 mt-0.5" />
                  <span>
                    Atenção: Conforme políticas clínicas, reagendamentos ou cancelamentos subsequentes devem ser efetuados via central administrativa.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isScheduling}
                  className="w-full py-3 rounded-xl font-bold text-white gradient-primary shadow-lg shadow-purple-500/15 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55"
                >
                  {isScheduling ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span>Confirmar Agendamento</span>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL: FEEDBACK DE EXERCÍCIO ─── */}
      <AnimatePresence>
        {showExFeedbackModal && currentExercise && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card rounded-2xl shadow-xl w-full max-w-md p-6 relative border"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <button
                onClick={() => {
                  setShowExFeedbackModal(false);
                  setCurrentExercise(null);
                }}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>Atividade Domiciliar Concluída</span>
              </h3>
              <p className="text-[10px] text-muted-foreground mt-1">Compartilhe como foi a execução do exercício com o terapeuta.</p>

              <div className="mt-4 space-y-4">
                <div className="p-3 bg-muted/40 rounded-xl font-medium">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Exercício:</p>
                  <p className="text-foreground font-bold text-xs mt-0.5">{currentExercise.titulo}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Comentários e Observações dos Pais *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Como foi o desempenho do seu filho? Teve alguma dificuldade ou facilidade marcante? Escreva para ajudar na avaliação do médico..."
                    value={exerciseComment}
                    onChange={(e) => setExerciseComment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none bg-muted/20 focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>

                <button
                  onClick={handleSaveExerciseFeedback}
                  disabled={isUpdatingEx || !exerciseComment.trim()}
                  className="w-full py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55"
                >
                  {isUpdatingEx ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span>Salvar e Marcar como Concluído</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL: PAGAMENTO PIX ─── */}
      <AnimatePresence>
        {showPixModal && currentInvoice && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card rounded-2xl shadow-xl w-full max-w-md p-6 relative border"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <button
                onClick={() => {
                  setShowPixModal(false);
                  setCurrentInvoice(null);
                }}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                <CreditCard className="h-4 w-4 text-purple-600" />
                <span>Pagamento via PIX</span>
              </h3>
              <p className="text-[10px] text-muted-foreground mt-1">Efetue o pagamento lendo o QR Code ou utilizando o Copia e Cola.</p>

              <div className="mt-4 space-y-4 text-center">
                
                {/* Visual do QR Code e Infos */}
                <div className="p-5 border border-dashed rounded-2xl bg-muted/30 inline-block mx-auto">
                  {/* Canvas Simulado do QR Code */}
                  <div className="w-40 h-40 bg-white border p-2 flex flex-col justify-center items-center relative mx-auto rounded-lg">
                    {/* Linhas simulando QR Code */}
                    <div className="grid grid-cols-5 gap-1.5 w-full h-full opacity-80">
                      {[...Array(25)].map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "rounded-xs",
                            (i % 2 === 0 || i % 3 === 0 || i === 0 || i === 4 || i === 20 || i === 24)
                              ? "bg-purple-900"
                              : "bg-transparent"
                          )}
                        />
                      ))}
                    </div>
                    {/* Logozinho Conectar no Centro */}
                    <div className="absolute inset-0 m-auto w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center border border-white text-white font-bold text-[9px]">
                      PIX
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-1">
                    <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">{currentInvoice.descricao}</p>
                    <p className="text-lg font-extrabold text-foreground">{formatCurrency(Number(currentInvoice.valor))}</p>
                  </div>
                </div>

                {/* Copia e Cola */}
                <div className="text-left space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">PIX Copia e Cola</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`00020101021226880014br.gov.bcb.pix2566pix.conectar-clinica.com.br/qr/v2/c9a44b7a-ef80-4b2a-8ef0-038c115fdca25204000053039865407${Number(currentInvoice.valor).toFixed(2)}5802BR5918...`}
                      className="w-full px-3 py-2 border rounded-xl bg-muted/40 text-[10px] outline-none text-muted-foreground truncate"
                    />
                    <button
                      onClick={handleCopyPix}
                      className="p-2.5 rounded-xl border hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer flex items-center justify-center shrink-0"
                    >
                      {pixCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirmar pagamento simulado */}
                <button
                  onClick={handleSimulatePayment}
                  disabled={isPaying}
                  className="w-full py-3 rounded-xl font-bold text-white gradient-primary shadow-lg shadow-purple-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isPaying ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span>Confirmar Pagamento Simulado (Teste)</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Simulador de Leitura de QR Code */}
      <AnimatePresence>
        {showQrScanModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm shadow-2xl"
              onClick={() => {
                if (!isScanning) setShowQrScanModal(false);
              }}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card rounded-2xl shadow-xl w-full max-w-sm p-6 relative border text-center space-y-5"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              {!isScanning && !scanSuccess && (
                <button
                  onClick={() => setShowQrScanModal(false)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer border-0 bg-transparent"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              <div className="mx-auto w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600">
                <Camera className="h-5 w-5" />
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Check-in Presencial QR Code
                </h3>
                <p className="text-[10px] text-muted-foreground max-w-xs mx-auto">
                  Aponte a câmera para o QR Code do Totem de Check-in na recepção da clínica para confirmar sua presença.
                </p>
              </div>

              {/* Viewfinder da Câmera */}
              <div className="relative mx-auto w-52 h-52 bg-slate-950 rounded-2xl overflow-hidden border border-purple-500/30 flex items-center justify-center">
                
                {/* Linhas de Canto do Viewfinder */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-purple-500 rounded-tl-xs" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-purple-500 rounded-tr-xs" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-purple-500 rounded-bl-xs" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-purple-500 rounded-br-xs" />

                {isScanning && (
                  <>
                    {/* Laser Scanner */}
                    <motion.div
                      animate={{ y: [-80, 80, -80] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute left-4 right-4 h-0.5 bg-emerald-500 z-10 shadow-[0_0_8px_#10b981]"
                    />
                    
                    {/* Animated scanning blur overlay */}
                    <div className="absolute inset-0 bg-purple-500/5 animate-pulse" />
                    
                    {/* Mock Blurred QR Code representing focus */}
                    <div className="w-24 h-24 border border-dashed border-purple-500/20 opacity-30 flex flex-wrap p-1 gap-1 blur-xs">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-6 h-6 bg-purple-200 rounded-xs" />
                      ))}
                    </div>

                    <p className="absolute bottom-6 text-[9px] text-purple-400 font-bold uppercase tracking-wider animate-pulse">
                      Buscando QR Code...
                    </p>
                  </>
                )}

                {scanSuccess && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center justify-center space-y-2 text-emerald-400"
                  >
                    <CheckCircle className="h-12 w-12 text-emerald-500 animate-bounce" />
                    <p className="text-[10px] font-bold uppercase tracking-wider">QR Code Lido!</p>
                  </motion.div>
                )}

                {!isScanning && !scanSuccess && (
                  <div className="flex flex-col items-center text-muted-foreground space-y-2 p-4">
                    <QrCode className="h-8 w-8 opacity-45" />
                    <p className="text-[9px]">Câmera Pronta</p>
                  </div>
                )}
              </div>

              {!isScanning && !scanSuccess && (
                <button
                  onClick={handleQrScan}
                  className="w-full py-2.5 rounded-xl font-bold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
                >
                  Iniciar Escaneamento
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
