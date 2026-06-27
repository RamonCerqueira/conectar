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
  Clock,
  User,
  FileText,
  CheckCircle,
  QrCode,
  Download,
  Info,
  Briefcase,
  Users,
  RefreshCw,
  PlusCircle,
  Trash2,
  Check,
  Send,
  Lock,
  Unlock,
  Printer
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

interface Employee {
  id: string;
  nome: string;
  cargo: string;
  tipoContrato: "CLT" | "PJ";
  salarioBase: number;
  cpfCnpj: string;
  telefone: string;
  comissaoPorcentagem?: number;
  chavePix?: string;
}

export function FinanceiroPage() {
  const [activeTab, setActiveTab] = useState<"fluxo" | "lancamentos" | "folha" | "repasses" | "inadimplentes" | "caixa">("fluxo");
  const [lancamentos, setLancamentos] = useState<any[]>([]);
  const [funcionarios, setFuncionarios] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("TODOS");
  const [contaFilter, setContaFilter] = useState("TODOS");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states (Novo Lançamento)
  const [tipo, setTipo] = useState("RECEITA");
  const [categoria, setCategoria] = useState("Mensalidades Pacientes");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [forma, setForma] = useState("PIX");
  const [contaCaixa, setContaCaixa] = useState("Caixa Geral");
  const [vencimento, setVencimento] = useState("");
  const [repetirDespesa, setRepetirDespesa] = useState(false);
  const [repetirMeses, setRepetirMeses] = useState("6");

  // Payroll modal state
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [mesReferencia, setMesReferencia] = useState("06/2026");
  const [horasExtras, setHorasExtras] = useState("0");
  const [descontosExtras, setDescontosExtras] = useState("0");
  const [incluirFerias, setIncluirFerias] = useState(false);
  const [incluirVT, setIncluirVT] = useState(true);
  const [empAdvances, setEmpAdvances] = useState<any[]>([]);

  // Vales / Advances sub-modal
  const [isAdvancesModalOpen, setIsAdvancesModalOpen] = useState(false);
  const [advancesList, setAdvancesList] = useState<any[]>([]);
  const [advVal, setAdvVal] = useState("");
  const [advObs, setAdvObs] = useState("");

  // PIX Checkout QrCode Simulator modal
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [pixPayload, setPixPayload] = useState<any | null>(null);

  // Repasses state
  const [repassesList, setRepassesList] = useState<any[]>([]);
  const [repassesLoading, setRepassesLoading] = useState(false);

  // Cashier Status state
  const [caixaStatus, setCaixaStatus] = useState<any | null>(null);
  const [caixaHistorico, setCaixaHistorico] = useState<any[]>([]);
  const [aberturaSaldo, setAberturaSaldo] = useState("50.00");
  const [fechamentoFisico, setFechamentoFisico] = useState("");
  const [fechamentoJustificativa, setFechamentoJustificativa] = useState("");

  // Load ledger transactions
  const loadLancamentos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/financeiro");
      const data = res.data || [];
      const mapped = data.map((l: any) => ({
        id: l.id,
        tipo: l.tipo || "RECEITA",
        descricao: l.descricao || "",
        valor: parseFloat(l.valor) || 0,
        formaPagamento: l.formaPagamento || "PIX",
        status: l.status || "PENDENTE",
        vencimento: l.vencimento ? l.vencimento.split("T")[0] : "",
        pagamento: l.pagamento ? l.pagamento.split("T")[0] : null,
        observacoes: l.observacoes || "",
        contaCaixa: l.contaCaixa || "Caixa Geral",
      }));
      setLancamentos(mapped);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar lançamentos financeiros.");
    } finally {
      setLoading(false);
    }
  };

  // Load all employees (users and professionals) for payroll calculation
  const loadFuncionarios = async () => {
    try {
      const [resUsers, resProfs] = await Promise.all([
        api.get("/usuarios"),
        api.get("/profissionais"),
      ]);

      const colaboradores = (resUsers.data || [])
        .filter((u: any) => u.perfil !== "PAIS" && u.perfil !== "ADMINISTRADOR")
        .map((u: any) => ({
          id: u.id,
          nome: u.nome,
          cargo: u.perfil === "RECEPCAO" ? "Recepção / Secretária" : "Administrativo",
          tipoContrato: (u.tipoContrato || "CLT") as "CLT" | "PJ",
          salarioBase: u.salarioBase ? parseFloat(u.salarioBase) : 1800,
          cpfCnpj: u.cpfCnpj || "000.000.000-00",
          telefone: u.telefone || "(00) 00000-0000",
          chavePix: u.chavePix || "",
        }));

      const clinicos = (resProfs.data || []).map((p: any) => ({
        id: p.id,
        nome: p.usuario?.nome || "Terapeuta",
        cargo: p.cargo || "Clínico",
        tipoContrato: (p.tipoContrato || "PJ") as "CLT" | "PJ",
        salarioBase: p.salarioBase ? parseFloat(p.salarioBase) : 3200,
        cpfCnpj: p.cpfCnpj || "000.000.000-00",
        telefone: p.telefone || "(00) 00000-0000",
        comissaoPorcentagem: p.comissaoPorcentagem ? parseFloat(p.comissaoPorcentagem) : 50,
        chavePix: p.chavePix || "",
      }));

      setFuncionarios([...colaboradores, ...clinicos]);
    } catch (err) {
      console.error("Erro ao carregar funcionários para a folha:", err);
    }
  };

  const loadCaixaStatus = async () => {
    try {
      const res = await api.get("/financeiro/caixa/status");
      setCaixaStatus(res.data);
    } catch (err) {
      console.error("Erro ao carregar status do caixa:", err);
    }
  };

  const loadCaixaHistorico = async () => {
    try {
      const res = await api.get("/financeiro/caixa/historico");
      setCaixaHistorico(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar histórico de caixas:", err);
    }
  };

  const loadRepasses = async () => {
    setRepassesLoading(true);
    try {
      const res = await api.get(`/financeiro/repasses/${mesReferencia.replace("/", "-")}`);
      setRepassesList(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar repasses:", err);
    } finally {
      setRepassesLoading(false);
    }
  };

  const loadAdvances = async (empId: string) => {
    try {
      const res = await api.get(`/financeiro/adiantamentos?refMes=${mesReferencia}`);
      const list = (res.data || []).filter((a: any) => a.usuarioId === empId);
      setAdvancesList(list);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadLancamentos();
    loadFuncionarios();
    loadCaixaStatus();
    loadCaixaHistorico();
    
    // Set default due date to today
    const today = new Date().toISOString().split("T")[0];
    setVencimento(today);
  }, []);

  useEffect(() => {
    if (activeTab === "repasses") {
      loadRepasses();
    } else if (activeTab === "caixa") {
      loadCaixaHistorico();
    }
  }, [activeTab, mesReferencia]);

  const handleCreateLancamento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao || !valor) return;

    const fullDescription = `[${categoria}] ${descricao}`;
    const baseValue = parseFloat(valor);

    try {
      if (tipo === "DESPESA" && repetirDespesa) {
        // Criar despesas fixas recorrentes
        const totalMeses = parseInt(repetirMeses) || 1;
        const today = new Date(vencimento);

        for (let i = 0; i < totalMeses; i++) {
          const venc = new Date(today.getFullYear(), today.getMonth() + i, today.getDate());
          const refMes = `${venc.getFullYear()}-${String(venc.getMonth() + 1).padStart(2, "0")}`;
          
          await api.post("/financeiro", {
            tipo: "DESPESA",
            descricao: `${fullDescription} (Parc. ${i + 1}/${totalMeses})`,
            valor: baseValue,
            formaPagamento: forma,
            status: "PENDENTE",
            vencimento: venc.toISOString(),
            contaCaixa,
            observacoes: `Lançamento fixo recorrente gerado automaticamente.`,
          });
        }
        toast.success(`${totalMeses} despesas fixas recorrentes lançadas com sucesso!`);
      } else {
        // Lançamento avulso simples
        await api.post("/financeiro", {
          tipo,
          descricao: fullDescription,
          valor: baseValue,
          formaPagamento: forma,
          status: "PENDENTE",
          vencimento: new Date(vencimento).toISOString(),
          contaCaixa,
        });
        toast.success("Lançamento financeiro registrado com sucesso!");
      }

      loadLancamentos();
      setIsModalOpen(false);
      setDescricao("");
      setValor("");
      setRepetirDespesa(false);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar lançamento financeiro.");
    }
  };

  const handlePagar = async (id: string) => {
    try {
      await api.put(`/financeiro/${id}`, {
        status: "PAGO",
        pagamento: new Date().toISOString(),
      });
      toast.success("Lançamento marcado como Pago!");
      loadLancamentos();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao marcar lançamento como pago.");
    }
  };

  // ─── CAIXA OPERATIONS ─────────────────────────────────────────────────────
  
  const handleAbrirCaixa = async () => {
    try {
      await api.post("/financeiro/caixa/abrir", { saldoInicial: parseFloat(aberturaSaldo) || 0 });
      toast.success("Caixa diário aberto com sucesso!");
      loadCaixaStatus();
      loadCaixaHistorico();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao abrir caixa.");
    }
  };

  const handleFecharCaixa = async () => {
    if (!fechamentoFisico) {
      toast.error("Informe o valor físico contado em caixa.");
      return;
    }
    try {
      await api.post("/financeiro/caixa/fechar", {
        conferidoDinh: parseFloat(fechamentoFisico) || 0,
        justificativa: fechamentoJustificativa
      });
      toast.success("Caixa fechado e reconciliado com sucesso!");
      setFechamentoFisico("");
      setFechamentoJustificativa("");
      loadCaixaStatus();
      loadCaixaHistorico();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao fechar caixa.");
    }
  };

  const handleAprovarCaixa = async (id: string) => {
    try {
      await api.post(`/financeiro/caixa/aprovar/${id}`);
      toast.success("Fechamento de caixa aprovado e conciliado!");
      loadCaixaHistorico();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao aprovar caixa.");
    }
  };

  // ─── REPASSES OPERATIONS ──────────────────────────────────────────────────
  
  const handleLancarRepasse = async (rep: any) => {
    try {
      await api.post("/financeiro/repasses/lancar", {
        profId: rep.profId,
        nome: rep.nome,
        comissaoTotal: rep.comissaoTotal,
        mesReferencia,
      });
      toast.success(`Repasse PJ de ${rep.nome} lançado no caixa com sucesso!`);
      loadRepasses();
      loadLancamentos();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao lançar repasse no financeiro.");
    }
  };

  // ─── VALES / ADVANCES OPERATIONS ──────────────────────────────────────────
  
  const handleAddAdvance = async () => {
    if (!advVal || !selectedEmp) return;
    try {
      await api.post("/financeiro/adiantamentos", {
        usuarioId: selectedEmp.id,
        valor: parseFloat(advVal),
        referenciaMes: mesReferencia,
        observacoes: advObs,
      });
      toast.success("Adiantamento (vale) registrado!");
      setAdvVal("");
      setAdvObs("");
      loadAdvances(selectedEmp.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAdvance = async (id: string) => {
    try {
      await api.delete(`/financeiro/adiantamentos/${id}`);
      toast.success("Adiantamento excluído.");
      if (selectedEmp) {
        loadAdvances(selectedEmp.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openAdvancesModal = async (emp: Employee) => {
    setSelectedEmp(emp);
    await loadAdvances(emp.id);
    setIsAdvancesModalOpen(true);
  };

  // ─── PIX CHECKOUT SIMULATOR ───────────────────────────────────────────────
  
  const openPixCheckout = (l: any) => {
    setPixPayload(l);
    setIsPixModalOpen(true);
  };

  // ─── CONTRACQUE / COMPROVANTE PRINT HELPERS ────────────────────────────────
  
  const parseHoleriteDetails = (obs: string, valorLiquido: number) => {
    if (!obs || !obs.includes("Holerite Detalhado:")) {
      return { proventos: [], descontos: [] };
    }
    const detailPart = obs.split("Holerite Detalhado:")[1].split(". Chave Pix:")[0];
    const items = detailPart.split(" | ");
    
    const proventos: any[] = [];
    const descontos: any[] = [];
    
    items.forEach(item => {
      const parts = item.split(": ");
      if (parts.length === 2) {
        const label = parts[0];
        const valStr = parts[1].replace("+", "").replace("-", "").replace("R$", "").replace(".", "").replace(",", ".").trim();
        const val = parseFloat(valStr) || 0;
        if (parts[1].startsWith("-")) {
          descontos.push({ label, value: val });
        } else {
          proventos.push({ label, value: val });
        }
      }
    });

    return { proventos, descontos };
  };

  const handlePrintComprovante = (lancamento: any) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    
    const html = `
      <html>
        <head>
          <title>Comprovante - Conectar</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #7c3aed; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #7c3aed; }
            .title { font-size: 18px; font-weight: bold; margin-top: 10px; text-transform: uppercase; letter-spacing: 1px; }
            .content { line-height: 1.8; font-size: 14px; }
            .row { display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 10px 0; }
            .label { font-weight: bold; color: #666; }
            .value { font-weight: bold; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #999; border-top: 1px dashed #ccc; padding-top: 20px; }
            .signature { margin-top: 65px; text-align: center; display: inline-block; width: 250px; border-top: 1px solid #333; padding-top: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">INSTITUTO CONECTAR</div>
            <div class="title">Comprovante de Operação Financeira</div>
          </div>
          <div class="content">
            <div class="row"><span class="label">ID da Transação:</span><span class="value">${lancamento.id}</span></div>
            <div class="row"><span class="label">Tipo:</span><span class="value">${lancamento.tipo === 'RECEITA' ? 'RECEBIMENTO (ENTRADA)' : 'PAGAMENTO (SAÍDA)'}</span></div>
            <div class="row"><span class="label">Descrição:</span><span class="value">${lancamento.descricao}</span></div>
            <div class="row"><span class="label">Valor Liquidado:</span><span class="value">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lancamento.valor)}</span></div>
            <div class="row"><span class="label">Forma de Liquidação:</span><span class="value">${lancamento.formaPagamento}</span></div>
            <div class="row"><span class="label">Data de Vencimento:</span><span class="value">${lancamento.vencimento ? new Date(lancamento.vencimento + 'T00:00:00').toLocaleDateString('pt-BR') : '—'}</span></div>
            <div class="row"><span class="label">Data de Pagamento:</span><span class="value">${lancamento.pagamento ? new Date(lancamento.pagamento + 'T00:00:00').toLocaleDateString('pt-BR') : '—'}</span></div>
            <div class="row"><span class="label">Situação:</span><span class="value" style="color: #10b981;">EFETIVADO / PAGO</span></div>
          </div>
          <div style="text-align: center; margin-top: 40px;">
            <div class="signature">Assinatura do Responsável</div>
          </div>
          <div class="footer">
            Instituto Conectar Apoio à Aprendizagem LTDA | CNPJ: 12.345.678/0001-99
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handlePrintContracheque = (l: any) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    
    let cargo = "Funcionário";
    let nome = "Funcionário";
    let mes = "MM/AAAA";
    
    const desc = l.descricao;
    if (desc.includes("[Folha Salarial]")) {
      const cleanDesc = desc.replace("[Folha Salarial]", "").trim();
      const parts = cleanDesc.split(" - ");
      if (parts.length >= 2) {
        cargo = parts[0].trim();
        const nameAndMonth = parts[1].split(" (");
        nome = nameAndMonth[0].trim();
        if (nameAndMonth.length >= 2) {
          mes = nameAndMonth[1].replace(")", "").trim();
        }
      }
    } else if (desc.includes("[Vale Transporte]")) {
      const cleanDesc = desc.replace("[Vale Transporte] Liberação Ref:", "").trim();
      const parts = cleanDesc.split(" - ");
      if (parts.length >= 2) {
        mes = parts[0].trim();
        nome = parts[1].trim();
        cargo = "Auxílio Vale-Transporte";
      }
    }

    const { proventos, descontos } = parseHoleriteDetails(l.observacoes, l.valor);
    
    if (proventos.length === 0 && descontos.length === 0) {
      proventos.push({ label: desc.includes("Vale") ? "Vale Transporte Liberação" : "Vencimento Base", value: l.valor });
    }

    const totalProventos = proventos.reduce((sum, p) => sum + p.value, 0);
    const totalDescontos = descontos.reduce((sum, d) => sum + d.value, 0);
    const liquido = totalProventos - totalDescontos;

    const html = `
      <html>
        <head>
          <title>Contracheque - ${nome}</title>
          <style>
            body { font-family: monospace; padding: 20px; color: #000; font-size: 12px; }
            .border-box { border: 2px solid #000; padding: 15px; max-width: 800px; margin: auto; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
            .col { flex: 1; }
            .col-r { text-align: right; }
            .bold { font-weight: bold; }
            .section { border-bottom: 1px solid #000; padding: 5px 0; margin-bottom: 5px; }
            .grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 5px; border-bottom: 1px solid #000; padding-bottom: 5px; }
            .grid-head { font-weight: bold; border-bottom: 2px solid #000; padding-bottom: 2px; }
            .grid-row { padding: 4px 0; }
            .totals { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 5px; font-weight: bold; padding-top: 5px; border-top: 1px solid #000; }
            .footer { margin-top: 30px; display: flex; justify-content: space-between; }
            .sign-area { border-top: 1px solid #000; width: 220px; text-align: center; margin-top: 40px; padding-top: 5px; }
          </style>
        </head>
        <body>
          <div class="border-box">
            <div class="header">
              <div class="col">
                <div class="bold">INSTITUTO CONECTAR APOIO À APRENDIZAGEM LTDA</div>
                <div>CNPJ: 12.345.678/0001-99</div>
              </div>
              <div class="col col-r">
                <div class="bold">RECIBO DE PAGAMENTO DE SALÁRIO</div>
                <div>Referência: ${mes}</div>
              </div>
            </div>

            <div class="section grid-row">
              <div><span class="bold">Nome do Funcionário:</span> ${nome}</div>
              <div><span class="bold">Função/Cargo:</span> ${cargo}</div>
              <div><span class="bold">Identificação ID:</span> ${l.id.substring(0, 8)}</div>
            </div>

            <div class="grid grid-head">
              <div>Descrição do Evento</div>
              <div style="text-align: right;">Proventos (+)</div>
              <div style="text-align: right;">Descontos (-)</div>
            </div>

            ${proventos.map(p => `
              <div class="grid grid-row">
                <div>${p.label}</div>
                <div style="text-align: right;">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.value)}</div>
                <div style="text-align: right;">—</div>
              </div>
            `).join("")}

            ${descontos.map(d => `
              <div class="grid grid-row">
                <div>${d.label}</div>
                <div style="text-align: right;">—</div>
                <div style="text-align: right;">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(d.value)}</div>
              </div>
            `).join("")}

            <div style="height: 40px;"></div>

            <div class="totals">
              <div>Totais Consolidados</div>
              <div style="text-align: right;">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalProventos)}</div>
              <div style="text-align: right;">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalDescontos)}</div>
            </div>

            <div class="totals" style="border-top: 2px solid #000; margin-top: 5px; padding-top: 5px; font-size: 14px;">
              <div>VALOR LÍQUIDO A RECEBER:</div>
              <div style="grid-column: span 2; text-align: right;" class="bold">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(liquido)}</div>
            </div>

            <div class="footer">
              <div class="sign-area">Assinatura do Funcionário</div>
              <div class="sign-area">Instituto Conectar</div>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
  };

  // ─── CALCULATE SYSTEM METRICS ─────────────────────────────────────────────
  
  const filteredLancamentos = lancamentos.filter((l) => {
    const matchesSearch = l.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = tipoFilter === "TODOS" || l.tipo === tipoFilter;
    const matchesConta = contaFilter === "TODOS" || l.contaCaixa === contaFilter;
    return matchesSearch && matchesTipo && matchesConta;
  });

  const getAccountBalance = (account: string) => {
    const recs = lancamentos.filter(l => l.contaCaixa === account && l.status === "PAGO");
    const incoming = recs.filter(l => l.tipo === "RECEITA").reduce((sum, l) => sum + l.valor, 0);
    const outgoing = recs.filter(l => l.tipo === "DESPESA").reduce((sum, l) => sum + l.valor, 0);
    return incoming - outgoing;
  };

  const totalReceitas = lancamentos
    .filter((l) => l.tipo === "RECEITA" && l.status === "PAGO")
    .reduce((sum, l) => sum + l.valor, 0);

  const totalDespesas = lancamentos
    .filter((l) => l.tipo === "DESPESA" && l.status === "PAGO")
    .reduce((sum, l) => sum + l.valor, 0);

  const pendentes = lancamentos
    .filter((l) => l.status === "PENDENTE")
    .reduce((sum, l) => sum + l.valor, 0);

  // Group ledger entries by month to feed the cash flow chart
  const cashFlowData = (() => {
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const grouped: Record<string, { receitas: number; despesas: number }> = {};

    lancamentos.forEach((l) => {
      if (l.status !== "PAGO" || !l.vencimento) return;
      const date = new Date(l.vencimento + "T00:00:00");
      const monthLabel = months[date.getMonth()];
      if (!grouped[monthLabel]) grouped[monthLabel] = { receitas: 0, despesas: 0 };

      if (l.tipo === "RECEITA") {
        grouped[monthLabel].receitas += l.valor;
      } else {
        grouped[monthLabel].despesas += l.valor;
      }
    });

    return Object.keys(grouped).map((m) => ({
      mes: m,
      receitas: grouped[m].receitas,
      despesas: grouped[m].despesas,
    }));
  })();

  // Pie chart calculation for revenues categories (Rentabilidade)
  const categoryData = (() => {
    const dataObj: Record<string, number> = {};
    lancamentos
      .filter((l) => l.tipo === "RECEITA" && l.status === "PAGO")
      .forEach((l) => {
        // extract [Category] from "[Category] Description"
        const matched = l.descricao.match(/^\[(.*?)\]/);
        const cat = matched ? matched[1] : "Outras Receitas";
        dataObj[cat] = (dataObj[cat] || 0) + l.valor;
      });

    const COLORS = ["#8B5CF6", "#10B981", "#F59E0B", "#EC4899", "#3B82F6"];
    return Object.keys(dataObj).map((cat, index) => ({
      name: cat,
      value: dataObj[cat],
      color: COLORS[index % COLORS.length]
    }));
  })();

  // Simplified INSS Bracket Calculator
  const calculateINSS = (salario: number) => {
    if (salario <= 1412) return salario * 0.075;
    if (salario <= 2666.68) return salario * 0.09;
    if (salario <= 4000.03) return salario * 0.12;
    return salario * 0.14;
  };

  const handleLaunchPayroll = async (liquido: number, proventos: any[], descontos: any[], advancesVal: number) => {
    if (!selectedEmp) return;

    const detailLines = [
      ...proventos.map(p => `${p.label}: +${formatCurrency(p.value)}`),
      ...descontos.map(d => `${d.label}: -${formatCurrency(d.value)}`),
      ...(advancesVal > 0 ? [`Dedução Vales/Adiantamentos: -${formatCurrency(advancesVal)}`] : [])
    ].join(" | ");

    const payload = {
      tipo: "DESPESA",
      descricao: `[Folha Salarial] ${selectedEmp.cargo} - ${selectedEmp.nome} (${mesReferencia})`,
      valor: liquido - advancesVal,
      formaPagamento: "PIX",
      status: "PENDENTE",
      vencimento: new Date().toISOString(),
      observacoes: `Holerite Detalhado: ${detailLines}. Chave Pix: ${selectedEmp.chavePix || "Não Cadastrada"}`
    };

    try {
      await api.post("/financeiro", payload);
      toast.success(`Despesa de folha de pagamento de ${selectedEmp.nome} lançada no financeiro!`);
      
      // Update advances as paid
      if (advancesVal > 0) {
        await Promise.all(
          empAdvances.map(a => api.put(`/financeiro/${a.id}`, { status: "PAGO" }).catch(() => {}))
        );
      }

      setIsPayrollModalOpen(false);
      setSelectedEmp(null);
      loadLancamentos();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao lançar despesa de folha no financeiro.");
    }
  };

  // Render variables for current calculations inside Payroll Modal
  const payrollCalculation = () => {
    if (!selectedEmp) return { proventos: [], descontos: [], liquido: 0, fgts: 0, advancesVal: 0 };

    const base = selectedEmp.salarioBase;
    const extras = Number(horasExtras) || 0;
    const descExtras = Number(descontosExtras) || 0;
    
    let proventosList = [{ label: "Salário Base", value: base }];
    let descontosList = [];

    // Férias calculation (+1/3 constitucional)
    if (incluirFerias) {
      proventosList.push({ label: "Férias Adicional (1/3)", value: base / 3 });
    }

    if (extras > 0) {
      proventosList.push({ label: "Horas Extras & Comissões", value: extras });
    }

    // CLT Calculations
    let fgts = 0;
    if (selectedEmp.tipoContrato === "CLT") {
      const inss = calculateINSS(base);
      descontosList.push({ label: "Dedução INSS (CLT)", value: inss });
      
      if (incluirVT) {
        descontosList.push({ label: "Desconto Vale-Transporte (6%)", value: base * 0.06 });
      }
      
      fgts = base * 0.08; // FGTS cost is patronal, not deducted from net
    }

    if (descExtras > 0) {
      descontosList.push({ label: "Faltas / Descontos Diversos", value: descExtras });
    }

    // Sum of employee advances
    const advancesVal = empAdvances.reduce((sum, a) => sum + parseFloat(a.valor), 0);

    const totalProv = proventosList.reduce((sum, p) => sum + p.value, 0);
    const totalDesc = descontosList.reduce((sum, d) => sum + d.value, 0);
    const liquido = Math.max(0, totalProv - totalDesc);

    return { proventos: proventosList, descontos: descontosList, liquido, fgts, advancesVal };
  };

  const payrollCalc = payrollCalculation();

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "hsl(var(--foreground))" }}>
            Gestão Financeira de Elite
          </h1>
          <p className="text-sm text-muted-foreground">
            Controle de fluxo de caixa, livro caixa analítico, repasses de terapeutas e fechamento de caixa diário.
          </p>
        </div>

        {activeTab === "lancamentos" && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer border-0"
          >
            <Plus className="h-4 w-4" />
            Novo Lançamento
          </motion.button>
        )}
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-border overflow-x-auto scrollbar-none">
        {[
          { id: "fluxo", label: "Fluxo de Caixa", icon: TrendingUp },
          { id: "lancamentos", label: "Livro Caixa", icon: Wallet },
          { id: "folha", label: "Folha / Holerites", icon: FileText },
          { id: "repasses", label: "Repasses Terapeutas", icon: Users },
          { id: "inadimplentes", label: "Inadimplência", icon: AlertTriangle },
          { id: "caixa", label: "Fechamento de Caixa", icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer",
                activeTab === tab.id
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ─── TAB 1: FLUXO DE CAIXA (DASHBOARD) ───────────────────────────── */}
      {activeTab === "fluxo" && (
        <div className="space-y-6 text-xs">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Receitas Efetivadas", val: totalReceitas, color: "text-emerald-500", bg: "bg-emerald-500/10", icon: TrendingUp },
              { label: "Despesas Efetivadas", val: totalDespesas, color: "text-red-500", bg: "bg-red-500/10", icon: TrendingDown },
              { label: "Saldo Líquido Caixa", val: totalReceitas - totalDespesas, color: "text-purple-400", bg: "bg-purple-500/10", icon: Wallet },
              { label: "Projeção Pendente", val: pendentes, color: "text-amber-500", bg: "bg-amber-500/10", icon: AlertTriangle }
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

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Area Chart */}
            <div
              className="lg:col-span-2 p-6 rounded-2xl border bg-card space-y-4"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wide">
                <Sparkles className="h-4 w-4 text-purple-500" /> Histórico Financeiro Mensal
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cashFlowData}>
                    <defs>
                      <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Area type="monotone" dataKey="receitas" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReceitas)" name="Receitas" />
                    <Area type="monotone" dataKey="despesas" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDespesas)" name="Despesas" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart / Bank Balances */}
            <div
              className="lg:col-span-1 p-6 rounded-2xl border bg-card space-y-4 flex flex-col justify-between"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wide border-b border-border/40 pb-2">
                  <Wallet className="h-4 w-4 text-purple-500" /> Contas & Caixas
                </h3>
                
                <div className="space-y-3 pt-4">
                  {[
                    { name: "Caixa Geral", label: "Caixa Físico (Recepção)", icon: Wallet, bg: "bg-zinc-500/10", text: "text-zinc-400" },
                    { name: "Banco Itaú", label: "Banco Itaú (Operacional)", icon: DollarSign, bg: "bg-orange-500/10", text: "text-orange-500" },
                    { name: "Banco Inter", label: "Banco Inter (Reserva)", icon: DollarSign, bg: "bg-amber-500/10", text: "text-amber-500" },
                    { name: "Banco Nubank", label: "Banco Nubank (Digital)", icon: DollarSign, bg: "bg-purple-500/10", text: "text-purple-400" }
                  ].map(acc => {
                    const balance = getAccountBalance(acc.name);
                    return (
                      <div key={acc.name} className="flex justify-between items-center p-3.5 rounded-xl bg-muted/30 border border-border/40">
                        <div className="flex items-center gap-2.5">
                          <div className={cn("p-2 rounded-lg shrink-0", acc.bg, acc.text)}>
                            <acc.icon className="h-4 w-4" />
                          </div>
                          <span className="font-bold text-[10px] text-foreground uppercase tracking-wide">{acc.label}</span>
                        </div>
                        <span className={cn("font-bold text-[11px] font-mono", balance >= 0 ? "text-emerald-500" : "text-red-500")}>
                          {formatCurrency(balance)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-violet-600/10 text-violet-400 border border-violet-500/10 rounded-xl text-[10px] leading-relaxed mt-4">
                💡 As receitas de consultas particulares registradas na recepção entram no "Caixa Geral" e podem ser transferidas posteriormente.
              </div>
            </div>
          </div>

          {/* Category Split Chart */}
          {categoryData.length > 0 && (
            <div className="p-6 rounded-2xl border bg-card space-y-4" style={{ borderColor: "hsl(var(--border))" }}>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wide">
                <Sparkles className="h-4 w-4 text-purple-500" /> Origem das Receitas (Rentabilidade)
              </h3>
              <div className="h-64 flex flex-col md:flex-row items-center justify-around gap-6">
                <div className="h-full w-full md:w-1/2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full md:w-1/2">
                  {categoryData.map(c => (
                    <div key={c.name} className="flex items-center gap-2 text-xs">
                      <span className="h-3.5 w-3.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                      <div>
                        <span className="text-muted-foreground font-semibold block">{c.name}</span>
                        <span className="font-bold text-foreground">{formatCurrency(c.value)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: LIVRO CAIXA (LANÇAMENTOS) ────────────────────────────── */}
      {activeTab === "lancamentos" && (
        <div className="space-y-4">
          {/* Filters and search */}
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none border transition-colors bg-muted border-transparent text-foreground"
              />
            </div>

            <div className="flex gap-2">
              {/* Filtro de tipo */}
              <div className="flex gap-1 bg-muted p-1 rounded-xl">
                {["TODOS", "RECEITA", "DESPESA"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTipoFilter(t)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer",
                      tipoFilter === t
                        ? "bg-purple-600 text-white shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t === "TODOS" ? "Todos" : t === "RECEITA" ? "Receitas" : "Despesas"}
                  </button>
                ))}
              </div>

              {/* Filtro de conta */}
              <select
                value={contaFilter}
                onChange={(e) => setContaFilter(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs border bg-background text-foreground outline-none cursor-pointer font-semibold"
              >
                <option value="TODOS">Todas as Contas</option>
                <option value="Caixa Geral">Caixa Geral</option>
                <option value="Banco Itaú">Banco Itaú</option>
                <option value="Banco Inter">Banco Inter</option>
                <option value="Banco Nubank">Banco Nubank</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-violet-600 border-t-transparent" />
            </div>
          ) : filteredLancamentos.length === 0 ? (
            <div 
              className="p-12 text-center rounded-2xl border bg-card flex flex-col items-center gap-2"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <Search className="h-8 w-8 text-zinc-500" />
              <h3 className="font-bold text-sm text-foreground">Nenhum lançamento encontrado</h3>
              <p className="text-xs text-muted-foreground">Registre novos lançamentos ou mude os filtros de busca.</p>
            </div>
          ) : (
            <div className="overflow-hidden border rounded-2xl bg-card" style={{ borderColor: "hsl(var(--border))" }}>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                      <th className="p-4">Descrição do Lançamento</th>
                      <th className="p-4">Conta Caixa</th>
                      <th className="p-4">Tipo</th>
                      <th className="p-4">Valor</th>
                      <th className="p-4">Forma</th>
                      <th className="p-4">Vencimento</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredLancamentos.map((l) => (
                      <tr key={l.id} className="hover:bg-muted/10 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-foreground text-sm">{l.descricao}</p>
                          {l.observacoes && (
                            <p className="text-[10px] text-muted-foreground mt-0.5 max-w-md truncate" title={l.observacoes}>{l.observacoes}</p>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="font-semibold bg-zinc-500/10 text-zinc-400 px-2 py-0.5 rounded text-[10px]">
                            {l.contaCaixa}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={cn(
                              "text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border",
                              l.tipo === "RECEITA" 
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                                : "bg-red-500/10 text-red-500 border-red-500/20"
                            )}
                          >
                            {l.tipo === "RECEITA" ? "Receita" : "Despesa"}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-foreground text-sm">{formatCurrency(l.valor)}</td>
                        <td className="p-4 text-muted-foreground font-semibold">{l.formaPagamento}</td>
                        <td className="p-4 text-muted-foreground">{formatDate(l.vencimento)}</td>
                        <td className="p-4">
                          <span
                            className={cn(
                              "text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border",
                              l.status === "PAGO" 
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                                : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            )}
                          >
                            {l.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {l.status === "PENDENTE" && (
                            <div className="flex justify-end gap-1.5">
                              {l.tipo === "RECEITA" && (
                                <button
                                  onClick={() => openPixCheckout(l)}
                                  className="py-1.5 px-2.5 rounded-lg border border-purple-500/20 text-purple-400 font-bold hover:bg-purple-500/10 transition-all cursor-pointer text-[10px] uppercase tracking-wider flex items-center gap-1"
                                >
                                  <QrCode className="h-3.5 w-3.5" />
                                  <span>PIX QRCode</span>
                                </button>
                              )}
                              <button
                                onClick={() => handlePagar(l.id)}
                                className="py-1.5 px-3 rounded-lg border border-emerald-500/20 text-emerald-500 font-bold hover:bg-emerald-500/10 transition-all cursor-pointer text-[10px] uppercase tracking-wider"
                              >
                                Efetuar
                              </button>
                            </div>
                          )}
                          {l.status === "PAGO" && (
                            <div className="flex justify-end gap-1.5">
                              {(l.descricao.includes("[Folha Salarial]") || l.descricao.includes("[Vale Transporte]")) && (
                                <button
                                  onClick={() => handlePrintContracheque(l)}
                                  className="py-1.5 px-2.5 rounded-lg border border-purple-500/20 text-purple-400 font-bold hover:bg-purple-500/10 transition-all cursor-pointer text-[10px] uppercase tracking-wider flex items-center gap-1"
                                >
                                  <FileText className="h-3.5 w-3.5" />
                                  <span>Contracheque</span>
                                </button>
                              )}
                              <button
                                onClick={() => handlePrintComprovante(l)}
                                className="py-1.5 px-2.5 rounded-lg border border-zinc-500/20 text-zinc-400 font-bold hover:bg-zinc-500/10 transition-all cursor-pointer text-[10px] uppercase tracking-wider flex items-center gap-1"
                              >
                                <Download className="h-3.5 w-3.5" />
                                <span>Recibo</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 3: FOLHA DE PAGAMENTO ──────────────────────────────────── */}
      {activeTab === "folha" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl border bg-card/40 flex items-center justify-between" style={{ borderColor: "hsl(var(--border))" }}>
            <div className="flex items-center gap-3 text-xs">
              <Info className="h-5 w-5 text-violet-400" />
              <div>
                <p className="font-bold text-foreground">Geração Automática de Holerite e Proventos</p>
                <p className="text-[10px] text-muted-foreground">
                  Selecione um funcionário abaixo (CLT ou PJ) para emitir sua folha salarial mensal, gerenciar vales e adiantamentos.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Mês Referência:</label>
              <input
                type="text"
                value={mesReferencia}
                onChange={(e) => setMesReferencia(e.target.value)}
                className="p-1.5 rounded-lg border text-center font-bold text-xs bg-background outline-none w-24"
                placeholder="MM/AAAA"
              />
            </div>
          </div>

          <div className="overflow-hidden border rounded-2xl bg-card" style={{ borderColor: "hsl(var(--border))" }}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                    <th className="p-4">Colaborador / Clínico</th>
                    <th className="p-4">Cargo / Função</th>
                    <th className="p-4">Regime de Contrato</th>
                    <th className="p-4">Salário Base</th>
                    <th className="p-4">Ação Adiantamento</th>
                    <th className="p-4 text-right">Processar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {funcionarios.map((emp) => (
                    <tr key={emp.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 font-bold text-foreground text-sm">{emp.nome}</td>
                      <td className="p-4 text-muted-foreground font-semibold">{emp.cargo}</td>
                      <td className="p-4">
                        <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold border", 
                          emp.tipoContrato === "PJ" ? "bg-teal-500/10 text-teal-500 border-teal-500/20" : "bg-sky-500/10 text-sky-500 border-sky-500/20"
                        )}>
                          {emp.tipoContrato}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-foreground">{formatCurrency(emp.salarioBase)}</td>
                      <td className="p-4">
                        <button
                          onClick={() => openAdvancesModal(emp)}
                          className="px-3 py-1.5 rounded-lg border border-purple-500/20 text-purple-400 font-bold hover:bg-purple-500/10 text-[10px] transition-all cursor-pointer"
                        >
                          Vales / Adiantamentos
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={async () => {
                            setSelectedEmp(emp);
                            // Load employee advances for the payroll calculation
                            const res = await api.get(`/financeiro/adiantamentos?refMes=${mesReferencia}`);
                            const list = (res.data || []).filter((a: any) => a.usuarioId === emp.id && !a.pago);
                            setEmpAdvances(list);
                            setIsPayrollModalOpen(true);
                          }}
                          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
                        >
                          Calcular Folha
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

      {/* ─── TAB 4: REPASSES / COMISSÕES ────────────────────────────────── */}
      {activeTab === "repasses" && (
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl border bg-card/40 flex items-center justify-between" style={{ borderColor: "hsl(var(--border))" }}>
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-violet-400" />
              <div>
                <p className="font-bold text-foreground">Relatório Mensal de Repasses de Terapeutas</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Lista de comissões por consultas concluídas no mês selecionado ({mesReferencia}).
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Período:</label>
              <input
                type="text"
                value={mesReferencia}
                onChange={(e) => setMesReferencia(e.target.value)}
                className="p-1.5 rounded-lg border text-center font-bold text-xs bg-background outline-none w-24"
                placeholder="MM/AAAA"
              />
            </div>
          </div>

          {repassesLoading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-violet-600 border-t-transparent" />
            </div>
          ) : (
            <div className="overflow-hidden border rounded-2xl bg-card" style={{ borderColor: "hsl(var(--border))" }}>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Terapeuta / Clínico</th>
                      <th className="p-4">Sessões Atendidas</th>
                      <th className="p-4">Valor Total Faturado</th>
                      <th className="p-4">Comissão Devida</th>
                      <th className="p-4">Chave PIX</th>
                      <th className="p-4 text-right">Lançar Repasse</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {repassesList.map((rep) => (
                      <tr key={rep.profId} className="hover:bg-muted/5 transition-colors">
                        <td className="p-4 font-bold text-foreground">{rep.nome}</td>
                        <td className="p-4 font-semibold text-foreground">{rep.sessoesAtendidas} atendimentos</td>
                        <td className="p-4 text-muted-foreground">{formatCurrency(rep.valorFaturado)}</td>
                        <td className="p-4 font-bold text-emerald-500">{formatCurrency(rep.comissaoTotal)}</td>
                        <td className="p-4 text-muted-foreground font-mono text-[10px]">{rep.chavePix || "Não informada"}</td>
                        <td className="p-4 text-right">
                          {rep.jaLancado ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-wide">
                              <Check className="h-3 w-3" /> Lançado
                            </span>
                          ) : (
                            <button
                              onClick={() => handleLancarRepasse(rep)}
                              disabled={rep.comissaoTotal === 0}
                              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Lançar Despesa
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {repassesList.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-zinc-500 italic">Nenhum repasse de terapeuta localizado para o mês {mesReferencia}.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 5: INADIMPLÊNCIA / COBRANÇAS ────────────────────────────── */}
      {activeTab === "inadimplentes" && (
        <div className="space-y-4 text-xs">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Controle de Inadimplência (Faturamento Atrasado)</h3>
          
          <div className="overflow-hidden border rounded-2xl bg-card" style={{ borderColor: "hsl(var(--border))" }}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Faturamento / Lançamento</th>
                    <th className="p-4">Valor Devido</th>
                    <th className="p-4">Data Vencimento</th>
                    <th className="p-4">Dias de Atraso</th>
                    <th className="p-4 text-right">Notificar Inadimplente</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {lancamentos
                    .filter(l => l.tipo === "RECEITA" && l.status === "PENDENTE" && new Date(l.vencimento) < new Date())
                    .map((l) => {
                      const diasAtraso = Math.ceil(
                        (new Date().getTime() - new Date(l.vencimento).getTime()) / (1000 * 3600 * 24)
                      );
                      return (
                        <tr key={l.id} className="hover:bg-muted/5 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-foreground">{l.descricao}</p>
                            {l.observacoes && <p className="text-[10px] text-muted-foreground mt-0.5">{l.observacoes}</p>}
                          </td>
                          <td className="p-4 font-bold text-red-500">{formatCurrency(l.valor)}</td>
                          <td className="p-4 text-red-500 font-semibold">{formatDate(l.vencimento)}</td>
                          <td className="p-4 font-bold text-foreground font-mono">{diasAtraso} dias</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                const text = `Olá! Gostaríamos de lembrar que a cobrança de "${l.descricao}" no valor de ${formatCurrency(l.valor)} venceu em ${formatDate(l.vencimento)} e consta pendente no Instituto Conectar. Chave PIX CNPJ: 12.345.678/0001-99. Obrigado!`;
                                navigator.clipboard.writeText(text);
                                toast.success("Mensagem de cobrança copiada para a área de transferência!");
                              }}
                              className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-purple-500/20 text-purple-400 font-bold hover:bg-purple-500/10 text-[10px] uppercase tracking-wider cursor-pointer"
                            >
                              <Send className="h-3.5 w-3.5" />
                              <span>Copiar Aviso</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  {lancamentos.filter(l => l.tipo === "RECEITA" && l.status === "PENDENTE" && new Date(l.vencimento) < new Date()).length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-emerald-500 font-bold">🎉 Nenhuma cobrança em atraso! Todos os clientes em dia.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 6: FECHAMENTO DE CAIXA DIÁRIO ───────────────────────────── */}
      {activeTab === "caixa" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
          {/* Caixa Activo */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 rounded-2xl border bg-card space-y-4" style={{ borderColor: "hsl(var(--border))" }}>
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wider border-b border-border/40 pb-2 flex items-center gap-2">
                <Clock className="h-4.5 w-4.5 text-purple-500" /> Caixa Operacional
              </h3>

              {caixaStatus?.status === "FECHADO" ? (
                <div className="space-y-4">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl leading-relaxed">
                    ⚠️ O Caixa da recepção está fechado. Abra-o informando o saldo/troco inicial para aceitar novos recebimentos físicos.
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Troco / Saldo Inicial (R$)</label>
                    <input
                      type="number"
                      value={aberturaSaldo}
                      onChange={(e) => setAberturaSaldo(e.target.value)}
                      className="w-full p-2.5 rounded-xl border bg-background text-foreground font-bold outline-none"
                    />
                  </div>

                  <button
                    onClick={handleAbrirCaixa}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
                  >
                    <Unlock className="h-4.5 w-4.5" /> Abrir Caixa Diário
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl flex items-center gap-2 font-bold uppercase tracking-wider">
                    <Lock className="h-4 w-4" /> Caixa Diário Ativo
                  </div>

                  <div className="bg-muted/40 p-4 rounded-xl border space-y-2">
                    <div className="flex justify-between border-b border-border/40 pb-1.5">
                      <span className="text-muted-foreground">Aberto em:</span>
                      <span className="font-bold text-foreground">{caixaStatus?.caixa ? new Date(caixaStatus.caixa.abertoEm).toLocaleString("pt-BR") : "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Troco Inicial:</span>
                      <span className="font-bold text-foreground">{formatCurrency(caixaStatus?.caixa?.saldoInicial)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-500 font-semibold">
                      <span>PIX recebidos:</span>
                      <span>{formatCurrency(caixaStatus?.totalPix)}</span>
                    </div>
                    <div className="flex justify-between text-sky-500 font-semibold">
                      <span>Cartões recebidos:</span>
                      <span>{formatCurrency(caixaStatus?.totalCartao)}</span>
                    </div>
                    <div className="flex justify-between text-amber-500 font-semibold border-t border-border/40 pt-1.5">
                      <span>Dinheiro esperado:</span>
                      <span>{formatCurrency(caixaStatus?.totalDinheiro)}</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Dinheiro Físico Contado na Gaveta (R$)</label>
                      <input
                        type="number"
                        placeholder="Informe o dinheiro contado"
                        value={fechamentoFisico}
                        onChange={(e) => setFechamentoFisico(e.target.value)}
                        className="w-full p-2.5 rounded-xl border bg-background text-foreground font-bold outline-none"
                      />
                    </div>

                    {fechamentoFisico && (
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-muted-foreground">Diferença de Caixa:</span>
                        <span className={cn(
                          parseFloat(fechamentoFisico) - (caixaStatus?.totalDinheiro || 0) >= 0 ? "text-emerald-500" : "text-red-500"
                        )}>
                          {formatCurrency(parseFloat(fechamentoFisico) - (caixaStatus?.totalDinheiro || 0))}
                        </span>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Justificativa da Diferença (se houver)</label>
                      <textarea
                        rows={2}
                        placeholder="Ex: Diferença de R$ 0,50 por conta de troco."
                        value={fechamentoJustificativa}
                        onChange={(e) => setFechamentoJustificativa(e.target.value)}
                        className="w-full p-2 rounded-xl border bg-background text-foreground outline-none resize-none"
                      />
                    </div>

                    <button
                      onClick={handleFecharCaixa}
                      className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-red-600 shadow-lg shadow-red-500/10 cursor-pointer"
                    >
                      Realizar Fechamento
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Historial de Fechamentos (Admin) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Auditoria Geral de Fechamentos</h3>
            <div className="overflow-hidden border rounded-2xl bg-card" style={{ borderColor: "hsl(var(--border))" }}>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Operador</th>
                      <th className="p-4">Abertura / Fechamento</th>
                      <th className="p-4">Esp. Dinheiro</th>
                      <th className="p-4">Conf. Dinheiro</th>
                      <th className="p-4">Diferença</th>
                      <th className="p-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {caixaHistorico.map((c) => (
                      <tr key={c.id} className="hover:bg-muted/5 transition-colors">
                        <td className="p-4 font-bold text-foreground">{c.usuario?.nome}</td>
                        <td className="p-4 text-muted-foreground">
                          <p className="font-semibold text-foreground">Abertura: {new Date(c.abertoEm).toLocaleDateString()}</p>
                          <p className="text-[9px]">Fechamento: {c.fechadoEm ? new Date(c.fechadoEm).toLocaleString() : "Aberto"}</p>
                        </td>
                        <td className="p-4 text-muted-foreground font-bold">{formatCurrency(c.totalDinheiro)}</td>
                        <td className="p-4 font-bold text-foreground">{formatCurrency(c.conferidoDinh)}</td>
                        <td className="p-4">
                          <span className={cn("font-bold font-mono", parseFloat(c.diferenca) >= 0 ? "text-emerald-500" : "text-red-500")}>
                            {formatCurrency(c.diferenca)}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {c.status === "FECHADO" ? (
                            <button
                              onClick={() => handleAprovarCaixa(c.id)}
                              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white gradient-primary shadow-xs cursor-pointer"
                            >
                              Homologar
                            </button>
                          ) : (
                            <span className={cn(
                              "px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider",
                              c.status === "APROVADO" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            )}>
                              {c.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {caixaHistorico.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-zinc-500 italic">Nenhum fechamento de caixa auditado no histórico.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL NOVO LANÇAMENTO (DESPESAS RECORRENTES INTEGRADAS) ────────── */}
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
                  <h3 className="font-bold text-lg text-foreground">Novo Lançamento Financeiro</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Registre receitas ou despesas da clínica.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-muted text-zinc-400 cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateLancamento} className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Tipo de Movimentação</label>
                    <select
                      value={tipo}
                      onChange={(e) => {
                        setTipo(e.target.value);
                        setCategoria(e.target.value === "RECEITA" ? "Mensalidades Pacientes" : "Salários (CLT)");
                      }}
                      className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none cursor-pointer"
                    >
                      <option value="RECEITA">Receita (Entrada)</option>
                      <option value="DESPESA">Despesa (Saída)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Categoria</label>
                    <select
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none cursor-pointer"
                    >
                      {tipo === "RECEITA" ? (
                        <>
                          <option value="Mensalidades Pacientes">Mensalidades Pacientes</option>
                          <option value="Avaliações Clínicas">Avaliações Clínicas</option>
                          <option value="Repasses / Convênios">Repasses / Convênios</option>
                          <option value="Outras Receitas">Outras Receitas</option>
                        </>
                      ) : (
                        <>
                          <option value="Salários (CLT)">Salários (CLT)</option>
                          <option value="Encargos Sociais (INSS/FGTS)">Encargos Sociais (INSS/FGTS)</option>
                          <option value="Infraestrutura / Aluguel">Infraestrutura / Aluguel</option>
                          <option value="Marketing & Vendas">Marketing & Vendas</option>
                          <option value="Vale Transporte">Vale Transporte</option>
                          <option value="Provisão de Férias">Provisão de Férias</option>
                          <option value="Repasses PJ">Repasses PJ</option>
                          <option value="Outras Despesas">Outras Despesas</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Descrição</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Mensalidade Clínica - Arthur Silva"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none"
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
                      className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Forma de Pagamento</label>
                    <select
                      value={forma}
                      onChange={(e) => setForma(e.target.value)}
                      className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none cursor-pointer"
                    >
                      <option value="PIX">PIX</option>
                      <option value="CARTAO_CREDITO">Cartão de Crédito</option>
                      <option value="CARTAO_DEBITO">Cartão de Débito</option>
                      <option value="DINHEIRO">Dinheiro</option>
                      <option value="TRANSFERENCIA">Transferência / TED</option>
                      <option value="BOLETO">Boleto Bancário</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Data de Vencimento</label>
                    <input
                      type="date"
                      required
                      value={vencimento}
                      onChange={(e) => setVencimento(e.target.value)}
                      className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Conta Caixa / Destino</label>
                    <select
                      value={contaCaixa}
                      onChange={(e) => setContaCaixa(e.target.value)}
                      className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none cursor-pointer"
                    >
                      <option value="Caixa Geral">Caixa Geral (Dinheiro)</option>
                      <option value="Banco Itaú">Banco Itaú</option>
                      <option value="Banco Inter">Banco Inter</option>
                      <option value="Banco Nubank">Banco Nubank</option>
                    </select>
                  </div>
                </div>

                {tipo === "DESPESA" && (
                  <div className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        id="recorrente"
                        checked={repetirDespesa}
                        onChange={(e) => setRepetirDespesa(e.target.checked)}
                        className="rounded border-border text-purple-500 w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="recorrente" className="font-bold text-foreground cursor-pointer">Despesa Fixa Recorrente</label>
                    </div>
                    {repetirDespesa && (
                      <div className="flex items-center gap-2 pl-6">
                        <span className="text-muted-foreground">Repetir mensalmente por</span>
                        <input
                          type="number"
                          value={repetirMeses}
                          onChange={(e) => setRepetirMeses(e.target.value)}
                          className="w-16 p-1.5 rounded-lg border bg-background text-foreground font-bold outline-none text-center"
                        />
                        <span className="text-muted-foreground">meses</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-4 border-t flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl font-bold border text-zinc-400 border-border hover:bg-muted transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
                  >
                    Salvar Lançamento
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL FOLHA DE PAGAMENTO / HOLERITE DE ELITE ────────────────── */}
      <AnimatePresence>
        {isPayrollModalOpen && selectedEmp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="absolute inset-0" onClick={() => { setIsPayrollModalOpen(false); setSelectedEmp(null); }} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl rounded-2xl shadow-2xl border overflow-hidden bg-card flex flex-col md:flex-row"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              {/* Left Column: Form Adjustments */}
              <div className="w-full md:w-1/2 p-6 border-r border-border/40 space-y-4 text-xs">
                <div>
                  <h3 className="font-extrabold text-base text-foreground">Calculadora de Holerite ({mesReferencia})</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Ajuste proventos e encargos de {selectedEmp.nome}.</p>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Horas Extras / Prêmios (R$)</label>
                      <input
                        type="number"
                        value={horasExtras}
                        onChange={(e) => setHorasExtras(e.target.value)}
                        className="w-full p-2.5 rounded-xl border bg-background text-foreground font-bold outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Faltas / Descontos (R$)</label>
                      <input
                        type="number"
                        value={descontosExtras}
                        onChange={(e) => setDescontosExtras(e.target.value)}
                        className="w-full p-2.5 rounded-xl border bg-background text-foreground font-bold outline-none"
                      />
                    </div>
                  </div>

                  {selectedEmp.tipoContrato === "CLT" && (
                    <div className="flex flex-col gap-2.5 bg-muted/40 p-3 rounded-xl border">
                      <div className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          id="vt"
                          checked={incluirVT}
                          onChange={(e) => setIncluirVT(e.target.checked)}
                          className="rounded border-border text-purple-500 w-4 h-4 cursor-pointer"
                        />
                        <label htmlFor="vt" className="font-semibold text-foreground cursor-pointer">Descontar Vale-Transporte (6%)</label>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 cursor-pointer bg-muted/40 p-3 rounded-xl border">
                    <input
                      type="checkbox"
                      id="ferias"
                      checked={incluirFerias}
                      onChange={(e) => setIncluirFerias(e.target.checked)}
                      className="rounded border-border text-purple-500 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="ferias" className="font-semibold text-foreground cursor-pointer">Adicionar 1/3 de Férias Constitucional</label>
                  </div>
                </div>

                {/* List of advances deducted */}
                {empAdvances.length > 0 && (
                  <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl space-y-1.5">
                    <p className="font-bold text-red-500 text-[10px] uppercase">Vales / Adiantamentos no Mês:</p>
                    <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                      {empAdvances.map(adv => (
                        <div key={adv.id} className="flex justify-between text-[10px]">
                          <span>{adv.observacoes || "Adiantamento"} ({new Date(adv.data).toLocaleDateString()})</span>
                          <span className="font-bold">-{formatCurrency(adv.valor)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Visual Holerite Slip */}
              <div className="w-full md:w-1/2 p-6 bg-muted/20 flex flex-col justify-between text-[11px] font-mono border-t md:border-t-0 border-border/40">
                <div className="border border-foreground/30 p-4 rounded bg-background text-foreground space-y-3 shadow-xs">
                  <div className="flex justify-between border-b border-foreground/30 pb-2">
                    <div>
                      <p className="font-bold text-[10px]">INSTITUTO CONECTAR LTDA</p>
                      <p className="text-[8px] text-muted-foreground">CNPJ: 12.345.678/0001-99</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">RECIBO DE PAGAMENTO</p>
                      <p className="text-[9px]">Ref: {mesReferencia}</p>
                    </div>
                  </div>

                  <div className="border-b border-foreground/30 pb-2 text-[9px] leading-relaxed">
                    <p><span className="font-bold">Colaborador:</span> {selectedEmp.nome}</p>
                    <p><span className="font-bold">Cargo:</span> {selectedEmp.cargo}</p>
                    <p><span className="font-bold">Regime:</span> {selectedEmp.tipoContrato} | Pix: {selectedEmp.chavePix || "Não Cadastrado"}</p>
                  </div>

                  {/* Proventos list */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-bold border-b border-foreground/10 text-[9px] uppercase">
                      <span>Proventos (+)</span>
                      <span>Descontos (-)</span>
                    </div>
                    
                    {payrollCalc.proventos.map((p, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{p.label}</span>
                        <span>{formatCurrency(p.value)}</span>
                      </div>
                    ))}

                    {payrollCalc.descontos.map((d, idx) => (
                      <div key={idx} className="flex justify-between text-red-500/80">
                        <span>{d.label}</span>
                        <span>-{formatCurrency(d.value)}</span>
                      </div>
                    ))}

                    {payrollCalc.advancesVal > 0 && (
                      <div className="flex justify-between text-red-500/80 font-semibold">
                        <span>Desconto Adiantamento (Vales)</span>
                        <span>-{formatCurrency(payrollCalc.advancesVal)}</span>
                      </div>
                    )}
                  </div>

                  {/* Liquido */}
                  <div className="flex justify-between border-t border-foreground/30 pt-2 font-bold text-sm">
                    <span>LÍQUIDO A RECEBER:</span>
                    <span className="text-emerald-500 font-bold">{formatCurrency(payrollCalc.liquido - payrollCalc.advancesVal)}</span>
                  </div>

                  {selectedEmp.tipoContrato === "CLT" && (
                    <div className="text-[8px] text-muted-foreground border-t border-dashed pt-1 flex justify-between">
                      <span>Custo informativo FGTS (8%):</span>
                      <span className="font-bold">{formatCurrency(payrollCalc.fgts)}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => { setIsPayrollModalOpen(false); setSelectedEmp(null); }}
                    className="px-3.5 py-2 rounded-xl border border-border bg-background text-zinc-400 hover:bg-muted font-bold transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleLaunchPayroll(payrollCalc.liquido, payrollCalc.proventos, payrollCalc.descontos, payrollCalc.advancesVal)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer border-0"
                  >
                    <Download className="h-4 w-4" />
                    <span>Lançar no Financeiro</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── SUB-MODAL: GERENCIAMENTO DE VALES / ADIANTAMENTOS ───────────── */}
      <AnimatePresence>
        {isAdvancesModalOpen && selectedEmp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="absolute inset-0" onClick={() => { setIsAdvancesModalOpen(false); setSelectedEmp(null); }} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden bg-card"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-foreground">Vales / Adiantamentos</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Registre adiantamentos salariais para {selectedEmp.nome}.</p>
                </div>
                <button onClick={() => { setIsAdvancesModalOpen(false); setSelectedEmp(null); }} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                {/* Form to add */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase">Valor do Vale (R$)</label>
                    <input
                      type="number"
                      required
                      placeholder="0.00"
                      value={advVal}
                      onChange={(e) => setAdvVal(e.target.value)}
                      className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase">Motivo / Observação</label>
                    <input
                      type="text"
                      placeholder="Ex: Adiantamento Quinzena"
                      value={advObs}
                      onChange={(e) => setAdvObs(e.target.value)}
                      className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddAdvance}
                  className="w-full py-2 rounded-xl text-xs font-semibold text-white gradient-primary cursor-pointer flex items-center justify-center gap-1.5 border-0"
                >
                  <PlusCircle className="h-4 w-4" /> Registrar Vale
                </button>

                {/* List */}
                <div className="space-y-2 border-t border-border/40 pt-3">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Histórico de Vales do Mês ({mesReferencia})</span>
                  <div className="max-h-48 overflow-y-auto space-y-1.5">
                    {advancesList.map((adv) => (
                      <div key={adv.id} className="flex justify-between items-center bg-muted/40 p-2.5 rounded-xl border border-border/40 text-[10px]">
                        <div>
                          <p className="font-bold text-foreground">{formatCurrency(adv.valor)}</p>
                          <p className="text-muted-foreground font-semibold">{adv.observacoes || "Adiantamento"}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteAdvance(adv.id)}
                          className="p-1 hover:bg-red-500/10 text-red-500 rounded cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    {advancesList.length === 0 && (
                      <p className="text-[10px] text-zinc-500 italic">Nenhum vale registrado para este período.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL: PIX QR CODE CHECKOUT SIMULATOR ────────────────────────── */}
      <AnimatePresence>
        {isPixModalOpen && pixPayload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="absolute inset-0" onClick={() => setIsPixModalOpen(false)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm rounded-2xl shadow-2xl border overflow-hidden bg-card"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-foreground">Recebimento PIX</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Mostre ao cliente para efetuar o pagamento.</p>
                </div>
                <button onClick={() => setIsPixModalOpen(false)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 flex flex-col items-center gap-4 text-xs text-center">
                {/* Simulated PIX QR Code image */}
                <div className="h-44 w-44 bg-white p-3.5 border rounded-2xl flex items-center justify-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                    alt="Simulated PIX QRCode"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="w-full bg-muted/40 p-3 rounded-xl border border-border/40 space-y-1">
                  <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">PIX Copia e Cola</span>
                  <p className="font-mono text-[9px] select-all break-all text-foreground bg-background p-1.5 rounded border border-border/60">
                    00020101021126360014br.gov.pix0114123456780001995204000053039865802BR5917InstitutoConectar6009SaoPaulo620705031236304CA12
                  </p>
                </div>

                <p className="font-bold text-foreground text-sm">Valor: {formatCurrency(pixPayload.valor)}</p>

                <button
                  onClick={() => {
                    handlePagar(pixPayload.id);
                    setIsPixModalOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary cursor-pointer border-0 flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/10"
                >
                  <Check className="h-4.5 w-4.5" /> Confirmar Pagamento Liquidado
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
