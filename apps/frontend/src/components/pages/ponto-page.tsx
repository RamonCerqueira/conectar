"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Settings,
  Shield,
  Search,
  Plus,
  Trash2,
  ListFilter,
  FileText,
  DollarSign,
  Briefcase,
  HelpCircle,
  Check,
  ChevronRight,
  Info,
  Camera,
  MapPin,
  Eye
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PontoRecord {
  fotoAuditoria: any;
  latitude: any;
  longitude: any;
  id: string;
  usuarioId: string;
  data: string;
  entrada?: string | null;
  saida?: string | null;
  status: "NORMAL" | "SOLICITADO" | "APROVADO" | "REJEITADO";
  justificativa?: string | null;
  entradaSol?: string | null;
  saidaSol?: string | null;
  usuario?: {
    nome: string;
    email: string;
    perfil: string;
    tipoContrato: string;
    salarioBase: number;
    cargaHoraria: string;
    horariosTrabalho?: any;
  };
}

interface Holiday {
  id: string;
  data: string;
  descricao: string;
}

export function PontoPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [activeTab, setActiveTab] = useState<"meu" | "admin-todos" | "admin-solicitacoes" | "admin-horarios" | "admin-transporte">("meu");
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Personal Time Clock State
  const [myRecords, setMyRecords] = useState<PontoRecord[]>([]);
  const [isAjusteModalOpen, setIsAjusteModalOpen] = useState(false);
  const [ajusteDia, setAjusteDia] = useState("");
  const [ajusteEntrada, setAjusteEntrada] = useState("");
  const [ajusteSaida, setAjusteSaida] = useState("");
  const [ajusteJustificativa, setAjusteJustificativa] = useState("");

  // Admin: History Records State
  const [allRecords, setAllRecords] = useState<PontoRecord[]>([]);
  const [historyStart, setHistoryStart] = useState("");
  const [historyEnd, setHistoryEnd] = useState("");
  const [historySearch, setHistorySearch] = useState("");

  // Admin: Requests State
  const [requests, setRequests] = useState<PontoRecord[]>([]);

  // Admin: Employees schedules list
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmp, setSelectedEmp] = useState<any | null>(null);
  const [isHorarioModalOpen, setIsHorarioModalOpen] = useState(false);
  const [horarioEntrada, setHorarioEntrada] = useState("09:00");
  const [horarioSaida, setHorarioSaida] = useState("18:00");
  const [custoVT, setCustoVT] = useState("10.00");

  // Admin: Vale Transporte Release State
  const [vtMonth, setVtMonth] = useState("2026-06"); // YYYY-MM
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [newHolidayDate, setNewHolidayDate] = useState("");
  const [newHolidayDesc, setNewHolidayDesc] = useState("");
  const [selectedVTEmployees, setSelectedVTEmployees] = useState<string[]>([]);

  // Selfie / Geoloc Audit States
  const [isWebcamModalOpen, setIsWebcamModalOpen] = useState(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const [gpsCoords, setGpsCoords] = useState<{ latitude?: number; longitude?: number }>({});
  const [capturing, setCapturing] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Real-time Clock effect
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadUserData = () => {
    const role = localStorage.getItem("userRole") || "RECEPCAO";
    setUserRole(role);
    setIsAdmin(role === "ADMINISTRADOR" || role === "DIRETOR");

    // Set default tab for admins to todos, and users to meu
    if (role === "ADMINISTRADOR" || role === "DIRETOR") {
      setActiveTab("admin-todos");
    } else {
      setActiveTab("meu");
    }
  };

  const loadMyPonto = async () => {
    try {
      const res = await api.get("/ponto/me");
      setMyRecords(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar seu histórico de pontos.");
    }
  };

  const loadAdminData = async () => {
    try {
      const [resRequests, resHolidays, resUsers] = await Promise.all([
        api.get("/ponto/admin/solicitacoes"),
        api.get("/ponto/admin/feriados"),
        api.get("/usuarios")
      ]);
      setRequests(resRequests.data || []);
      setHolidays(resHolidays.data || []);

      // Filter out parents (PAIS) from employee settings
      const staffList = (resUsers.data || []).filter((u: any) => u.perfil !== "PAIS");
      setEmployees(staffList);

      // Automatically select all CLT employees for VT payout
      const cltIds = staffList.filter((u: any) => u.tipoContrato === "CLT").map((u: any) => u.id);
      setSelectedVTEmployees(cltIds);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAllHistory = async () => {
    if (!historyStart || !historyEnd) return;
    try {
      const res = await api.get(`/ponto/admin/todos?inicio=${historyStart}&fim=${historyEnd}`);
      setAllRecords(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar histórico geral.");
    }
  };

  const initializeData = async () => {
    setLoading(true);
    loadUserData();
    await loadMyPonto();

    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    setHistoryStart(lastMonth.toISOString().split("T")[0]);
    setHistoryEnd(today.toISOString().split("T")[0]);
    setAjusteDia(today.toISOString().split("T")[0]);

    if (localStorage.getItem("userRole") === "ADMINISTRADOR" || localStorage.getItem("userRole") === "DIRETOR") {
      await loadAdminData();
    }
    setLoading(false);
  };

  useEffect(() => {
    initializeData();
  }, []);

  // Trigger reload when dates change
  useEffect(() => {
    if (isAdmin) {
      loadAllHistory();
    }
  }, [historyStart, historyEnd, activeTab]);

  const handleBaterPonto = async () => {
    // Request geolocation
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("GPS error:", error);
          toast.warning("Não foi possível obter sua geolocalização exata. O ponto será registrado sem coordenadas.");
        }
      );
    }

    // Attempt webcam activation
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
      setWebcamStream(stream);
      setIsWebcamModalOpen(true);
    } catch (err) {
      console.warn("Webcam blocked or missing:", err);
      if (confirm("Câmera indisponível ou bloqueada. Deseja prosseguir com o registro de ponto sem foto de selfie?")) {
        executeBaterPonto();
      }
    }
  };

  const executeBaterPonto = async (photoBase64?: string) => {
    try {
      const res = await api.post("/ponto/bater", {
        latitude: gpsCoords.latitude,
        longitude: gpsCoords.longitude,
        fotoAuditoriaBase64: photoBase64,
      });
      toast.success(res.data.message || "Ponto registrado!");
      loadMyPonto();
      if (isAdmin) {
        loadAllHistory();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Erro ao registrar ponto.");
    }
  };

  const handleSolicitarAjuste = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ajusteDia || !ajusteJustificativa.trim()) {
      toast.error("Preencha o dia e a justificativa do ajuste.");
      return;
    }

    const payload = {
      dia: ajusteDia,
      entradaSol: ajusteEntrada ? `${ajusteDia}T${ajusteEntrada}:00` : null,
      saidaSol: ajusteSaida ? `${ajusteDia}T${ajusteSaida}:00` : null,
      justificativa: ajusteJustificativa,
    };

    try {
      await api.post("/ponto/solicitar-ajuste", payload);
      toast.success("Solicitação enviada para avaliação!");
      setIsAjusteModalOpen(false);
      setAjusteEntrada("");
      setAjusteSaida("");
      setAjusteJustificativa("");
      loadMyPonto();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Erro ao solicitar ajuste.");
    }
  };

  const handleAvaliarSolicitacao = async (id: string, aprovado: boolean) => {
    try {
      await api.post(`/ponto/admin/avaliar-ajuste/${id}`, { aprovado });
      toast.success(aprovado ? "Solicitação de ajuste aprovada!" : "Solicitação de ajuste recusada!");
      loadAdminData();
      loadAllHistory();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao avaliar solicitação de ajuste.");
    }
  };

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp) return;

    try {
      const schedule = { entrada: horarioEntrada, saida: horarioSaida };
      await api.put(`/ponto/admin/usuario/${selectedEmp.id}/horarios`, {
        horariosTrabalho: schedule,
        custoValeTransporte: Number(custoVT)
      });

      toast.success(`Horários de trabalho de ${selectedEmp.nome} atualizados!`);
      setIsHorarioModalOpen(false);
      setSelectedEmp(null);
      loadAdminData();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar horários de trabalho.");
    }
  };

  const handleCreateHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolidayDate || !newHolidayDesc.trim()) return;

    try {
      await api.post("/ponto/admin/feriados", {
        data: newHolidayDate,
        descricao: newHolidayDesc
      });
      toast.success("Feriado cadastrado!");
      setNewHolidayDate("");
      setNewHolidayDesc("");
      loadAdminData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Erro ao cadastrar feriado.");
    }
  };

  const handleDeleteHoliday = async (id: string) => {
    try {
      await api.delete(`/ponto/admin/feriados/${id}`);
      toast.success("Feriado excluído!");
      loadAdminData();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir feriado.");
    }
  };

  // Calculate Net Workdays in the selected month excluding weekends and server holidays
  const calculateWorkdays = () => {
    if (!vtMonth) return 0;
    const [year, month] = vtMonth.split("-").map(Number);
    const monthIndex = month - 1;

    const serverHolidays = holidays.map(h => h.data.split("T")[0]);

    let count = 0;
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day);
      const dayOfWeek = date.getDay();

      // Adjust timezone output to get exact YYYY-MM-DD
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday
      const isHoliday = serverHolidays.includes(dateStr);

      if (!isWeekend && !isHoliday) {
        count++;
      }
    }
    return count;
  };

  const diasUteis = calculateWorkdays();

  const handleLaunchVT = async () => {
    if (selectedVTEmployees.length === 0) {
      toast.error("Selecione pelo menos um colaborador para liberar o vale-transporte.");
      return;
    }

    try {
      const res = await api.post("/ponto/admin/lancar-transporte", {
        mesReferencia: vtMonth,
        diasUteis,
        colaboradorIds: selectedVTEmployees
      });

      toast.success(res.data.message || "Lançamentos de Vale-Transporte gerados!");
      loadAdminData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Erro ao lançar vale-transporte.");
    }
  };

  // Get Today's record for clock button display
  const getTodayRecord = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    return myRecords.find(r => r.data.split("T")[0] === todayStr);
  };

  const todayRecord = getTodayRecord();

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      NORMAL: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
      SOLICITADO: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      APROVADO: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      REJEITADO: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return (
      <span className={cn("px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border", styles[status] || styles.NORMAL)}>
        {status}
      </span>
    );
  };

  const formatTime = (isoString?: string | null) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  const openHorarioModal = (emp: any) => {
    setSelectedEmp(emp);
    setHorarioEntrada(emp.horariosTrabalho?.entrada || "09:00");
    setHorarioSaida(emp.horariosTrabalho?.saida || "18:00");
    setCustoVT(emp.custoValeTransporte !== undefined && emp.custoValeTransporte !== null ? String(emp.custoValeTransporte) : "10.00");
    setIsHorarioModalOpen(true);
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      RECEPCAO: "Recepção / Secretária",
      FINANCEIRO: "Financeiro",
      COORDENADOR: "Coordenador Geral",
      DIRETOR: "Diretor Clínico",
      SUPERVISOR: "Supervisor",
      ADMINISTRADOR: "Administrador",
      PSICOLOGO: "Psicólogo",
      FONOAUDIOLOGO: "Fonoaudiólogo",
      TERAPEUTA_OCUPACIONAL: "Terapia Ocupacional",
    };
    return labels[role] || role;
  };

  const filteredHistory = allRecords.filter((r) => {
    const name = r.usuario?.nome.toLowerCase() || "";
    return name.includes(historySearch.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "hsl(var(--foreground))" }}>
            Ponto Eletrônico & Jornada
          </h1>
          <p className="text-sm text-muted-foreground">
            Bata o ponto diário, solicite ajustes de horário e acompanhe folhas de vale-transporte de funcionários.
          </p>
        </div>

        {/* Big Clock Button for non-admins (or everyone) */}
        <button
          onClick={handleBaterPonto}
          disabled={!!(todayRecord && todayRecord.entrada && todayRecord.saida)}
          className={cn(
            "flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition-all cursor-pointer",
            todayRecord && todayRecord.entrada && todayRecord.saida
              ? "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20 cursor-not-allowed"
              : todayRecord && todayRecord.entrada
                ? "bg-red-600 text-white shadow-red-600/10"
                : "gradient-primary text-white shadow-purple-500/10"
          )}
        >
          <Clock className="h-4.5 w-4.5" />
          <span>
            {todayRecord && todayRecord.entrada && todayRecord.saida
              ? "Jornada Concluída Hoje"
              : todayRecord && todayRecord.entrada
                ? "Registrar Saída (Clock Out)"
                : "Registrar Entrada (Clock In)"}
          </span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("meu")}
          className={cn(
            "flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
            activeTab === "meu"
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <User className="h-4 w-4" />
          Meu Ponto Diário
        </button>

        {isAdmin && (
          <>
            <button
              onClick={() => setActiveTab("admin-todos")}
              className={cn(
                "flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
                activeTab === "admin-todos"
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Briefcase className="h-4 w-4" />
              Painel Admin (Todos)
            </button>

            <button
              onClick={() => setActiveTab("admin-solicitacoes")}
              className={cn(
                "flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer relative",
                activeTab === "admin-solicitacoes"
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Ajustes Solicitados</span>
              {requests.length > 0 && (
                <span className="absolute top-1 right-0 h-2 w-2 rounded-full bg-amber-500" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("admin-horarios")}
              className={cn(
                "flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
                activeTab === "admin-horarios"
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Settings className="h-4 w-4" />
              Jornadas & VT
            </button>

            <button
              onClick={() => setActiveTab("admin-transporte")}
              className={cn(
                "flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
                activeTab === "admin-transporte"
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <DollarSign className="h-4 w-4" />
              Vale-Transporte (dia 28)
            </button>
          </>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-violet-600 border-t-transparent" />
        </div>
      )}

      {/* ─── TAB 1: MEU PONTO DIÁRIO ────────────────────────────────────── */}
      {!loading && activeTab === "meu" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Card left: bater ponto & status */}
          <div
            className="lg:col-span-1 p-6 rounded-2xl border bg-card flex flex-col items-center text-center gap-6"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            {/* Clock Widget */}
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-foreground font-mono">{currentTime.toLocaleTimeString("pt-BR")}</p>
              <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5 justify-center">
                <Calendar className="h-3.5 w-3.5" />
                {currentTime.toLocaleDateString("pt-BR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Today record summary */}
            <div className="w-full space-y-3 bg-muted/40 p-4 rounded-xl border text-xs text-left">
              <h4 className="font-bold text-foreground block border-b border-border/40 pb-1">Jornada de Hoje</h4>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Entrada:</span>
                <span className="font-bold text-emerald-500">{formatTime(todayRecord?.entrada)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Saída:</span>
                <span className="font-bold text-red-500">{formatTime(todayRecord?.saida)}</span>
              </div>
            </div>

            <button
              onClick={() => setIsAjusteModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border border-border bg-background hover:bg-muted text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Solicitar Ajuste retroativo
            </button>
          </div>

          {/* Table right: history of current user */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-bold text-foreground">Histórico da Minha Jornada</h3>
            <div className="overflow-hidden border rounded-2xl bg-card" style={{ borderColor: "hsl(var(--border))" }}>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider text-center">
                      <th className="p-4 text-left">Dia / Data</th>
                      <th className="p-4">Entrada registrada</th>
                      <th className="p-4">Saída registrada</th>
                      <th className="p-4">Auditoria</th>
                      <th className="p-4 text-left">Justificativas / Ajustes</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {myRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-muted/10 transition-colors">
                        <td className="p-4 font-bold text-foreground">
                          {new Date(r.data + 'T00:00:00').toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit', weekday: 'short' })}
                        </td>
                        <td className="p-4 font-semibold text-emerald-500 text-center">{formatTime(r.entrada)}</td>
                        <td className="p-4 font-semibold text-red-500 text-center">{formatTime(r.saida)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 justify-center">
                            {r.fotoAuditoria ? (
                              <button
                                onClick={() => {
                                  setLightboxUrl(r.fotoAuditoria!);
                                  setIsLightboxOpen(true);
                                }}
                                className="p-1 hover:bg-purple-500/10 text-purple-400 rounded transition-colors border-0 bg-transparent cursor-pointer"
                                title="Ver Selfie de Auditoria"
                              >
                                <Camera className="h-4.5 w-4.5" />
                              </button>
                            ) : (
                              <span className="text-[10px] text-muted-foreground">—</span>
                            )}
                            {r.latitude && r.longitude ? (
                              <a
                                href={`https://www.google.com/maps?q=${r.latitude},${r.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 hover:bg-purple-500/10 text-purple-400 rounded transition-colors block"
                                title="Ver Localização no Mapa"
                              >
                                <MapPin className="h-4.5 w-4.5" />
                              </a>
                            ) : null}
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground text-[10px]">
                          {r.justificativa ? (
                            <span className="italic block max-w-xs truncate" title={r.justificativa}>{r.justificativa}</span>
                          ) : (
                            "—"
                          )}
                          {r.status === "SOLICITADO" && (
                            <p className="text-[9px] text-amber-500 mt-1">Ajuste Sol: {formatTime(r.entradaSol)} às {formatTime(r.saidaSol)}</p>
                          )}
                        </td>
                        <td className="p-4">{getStatusBadge(r.status)}</td>
                      </tr>
                    ))}
                    {myRecords.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-muted-foreground">Nenhum registro de ponto encontrado este mês.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: PAINEL ADMIN (TODOS OS PONTOS) ──────────────────────── */}
      {!loading && activeTab === "admin-todos" && (
        <div className="space-y-4">
          {/* Date Picker & Search */}
          <div
            className="p-4 rounded-2xl border bg-card flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">Início:</span>
                <input
                  type="date"
                  value={historyStart}
                  onChange={(e) => setHistoryStart(e.target.value)}
                  className="p-2 rounded-xl border bg-background text-foreground text-xs outline-none"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">Fim:</span>
                <input
                  type="date"
                  value={historyEnd}
                  onChange={(e) => setHistoryEnd(e.target.value)}
                  className="p-2 rounded-xl border bg-background text-foreground text-xs outline-none"
                />
              </div>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar funcionário por nome..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full pl-10 p-2.5 rounded-xl border outline-none text-xs bg-background text-foreground"
              />
            </div>
          </div>

          {/* History table */}
          <div className="overflow-hidden border rounded-2xl bg-card" style={{ borderColor: "hsl(var(--border))" }}>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider text-center">
                    <th className="p-4 text-left">Funcionário</th>
                    <th className="p-4 text-left">Dia / Data</th>
                    <th className="p-4">Entrada</th>
                    <th className="p-4">Saída</th>
                    <th className="p-4">Auditoria</th>
                    <th className="p-4 text-left">Ajustes / Histórico</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredHistory.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-foreground">{r.usuario?.nome}</p>
                        <p className="text-[10px] text-muted-foreground">{getRoleLabel(r.usuario?.perfil || "")}</p>
                      </td>
                      <td className="p-4 font-bold text-foreground">
                        {new Date(r.data + 'T00:00:00').toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit', weekday: 'short' })}
                      </td>
                      <td className="p-4 font-semibold text-emerald-500 text-center">{formatTime(r.entrada)}</td>
                      <td className="p-4 font-semibold text-red-500 text-center">{formatTime(r.saida)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 justify-center">
                          {r.fotoAuditoria ? (
                            <button
                              onClick={() => {
                                setLightboxUrl(r.fotoAuditoria!);
                                setIsLightboxOpen(true);
                              }}
                              className="p-1 hover:bg-purple-500/10 text-purple-400 rounded transition-colors border-0 bg-transparent cursor-pointer"
                              title="Ver Selfie de Auditoria"
                            >
                              <Camera className="h-4.5 w-4.5" />
                            </button>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">—</span>
                          )}
                          {r.latitude && r.longitude ? (
                            <a
                              href={`https://www.google.com/maps?q=${r.latitude},${r.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 hover:bg-purple-500/10 text-purple-400 rounded transition-colors block"
                              title="Ver Localização no Mapa"
                            >
                              <MapPin className="h-4.5 w-4.5" />
                            </a>
                          ) : null}
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground text-[10px] space-y-1 text-left">
                        {r.justificativa && <p className="italic font-bold">Justificativa: "{r.justificativa}"</p>}
                        {r.status === "SOLICITADO" && (
                          <p className="text-amber-500">Solicitado: {formatTime(r.entradaSol)} às {formatTime(r.saidaSol)}</p>
                        )}
                      </td>
                      <td className="p-4">{getStatusBadge(r.status)}</td>
                    </tr>
                  ))}
                  {filteredHistory.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">Nenhum registro de ponto encontrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: SOLICITAÇÕES DE AJUSTE ──────────────────────────────── */}
      {!loading && activeTab === "admin-solicitacoes" && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground">Solicitações de Ajuste Pendentes</h3>
          {requests.length === 0 ? (
            <div
              className="p-12 text-center rounded-2xl border bg-card flex flex-col items-center gap-2"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <CheckCircle className="h-8 w-8 text-emerald-500" />
              <h3 className="font-bold text-sm text-foreground">Tudo em dia!</h3>
              <p className="text-xs text-muted-foreground">Não há solicitações de ajuste pendentes para avaliação.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requests.map((r) => (
                <div
                  key={r.id}
                  className="p-5 rounded-2xl border bg-card text-xs space-y-4 flex flex-col justify-between"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-foreground text-sm">{r.usuario?.nome}</h4>
                        <p className="text-[10px] text-muted-foreground">{getRoleLabel(r.usuario?.perfil || "")}</p>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/20">
                        {new Date(r.data + 'T00:00:00').toLocaleDateString("pt-BR")}
                      </span>
                    </div>

                    <div className="bg-muted/40 p-3 rounded-xl border space-y-1.5">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-muted-foreground">Original:</span>
                        <span className="font-semibold">{formatTime(r.entrada)} - {formatTime(r.saida)}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-purple-400 font-bold border-t border-border/40 pt-1">
                        <span>Ajuste Solicitado:</span>
                        <span>{formatTime(r.entradaSol)} - {formatTime(r.saidaSol)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] pt-1">
                      <span className="font-bold text-foreground">Motivo:</span>
                      <span className="italic">"{r.justificativa}"</span>
                    </div>

                    {/* Geolocation/Selfie preview if original point has it */}
                    {(r.fotoAuditoria || r.latitude) && (
                      <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[9px] text-muted-foreground">
                        <span>Original Auditado:</span>
                        <div className="flex items-center gap-1.5">
                          {r.fotoAuditoria && (
                            <button
                              onClick={() => {
                                setLightboxUrl(r.fotoAuditoria!);
                                setIsLightboxOpen(true);
                              }}
                              className="text-purple-400 flex items-center gap-0.5 bg-transparent border-0 cursor-pointer"
                            >
                              <Camera className="h-3 w-3" /> Foto
                            </button>
                          )}
                          {r.latitude && (
                            <a
                              href={`https://www.google.com/maps?q=${r.latitude},${r.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-400 flex items-center gap-0.5 decoration-none"
                            >
                              <MapPin className="h-3 w-3" /> Mapa
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 justify-end border-t border-border/40 pt-3">
                    <button
                      onClick={() => handleAvaliarSolicitacao(r.id, false)}
                      className="px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      Rejeitar
                    </button>
                    <button
                      onClick={() => handleAvaliarSolicitacao(r.id, true)}
                      className="px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                    >
                      Aprovar Ajuste
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 4: JORNADAS & VT CONFIG ────────────────────────────────── */}
      {!loading && activeTab === "admin-horarios" && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground">Gerenciamento de Horários e VT por Funcionário</h3>
          <div className="overflow-hidden border rounded-2xl bg-card" style={{ borderColor: "hsl(var(--border))" }}>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                    <th className="p-4">Funcionário</th>
                    <th className="p-4">Regime</th>
                    <th className="p-4">Horário de Trabalho</th>
                    <th className="p-4">Custo Diário VT</th>
                    <th className="p-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-foreground text-sm">{emp.nome}</p>
                        <p className="text-[10px] text-muted-foreground">{emp.email}</p>
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider",
                          emp.tipoContrato === "PJ" ? "bg-teal-500/10 text-teal-500 border-teal-500/20" : "bg-sky-500/10 text-sky-500 border-sky-500/20"
                        )}>
                          {emp.tipoContrato || "CLT"}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-foreground text-sm">
                        {emp.horariosTrabalho?.entrada ? (
                          `${emp.horariosTrabalho.entrada} - ${emp.horariosTrabalho.saida}`
                        ) : (
                          <span className="text-zinc-500 font-normal">Não configurado (Padrão 09h - 18h)</span>
                        )}
                      </td>
                      <td className="p-4 font-bold text-foreground">
                        {formatCurrency(emp.custoValeTransporte !== undefined ? emp.custoValeTransporte : 10)} / dia
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => openHorarioModal(emp)}
                          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
                        >
                          Configurar Jornada
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 5: LIBERAÇÃO VALE-TRANSPORTE (DIA 28) ──────────────────── */}
      {!loading && activeTab === "admin-transporte" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
          {/* Col esquerda: Config do Mês e Feriados */}
          <div className="lg:col-span-1 space-y-6">
            {/* Mês e Dias Úteis */}
            <div
              className="p-5 rounded-2xl border bg-card space-y-4"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">Período de Liberação</h3>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Mês da Folha</label>
                <input
                  type="month"
                  value={vtMonth}
                  onChange={(e) => setVtMonth(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none font-bold"
                />
              </div>

              <div className="bg-purple-500/5 p-4 rounded-xl border border-purple-500/10 text-center space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Dias Úteis Calculados</span>
                <p className="text-3xl font-extrabold text-purple-400 font-mono">{diasUteis} dias</p>
                <p className="text-[9px] text-muted-foreground">Exclui sábados, domingos e feriados cadastrados abaixo.</p>
              </div>
            </div>

            {/* Cadastro de Feriados */}
            <div
              className="p-5 rounded-2xl border bg-card space-y-4"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">Cadastro de Feriados</h3>

              <form onSubmit={handleCreateHoliday} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase">Data</label>
                    <input
                      type="date"
                      required
                      value={newHolidayDate}
                      onChange={(e) => setNewHolidayDate(e.target.value)}
                      className="w-full p-2 rounded-lg border bg-background text-foreground outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase">Nome Feriado</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Natal"
                      value={newHolidayDesc}
                      onChange={(e) => setNewHolidayDesc(e.target.value)}
                      className="w-full p-2 rounded-lg border bg-background text-foreground outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-semibold text-white gradient-primary cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Cadastrar Feriado
                </button>
              </form>

              {/* Feriados list */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Feriados no Sistema</span>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {holidays.map((h) => (
                    <div key={h.id} className="flex justify-between items-center bg-muted/30 p-2 rounded-lg border text-[10px]">
                      <div>
                        <p className="font-bold text-foreground">{h.descricao}</p>
                        <p className="text-muted-foreground font-mono">{new Date(h.data + 'T00:00:00').toLocaleDateString("pt-BR")}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteHoliday(h.id)}
                        className="p-1 hover:bg-red-500/10 text-red-500 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {holidays.length === 0 && (
                    <p className="text-[10px] text-zinc-500 italic">Nenhum feriado cadastrado.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Col direita: Lista de funcionários CLT e liberação */}
          <div className="lg:col-span-2 space-y-6">
            <div
              className="p-5 rounded-2xl border bg-card space-y-4"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <div className="flex justify-between items-center border-b border-border/40 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">Liberação de VT (Funcionários CLT)</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Selecione quem receberá o vale transporte do mês {vtMonth}.</p>
                </div>
                <button
                  onClick={handleLaunchVT}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>Lançar VT no Financeiro</span>
                </button>
              </div>

              {/* List of CLT */}
              <div className="space-y-2">
                {employees.filter(e => e.tipoContrato === "CLT").map((emp) => {
                  const custoVTDiario = emp.custoValeTransporte !== undefined ? Number(emp.custoValeTransporte) : 10;
                  const totalPagar = custoVTDiario * diasUteis;
                  const isChecked = selectedVTEmployees.includes(emp.id);

                  return (
                    <div
                      key={emp.id}
                      className={cn(
                        "p-4 rounded-xl border flex items-center justify-between transition-colors",
                        isChecked ? "bg-purple-500/5 border-purple-500/20" : "bg-card border-border"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedVTEmployees([...selectedVTEmployees, emp.id]);
                            } else {
                              setSelectedVTEmployees(selectedVTEmployees.filter(id => id !== emp.id));
                            }
                          }}
                          className="rounded border-border text-purple-500 outline-none w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-foreground text-sm">{emp.nome}</p>
                          <p className="text-[10px] text-muted-foreground">{getRoleLabel(emp.perfil)}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-extrabold text-foreground text-sm">{formatCurrency(totalPagar)}</p>
                        <p className="text-[9px] text-muted-foreground">{diasUteis} dias x {formatCurrency(custoVTDiario)}/dia</p>
                      </div>
                    </div>
                  );
                })}

                {employees.filter(e => e.tipoContrato === "CLT").length === 0 && (
                  <p className="p-8 text-center text-zinc-500 italic">Nenhum funcionário cadastrado no regime CLT.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: SOLICITAR AJUSTE RETROATIVO ───────────────────────────── */}
      <AnimatePresence>
        {isAjusteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="absolute inset-0" onClick={() => setIsAjusteModalOpen(false)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden bg-card"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-foreground">Solicitar Ajuste de Ponto</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Informe os horários corretos e a justificativa.</p>
                </div>
                <button onClick={() => setIsAjusteModalOpen(false)} className="p-2 rounded-xl hover:bg-muted text-zinc-400 cursor-pointer">
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSolicitarAjuste} className="p-6 space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Data do Ponto</label>
                  <input
                    type="date"
                    required
                    value={ajusteDia}
                    onChange={(e) => setAjusteDia(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Hora Entrada Solicitada</label>
                    <input
                      type="time"
                      value={ajusteEntrada}
                      onChange={(e) => setAjusteEntrada(e.target.value)}
                      className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Hora Saída Solicitada</label>
                    <input
                      type="time"
                      value={ajusteSaida}
                      onChange={(e) => setAjusteSaida(e.target.value)}
                      className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Justificativa / Motivo do Ajuste</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Ex: Esqueci de registrar a entrada pois entrei em atendimento de emergência ou falha no sistema."
                    value={ajusteJustificativa}
                    onChange={(e) => setAjusteJustificativa(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none resize-none"
                  />
                </div>

                <div className="pt-4 border-t flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAjusteModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl font-bold border text-zinc-400 border-border hover:bg-muted transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl font-semibold text-white gradient-primary cursor-pointer"
                  >
                    Enviar Solicitação
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL: CONFIGURAR JORNADA E VT ────────────────────────────── */}
      <AnimatePresence>
        {isHorarioModalOpen && selectedEmp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="absolute inset-0" onClick={() => setIsHorarioModalOpen(false)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden bg-card"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-foreground">Definir Jornada & VT</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Configure o horário oficial e o VT diário de {selectedEmp.nome}.</p>
                </div>
                <button onClick={() => { setIsHorarioModalOpen(false); setSelectedEmp(null); }} className="p-2 rounded-xl hover:bg-muted text-zinc-400 cursor-pointer">
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSchedule} className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Horário Entrada Padrão</label>
                    <input
                      type="time"
                      required
                      value={horarioEntrada}
                      onChange={(e) => setHorarioEntrada(e.target.value)}
                      className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Horário Saída Padrão</label>
                    <input
                      type="time"
                      required
                      value={horarioSaida}
                      onChange={(e) => setHorarioSaida(e.target.value)}
                      className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Custo de Vale-Transporte Diário (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={custoVT}
                    onChange={(e) => setCustoVT(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none font-bold"
                    placeholder="10.00"
                  />
                  <p className="text-[9px] text-muted-foreground">Valor pago por dia útil trabalhado (excluindo feriados/fins de semana).</p>
                </div>

                <div className="pt-4 border-t flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => { setIsHorarioModalOpen(false); setSelectedEmp(null); }}
                    className="px-4 py-2.5 rounded-xl font-bold border text-zinc-400 border-border hover:bg-muted transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl font-semibold text-white gradient-primary cursor-pointer"
                  >
                    Gravar Configurações
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL WEBCAM CAMERA CAPTURE AUDIT ──────────────────────────────── */}
        <AnimatePresence>
          {isWebcamModalOpen && (
            <WebcamModal
              videoRef={videoRef}
              stream={webcamStream}
              capturing={capturing}
              onClose={() => {
                if (webcamStream) {
                  webcamStream.getTracks().forEach((track) => track.stop());
                }
                setWebcamStream(null);
                setIsWebcamModalOpen(false);
              }}
              onCapture={async () => {
                setCapturing(true);
                const video = videoRef.current;
                let photoBase64 = "";
                if (video) {
                  try {
                    const canvas = document.createElement("canvas");
                    canvas.width = 320;
                    canvas.height = 240;
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                      ctx.drawImage(video, 0, 0, 320, 240);
                      photoBase64 = canvas.toDataURL("image/png");
                    }
                  } catch (e) {
                    console.error(e);
                  }
                }
                if (webcamStream) {
                  webcamStream.getTracks().forEach((track) => track.stop());
                }
                setWebcamStream(null);
                setIsWebcamModalOpen(false);
                setCapturing(false);
                executeBaterPonto(photoBase64);
              }}
            />
          )}
        </AnimatePresence>

        {/* ─── LIGHTBOX DE FOTO AUDITORIA ──────────────────────────────────────── */}
        <AnimatePresence>
          {isLightboxOpen && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 backdrop-blur-xs p-4">
              <div className="absolute inset-0" onClick={() => setIsLightboxOpen(false)} />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-sm w-full bg-card p-4 rounded-2xl border text-center space-y-4"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                <div className="flex justify-between items-center border-b pb-2">
                  <h4 className="font-bold text-xs text-foreground">Selfie de Auditoria do Ponto</h4>
                  <button
                    onClick={() => setIsLightboxOpen(false)}
                    className="p-1 hover:bg-muted rounded text-muted-foreground border-0 bg-transparent cursor-pointer"
                  >
                    <XCircle className="h-4.5 w-4.5" />
                  </button>
                </div>
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border">
                  <img
                    src={`${api.defaults.baseURL?.replace("/api", "")}${lightboxUrl}`}
                    alt="Selfie de auditoria"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">Selfie tirada no momento exato do registro do ponto.</p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
    </div>
  );
}

// ─── COMPONENTE AUXILIAR WEBCAM MODAL ──────────────────────────────────────
interface WebcamModalProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  capturing: boolean;
  onClose: () => void;
  onCapture: () => void;
}

function WebcamModal({ videoRef, stream, capturing, onClose, onCapture }: WebcamModalProps) {
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(err => console.error("Error playing video:", err));
    }
  }, [stream, videoRef]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative max-w-sm w-full bg-card rounded-2xl border p-5 space-y-4 shadow-2xl"
        style={{ borderColor: "hsl(var(--border))" }}
      >
        <div className="text-center space-y-1">
          <h4 className="font-extrabold text-sm text-foreground">Registro Fotográfico</h4>
          <p className="text-[10px] text-muted-foreground">Olhe para a câmera para registrar sua entrada/saída.</p>
        </div>

        <div className="aspect-video w-full bg-black rounded-xl overflow-hidden border">
          <video
            ref={videoRef}
            className="w-full h-full object-cover scale-x-[-1]"
            muted
            playsInline
          />
        </div>

        <div className="flex gap-2 justify-end text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-xl font-bold hover:bg-muted text-[10px] uppercase transition-colors cursor-pointer bg-transparent"
            style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={capturing}
            onClick={onCapture}
            className="px-5 py-2 rounded-xl font-semibold text-white gradient-primary shadow-lg border-0 cursor-pointer text-[10px] uppercase tracking-wider flex items-center gap-1"
          >
            <Camera className="h-4 w-4" />
            {capturing ? "Registrando..." : "Tirar Foto & Bater"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
