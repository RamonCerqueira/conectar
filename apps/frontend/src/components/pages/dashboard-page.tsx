"use client";

import { motion } from "framer-motion";
import {
  CalendarCheck,
  CalendarX,
  Clock,
  DollarSign,
  UserPlus,
  Activity,
  AlertTriangle,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { StatCard } from "./dashboard/stat-card";
import { ConsultasList } from "./dashboard/consultas-list";
import { AlertasList } from "./dashboard/alertas-list";
import { AniversariantesList } from "./dashboard/aniversariantes-list";
import { FinanceAreaChart, EspecialidadesPieChart } from "./dashboard/charts";
import {
  StatCard as StatCardType,
  Consulta,
  Alerta,
  Aniversariante,
  EvolucaoFinanceira,
  AtendimentoPorEspecialidade,
} from "@/types";

// ─── Dados Mockados ──────────────────────────────────────────────────────────

const initialStatsCards = [
  {
    id: "atendimentos-hoje",
    title: "Atendimentos",
    value: "24",
    change: "+3",
    changeType: "up" as const,
    changeLabel: "vs. ontem",
    icon: CalendarCheck,
    gradient: "",
    bg: "",
    iconBg: "",
    iconColor: "",
  },
  {
    id: "novos-pacientes",
    title: "Novos Pacientes",
    value: "7",
    change: "+2",
    changeType: "up" as const,
    changeLabel: "esta semana",
    icon: UserPlus,
    gradient: "",
    bg: "",
    iconBg: "",
    iconColor: "",
  },
  {
    id: "faltas-hoje",
    title: "Faltas Hoje",
    value: "3",
    change: "-1",
    changeType: "down" as const,
    changeLabel: "vs. ontem",
    icon: CalendarX,
    gradient: "",
    bg: "",
    iconBg: "",
    iconColor: "",
  },
  {
    id: "aguardando-avaliacao",
    title: "Aguardando",
    value: "12",
    change: "+5",
    changeType: "neutral" as const,
    changeLabel: "na fila",
    icon: Clock,
    gradient: "",
    bg: "",
    iconBg: "",
    iconColor: "",
  },
  {
    id: "receita-mes",
    title: "Receita do Mês",
    value: "R$ 48.350",
    change: "+12%",
    changeType: "up" as const,
    changeLabel: "vs. anterior",
    icon: DollarSign,
    gradient: "",
    bg: "",
    iconBg: "",
    iconColor: "",
  },
  {
    id: "pagamentos-pendentes",
    title: "Pend. Financ.",
    value: "R$ 6.200",
    change: "8",
    changeType: "alert" as const,
    changeLabel: "em aberto",
    icon: AlertTriangle,
    gradient: "",
    bg: "",
    iconBg: "",
    iconColor: "",
  },
] as StatCardType[];

const proximasConsultas = [
  {
    id: 1,
    horario: "09:00",
    paciente: "Lucas Mendes",
    profissional: "Dra. Ana Lima",
    especialidade: "Psicopedagogia",
    tipo: "presencial",
    sala: "Sala 01",
    status: "confirmado",
    foto: "LM",
  },
  {
    id: 2,
    horario: "09:30",
    paciente: "Sofia Andrade",
    profissional: "Dra. Carla Souza",
    especialidade: "Fonoaudiologia",
    tipo: "presencial",
    sala: "Sala 02",
    status: "confirmado",
    foto: "SA",
  },
  {
    id: 3,
    horario: "10:00",
    paciente: "Pedro Oliveira",
    profissional: "Dr. Marcos Santos",
    especialidade: "Neuropsicologia",
    tipo: "online",
    sala: "Online",
    status: "aguardando",
    foto: "PO",
  },
  {
    id: 4,
    horario: "10:30",
    paciente: "Isabela Costa",
    profissional: "Dra. Ana Lima",
    especialidade: "Psicopedagogia",
    tipo: "presencial",
    sala: "Sala 01",
    status: "confirmado",
    foto: "IC",
  },
  {
    id: 5,
    horario: "11:00",
    paciente: "Gabriel Ferreira",
    profissional: "Dra. Paula Ramos",
    especialidade: "Terapia Ocupacional",
    tipo: "presencial",
    sala: "Sala Sensorial",
    status: "aguardando",
    foto: "GF",
  },
] as Consulta[];

const aniversariantes = [
  { id: 1, nome: "Valentina Lima", idade: 8, foto: "VL", profissional: false },
  { id: 2, nome: "Arthur Neves", idade: 10, foto: "AN", profissional: false },
  { id: 3, nome: "Dra. Ana Lima", idade: null, foto: "AL", profissional: true },
] as Aniversariante[];

const ocupacaoProfissionais = [
  { nome: "Dra. Ana Lima", especialidade: "Psicopedagoga", ocupacao: 87, atendimentos: 7, cor: "#8E7BBE" },
  { nome: "Dra. Carla Souza", especialidade: "Fonoaudióloga", ocupacao: 75, atendimentos: 6, cor: "#E98BAE" },
  { nome: "Dr. Marcos Santos", especialidade: "Neuropsicólogo", ocupacao: 62, atendimentos: 5, cor: "#69C4B5" },
  { nome: "Dra. Paula Ramos", especialidade: "Terapeuta Ocupacional", ocupacao: 50, atendimentos: 4, cor: "#F3B357" },
];

const evolucaoFinanceira = [
  { mes: "Jan", receita: 35000, despesa: 22000 },
  { mes: "Fev", receita: 38000, despesa: 23000 },
  { mes: "Mar", receita: 42000, y: 0, receitaGradient: 0, despesa: 24000 },
  { mes: "Abr", receita: 39000, despesa: 22500 },
  { mes: "Mai", receita: 45000, despesa: 25000 },
  { mes: "Jun", receita: 48350, despesa: 26000 },
] as EvolucaoFinanceira[];

const atendimentosPorEspecialidade = [
  { name: "Psicopedagogia", value: 35, color: "#8E7BBE" },
  { name: "Fonoaudiologia", value: 25, color: "#E98BAE" },
  { name: "Neuropsicologia", value: 20, color: "#69C4B5" },
  { name: "Ter. Ocupacional", value: 15, color: "#F3B357" },
  { name: "Outros", value: 5, color: "#9ca3af" },
] as AtendimentoPorEspecialidade[];

const alertasImportantes = [
  {
    id: 1,
    tipo: "warning",
    mensagem: "8 mensalidades com vencimento amanhã",
    acao: "Ver cobranças",
    icon: DollarSign,
  },
  {
    id: 2,
    tipo: "info",
    mensagem: "Lucas Mendes: 3 faltas consecutivas",
    acao: "Ver histórico",
    icon: CalendarX,
  },
  {
    id: 3,
    tipo: "success",
    mensagem: "Laudo de Sofia Andrade pronto para revisão",
    acao: "Ver laudo",
    icon: CheckCircle2,
  },
  {
    id: 4,
    tipo: "error",
    mensagem: "Sala 03 com equipamento defeituoso",
    acao: "Ver detalhes",
    icon: XCircle,
  },
] as Alerta[];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function DashboardPage() {
  const today = format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  const [stats, setStats] = useState<StatCardType[]>(
    initialStatsCards.map(c => ({ ...c, value: c.id.includes("receita") || c.id.includes("pagamentos") ? "R$ 0,00" : "0" }))
  );
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [dashRes, hojeRes, alertasRes, finRes] = await Promise.all([
          api.get("/dashboard"),
          api.get("/dashboard/hoje"),
          api.get("/dashboard/alertas"),
          api.get("/dashboard/financeiro").catch(() => null),
        ]);

        const dashboardData = dashRes.data;
        const hojeData = hojeRes.data;
        const alertasData = alertasRes.data;
        const finResData = finRes?.data;

        if (dashboardData) {
          setStats((prev) =>
            prev.map((card) => {
              if (card.id === "atendimentos-hoje" && dashboardData.atendimentosHoje !== undefined) {
                return { ...card, value: String(dashboardData.atendimentosHoje) };
              }
              if (card.id === "novos-pacientes" && dashboardData.novoPacientesMes !== undefined) {
                return { ...card, value: String(dashboardData.novoPacientesMes) };
              }
              if (card.id === "faltas-hoje" && dashboardData.faltasHoje !== undefined) {
                return { ...card, value: String(dashboardData.faltasHoje) };
              }
              if (card.id === "aguardando-avaliacao" && dashboardData.aguardandoAvaliacao !== undefined) {
                return { ...card, value: String(dashboardData.aguardandoAvaliacao) };
              }
              if (card.id === "receita-mes" && finResData?.receita !== undefined) {
                return { ...card, value: `R$ ${finResData.receita.toLocaleString("pt-BR")}` };
              }
              if (card.id === "pagamentos-pendentes" && dashboardData.pagamentosPendentes?.total !== undefined) {
                return { ...card, value: `R$ ${dashboardData.pagamentosPendentes.total.toLocaleString("pt-BR")}` };
              }
              return card;
            })
          );
        }

        setConsultas(hojeData || []);
        setAlertas(alertasData || []);
      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const mappedConsultas = consultas.map((c: any) => {
    if (c.horario && c.paciente) return c;
    const dateObj = new Date(c.data);
    const formattedHorario = dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const initials = c.paciente?.nome
      ? c.paciente.nome.split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase()
      : "P";

    return {
      id: c.id,
      horario: formattedHorario,
      paciente: c.paciente?.nome || "Paciente",
      profissional: c.profissional?.usuario?.nome || "Profissional",
      especialidade: c.profissional?.especialidade || "Terapeuta",
      tipo: c.tipo || "presencial",
      sala: c.sala?.nome || "Sala",
      status: c.status?.toLowerCase() || "aguardando",
      foto: initials,
    };
  });

  const mappedAlertas = alertas.map((a: any, index: number) => {
    if (a.icon) return a;
    let icon = Clock;
    if (a.tipo === "warning") icon = DollarSign;
    else if (a.tipo === "info") icon = CalendarX;
    else if (a.tipo === "success") icon = CheckCircle2;
    else if (a.tipo === "error") icon = XCircle;

    return {
      id: `alert-${index}`,
      tipo: a.tipo || "info",
      mensagem: a.mensagem,
      acao: "Ver detalhes",
      url: a.url || "/dashboard",
      icon,
    };
  });

  const router = useRouter();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-[1600px] mx-auto"
    >
      {/* ─── Título da Página ─── */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-purple-800 dark:text-purple-100 capitalize">{today}</h1>
          <p className="text-sm mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
            Bem-vindo ao Instituto Conectar
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/agenda")}
          className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary-600 shadow-md shadow-primary/10 cursor-pointer"
          id="btn-dashboard-novo-atendimento"
        >
          <Activity className="h-4 w-4" />
          Iniciar Atendimento
        </motion.button>
      </motion.div>

      {/* ─── Stats Cards ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((card, i) => (
          <StatCard key={card.id} card={card} index={i} />
        ))}
      </div>

      {/* ─── Linha 2: Próximas Consultas + Alertas ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Próximas Consultas */}
        <ConsultasList consultas={mappedConsultas} />

        {/* Coluna Direita: Alertas + Aniversariantes */}
        <div className="space-y-4">
          <AlertasList alertas={mappedAlertas} />
          <AniversariantesList aniversariantes={aniversariantes} />
        </div>
      </div>

      {/* ─── Linha 3: Gráficos ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <FinanceAreaChart data={evolucaoFinanceira} />
        <EspecialidadesPieChart data={atendimentosPorEspecialidade} />
      </div>
    </motion.div>
  );
}
