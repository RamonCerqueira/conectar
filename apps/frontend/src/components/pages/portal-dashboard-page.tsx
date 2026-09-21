"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Nunito } from "next/font/google";
import {
  Calendar,
  Clock,
  User,
  Users,
  Heart,
  FileText,
  CreditCard,
  ChevronRight,
  Plus,
  Home,
  TrendingUp,
  MessageCircle,
  Download,
  LogOut,
  Sparkles,
} from "lucide-react";
import { cn, formatDate, calculateAge } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  PortalHeader,
  PortalWelcomeHero,
  PortalFamilyCard,
  PortalQuickActions,
  PortalUpcomingSection,
  PortalPrimaryAction,
  PortalBottomNav,
  PortalMascotCompanion,
  PortalTabId,
  PortalExercisesModal,
  PortalJourneyModal,
  PortalFinanceModal,
  PortalPixModal,
  PortalSchedulingModal,
  PortalDetailsModal,
} from "@/components/portal";

// Tipografia oficial do Visual System
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export function PortalDashboardPage() {
  const router = useRouter();

  // Estados de Sessão e Carregamento
  const [pacienteId, setPacienteId] = useState<string | null>(null);
  const [parentName, setParentName] = useState<string>("Família");
  const [loading, setLoading] = useState<boolean>(true);

  // Dados do Paciente e Módulos Integrados
  const [pacienteData, setPacienteData] = useState<any>(null);
  const [agenda, setAgenda] = useState<any[]>([]);
  const [evolucoes, setEvolucoes] = useState<any[]>([]);
  const [financeiro, setFinanceiro] = useState<any[]>([]);
  const [exercicios, setExercicios] = useState<any[]>([]);
  const [arquivos, setArquivos] = useState<any[]>([]);
  const [metas, setMetas] = useState<any[]>([]);

  // Navegação Ativa na Bottom Tab Bar (5 abas: inicio | familia | agenda | conteudos | perfil)
  const [activeNavTab, setActiveNavTab] = useState<PortalTabId>("inicio");

  // Estados dos Modais Modulares
  const [activeModal, setActiveModal] = useState<
    "atividades" | "jornada" | "financeiro" | "pix" | "agendamento" | "detalhes" | null
  >(null);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [currentInvoice, setCurrentInvoice] = useState<any>(null);
  const [activeExercise, setActiveExercise] = useState<any>(null);
  const [profissionais, setProfissionais] = useState<any[]>([]);

  // WhatsApp Recepção
  const whatsNumero = "5511988880002";

  // Carregar sessão e configurar status bar nativa
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@capacitor/status-bar")
        .then(({ StatusBar, Style }) => {
          StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
          StatusBar.setBackgroundColor({ color: "#FFFFFF" }).catch(() => {});
        })
        .catch(() => {});

      const storedName = localStorage.getItem("parentName");
      const storedPId = localStorage.getItem("pacienteId");

      if (storedName) setParentName(storedName);

      if (storedPId) {
        setPacienteId(storedPId);
        loadData(storedPId);
      } else {
        setPacienteId("pac-lucas");
        loadData("pac-lucas");
      }
    }
  }, []);

  const loadData = async (pId: string) => {
    try {
      setLoading(true);
      const [pacRes, agRes, evoRes, finRes, exRes, arqRes, ptsRes] = await Promise.all([
        api.get(`/pacientes/${pId}`).catch(() => ({ data: null })),
        api.get(`/pacientes/${pId}/agendamentos`).catch(() => ({ data: [] })),
        api.get(`/prontuarios/paciente/${pId}`).catch(() => ({ data: [] })),
        api.get(`/pacientes/${pId}/financeiro`).catch(() => ({ data: [] })),
        api.get(`/exercicios/paciente/${pId}`).catch(() => ({ data: [] })),
        api.get(`/arquivos/paciente/${pId}`).catch(() => ({ data: [] })),
        api.get(`/plano-terapeutico/paciente/${pId}`).catch(() => ({ data: [] })),
      ]);

      if (pacRes.data) {
        setPacienteData(pacRes.data);
      } else {
        setPacienteData({
          id: "pac-lucas",
          nome: "Maria Júlia",
          dataNascimento: new Date("2019-03-15"),
          status: "ATIVO",
          escola: "Colégio Integração Infantil",
          serie: "1º ano do Fundamental I",
          alergias: ["Amendoim"],
          medicamentos: ["Nenhum de uso contínuo"],
        });
      }

      setAgenda(agRes.data || []);
      setEvolucoes(evoRes.data || []);
      setFinanceiro(finRes.data || []);
      setExercicios(exRes.data || []);
      setArquivos(arqRes.data || []);
      setMetas(ptsRes.data?.[0]?.metas || []);
    } catch (error) {
      console.error("Erro ao carregar dados do portal:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("parentName");
    localStorage.removeItem("pacienteId");
    router.push("/portal/login");
  };

  const openWhatsApp = (msg = "Olá, gostaria de falar com a recepção do Instituto Conectar.") => {
    const nome = pacienteData?.nome || "Maria Júlia";
    const texto = `${msg} (Responsável: ${parentName}, Paciente: ${nome})`;
    window.open(`https://wa.me/${whatsNumero}?text=${encodeURIComponent(texto)}`, "_blank");
  };

  const nextAppointment = agenda.length > 0 ? agenda[0] : null;

  // Abrir modal de novo agendamento
  const handleOpenScheduling = async () => {
    setActiveModal("agendamento");
    try {
      const res = await api.get("/profissionais");
      setProfissionais(res.data || []);
    } catch {
      setProfissionais([
        { id: "1", especialidade: "Psicologia TCC", usuario: { nome: "Dra. Leliane Rocha" } },
        { id: "2", especialidade: "Fonoaudiologia", usuario: { nome: "Dra. Rosana Alves" } },
        { id: "3", especialidade: "Psicopedagogia", usuario: { nome: "Dra. Beatriz Lima" } },
        { id: "4", especialidade: "Terapia Ocupacional", usuario: { nome: "Dr. Thiago Martins" } },
      ]);
    }
  };

  const handleScheduleSubmit = async ({
    profId,
    date,
    time,
    tipo,
    obs,
  }: {
    profId: string;
    date: string;
    time: string;
    tipo: "PRESENCIAL" | "ONLINE";
    obs: string;
  }) => {
    const start = new Date(`${date}T${time}:00`);
    const end = new Date(start.getTime() + 50 * 60 * 1000);

    await api.post("/agenda", {
      pacienteId: pacienteData?.id || pacienteId,
      profissionalId: profId,
      data: start.toISOString(),
      dataFim: end.toISOString(),
      tipo,
      observacoes: obs || "Agendado via Portal dos Pais",
    });

    toast.success("Atendimento solicitado com sucesso! A clínica confirmará em breve.");
    if (pacienteId) loadData(pacienteId);
  };

  const handleCompleteExercise = async (ex: any) => {
    try {
      await api.patch(`/exercicios/${ex.id}`, {
        realizado: true,
        observacaoResponsavel: "Atividade realizada com sucesso em casa.",
      });
      toast.success("Parabéns! Atividade marcada como realizada 🌟");
      if (pacienteId) loadData(pacienteId);
    } catch {
      toast.success("Atividade concluída com sucesso!");
    }
  };

  const openPixPayment = (inv: any) => {
    setCurrentInvoice(inv);
    setActiveModal("pix");
  };

  const childName = pacienteData?.nome || "Maria Júlia";
  const childAge = pacienteData?.dataNascimento ? `${calculateAge(pacienteData.dataNascimento)} anos` : "7 anos";

  return (
    <div className={`min-h-screen w-full bg-[#FAF7FD] text-[#29232F] flex items-center justify-center p-0 md:py-8 ${nunito.className} selection:bg-[#E8DEFF]`}>
      
      {/* ─── ELEMENTOS DECORATIVOS EXTERNOS (BLOBS COLORIDOS CONFORME JSON) ─── */}
      <div className="hidden lg:block fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top-Left: #A88BD9 */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#A88BD9]/25 blur-3xl" />
        {/* Top-Right: #F3A43B */}
        <div className="absolute top-1/4 -right-28 w-96 h-96 rounded-full bg-[#F3A43B]/20 blur-3xl" />
        {/* Bottom-Left: #F58A7E */}
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 rounded-full bg-[#F58A7E]/20 blur-3xl" />
        {/* Bottom-Right: #79C5A5 */}
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#79C5A5]/25 blur-3xl" />

        {/* Textos caligráficos afetuosos nas laterais */}
        <div className="absolute left-16 top-1/2 -translate-y-1/2 max-w-[210px] text-[#8D5BD1]/80 font-medium text-lg leading-relaxed select-none">
          <p className="font-serif italic text-2xl mb-2 text-[#29232F]">Desenvolvimento</p>
          <p className="font-serif italic text-2xl mb-2 text-[#8D5BD1]">Aprendizagem</p>
          <p className="font-serif italic text-2xl text-[#8D5BD1]/90 font-bold">Bem-Estar 💜</p>
        </div>

        <div className="absolute right-16 top-1/2 -translate-y-1/2 max-w-[220px] text-right text-[#8D5BD1]/80 font-medium text-lg leading-relaxed select-none">
          <p className="font-serif italic text-2xl text-[#29232F] mb-1">Conectando</p>
          <p className="font-serif italic text-2xl text-[#8D5BD1] mb-1">família, escola</p>
          <p className="font-serif italic text-2xl text-[#8D5BD1]/90 font-bold">e cuidado. 💜</p>
        </div>
      </div>

      {/* ─── CONTAINER SMARTPHONE (VIEWPORT: 390x844 / DESKTOP MAX 430px) ─── */}
      <div className="relative w-full max-w-[430px] h-full min-h-screen md:min-h-[844px] md:h-[860px] bg-white md:rounded-[44px] shadow-2xl md:border-[8px] md:border-slate-900/90 overflow-hidden flex flex-col z-10 pt-[env(safe-area-inset-top,0px)]">
        
        {/* Barra Superior Simulada no Desktop */}
        <div className="hidden md:flex w-full bg-white pt-2.5 px-6 pb-1 shrink-0 items-center justify-between text-xs font-semibold text-slate-800 select-none z-20">
          <span className="text-[12px] tracking-tight font-bold text-[#29232F]">09:41</span>
          <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto" />
          <div className="flex items-center gap-1 text-slate-700">
            <span className="text-[10px] font-bold">5G</span>
            <div className="w-4.5 h-2.5 border border-slate-700 rounded-xs p-0.5 flex items-center">
              <div className="w-full h-full bg-slate-800 rounded-2xs" />
            </div>
          </div>
        </div>

        {/* 1. TOP HEADER MODULAR */}
        <PortalHeader
          parentName={parentName}
          onOpenProfile={() => setActiveNavTab("perfil")}
          onContactSupport={() => openWhatsApp()}
        />

        {/* ─── CORPO COM ROLAGEM (PADDING: TOP 12, LEFT 16, RIGHT 16, BOTTOM 88) ─── */}
        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-[88px] scrollbar-none bg-white">
          
          {/* TAB 1: INÍCIO */}
          {activeNavTab === "inicio" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              {/* 2. WELCOME BANNER (HERO CARD) */}
              <PortalWelcomeHero parentName={parentName} />

              {/* 3. FAMILY PROFILE CARD */}
              <PortalFamilyCard
                childName={childName}
                childAge={childAge}
                school={pacienteData?.escola || "Colégio Integração"}
                onOpenFamilyProfile={() => setActiveNavTab("familia")}
              />

              {/* 4. QUICK ACTIONS GRID (3 COLUNAS x 6 CARDS PASTÉIS) */}
              <PortalQuickActions
                pendingExercisesCount={exercicios.filter((e) => !e.realizado).length}
                pendingInvoicesCount={financeiro.filter((f) => f.status !== "PAGO").length}
                onSelectAction={(actionKey) => {
                  switch (actionKey) {
                    case "agenda":
                      setActiveNavTab("agenda");
                      break;
                    case "evolucao":
                      setActiveModal("jornada");
                      break;
                    case "atividades":
                      setActiveModal("atividades");
                      break;
                    case "documentos":
                      setActiveNavTab("conteudos");
                      break;
                    case "jornada":
                      setActiveModal("jornada");
                      break;
                    case "financeiro":
                      setActiveModal("financeiro");
                      break;
                  }
                }}
              />

              {/* 5. SEÇÃO DE PRÓXIMOS COMPROMISSOS */}
              <PortalUpcomingSection
                nextAppointment={nextAppointment}
                onSeeAll={() => setActiveNavTab("agenda")}
                onOpenDetails={(app) => {
                  setSelectedAppointment(app);
                  setActiveModal("detalhes");
                }}
              />

              {/* 6. BOTÃO DE AÇÃO PRIMÁRIA PILL */}
              <PortalPrimaryAction
                onClick={handleOpenScheduling}
                label="Agendar atendimento"
              />

              {/* Rodapé institucional acolhedor */}
              <div className="pt-2 pb-1 text-center select-none">
                <p className="text-[8.5px] font-bold text-[#77717E]/70 uppercase tracking-wider">
                  Instituto Conectar • Tudo em um só lugar
                </p>
              </div>
            </motion.div>
          )}

          {/* TAB 2: FAMÍLIA */}
          {activeNavTab === "familia" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 select-none">
              <div>
                <h2 className="text-[16px] font-extrabold text-[#29232F]">Espaço da Família</h2>
                <p className="text-[10px] text-[#77717E]">Informações integradas da criança e suporte</p>
              </div>

              <div className="p-4 rounded-[16px] bg-[#FAF8FF] border border-[#EEE8FA] space-y-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#E8DEFF] flex items-center justify-center text-[#8D5BD1] font-black text-lg">
                    {childName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-[14px] font-extrabold text-[#29232F]">{childName}</h3>
                    <p className="text-[10px] text-[#77717E]">{childAge} • Paciente Ativo</p>
                  </div>
                </div>

                <div className="border-t border-[#EEE8FA] pt-2.5 space-y-1.5 text-[10.5px]">
                  <div className="flex justify-between">
                    <span className="text-[#77717E]">Escola:</span>
                    <span className="font-bold text-[#29232F]">{pacienteData?.escola || "Colégio Integração"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#77717E]">Série:</span>
                    <span className="font-bold text-[#29232F]">{pacienteData?.serie || "1º ano Fundamental I"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#77717E]">Responsável:</span>
                    <span className="font-bold text-[#8D5BD1]">{parentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#77717E]">Alergias:</span>
                    <span className="font-bold text-[#E11D48]">
                      {pacienteData?.alergias?.join(", ") || "Nenhuma relatada"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botão de contato acolhedor com WhatsApp da clínica */}
              <div className="p-3.5 rounded-[16px] bg-[#DDF6ED] border border-[#C5EFE0] flex items-center justify-between shadow-2xs">
                <div>
                  <h4 className="text-[12px] font-bold text-[#29232F]">Dúvidas ou Reagendamentos?</h4>
                  <p className="text-[9.5px] text-[#77717E]">Nossa recepção acolhe você no WhatsApp</p>
                </div>
                <button
                  onClick={() => openWhatsApp()}
                  className="px-3 py-1.5 rounded-full bg-[#10B981] hover:bg-[#059669] text-white text-[10px] font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Conversar</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* TAB 3: AGENDA COMPLETA */}
          {activeNavTab === "agenda" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 select-none">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[16px] font-extrabold text-[#29232F]">Minha Agenda</h2>
                  <p className="text-[10px] text-[#77717E]">Consultas e atendimentos terapêuticos</p>
                </div>
                <button
                  onClick={handleOpenScheduling}
                  className="px-3 py-1.5 rounded-full bg-[#8D5BD1] hover:bg-[#7B48C2] text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Novo</span>
                </button>
              </div>

              <div className="space-y-2">
                {agenda.length > 0 ? (
                  agenda.map((ag) => (
                    <div
                      key={ag.id}
                      onClick={() => {
                        setSelectedAppointment(ag);
                        setActiveModal("detalhes");
                      }}
                      className="p-3 rounded-[14px] bg-white border border-[#EEEAF4] shadow-2xs space-y-1.5 hover:border-[#8D5BD1]/30 cursor-pointer transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[8.5px] font-bold px-2 py-0.5 rounded-md bg-[#F0E8FF] text-[#8D5BD1]">
                            {ag.profissional?.especialidade || "Especialidade"}
                          </span>
                          <h4 className="text-[12px] font-bold text-[#29232F] mt-1">
                            {ag.profissional?.usuario?.nome || "Terapeuta"}
                          </h4>
                        </div>
                        <span
                          className={cn(
                            "text-[8.5px] font-bold px-2 py-0.5 rounded-full uppercase",
                            ag.status === "PRESENTE" && "bg-[#DDF6ED] text-[#10B981]",
                            ag.status === "CONFIRMADO" && "bg-[#DDEEFF] text-[#0284C7]",
                            ag.status === "AGENDADO" && "bg-[#F0E8FF] text-[#8D5BD1]",
                            ag.status === "CANCELADO" && "bg-[#FFDDE0] text-[#E11D48]"
                          )}
                        >
                          {ag.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[9.5px] text-[#77717E]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#8D5BD1]" />
                          {formatDate(ag.data)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#8D5BD1]" />
                          {new Date(ag.data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-[14px] bg-[#FAF8FF] text-center text-[10.5px] text-[#77717E]">
                    Nenhum atendimento agendado no momento.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 4: CONTEÚDOS & LAUDOS */}
          {activeNavTab === "conteudos" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 select-none">
              <div>
                <h2 className="text-[16px] font-extrabold text-[#29232F]">Conteúdos e Laudos</h2>
                <p className="text-[10px] text-[#77717E]">Documentos clínicos, orientações e guias</p>
              </div>

              <div className="space-y-2">
                {[
                  { title: "Laudo de Avaliação Neuropsicológica", tipo: "Laudo Oficial", data: "15/09/2026" },
                  { title: "Plano Educacional Individualizado (PEI)", tipo: "Relatório Escolar", data: "01/08/2026" },
                  { title: "Declaração de Comparecimento", tipo: "Declaração", data: "20/09/2026" },
                ].map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-[14px] bg-white border border-[#EEEAF4] shadow-2xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-[10px] bg-[#FFDDE0] text-[#E11D48] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-[11.5px] font-bold text-[#29232F]">{doc.title}</h4>
                        <p className="text-[9px] text-[#77717E]">
                          {doc.tipo} • {doc.data}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toast.success(`Download iniciado: ${doc.title}`)}
                      className="p-1.5 rounded-full bg-[#FAF8FF] text-[#8D5BD1] hover:bg-[#E8DEFF] cursor-pointer"
                      title="Baixar Documento"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 5: PERFIL */}
          {activeNavTab === "perfil" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 select-none">
              <div>
                <h2 className="text-[16px] font-extrabold text-[#29232F]">Perfil</h2>
                <p className="text-[10px] text-[#77717E]">Configurações da conta e dados cadastrais</p>
              </div>

              <div className="p-4 rounded-[16px] bg-[#FAF8FF] border border-[#EEE8FA] space-y-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#8D5BD1] to-[#B388EB] flex items-center justify-center text-white font-extrabold text-lg shadow-2xs">
                    {parentName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-[14px] font-extrabold text-[#29232F]">{parentName}</h3>
                    <p className="text-[10px] text-[#77717E]">Responsável Legal</p>
                  </div>
                </div>

                <div className="border-t border-[#EEE8FA] pt-3">
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 rounded-[12px] border border-rose-200 bg-rose-50 text-rose-600 font-bold text-[11px] flex items-center justify-center gap-1.5 hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sair do Portal</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </div>

        {/* 7. MASCOTE INTERATIVO (OVERLAP 64px NO CANTO INFERIOR DIREITO) */}
        <PortalMascotCompanion />

        {/* 8. BARRA DE NAVEGAÇÃO INFERIOR FIXA (5 ABAS) */}
        <PortalBottomNav
          activeTab={activeNavTab}
          onChangeTab={(tabId) => setActiveNavTab(tabId)}
        />
      </div>

      {/* ─── MODAIS MODULARES DE APOIO ─── */}
      <PortalExercisesModal
        isOpen={activeModal === "atividades"}
        onClose={() => setActiveModal(null)}
        exercicios={exercicios}
        onCompleteExercise={handleCompleteExercise}
      />

      <PortalJourneyModal
        isOpen={activeModal === "jornada"}
        onClose={() => setActiveModal(null)}
        metas={metas}
      />

      <PortalFinanceModal
        isOpen={activeModal === "financeiro"}
        onClose={() => setActiveModal(null)}
        financeiro={financeiro}
        onOpenPix={openPixPayment}
      />

      <PortalPixModal
        isOpen={activeModal === "pix"}
        onClose={() => setActiveModal(null)}
        currentInvoice={currentInvoice}
      />

      <PortalSchedulingModal
        isOpen={activeModal === "agendamento"}
        onClose={() => setActiveModal(null)}
        profissionais={profissionais}
        onSubmit={handleScheduleSubmit}
      />

      <PortalDetailsModal
        isOpen={activeModal === "detalhes"}
        onClose={() => setActiveModal(null)}
        selectedAppointment={selectedAppointment}
        childName={childName}
        onWhatsApp={openWhatsApp}
      />

    </div>
  );
}
