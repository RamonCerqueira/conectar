"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  CheckCircle,
  FileSpreadsheet,
  FileText,
  Clock,
  Sparkles,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { api } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-errors";
import { toast } from "sonner";

// ─── CATÁLOGO DE RELATÓRIOS DO SERVIDOR ───────────────────────────────────────────────
const reportsList = [
  {
    id: "rep-2",
    titulo: "Faturamento Mensal e Lucratividade",
    descricao: "Detalhamento de receitas pagas, despesas quitadas e margem de lucro operacional.",
    tipo: "Financeiro",
    formato: "CSV",
  },
  {
    id: "rep-3",
    titulo: "Taxa de Faltas e Evasão Clínica",
    descricao: "Totais de atendimentos agrupados por status.",
    tipo: "Atendimentos",
    formato: "CSV",
  },
  {
    id: "rep-4",
    titulo: "Pacientes por Status e Sexo",
    descricao: "Totais de pacientes cadastrados agrupados por status e sexo.",
    tipo: "Pacientes",
    formato: "CSV",
  },
];

export function RelatoriosPage() {
  const [reports, setReports] = useState(reportsList);
  const [exporting, setExporting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("TODOS");

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.descricao.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = activeTab === "TODOS" || r.tipo === activeTab;

    return matchesSearch && matchesTab;
  });

  const exportReport = async (id: string, title: string) => {
    if (exporting) return;
    setExporting(id);
    try {
      const endpoint = { "rep-2": "financeiro", "rep-3": "atendimentos", "rep-4": "pacientes" }[id];
      const { data } = await api.get(`/relatorios/${endpoint}`);
      const rows: string[][] = [["Métrica", "Grupo", "Valor"]];
      const flatten = (value: unknown, path: string[] = []) => {
        if (value !== null && typeof value === "object") Object.entries(value).forEach(([key, val]) => flatten(val, [...path, key]));
        else rows.push([path[0] || "total", path.slice(1).join(" / "), String(value ?? "")]);
      };
      flatten(data);
      const quote = (value: string) => '"' + (/^[=+@-]/.test(value) ? "'" : "") + value.replace(/"/g, '""') + '"';
      const blob = new Blob(["\uFEFF" + rows.map(row => row.map(quote).join(";")).join("\r\n")], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${endpoint}-${new Date().toISOString().slice(0,10)}.csv`; document.body.appendChild(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success(`Relatório "${title}" gerado com dados do servidor.`);
    } catch (error) { toast.error(getApiErrorMessage(error, "Não foi possível exportar o relatório.")); }
    finally { setExporting(null); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "hsl(var(--foreground))" }}>
          Relatórios & Métricas Operacionais
        </h1>
        <p className="text-sm text-muted-foreground">
          Exportação de relatórios gerenciais, faturamento financeiro, dados de frequência e ocupação da clínica.
        </p>
      </div>

      {/* Abas e Filtros */}
      <div
        className="p-4 rounded-2xl border flex flex-col md:flex-row gap-4 bg-card"
        style={{ borderColor: "hsl(var(--border))" }}
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por título de relatório..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none border transition-colors bg-muted border-transparent text-foreground"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {["TODOS", "Clínico", "Financeiro", "Atendimentos", "Pacientes"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer",
                activeTab === tab
                  ? "gradient-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {tab === "TODOS" ? "Todos" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Relatórios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReports.map((rep) => (
          <motion.div
            layout
            key={rep.id}
            whileHover={{ y: -4 }}
            className="rounded-2xl border p-5 flex flex-col justify-between relative overflow-hidden transition-all shadow-sm bg-card"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2 border-b pb-3">
                <span className="text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-300 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  {rep.tipo}
                </span>
                <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                  {rep.formato === "PDF" ? (
                    <>
                      <FileText className="h-3.5 w-3.5 text-purple-500" /> PDF Document
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" /> Planilha CSV
                    </>
                  )}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-bold text-base text-foreground leading-tight">
                  {rep.titulo}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {rep.descricao}
                </p>
              </div>
            </div>

            <div className="h-[1px] bg-border my-5" />

            {/* Ação Exportar */}
            <button
              disabled={exporting !== null}
              onClick={() => exportReport(rep.id, rep.titulo)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold transition-all hover:bg-purple-500/10 hover:border-purple-500 text-purple-500 cursor-pointer"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <Download className="h-4 w-4" />
              <span>{exporting === rep.id ? "Gerando…" : `Exportar Dados (${rep.formato})`}</span>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
