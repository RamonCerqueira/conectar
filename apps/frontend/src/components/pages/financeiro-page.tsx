"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  X,
  Calendar,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

// ─── DADOS MOCKADOS COMPLETOS ───────────────────────────────────────────────
const initialLancamentos = [
  {
    id: "f-1",
    tipo: "RECEITA" as const,
    descricao: "Mensalidade - Lucas Mendes (Junho)",
    valor: 1200,
    formaPagamento: "PIX",
    status: "PAGO" as const,
    vencimento: "2026-06-10",
    pagamento: "2026-06-10",
  },
  {
    id: "f-2",
    tipo: "RECEITA" as const,
    descricao: "Mensalidade - Sofia Andrade (Junho)",
    valor: 1400,
    formaPagamento: "CARTAO_CREDITO",
    status: "PAGO" as const,
    vencimento: "2026-06-10",
    pagamento: "2026-06-08",
  },
  {
    id: "f-3",
    tipo: "DESPESA" as const,
    descricao: "Aluguel da Clínica",
    valor: 3500,
    formaPagamento: "TRANSFERENCIA",
    status: "PAGO" as const,
    vencimento: "2026-06-05",
    pagamento: "2026-06-05",
  },
  {
    id: "f-4",
    tipo: "RECEITA" as const,
    descricao: "Mensalidade - Pedro Oliveira (Junho)",
    valor: 1200,
    formaPagamento: "PIX",
    status: "PENDENTE" as const,
    vencimento: "2026-06-10",
    pagamento: null,
  },
  {
    id: "f-5",
    tipo: "DESPESA" as const,
    descricao: "Materiais Pedagógicos e Brinquedos",
    valor: 450,
    formaPagamento: "PIX",
    status: "PAGO" as const,
    vencimento: "2026-06-15",
    pagamento: "2026-06-15",
  },
];

const cashFlowData = [
  { mes: "Jan", receitas: 32000, despesas: 15000 },
  { mes: "Fev", receitas: 35000, despesas: 16000 },
  { mes: "Mar", receitas: 41000, despesas: 17500 },
  { mes: "Abr", receitas: 38000, despesas: 16200 },
  { mes: "Mai", receitas: 45000, despesas: 19000 },
  { mes: "Jun", receitas: 48350, despesas: 18500 },
];

export function FinanceiroPage() {
  const [lancamentos, setLancamentos] = useState(initialLancamentos);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("TODOS");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [tipo, setTipo] = useState("RECEITA");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [forma, setForma] = useState("PIX");
  const [vencimento, setVencimento] = useState("2026-06-26");

  const loadLancamentos = async () => {
    try {
      const res = await api.get("/financeiro");
      if (res.data && res.data.length > 0) {
        const mapped = res.data.map((l: any) => ({
          id: l.id,
          tipo: l.tipo || "RECEITA",
          descricao: l.descricao || "",
          valor: parseFloat(l.valor) || 0,
          formaPagamento: l.formaPagamento || "PIX",
          status: l.status || "PENDENTE",
          vencimento: l.vencimento ? l.vencimento.split("T")[0] : "",
          pagamento: l.pagamento ? l.pagamento.split("T")[0] : null,
        }));
        setLancamentos(mapped);
      }
    } catch (err) {
      console.warn("Could not load real transactions, using mocks", err);
    }
  };

  useEffect(() => {
    loadLancamentos();
  }, []);

  const handleCreateLancamento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao || !valor) return;

    const payload = {
      tipo,
      descricao,
      valor: parseFloat(valor),
      formaPagamento: forma,
      status: "PENDENTE",
      vencimento: new Date(vencimento).toISOString(),
    };

    try {
      await api.post("/financeiro", payload);
      toast.success("Lançamento financeiro registrado!");
      loadLancamentos();
      setIsModalOpen(false);
      setDescricao("");
      setValor("");
    } catch (err) {
      console.warn("Could not save to real backend, fallback to local state", err);
      // Fallback
      const newLanc = {
        id: `f-${Date.now()}`,
        tipo: tipo as any,
        descricao: descricao,
        valor: parseFloat(valor),
        formaPagamento: forma,
        status: "PENDENTE" as const,
        vencimento: vencimento,
        pagamento: null,
      };

      setLancamentos([newLanc, ...lancamentos]);
      setIsModalOpen(false);
      setDescricao("");
      setValor("");
      toast.success("Lançamento registrado (Modo de Demonstração)");
    }
  };

  const handlePagar = async (id: string) => {
    try {
      if (id.startsWith("f-")) throw new Error("Mock ID");
      await api.put(`/financeiro/${id}`, {
        status: "PAGO",
        pagamento: new Date().toISOString(),
      });
      toast.success("Lançamento marcado como Pago!");
      loadLancamentos();
    } catch (err) {
      console.warn("Could not mark as paid in backend, using local fallback", err);
      setLancamentos(
        lancamentos.map((l) =>
          l.id === id
            ? { ...l, status: "PAGO" as const, pagamento: new Date().toISOString().split("T")[0] }
            : l
        )
      );
      toast.success("Lançamento marcado como Pago (Modo de Demonstração)");
    }
  };

  const filteredLancamentos = lancamentos.filter((l) => {
    const matchesSearch = l.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = tipoFilter === "TODOS" || l.tipo === tipoFilter;
    return matchesSearch && matchesTipo;
  });

  // Métricas
  const totalReceitas = lancamentos
    .filter((l) => l.tipo === "RECEITA" && l.status === "PAGO")
    .reduce((sum, l) => sum + l.valor, 0);

  const totalDespesas = lancamentos
    .filter((l) => l.tipo === "DESPESA" && l.status === "PAGO")
    .reduce((sum, l) => sum + l.valor, 0);

  const pendentes = lancamentos
    .filter((l) => l.status === "PENDENTE")
    .reduce((sum, l) => sum + l.valor, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "hsl(var(--foreground))" }}>
            Gestão Financeira & Fluxo de Caixa
          </h1>
          <p className="text-sm text-muted-foreground">
            Lançamento de mensalidades, despesas clínicas, fluxo de caixa e relatórios financeiros.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Lançamento</span>
        </motion.button>
      </div>

      {/* Grid de Cartões de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Receitas Clientes (Pago)", val: totalReceitas, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/20", icon: TrendingUp },
          { label: "Despesas Clínicas (Pago)", val: totalDespesas, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/20", icon: TrendingDown },
          { label: "Saldo Líquido", val: totalReceitas - totalDespesas, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/20", icon: Wallet },
          { label: "Valores Pendentes", val: pendentes, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/20", icon: AlertTriangle },
        ].map((card, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border bg-card flex items-center justify-between shadow-xs"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <div className="space-y-1.5">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{card.label}</span>
              <p className={cn("text-2xl font-extrabold", card.color)}>{formatCurrency(card.val)}</p>
            </div>
            <div className={cn("p-3 rounded-xl shrink-0", card.bg, card.color)}>
              <card.icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico de Evolução (Cash Flow) */}
      <div
        className="p-6 rounded-2xl border bg-card space-y-4"
        style={{ borderColor: "hsl(var(--border))" }}
      >
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wide">
          <Sparkles className="h-4 w-4 text-purple-500" /> Fluxo de Caixa (Mensal)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cashFlowData}>
              <defs>
                <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8E7BBE" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8E7BBE" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E98BAE" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#E98BAE" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="receitas" stroke="#8E7BBE" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReceitas)" name="Receitas" />
              <Area type="monotone" dataKey="despesas" stroke="#E98BAE" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDespesas)" name="Despesas" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela de Lançamentos */}
      <div className="space-y-4">
        {/* Filtros e Busca */}
        <div
          className="p-4 rounded-2xl border flex flex-col md:flex-row gap-4 bg-card"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por descrição de lançamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none border transition-colors bg-muted border-transparent text-foreground"
            />
          </div>

          <div className="flex gap-2">
            {["TODOS", "RECEITA", "DESPESA"].map((t) => (
              <button
                key={t}
                onClick={() => setTipoFilter(t)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer",
                  tipoFilter === t
                    ? "gradient-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {t === "TODOS" ? "Todos" : t.replace("RECEITA", "Receitas").replace("DESPESA", "Despesas")}
              </button>
            ))}
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-hidden border rounded-2xl bg-card" style={{ borderColor: "hsl(var(--border))" }}>
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Descrição</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Valor</th>
                <th className="p-4">Forma</th>
                <th className="p-4">Vencimento</th>
                <th className="p-4">Pagamento</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredLancamentos.map((l) => (
                <tr key={l.id} className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 font-bold text-foreground">{l.descricao}</td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider",
                        l.tipo === "RECEITA" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
                      )}
                    >
                      {l.tipo}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-foreground">{formatCurrency(l.valor)}</td>
                  <td className="p-4 text-muted-foreground">{l.formaPagamento}</td>
                  <td className="p-4 text-muted-foreground">{formatDate(l.vencimento)}</td>
                  <td className="p-4 text-muted-foreground">
                    {l.pagamento ? formatDate(l.pagamento) : "—"}
                  </td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider",
                        l.status === "PAGO" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                      )}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {l.status === "PENDENTE" && (
                      <button
                        onClick={() => handlePagar(l.id)}
                        className="py-1.5 px-3 rounded-lg border border-emerald-500/20 text-emerald-600 font-bold hover:bg-emerald-500/10 transition-all cursor-pointer text-[10px] uppercase tracking-wider"
                      >
                        Confirmar Pago
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLancamentos.length === 0 && (
            <div className="p-12 text-center text-xs text-muted-foreground">
              Nenhum lançamento financeiro registrado.
            </div>
          )}
        </div>
      </div>

      {/* ─── MODAL NOVO LANÇAMENTO (RECEITA / DESPESA) ────────────────────── */}
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
              {/* Header */}
              <div className="p-6 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-foreground">Novo Lançamento Financeiro</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Registre receitas ou despesas da clínica.</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-muted text-muted-foreground cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateLancamento} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Tipo de Movimentação</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs bg-card outline-none"
                  >
                    <option value="RECEITA">Receita (Entrada)</option>
                    <option value="DESPESA">Despesa (Saída)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Descrição</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Mensalidade - Arthur Lima"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Valor (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={valor}
                      onChange={(e) => setValor(e.target.value)}
                      className="w-full p-2.5 rounded-xl border text-xs outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Forma de Pagamento</label>
                    <select
                      value={forma}
                      onChange={(e) => setForma(e.target.value)}
                      className="w-full p-2.5 rounded-xl border text-xs bg-card outline-none"
                    >
                      <option value="PIX">PIX</option>
                      <option value="CARTAO_CREDITO">Cartão de Crédito</option>
                      <option value="CARTAO_DEBITO">Cartão de Débito</option>
                      <option value="DINHEIRO">Dinheiro</option>
                      <option value="BOLETO">Boleto Bancário</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Data de Vencimento</label>
                  <input
                    type="date"
                    required
                    value={vencimento}
                    onChange={(e) => setVencimento(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs bg-card outline-none"
                  />
                </div>

                <div className="pt-4 border-t flex justify-end gap-3">
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
                    Lançar Movimento
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
