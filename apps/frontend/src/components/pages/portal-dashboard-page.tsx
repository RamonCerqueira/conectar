"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Calendar,
  Clock,
  ClipboardList,
  HeartHandshake,
  DollarSign,
  BookOpen,
  FileText,
  LogOut,
  Sparkles,
  CheckCircle,
  HelpCircle,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

// ─── DADOS CLÍNICOS E FINANCEIROS MOCKADOS PARA O FILHO ───────────────────────
const pacienteMock = {
  nome: "Lucas Mendes da Silva",
  idade: 8,
  nascimento: "2018-05-15",
  diagnosticos: ["TDAH", "Dislexia"],
  agenda: [
    { id: "a-1", data: "2026-06-26T09:00:00", profissional: "Dra. Ana Lima", especialidade: "Psicopedagogia", tipo: "Presencial", sala: "Sala 01" },
  ],
  evolucoes: [
    { id: "e-1", data: "2026-06-24", profissional: "Dra. Ana Lima", nota: "Evolução excelente na leitura silábica. Realizou atividade de associação visual com 90% de acertos." },
    { id: "e-2", data: "2026-06-17", profissional: "Dra. Ana Lima", nota: "Início agitado, demorou 10 minutos para focar. Respondeu bem após introdução de elemento lúdico." },
  ],
  exercicios: [
    { id: "ex-1", titulo: "Caça-Palavras Silábico", tipo: "pdf", realizado: true },
    { id: "ex-2", titulo: "Leitura Compartilhada - Livro O Pequeno Príncipe", tipo: "leitura", realizado: false },
  ],
  laudos: [
    { id: "la-1", titulo: "Declaração de Acompanhamento Clínico.pdf", data: "2026-02-10" },
    { id: "la-2", titulo: "Termo de Consentimento LGPD.pdf", data: "2026-02-10" },
  ],
  financeiro: [
    { id: "f-1", descricao: "Mensalidade - Junho 2026", valor: 1200, status: "PAGO", vencimento: "2026-06-10" },
    { id: "f-2", descricao: "Mensalidade - Julho 2026", valor: 1200, status: "PENDENTE", vencimento: "2026-07-10" },
  ],
};

export function PortalDashboardPage() {
  const router = useRouter();
  const [parentName, setParentName] = useState("Mariana Mendes");
  const [paciente, setPaciente] = useState(pacienteMock);
  const [activeTab, setActiveTab] = useState("agenda");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const name = localStorage.getItem("parentName");
      if (name) setParentName(name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("parentName");
    localStorage.removeItem("pacienteId");
    router.push("/portal/login");
  };

  const handleCompleteExercicio = (id: string) => {
    setPaciente({
      ...paciente,
      exercicios: paciente.exercicios.map((ex) =>
        ex.id === id ? { ...ex, realizado: !ex.realizado } : ex
      ),
    });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background-soft">
      {/* Topbar */}
      <header
        className="h-16 flex items-center justify-between px-6 border-b shrink-0 bg-card"
        style={{ borderColor: "hsl(var(--border))" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
              Portal dos Pais
            </p>
            <p className="text-sm font-bold text-foreground">Conectar</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-muted-foreground">
            Olá, <strong>{parentName}</strong>
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

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Abas */}
        <aside
          className="w-full md:w-60 border-r shrink-0 flex flex-col p-4 space-y-2 bg-card text-xs"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <div className="p-3 bg-purple-500/5 rounded-xl border border-purple-500/10 space-y-1 mb-4">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Criança vinculada:</p>
            <p className="font-bold text-purple-600 leading-none">{paciente.nome}</p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Idade: {paciente.idade} anos • Diagnósticos: {paciente.diagnosticos.join(", ")}
            </p>
          </div>

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
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all text-left cursor-pointer",
                activeTab === tab.id
                  ? "gradient-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <tab.icon className="h-4 w-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 text-xs bg-background-soft">
          {/* Tab 1: Agenda */}
          {activeTab === "agenda" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-foreground">Consultas Agendadas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paciente.agenda.map((ag) => (
                  <div
                    key={ag.id}
                    className="p-5 rounded-2xl border bg-card space-y-4 shadow-sm"
                    style={{ borderColor: "hsl(var(--border))" }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold bg-purple-500/10 text-purple-600 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                          {ag.especialidade}
                        </span>
                        <h3 className="font-bold text-base text-foreground mt-2">{ag.profissional}</h3>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-500 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Confirmado
                      </span>
                    </div>

                    <div className="h-[1px] bg-border" />

                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <span className="font-medium text-foreground">{formatDate(ag.data)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-500" />
                        <span className="font-medium text-foreground">{ag.data.split("T")[1].slice(0, 5)} h</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-purple-500" />
                        <span className="font-medium text-foreground">{ag.tipo} — {ag.sala}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Evoluções */}
          {activeTab === "evolucoes" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-foreground">Relatos e Evoluções Terapêuticas</h2>
              <div className="relative pl-6 border-l border-purple-500/20 space-y-6">
                {paciente.evolucoes.map((ev) => (
                  <div key={ev.id} className="relative p-4 rounded-xl border bg-card space-y-2 shadow-xs">
                    <div className="absolute -left-[28.5px] top-5 w-2 h-2 rounded-full bg-purple-500 border border-card" />
                    <div className="flex justify-between items-center text-[10px] border-b pb-2">
                      <span className="font-bold text-purple-600">{ev.profissional}</span>
                      <span className="text-muted-foreground">{formatDate(ev.data)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                      "{ev.nota}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Tarefas */}
          {activeTab === "tarefas" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-foreground">Exercícios e Atividades Domiciliares</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paciente.exercicios.map((ex) => (
                  <div
                    key={ex.id}
                    className="p-4 rounded-xl border bg-card flex items-center justify-between shadow-xs"
                    style={{ borderColor: "hsl(var(--border))" }}
                  >
                    <div>
                      <p className="font-bold text-foreground">{ex.titulo}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold mt-0.5">Tipo: {ex.tipo}</p>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer font-bold text-foreground">
                      <input
                        type="checkbox"
                        checked={ex.realizado}
                        onChange={() => handleCompleteExercicio(ex.id)}
                        className="rounded border-border text-purple-500 outline-none"
                      />
                      {ex.realizado ? "Realizado" : "Pendente"}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Documentos */}
          {activeTab === "docs" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-foreground">Declarações, Laudos e Documentos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paciente.laudos.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border bg-card flex items-center justify-between shadow-xs"
                    style={{ borderColor: "hsl(var(--border))" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-500">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{doc.titulo}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Criado em: {formatDate(doc.data)}</p>
                      </div>
                    </div>

                    <button
                      className="py-1 px-3 border rounded text-[10px] font-semibold hover:bg-muted transition-colors cursor-pointer"
                      style={{ borderColor: "hsl(var(--border))" }}
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Financeiro */}
          {activeTab === "financeiro" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-foreground">Histórico de Cobranças e Mensalidades</h2>
              <div className="overflow-hidden border rounded-xl bg-card">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-muted/50 border-b text-muted-foreground font-semibold">
                      <th className="p-3">Descrição</th>
                      <th className="p-3">Vencimento</th>
                      <th className="p-3">Valor</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {paciente.financeiro.map((lanc) => (
                      <tr key={lanc.id} className="hover:bg-muted/10 transition-colors">
                        <td className="p-3 font-semibold text-foreground">{lanc.descricao}</td>
                        <td className="p-3 text-muted-foreground">{formatDate(lanc.vencimento)}</td>
                        <td className="p-3 font-bold text-foreground">R$ {lanc.valor.toFixed(2)}</td>
                        <td className="p-3">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider",
                              lanc.status === "PAGO" && "bg-emerald-500/10 text-emerald-500",
                              lanc.status === "PENDENTE" && "bg-amber-500/10 text-amber-500"
                            )}
                          >
                            {lanc.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Pequeno helper local para Briefcase
function Briefcase(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 2H9a2 2 0 0 0-2 2v2H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4V4a2 2 0 0 0-2-2z" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
      <path d="M12 11h.01" />
    </svg>
  );
}
