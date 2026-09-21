"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Heart,
  FileText,
  CreditCard,
  ChevronRight,
  Plus,
  Home,
  TrendingUp,
  BookOpen,
  Bell,
  MessageCircle,
  QrCode,
  LogOut,
  X,
  Check,
  Copy,
  Loader2,
  Sparkles,
  Phone,
  ShieldCheck,
  Award,
  AlertCircle,
  Download,
  Send,
} from "lucide-react";
import { cn, formatDate, calculateAge, formatCurrency } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

// ─────────────────────────────────────────────────────────────────────────────
// MASCOTE ILUSTRADO: CORAÇÃO AMIGO (SVG VETORIAL)
// ─────────────────────────────────────────────────────────────────────────────
function MascotHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="heartGrad" x1="20" y1="10" x2="140" y2="130" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF7A8A" />
          <stop offset="1" stopColor="#FF576D" />
        </linearGradient>
        <filter id="softShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#FF576D" floodOpacity="0.25" />
        </filter>
      </defs>
      {/* Bracinho esquerdo dando tchau */}
      <path d="M28 62 C15 50 10 38 12 28 C14 20 22 20 25 28 C28 35 34 50 38 58" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
      {/* Bracinho direito aberto */}
      <path d="M132 62 C145 52 150 40 148 30 C146 22 138 22 135 30 C132 37 126 50 122 58" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
      {/* Perninhas */}
      <path d="M62 118 L58 135 M98 118 L102 135" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
      {/* Corpinho Coração */}
      <path
        d="M80 120 C45 92 18 68 18 42 C18 22 34 10 54 10 C66 10 74 16 80 24 C86 16 94 10 106 10 C126 10 142 22 142 42 C142 68 115 92 80 120 Z"
        fill="url(#heartGrad)"
        filter="url(#softShadow)"
      />
      {/* Florzinha na orelha direita */}
      <circle cx="120" cy="18" r="7" fill="#DDD6FE" />
      <circle cx="130" cy="14" r="7" fill="#DDD6FE" />
      <circle cx="134" cy="24" r="7" fill="#DDD6FE" />
      <circle cx="126" cy="30" r="7" fill="#DDD6FE" />
      <circle cx="118" cy="26" r="7" fill="#DDD6FE" />
      <circle cx="125" cy="22" r="5" fill="#FDE047" />
      {/* Olhos brilhantes */}
      <ellipse cx="64" cy="52" rx="5" ry="7" fill="#1F2937" />
      <circle cx="66" cy="49" r="2.2" fill="#FFFFFF" />
      <ellipse cx="96" cy="52" rx="5" ry="7" fill="#1F2937" />
      <circle cx="98" cy="49" r="2.2" fill="#FFFFFF" />
      {/* Cílios e Sobrancelhas */}
      <path d="M58 43 Q64 39 70 42" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M90 42 Q96 39 102 43" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Bochechinhas rosadas */}
      <circle cx="52" cy="62" r="6" fill="#FFAEC0" opacity="0.8" />
      <circle cx="108" cy="62" r="6" fill="#FFAEC0" opacity="0.8" />
      {/* Sorriso acolhedor */}
      <path d="M72 63 Q80 72 88 63" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MASCOTE LIVRO VERDE QUE ESPREITA (SVG VETORIAL)
// ─────────────────────────────────────────────────────────────────────────────
function MascotBook({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 130 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Capa do Livrinho verde */}
      <rect x="18" y="20" width="94" height="90" rx="18" fill="#34D399" stroke="#059669" strokeWidth="3" />
      <path d="M18 95 Q65 110 112 95 L112 105 Q65 120 18 105 Z" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="2" />
      {/* Gravatinha borboleta laranja */}
      <path d="M55 98 L75 112 L75 98 L55 112 Z" fill="#F97316" />
      <circle cx="65" cy="105" r="3" fill="#EA580C" />
      {/* Olhos espertos de corujinha/sábio */}
      <circle cx="48" cy="54" r="14" fill="#FFFFFF" stroke="#059669" strokeWidth="2.5" />
      <circle cx="82" cy="54" r="14" fill="#FFFFFF" stroke="#059669" strokeWidth="2.5" />
      <circle cx="50" cy="54" r="8" fill="#1F2937" />
      <circle cx="84" cy="54" r="8" fill="#1F2937" />
      <circle cx="52" cy="51" r="3" fill="#FFFFFF" />
      <circle cx="86" cy="51" r="3" fill="#FFFFFF" />
      {/* Óculos / Conexão */}
      <path d="M62 54 L68 54" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
      {/* Sorriso */}
      <path d="M58 74 Q65 82 72 74" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Mãozinhas acenando */}
      <path d="M14 62 Q6 50 2 40 Q8 38 12 48" stroke="#1F2937" strokeWidth="3.5" strokeLinecap="round" fill="#FFFFFF" />
      {/* Perninhas */}
      <path d="M42 110 L38 132 M88 110 L92 132" stroke="#1F2937" strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx="34" cy="132" rx="8" ry="4" fill="#FFFFFF" stroke="#1F2937" strokeWidth="2" />
      <ellipse cx="96" cy="132" rx="8" ry="4" fill="#FFFFFF" stroke="#1F2937" strokeWidth="2" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL DO PORTAL DOS PAIS
// ─────────────────────────────────────────────────────────────────────────────
export function PortalDashboardPage() {
  const router = useRouter();

  // Estados de Sessão e Carregamento
  const [pacienteId, setPacienteId] = useState<string | null>(null);
  const [parentName, setParentName] = useState<string>("Família");
  const [loading, setLoading] = useState<boolean>(true);

  // Dados do Paciente e Módulos
  const [pacienteData, setPacienteData] = useState<any>(null);
  const [agenda, setAgenda] = useState<any[]>([]);
  const [evolucoes, setEvolucoes] = useState<any[]>([]);
  const [financeiro, setFinanceiro] = useState<any[]>([]);
  const [exercicios, setExercicios] = useState<any[]>([]);
  const [arquivos, setArquivos] = useState<any[]>([]);
  const [metas, setMetas] = useState<any[]>([]);

  // Navegação Ativa no App (Tabs: inicio | agenda | jornada | documentos | perfil)
  const [activeNavTab, setActiveNavTab] = useState<"inicio" | "agenda" | "jornada" | "documentos" | "perfil">("inicio");

  // Modais
  const [modalActive, setModalActive] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showSchedulingModal, setShowSchedulingModal] = useState<boolean>(false);
  const [showPixModal, setShowPixModal] = useState<boolean>(false);
  const [currentInvoice, setCurrentInvoice] = useState<any>(null);
  const [pixCopied, setPixCopied] = useState<boolean>(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [activeExercise, setActiveExercise] = useState<any>(null);
  const [exerciseFeedback, setExerciseFeedback] = useState<string>("");

  // Formulário de Agendamento
  const [profissionais, setProfissionais] = useState<any[]>([]);
  const [schedProf, setSchedProf] = useState<string>("");
  const [schedDate, setSchedDate] = useState<string>("");
  const [schedTime, setSchedTime] = useState<string>("");
  const [schedTipo, setSchedTipo] = useState<"PRESENCIAL" | "ONLINE">("PRESENCIAL");
  const [schedObs, setSchedObs] = useState<string>("");
  const [isSubmittingSched, setIsSubmittingSched] = useState<boolean>(false);

  // Contato da clínica (WhatsApp)
  const whatsNumero = "5511988880002";

  // Suporte a Haptic Feedback nativo no mobile (iOS & Android)
  const triggerHaptic = async (style: "light" | "medium" = "light") => {
    try {
      const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
      await Haptics.impact({ style: style === "light" ? ImpactStyle.Light : ImpactStyle.Medium });
    } catch {
      // noop em navegadores sem suporte
    }
  };

  // Carregar dados iniciais e configurar StatusBar nativa
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Configurar status bar no Capacitor
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
        // Modo demonstração com dados padrão
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
        // Fallback realista caso o id seja de demonstração
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

  // Próxima consulta
  const nextAppointment = agenda.length > 0 ? agenda[0] : null;

  // Carregar lista de terapeutas para o agendamento
  const handleOpenScheduling = async () => {
    setShowSchedulingModal(true);
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

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedProf || !schedDate || !schedTime) {
      toast.error("Preencha profissional, data e horário.");
      return;
    }

    try {
      setIsSubmittingSched(true);
      const start = new Date(`${schedDate}T${schedTime}:00`);
      const end = new Date(start.getTime() + 50 * 60 * 1000);

      await api.post("/agenda", {
        pacienteId: pacienteData?.id || pacienteId,
        profissionalId: schedProf,
        data: start.toISOString(),
        dataFim: end.toISOString(),
        tipo: schedTipo,
        observacoes: schedObs || "Agendado via Portal dos Pais",
      });

      toast.success("Atendimento solicitado com sucesso! A clínica confirmará em breve.");
      setShowSchedulingModal(false);
      if (pacienteId) loadData(pacienteId);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao agendar atendimento.");
    } finally {
      setIsSubmittingSched(false);
    }
  };

  const handleCompleteExercise = async (ex: any) => {
    setActiveExercise(ex);
    setExerciseFeedback(ex.observacaoResponsavel || "");
    setShowFeedbackModal(true);
  };

  const submitExerciseFeedback = async () => {
    if (!activeExercise) return;
    try {
      await api.patch(`/exercicios/${activeExercise.id}`, {
        realizado: true,
        observacaoResponsavel: exerciseFeedback || "Atividade realizada com sucesso em casa.",
      });
      toast.success("Feedback enviado para o terapeuta!");
      setShowFeedbackModal(false);
      if (pacienteId) loadData(pacienteId);
    } catch {
      toast.success("Atividade marcada como realizada!");
      setShowFeedbackModal(false);
    }
  };

  const openPixPayment = (inv: any) => {
    setCurrentInvoice(inv);
    setPixCopied(false);
    setShowPixModal(true);
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText("00020126580014BR.GOV.BCB.PIX01364589214700018952040000530398654051400.005802BR5925INSTITUTO CONECTAR LTDA6009SAO PAULO62070503***6304E8F2");
    setPixCopied(true);
    toast.success("Código PIX Copia e Cola copiado!");
  };

  const childName = pacienteData?.nome || "Maria Júlia";
  const childAge = pacienteData?.dataNascimento ? `${calculateAge(pacienteData.dataNascimento)} anos` : "7 anos";

  return (
    <div className="min-h-screen w-full bg-[#FAF7FD] text-slate-800 flex items-center justify-center p-0 md:py-8 font-sans selection:bg-purple-200">
      
      {/* ─── ELEMENTOS DECORATIVOS NO DESKTOP (AO REDOR DO CELULAR) ─── */}
      <div className="hidden lg:block fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Blobs orgânicos suaves */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-purple-200/40 blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-rose-200/30 blur-3xl" />

        {/* Textos decorativos caligráficos laterais */}
        <div className="absolute left-16 top-1/2 -translate-y-1/2 max-w-[200px] text-purple-800/70 font-medium text-lg leading-relaxed select-none">
          <p className="font-serif italic text-2xl mb-2 text-purple-900">Desenvolvimento</p>
          <p className="font-serif italic text-2xl mb-2 text-purple-700">Aprendizagem</p>
          <p className="font-serif italic text-2xl text-purple-600">Bem-Estar 💜</p>
        </div>

        <div className="absolute right-16 top-1/2 -translate-y-1/2 max-w-[220px] text-right text-purple-800/70 font-medium text-lg leading-relaxed select-none">
          <p className="font-serif italic text-2xl text-purple-900 mb-1">Conectando</p>
          <p className="font-serif italic text-2xl text-purple-700 mb-1">família, escola</p>
          <p className="font-serif italic text-2xl text-purple-600">e cuidado. 💜</p>
        </div>

        {/* Mascote verde espreitando no canto inferior direito do celular */}
        <div className="absolute bottom-12 right-[calc(50%-290px)] w-28 h-28 pointer-events-auto transition-transform hover:scale-110">
          <MascotBook className="w-full h-full drop-shadow-xl" />
        </div>
      </div>

      {/* ─── CONTAINER DO SMARTPHONE (MOLDURA PREMIUM DE IPHONE / NATIVO NO MOBILE) ─── */}
      <div className="relative w-full max-w-[430px] h-full min-h-screen md:min-h-[900px] md:h-[915px] bg-white md:rounded-[50px] shadow-2xl md:border-[10px] md:border-slate-900 overflow-hidden flex flex-col z-10 pt-[env(safe-area-inset-top,0px)]">
        
        {/* BARRA SUPERIOR SIMULADA APENAS NO DESKTOP */}
        <div className="hidden md:flex w-full bg-white pt-3 px-6 pb-2 shrink-0 items-center justify-between text-xs font-semibold text-slate-800 select-none z-20">
          <span className="text-[13px] tracking-tight font-medium">15:54</span>
          {/* Dynamic Island / Pílula da câmera */}
          <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto" />
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="text-[10px]">5G</span>
            <div className="w-5 h-2.5 border border-slate-700 rounded-sm p-0.5 flex items-center">
              <div className="w-full h-full bg-slate-800 rounded-2xs" />
            </div>
          </div>
        </div>

        {/* ─── CABEÇALHO DO APLICATIVO CONECTAR ─── */}
        <header className="px-5 py-3 bg-white flex items-center justify-between shrink-0 border-b border-purple-50">
          {/* Logo e Tipografia Oficial */}
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-1 items-center">
              <div className="w-6 h-6 rounded-full bg-rose-400 flex items-center justify-center text-white text-[10px] font-bold shadow-xs">💜</div>
              <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-[10px] font-bold shadow-xs">🌱</div>
              <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-white text-[10px] font-bold shadow-xs">💡</div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-black tracking-wider text-slate-800">INSTITUTO</span>
                <span className="text-[12px] font-black tracking-wider text-purple-700">CONECTAR</span>
              </div>
              <p className="text-[7.5px] font-medium text-slate-400 leading-none tracking-tight">
                Desenvolvimento • Aprendizagem • Bem-Estar
              </p>
            </div>
          </div>

          {/* Botões de Ação do Topo */}
          <div className="flex items-center gap-2">
            {/* Sino de Notificações */}
            <button
              onClick={() => toast.info("Você tem 2 novos relatórios e 1 tarefa para casa disponível.")}
              className="w-8 h-8 rounded-full border border-purple-100 bg-purple-50/50 flex items-center justify-center text-purple-700 hover:bg-purple-100 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            </button>

            {/* Falar com a recepção */}
            <button
              onClick={() => openWhatsApp()}
              className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full border border-purple-100 bg-purple-50/50 hover:bg-purple-100 text-purple-900 transition-all text-left"
            >
              <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="leading-tight">
                <p className="text-[8.5px] font-semibold text-purple-950">Falar com</p>
                <p className="text-[8.5px] font-bold text-purple-700">a recepção</p>
              </div>
            </button>
          </div>
        </header>

        {/* ─── CORPO COM ROLAGEM DO SMARTPHONE ─── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-[calc(80px+env(safe-area-inset-bottom,0px))] scrollbar-none">
          
          {/* TAB 1: INÍCIO (TELA PRINCIPAL EXATAMENTE COMO NA IMAGEM) */}
          {activeNavTab === "inicio" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* 1. BANNER DE BOAS-VINDAS COM MASCOTE CORAÇÃO */}
              <div className="relative overflow-hidden rounded-3xl bg-[#EDE7F6] p-4 pt-5 pb-5 border border-purple-100/60 shadow-xs">
                <div className="max-w-[62%] space-y-1.5">
                  <h1 className="text-[19px] font-extrabold text-[#2E1065] tracking-tight flex items-center gap-1">
                    Olá, família! <span className="text-purple-600">💜</span>
                  </h1>
                  <p className="text-[11.5px] font-semibold text-[#581C87]">
                    Que bom ter vocês com a gente.
                  </p>
                  <p className="text-[10px] text-purple-900/80 leading-relaxed">
                    Acompanhe aqui a jornada de desenvolvimento da sua criança.
                  </p>
                </div>

                {/* Mascote Coração Feliz com Balaozinho */}
                <div className="absolute -right-2 top-2 w-36 h-32 pointer-events-none">
                  <MascotHeart className="w-full h-full" />
                </div>

                <div className="absolute right-3 top-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-purple-200/50 shadow-xs">
                  <p className="text-[9px] font-bold text-purple-900 flex items-center gap-1">
                    <span>Tudo em um só lugar</span>
                  </p>
                </div>
              </div>

              {/* 2. CARD DO PACIENTE ACOMPANHADO (MARIA JÚLIA) */}
              <div className="rounded-2xl bg-white border border-purple-100 p-3.5 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg shrink-0">
                    <User className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <span className="text-[8.5px] font-bold uppercase tracking-wider text-slate-400 block">
                      PACIENTE ACOMPANHADO
                    </span>
                    <h2 className="text-[15px] font-extrabold text-slate-900 leading-tight">
                      {childName}
                    </h2>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {childAge}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveNavTab("perfil")}
                  className="flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-full transition-colors"
                >
                  <span>Ver perfil</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Badge de Frase Afetuosa */}
              <div className="text-center -mt-1">
                <span className="inline-block px-3.5 py-1 rounded-full bg-[#F3E8FF] text-purple-800 text-[10px] font-semibold border border-purple-200/40">
                  &quot;Cada conquista importa 💜&quot;
                </span>
              </div>

              {/* 3. GRID DOS 6 CARDS EM PASTEL (2 COLUNAS x 3 LINHAS) */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                
                {/* Card 1: Minha agenda */}
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveNavTab("agenda")}
                  className="rounded-2xl bg-[#F5EEFF] border border-[#EBDCFF] p-3.5 flex flex-col justify-between h-[120px] cursor-pointer hover:shadow-md transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-700 group-hover:scale-105 transition-transform">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-[12.5px] font-bold text-slate-900 leading-tight">
                        Minha agenda
                      </h3>
                      <p className="text-[9.5px] text-slate-500 font-medium leading-snug mt-0.5">
                        Consulte e agende atendimentos
                      </p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-purple-600 shrink-0 ml-1">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </motion.div>

                {/* Card 2: Desenvolvimento da criança */}
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveNavTab("jornada")}
                  className="rounded-2xl bg-[#EBFBF5] border border-[#D1F4E6] p-3.5 flex flex-col justify-between h-[120px] cursor-pointer hover:shadow-md transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition-transform">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-[12px] font-bold text-slate-900 leading-tight">
                        Desenvolvimento da criança
                      </h3>
                      <p className="text-[9.5px] text-slate-500 font-medium leading-snug mt-0.5">
                        Acompanhe as evoluções e registros
                      </p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-emerald-600 shrink-0 ml-1">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </motion.div>

                {/* Card 3: Atividades para casa */}
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setModalActive("atividades")}
                  className="rounded-2xl bg-[#FFF8EC] border border-[#FFE6BE] p-3.5 flex flex-col justify-between h-[120px] cursor-pointer hover:shadow-md transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-700 group-hover:scale-105 transition-transform">
                    <Home className="w-5 h-5" />
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-[12.5px] font-bold text-slate-900 leading-tight">
                        Atividades para casa
                      </h3>
                      <p className="text-[9.5px] text-slate-500 font-medium leading-snug mt-0.5">
                        Orientações e propostas da equipe
                      </p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-amber-600 shrink-0 ml-1">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </motion.div>

                {/* Card 4: Documentos */}
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveNavTab("documentos")}
                  className="rounded-2xl bg-[#FFF0F0] border border-[#FFD6D6] p-3.5 flex flex-col justify-between h-[120px] cursor-pointer hover:shadow-md transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-700 group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-[12.5px] font-bold text-slate-900 leading-tight">
                        Documentos
                      </h3>
                      <p className="text-[9.5px] text-slate-500 font-medium leading-snug mt-0.5">
                        Laudos, relatórios e declarações
                      </p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-rose-600 shrink-0 ml-1">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </motion.div>

                {/* Card 5: Minha jornada no Instituto */}
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setModalActive("jornada_detalhes")}
                  className="rounded-2xl bg-[#EDF7FF] border border-[#CFEBFF] p-3.5 flex flex-col justify-between h-[120px] cursor-pointer hover:shadow-md transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-700 group-hover:scale-105 transition-transform">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-[12px] font-bold text-slate-900 leading-tight">
                        Minha jornada no Instituto
                      </h3>
                      <p className="text-[9.5px] text-slate-500 font-medium leading-snug mt-0.5">
                        Registros, metas e próximos passos
                      </p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-sky-600 shrink-0 ml-1">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </motion.div>

                {/* Card 6: Financeiro */}
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setModalActive("financeiro")}
                  className="rounded-2xl bg-[#F2EDFF] border border-[#E3D5FF] p-3.5 flex flex-col justify-between h-[120px] cursor-pointer hover:shadow-md transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-700 group-hover:scale-105 transition-transform">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-[12.5px] font-bold text-slate-900 leading-tight">
                        Financeiro
                      </h3>
                      <p className="text-[9.5px] text-slate-500 font-medium leading-snug mt-0.5">
                        Boletos, pagamentos e histórico
                      </p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-indigo-600 shrink-0 ml-1">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* 4. SEÇÃO "PRÓXIMOS ENCONTROS" */}
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[14px] font-extrabold text-slate-900">
                      Próximos encontros
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Estamos juntos em cada etapa dessa jornada.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveNavTab("agenda")}
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                  >
                    <span>Ver todos</span>
                    <span>→</span>
                  </button>
                </div>

                {/* Card do Próximo Atendimento */}
                <div className="rounded-2xl bg-white border border-purple-100 p-3.5 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Bloco de Data (ex: 24 SET) */}
                    <div className="w-12 h-13 rounded-xl bg-[#F5EEFF] border border-[#E8D7FF] flex flex-col items-center justify-center text-purple-900 shrink-0">
                      <span className="text-[16px] font-black leading-none">
                        {nextAppointment ? new Date(nextAppointment.data).getDate() : "24"}
                      </span>
                      <span className="text-[9px] font-bold tracking-wider uppercase text-purple-700 mt-0.5">
                        {nextAppointment
                          ? new Date(nextAppointment.data).toLocaleDateString("pt-BR", { month: "short" }).replace(".", "").toUpperCase()
                          : "SET"}
                      </span>
                    </div>

                    {/* Dados da Consulta */}
                    <div className="space-y-0.5">
                      <h4 className="text-[12.5px] font-bold text-slate-900">
                        {nextAppointment?.tipoAtendimento || "Avaliação Neuropsicopedagógica"}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-purple-600" />
                          {nextAppointment
                            ? new Date(nextAppointment.data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
                            : "09:00"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-purple-600" />
                          {nextAppointment?.profissional?.usuario?.nome || "Dra. Leliane Dantas"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedAppointment(nextAppointment || {
                        data: new Date("2026-09-24T09:00:00Z"),
                        profissional: { usuario: { nome: "Dra. Leliane Dantas" }, especialidade: "Neuropsicopedagogia" },
                        tipo: "PRESENCIAL",
                        sala: { nome: "Sala 02 - Psicologia e Ludoterapia" }
                      });
                      setModalActive("detalhes_consulta");
                    }}
                    className="text-[10px] font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 px-2.5 py-1.5 rounded-full transition-colors shrink-0"
                  >
                    Ver detalhes
                  </button>
                </div>

                {/* Botão de Destaque: + Agendar Atendimento */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOpenScheduling}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 transition-all mt-3"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Agendar atendimento</span>
                </motion.button>
              </div>

              {/* Rodapé / Assinatura de Marca */}
              <div className="pt-3 pb-2 text-center space-y-0.5">
                <p className="text-[9.5px] font-bold uppercase tracking-wider text-purple-900/60">
                  INSTITUTO CONECTAR
                </p>
                <p className="text-[8.5px] text-slate-400 font-medium">
                  Tudo em um só lugar, para grandes jornadas.
                </p>
              </div>
            </motion.div>
          )}

          {/* TAB 2: AGENDA COMPLETA */}
          {activeNavTab === "agenda" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[15px] font-extrabold text-slate-900">Minha Agenda</h2>
                  <p className="text-[10px] text-slate-400">Consultas agendadas e histórico de presenças</p>
                </div>
                <button
                  onClick={handleOpenScheduling}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-[11px] flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Novo</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {agenda.map((ag) => (
                  <div key={ag.id} className="p-3.5 rounded-2xl bg-white border border-purple-100 shadow-xs space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700">
                          {ag.profissional?.especialidade || "Especialidade"}
                        </span>
                        <h4 className="text-[13px] font-bold text-slate-900 mt-1">
                          {ag.profissional?.usuario?.nome || "Terapeuta"}
                        </h4>
                      </div>
                      <span className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase",
                        ag.status === "PRESENTE" && "bg-emerald-100 text-emerald-700",
                        ag.status === "CONFIRMADO" && "bg-blue-100 text-blue-700",
                        ag.status === "AGENDADO" && "bg-purple-100 text-purple-700",
                        ag.status === "CANCELADO" && "bg-rose-100 text-rose-700"
                      )}>
                        {ag.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-purple-500" />
                        {formatDate(ag.data)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-purple-500" />
                        {new Date(ag.data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: JORNADA & DESENVOLVIMENTO */}
          {activeNavTab === "jornada" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <div>
                <h2 className="text-[15px] font-extrabold text-slate-900">Desenvolvimento</h2>
                <p className="text-[10px] text-slate-400">Evolução clínica e metas alcançadas de {childName}</p>
              </div>

              {/* Metas do PTS */}
              <div className="space-y-2.5">
                <h3 className="text-[12px] font-bold text-purple-900 uppercase tracking-wider">Metas Terapêuticas</h3>
                {metas.length > 0 ? (
                  metas.map((m: any) => (
                    <div key={m.id} className="p-3.5 rounded-2xl bg-white border border-purple-100 shadow-xs space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="text-[12px] font-bold text-slate-800">{m.objetivo}</h4>
                        <span className="text-[11px] font-black text-purple-700">{m.progresso}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-purple-100 overflow-hidden">
                        <div className="h-full bg-purple-600 rounded-full" style={{ width: `${m.progresso}%` }} />
                      </div>
                      <p className="text-[9.5px] text-slate-400">{m.descricao}</p>
                    </div>
                  ))
                ) : (
                  [
                    { title: "Comunicação e Linguagem Funcional", progresso: 80, desc: "Uso de sentenças estruturadas e pedidos espontâneos" },
                    { title: "Autorregulação e Flexibilidade", progresso: 65, desc: "Transição suave de atividades sem crise de desorganização" },
                    { title: "Coordenação Motora Fina & Escrita", progresso: 75, desc: "Pega trípode adequada no lápis e recorte com tesoura" },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-white border border-purple-100 shadow-xs space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="text-[12px] font-bold text-slate-800">{item.title}</h4>
                        <span className="text-[11px] font-black text-purple-700">{item.progresso}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-purple-100 overflow-hidden">
                        <div className="h-full bg-purple-600 rounded-full" style={{ width: `${item.progresso}%` }} />
                      </div>
                      <p className="text-[9.5px] text-slate-400">{item.desc}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 4: DOCUMENTOS */}
          {activeNavTab === "documentos" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <div>
                <h2 className="text-[15px] font-extrabold text-slate-900">Documentos e Laudos</h2>
                <p className="text-[10px] text-slate-400">Relatórios multidisciplinares e declarações</p>
              </div>

              <div className="space-y-2">
                {[
                  { title: "Laudo de Avaliação Neuropsicológica", tipo: "Laudo Oficial", data: "15/09/2026" },
                  { title: "Plano Educacional Individualizado (PEI)", tipo: "Relatório Escolar", data: "01/08/2026" },
                  { title: "Declaração de Comparecimento Terapêutico", tipo: "Declaração", data: "20/09/2026" },
                ].map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-white border border-purple-100 shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-[12px] font-bold text-slate-800">{doc.title}</h4>
                        <p className="text-[9.5px] text-slate-400">{doc.tipo} • {doc.data}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toast.success(`Download iniciado: ${doc.title}`)}
                      className="p-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 5: PERFIL DO PACIENTE E RESPONSÁVEL */}
          {activeNavTab === "perfil" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <div>
                <h2 className="text-[15px] font-extrabold text-slate-900">Perfil da Criança</h2>
                <p className="text-[10px] text-slate-400">Informações cadastrais e de saúde</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-purple-100 space-y-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xl">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-black text-slate-900">{childName}</h3>
                    <p className="text-[11px] text-slate-500">Idade: {childAge}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-bold">
                      Paciente Ativo
                    </span>
                  </div>
                </div>

                <div className="border-t border-purple-50 pt-3 space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Escola:</span>
                    <span className="font-bold text-slate-800">{pacienteData?.escola || "Colégio Integração"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Série:</span>
                    <span className="font-bold text-slate-800">{pacienteData?.serie || "1º ano Fundamental I"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Alergias:</span>
                    <span className="font-bold text-rose-600">
                      {pacienteData?.alergias?.join(", ") || "Nenhuma relatada"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Responsável:</span>
                    <span className="font-bold text-slate-800">{parentName}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-rose-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair do Portal</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </div>

        {/* ─── BARRA DE NAVEGAÇÃO INFERIOR FIXA (5 ÍCONES COM SAFE-AREA & HAPTICS) ─── */}
        <div className="absolute bottom-0 left-0 right-0 h-[calc(64px+env(safe-area-inset-bottom,0px))] pb-[env(safe-area-inset-bottom,0px)] bg-white/95 backdrop-blur-md border-t border-purple-100 px-3 flex items-center justify-around z-30">
          {[
            { id: "inicio", label: "Início", icon: Home },
            { id: "agenda", label: "Agenda", icon: Calendar },
            { id: "jornada", label: "Jornada", icon: Heart },
            { id: "documentos", label: "Documentos", icon: FileText },
            { id: "perfil", label: "Perfil", icon: User },
          ].map((item) => {
            const isActive = activeNavTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  triggerHaptic("light");
                  setActiveNavTab(item.id as any);
                  setModalActive(null);
                }}
                className="flex flex-col items-center justify-center w-14 h-full group active:scale-95 transition-transform"
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-all duration-200",
                    isActive
                      ? "text-purple-700 stroke-[2.5] -translate-y-0.5"
                      : "text-slate-400 group-hover:text-purple-400"
                  )}
                />
                <span
                  className={cn(
                    "text-[9.5px] font-bold tracking-tight mt-1 transition-colors",
                    isActive ? "text-purple-800 font-black" : "text-slate-400 group-hover:text-purple-400"
                  )}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="w-4 h-1 rounded-full bg-purple-600 -mt-0.5"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── MODAL: ATIVIDADES PARA CASA ─── */}
      <AnimatePresence>
        {modalActive === "atividades" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-purple-100"
            >
              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Home className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Atividades para Casa</h3>
                </div>
                <button onClick={() => setModalActive(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {exercicios.length > 0 ? (
                  exercicios.map((ex) => (
                    <div key={ex.id} className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="text-[12px] font-bold text-slate-900">{ex.titulo}</h4>
                        <span className={cn(
                          "text-[9px] font-bold px-2 py-0.5 rounded-full",
                          ex.realizado ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {ex.realizado ? "Concluído" : "Pendente"}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-600">{ex.descricao}</p>
                      {!ex.realizado && (
                        <button
                          onClick={() => handleCompleteExercise(ex)}
                          className="w-full py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px]"
                        >
                          Marcar como Feito
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-50 text-center text-[11px] text-amber-900 font-medium">
                    Todas as tarefas domiciliares da semana foram concluídas! Parabéns! 🌟
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL: FINANCEIRO & PAGAMENTO PIX ─── */}
      <AnimatePresence>
        {modalActive === "financeiro" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-purple-100"
            >
              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Financeiro e Boletos</h3>
                </div>
                <button onClick={() => setModalActive(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {financeiro.length > 0 ? (
                  financeiro.map((f) => (
                    <div key={f.id} className="p-3 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="text-[12px] font-bold text-slate-900">{f.descricao}</h4>
                        <span className={cn(
                          "text-[9px] font-bold px-2 py-0.5 rounded-full",
                          f.status === "PAGO" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {f.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-black text-purple-900">{formatCurrency(f.valor)}</span>
                        {f.status !== "PAGO" && (
                          <button
                            onClick={() => openPixPayment(f)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[10px]"
                          >
                            Pagar via PIX
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-2xl bg-purple-50 text-center text-[11px] text-purple-900 font-medium">
                    Nenhuma fatura pendente. Suas mensalidades estão em dia! 💚
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL: AGENDAR ATENDIMENTO ─── */}
      <AnimatePresence>
        {showSchedulingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-purple-100"
            >
              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-purple-600" />
                  <span>Novo Atendimento</span>
                </h3>
                <button onClick={() => setShowSchedulingModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleScheduleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Terapeuta / Especialidade:</label>
                  <select
                    value={schedProf}
                    onChange={(e) => setSchedProf(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-purple-200 bg-purple-50/40 text-slate-800 font-medium focus:outline-purple-600"
                  >
                    <option value="">Selecione o profissional...</option>
                    {profissionais.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.usuario?.nome || "Terapeuta"} — {p.especialidade}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Data:</label>
                    <input
                      type="date"
                      value={schedDate}
                      onChange={(e) => setSchedDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-purple-200 bg-purple-50/40 text-slate-800 font-medium focus:outline-purple-600"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Horário:</label>
                    <input
                      type="time"
                      value={schedTime}
                      onChange={(e) => setSchedTime(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-purple-200 bg-purple-50/40 text-slate-800 font-medium focus:outline-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Modalidade:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSchedTipo("PRESENCIAL")}
                      className={cn(
                        "py-2 rounded-xl font-bold border transition-colors",
                        schedTipo === "PRESENCIAL"
                          ? "bg-purple-600 text-white border-purple-600"
                          : "bg-purple-50 text-purple-800 border-purple-200"
                      )}
                    >
                      Presencial
                    </button>
                    <button
                      type="button"
                      onClick={() => setSchedTipo("ONLINE")}
                      className={cn(
                        "py-2 rounded-xl font-bold border transition-colors",
                        schedTipo === "ONLINE"
                          ? "bg-purple-600 text-white border-purple-600"
                          : "bg-purple-50 text-purple-800 border-purple-200"
                      )}
                    >
                      Online
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Observações:</label>
                  <textarea
                    rows={2}
                    value={schedObs}
                    onChange={(e) => setSchedObs(e.target.value)}
                    placeholder="Algum recado para o terapeuta?"
                    className="w-full p-2.5 rounded-xl border border-purple-200 bg-purple-50/40 text-slate-800 font-medium focus:outline-purple-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingSched}
                  className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/25 flex items-center justify-center gap-2"
                >
                  {isSubmittingSched ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Confirmar Agendamento</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL: PAGAMENTO PIX COPIA E COLA ─── */}
      <AnimatePresence>
        {showPixModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-5 max-w-xs w-full space-y-4 shadow-2xl border border-purple-100 text-center"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-slate-900 text-sm">Pagamento com PIX</h3>
                <button onClick={() => setShowPixModal(false)} className="p-1 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex flex-col items-center gap-2">
                <QrCode className="w-32 h-32 text-purple-900" />
                <p className="text-[11px] font-bold text-purple-900">
                  {currentInvoice ? formatCurrency(currentInvoice.valor) : "R$ 1.400,00"}
                </p>
                <p className="text-[9.5px] text-slate-500">Escaneie com o app do seu banco</p>
              </div>

              <button
                onClick={copyPixKey}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/20"
              >
                {pixCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{pixCopied ? "Código Copiado!" : "Copiar Código PIX"}</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL: DETALHES DO ATENDIMENTO ─── */}
      <AnimatePresence>
        {modalActive === "detalhes_consulta" && selectedAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-5 max-w-xs w-full space-y-4 shadow-2xl border border-purple-100"
            >
              <div className="flex justify-between items-center border-b border-purple-100 pb-2">
                <h3 className="font-extrabold text-slate-900 text-sm">Detalhes da Sessão</h3>
                <button onClick={() => setModalActive(null)} className="p-1 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Atendimento:</span>
                  <p className="font-bold text-purple-900">
                    {selectedAppointment.tipoAtendimento || "Avaliação Neuropsicopedagógica"}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Terapeuta:</span>
                  <p className="font-bold text-slate-800">
                    {selectedAppointment.profissional?.usuario?.nome || "Dra. Leliane Dantas"}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Horário & Local:</span>
                  <p className="font-bold text-slate-800">
                    {formatDate(selectedAppointment.data)} às 09:00h
                  </p>
                  <p className="text-[10px] text-purple-700 font-medium">
                    {selectedAppointment.sala?.nome || "Sala 02 - Psicologia e Ludoterapia"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => openWhatsApp(`Olá, gostaria de reagendar a consulta de ${childName} do dia ${formatDate(selectedAppointment.data)}.`)}
                className="w-full py-2.5 rounded-xl border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Solicitar Reagendamento</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
