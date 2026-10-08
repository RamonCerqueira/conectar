"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Nunito } from "next/font/google";
import { AnimatePresence } from "framer-motion";
import { api, setAccessToken } from "@/lib/api";
import { toast } from "sonner";
import {
  PortalHeader,
  PortalBottomNav,
  PortalMascotCompanion,
  PortalSplashScreen,
  PortalTabId,
  PortalHomeScreen,
  PortalFamilyScreen,
  PortalAgendaScreen,
  PortalContentScreen,
  PortalProfileScreen,
  PortalFinanceScreen,
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

export function PortalDashboardPage({
  initialTab = "inicio",
}: {
  initialTab?: PortalTabId | "financeiro";
} = {}) {
  const router = useRouter();

  // Estados de Sessão e Carregamento
  const [pacienteId, setPacienteId] = useState<string | null>(null);
  const [parentName, setParentName] = useState<string>("Família");
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Dados do Paciente e Módulos Integrados
  const [pacienteData, setPacienteData] = useState<any>(null);
  const [agenda, setAgenda] = useState<any[]>([]);
  const [evolucoes, setEvolucoes] = useState<any[]>([]);
  const [financeiro, setFinanceiro] = useState<any[]>([]);
  const [exercicios, setExercicios] = useState<any[]>([]);
  const [arquivos, setArquivos] = useState<any[]>([]);
  const [metas, setMetas] = useState<any[]>([]);

  // Navegação Ativa na Bottom Tab Bar (5 abas: inicio | familia | agenda | conteudos | perfil)
  // Também suporta aba interna "financeiro"
  const [activeNavTab, setActiveNavTab] = useState<PortalTabId | "financeiro">(initialTab);

  // Estados dos Modais Modulares
  const [activeModal, setActiveModal] = useState<
    "atividades" | "jornada" | "financeiro" | "pix" | "agendamento" | "detalhes" | null
  >(null);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [currentInvoice, setCurrentInvoice] = useState<any>(null);
  const [profissionais, setProfissionais] = useState<any[]>([]);

  // WhatsApp Recepção
  const whatsNumero = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");

  // Carregar sessão e configurar status bar nativa
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Configurar status bar nativa se estiver executando via Capacitor (Android/iOS)
      if (typeof window !== "undefined" && (window as any).Capacitor?.Plugins?.StatusBar) {
        (window as any).Capacitor.Plugins.StatusBar.setStyle({ style: "DARK" }).catch(() => { });
        (window as any).Capacitor.Plugins.StatusBar.setBackgroundColor({ color: "#FFFFFF" }).catch(() => { });
      }

      const storedName = localStorage.getItem("parentName");
      const storedPId = localStorage.getItem("pacienteId");

      if (storedName) setParentName(storedName);

      if (storedPId) {
        setPacienteId(storedPId);
        loadData(storedPId);
      } else {
        router.replace("/portal/login");
      }
    }
  }, []);

  const loadData = async (pId: string) => {
    try {
      setLoading(true);
      setLoadError("");
      const [pacRes, agRes, evoRes, finRes, exRes, arqRes, ptsRes] = await Promise.all([
        api.get(`/pacientes/${pId}`),
        api.get(`/pacientes/${pId}/agendamentos`),
        api.get(`/prontuarios/paciente/${pId}`),
        api.get(`/pacientes/${pId}/financeiro`),
        api.get(`/exercicios/paciente/${pId}`),
        api.get(`/arquivos/paciente/${pId}`),
        api.get(`/plano-terapeutico/paciente/${pId}`),
      ]);

      setPacienteData(pacRes.data);

      setAgenda(agRes.data || []);
      setEvolucoes(evoRes.data || []);
      setFinanceiro(finRes.data || []);
      setExercicios(exRes.data || []);
      setArquivos(arqRes.data || []);
      setMetas(ptsRes.data?.[0]?.metas || []);
    } catch (error) {
      setLoadError("Não foi possível carregar o portal. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.post("/auth/logout").catch(() => {});
    setAccessToken(null);
    localStorage.removeItem("parentName");
    localStorage.removeItem("pacienteId");
    router.push("/portal/login");
  };

  const openWhatsApp = (msg = "Olá, gostaria de falar com a recepção do Instituto Conectar.") => {
    if (!whatsNumero) { window.open("https://institutoconectar.net.br/#contato", "_blank", "noopener,noreferrer"); return; }
    const nome = pacienteData?.nome || "sua criança";
    const texto = `${msg} (Responsável: ${parentName}, Paciente: ${nome})`;
    window.open(`https://wa.me/${whatsNumero}?text=${encodeURIComponent(texto)}`, "_blank");
  };

  const nextAppointment = agenda.filter(item => new Date(item.data).getTime() >= Date.now() && item.status !== "CANCELADO").sort((a,b) => new Date(a.data).getTime() - new Date(b.data).getTime())[0] || null;

  // Abrir modal de novo agendamento
  const handleOpenScheduling = async () => {
    setActiveModal("agendamento");
    try {
      const res = await api.get("/profissionais");
      setProfissionais(res.data || []);
    } catch {
      setProfissionais([]);
      toast.error("Não foi possível carregar os profissionais. Tente novamente.");
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
      await api.put(`/exercicios/${ex.id}`, {
        realizado: true,
        observacaoResponsavel: "Atividade realizada com sucesso em casa.",
      });
      toast.success("Parabéns! Atividade marcada como realizada 🌟");
      if (pacienteId) loadData(pacienteId);
    } catch {
      toast.error("Não foi possível salvar a atividade. Tente novamente.");
    }
  };

  const openPixPayment = (inv: any) => {
    setCurrentInvoice(inv);
    setActiveModal("pix");
  };

  const childName = pacienteData?.nome || "sua criança";
  const birth = pacienteData?.dataNascimento ? new Date(pacienteData.dataNascimento) : null;
  const today = new Date();
  const years = birth ? today.getFullYear() - birth.getFullYear() - (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate()) ? 1 : 0) : null;
  const childAge = years !== null ? `${years} ${years === 1 ? "ano" : "anos"}` : "Idade não informada";
  if (loadError) return <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center"><p role="alert">{loadError}</p><button onClick={() => pacienteId && loadData(pacienteId)} className="px-5 py-3 rounded-xl bg-purple-600 text-white">Tentar novamente</button><button onClick={handleLogout}>Voltar ao login</button></main>;


  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <PortalSplashScreen
            durationSeconds={0.8}
            onFinish={() => setShowSplash(false)}
          />
        )}
      </AnimatePresence>

      <div className={`min-h-screen w-full bg-[#FAF7FD] text-[#29232F] flex items-center justify-center p-0 md:py-8 ${nunito.className} selection:bg-[#E8DEFF]`}>

      {/* ─── ELEMENTOS DECORATIVOS EXTERNOS (BLOBS COLORIDOS CONFORME JSON) ─── */}
      <div className="hidden lg:block fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#A88BD9]/25 blur-3xl" />
        <div className="absolute top-1/4 -right-28 w-96 h-96 rounded-full bg-[#F3A43B]/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 rounded-full bg-[#F58A7E]/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#79C5A5]/25 blur-3xl" />

        {/* Textos caligráficos afetuosos nas laterais do desktop */}
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

          {/* TAB 1: INÍCIO (TELA INICIAL CONFORME JSON EXATO) */}
          {activeNavTab === "inicio" && (
            <PortalHomeScreen
              parentName={parentName}
              childName={childName}
              childAge={childAge}
              school={pacienteData?.escola || "Colégio Integração Infantil"}
              nextAppointment={nextAppointment}
              pendingExercisesCount={exercicios.filter((e) => !e.realizado).length}
              pendingInvoicesCount={financeiro.filter((f) => f.status !== "PAGO").length}
              onOpenFamilyProfile={() => setActiveNavTab("familia")}
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
                    setActiveNavTab("financeiro");
                    break;
                }
              }}
              onSeeAllAppointments={() => setActiveNavTab("agenda")}
              onOpenAppointmentDetails={(app) => {
                setSelectedAppointment(app);
                setActiveModal("detalhes");
              }}
              onOpenScheduling={handleOpenScheduling}
            />
          )}

          {/* TAB 2: ESPAÇO DA FAMÍLIA */}
          {activeNavTab === "familia" && (
            <PortalFamilyScreen
              pacienteData={pacienteData}
              parentName={parentName}
              agenda={agenda}
              evolucoes={evolucoes}
              onOpenWhatsApp={openWhatsApp}
            />
          )}

          {/* TAB 3: AGENDA COMPLETA COM CONFIRMAÇÃO DE PRESENÇA (TAREFA 19) */}
          {activeNavTab === "agenda" && (
            <PortalAgendaScreen
              agenda={agenda}
              pacienteId={pacienteId}
              onOpenScheduling={handleOpenScheduling}
              onRefresh={() => pacienteId && loadData(pacienteId)}
              onOpenWhatsApp={openWhatsApp}
            />
          )}

          {/* TAB 4: CONTEÚDOS, LAUDOS E ATIVIDADES */}
          {activeNavTab === "conteudos" && (
            <PortalContentScreen
              exercicios={exercicios}
              arquivos={arquivos}
              onCompleteExercise={handleCompleteExercise}
            />
          )}

          {/* TAB 5: PERFIL */}
          {activeNavTab === "perfil" && (
            <PortalProfileScreen
              parentName={parentName}
              childName={childName}
              onOpenFinance={() => setActiveNavTab("financeiro")}
              onLogout={handleLogout}
              onOpenWhatsApp={openWhatsApp}
            />
          )}

          {/* TAB 6: FINANCEIRO & RECIBOS PARA CONVÊNIO/IRPF (TAREFA 20) */}
          {activeNavTab === "financeiro" && (
            <PortalFinanceScreen
              financeiro={financeiro}
              childName={childName}
              parentName={parentName}
              onOpenPix={openPixPayment}
            />
          )}

        </div>

        {/* 7. MASCOTE COMPANHEIRO (OVERLAP 64px NO CANTO INFERIOR DIREITO) */}
        <PortalMascotCompanion />

        {/* 8. BARRA DE NAVEGAÇÃO INFERIOR FIXA (5 ABAS) */}
        <PortalBottomNav
          activeTab={(activeNavTab === "financeiro" ? "perfil" : activeNavTab) as PortalTabId}
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
    </>
  );
}
