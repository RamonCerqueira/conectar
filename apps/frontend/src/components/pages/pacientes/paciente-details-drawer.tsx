import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Users,
  ClipboardList,
  HeartHandshake,
  DollarSign,
  BookOpen,
  Phone,
  Mail,
  Activity,
  GraduationCap,
  Calendar,
  Sparkles,
  FileText,
  Plus,
  Check,
  Clock,
  Trash2,
  ShieldAlert,
  Upload
} from "lucide-react";
import { cn, formatPhone, calculateAge, getInitials, formatDate, formatCurrency } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Paciente } from "@/types";
import { SignaturePadModal } from "./signature-pad-modal";

interface PacienteDetailsDrawerProps {
  selectedPaciente: Paciente | null;
  onClose: () => void;
}

export function PacienteDetailsDrawer({ selectedPaciente, onClose }: PacienteDetailsDrawerProps) {
  const router = useRouter();
  const [activeProfileTab, setActiveProfileTab] = useState("dados");

  const [contratos, setContratos] = useState<any[]>([]);
  const [contratosLoading, setContratosLoading] = useState(false);
  const [isNewContratoOpen, setIsNewContratoOpen] = useState(false);

  // Form states for generating contract
  const [cTitulo, setCTitulo] = useState("Contrato de Prestação de Serviços Clínicos");
  const [cTipo, setCTipo] = useState("contrato");
  const [cValor, setCValor] = useState("1200.00");
  const [cParcelas, setCParcelas] = useState("12");
  const [cDiaVenc, setCDiaVenc] = useState("10");
  const [vincularPDF, setVincularPDF] = useState(false);
  const [cUploadFile, setCUploadFile] = useState<File | null>(null);

  // Signature Pad state
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [signingContratoId, setSigningContratoId] = useState<string | null>(null);

  const loadContratos = async () => {
    if (!selectedPaciente) return;
    setContratosLoading(true);
    try {
      const res = await api.get(`/contratos/paciente/${selectedPaciente.id}`);
      setContratos(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setContratosLoading(false);
    }
  };

  useEffect(() => {
    if (activeProfileTab === "contratos" && selectedPaciente) {
      loadContratos();
    }
  }, [activeProfileTab, selectedPaciente]);

  const handleCreateContrato = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaciente) return;
    try {
      const res = await api.post("/contratos", {
        pacienteId: selectedPaciente.id,
        tipo: cTipo,
        titulo: cTitulo,
        caminho: `/storage/contratos/${selectedPaciente.nome.toLowerCase().replace(/ /g, "_")}_${Date.now()}.pdf`,
        valorMensal: cTipo === "contrato" ? parseFloat(cValor) || 0 : null,
        qtdParcelas: cTipo === "contrato" ? parseInt(cParcelas) || 1 : null,
        diaVencimento: cTipo === "contrato" ? parseInt(cDiaVenc) || 10 : null,
        assinado: false
      });

      const createdContrato = res.data;

      if (vincularPDF && cUploadFile) {
        const formData = new FormData();
        formData.append("file", cUploadFile);
        await api.post(`/contratos/${createdContrato.id}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Contrato criado e PDF físico anexado com sucesso!");
      } else {
        toast.success("Contrato de modelo padrão gerado com sucesso!");
      }

      setIsNewContratoOpen(false);
      setCUploadFile(null);
      setVincularPDF(false);
      loadContratos();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao gerar ou enviar contrato.");
    }
  };

  const handleSignContrato = (id: string) => {
    setSigningContratoId(id);
    setIsSignatureModalOpen(true);
  };

  const submitSignature = async (base64: string) => {
    if (!signingContratoId) return;
    try {
      await api.put(`/contratos/${signingContratoId}/assinar`, {
        assinaturaBase64: base64
      });
      toast.success("Contrato assinado com sua rubrica e faturamento lançado!");
      setIsSignatureModalOpen(false);
      setSigningContratoId(null);
      loadContratos();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao assinar contrato.");
    }
  };

  const handleDeleteContrato = async (id: string) => {
    try {
      await api.delete(`/contratos/${id}`);
      toast.success("Contrato removido com sucesso.");
      loadContratos();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao remover contrato.");
    }
  };

  return (
    <AnimatePresence>
      {selectedPaciente && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs">
          {/* Fechar clicando fora */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-4xl h-full flex flex-col shadow-2xl border-l overflow-hidden"
            style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
          >
            {/* Header do Drawer */}
            <div className="p-6 border-b flex items-center justify-between gradient-primary text-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-xl shadow-inner text-white">
                  {getInitials(selectedPaciente.nome)}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedPaciente.nome}</h2>
                  <p className="text-xs text-purple-200">
                    ID: {selectedPaciente.id} • Nascimento: {formatDate(selectedPaciente.dataNascimento)} (
                    {calculateAge(selectedPaciente.dataNascimento)} anos)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    router.push(`/prontuarios?pacienteId=${selectedPaciente.id}`);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-purple-600 bg-white hover:bg-purple-50 transition-colors shadow cursor-pointer mr-1"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Iniciar Atendimento 360
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Abas */}
            <div className="flex border-b overflow-x-auto px-4 bg-muted/30">
              {[
                { id: "dados", label: "Dados Clínicos", icon: Users },
                { id: "prontuario", label: "Evoluções (Prontuário)", icon: ClipboardList },
                { id: "plano", label: "Plano Terapêutico", icon: HeartHandshake },
                { id: "financeiro", label: "Financeiro", icon: DollarSign },
                { id: "contratos", label: "Contratos & Termos", icon: FileText },
                { id: "docs", label: "Exercícios & Docs", icon: BookOpen },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveProfileTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap",
                    activeProfileTab === tab.id
                      ? "border-purple-500 text-purple-600 dark:text-purple-400 bg-card"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Conteúdo da Aba */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* 1. DADOS CLÍNICOS E PESSOAIS */}
              {activeProfileTab === "dados" && (
                <div className="space-y-6">
                  {/* Responsáveis */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-purple-500 flex items-center gap-2 uppercase tracking-wide">
                      <Users className="h-4 w-4" />
                      Responsáveis Familiares
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedPaciente.responsaveis.map((resp) => (
                        <div
                          key={resp.id}
                          className="p-4 rounded-xl border space-y-2 relative"
                          style={{ background: "hsl(var(--muted)/0.3)", borderColor: "hsl(var(--border))" }}
                        >
                          {resp.isPrincipal && (
                            <span className="absolute top-3 right-3 text-[9px] font-bold bg-purple-500/10 text-purple-600 px-2 py-0.5 rounded-full">
                              Principal
                            </span>
                          )}
                          <p className="font-bold text-sm text-foreground">
                            {resp.nome} ({resp.grauParent})
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5" />
                            {formatPhone(resp.telefone || "")}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5" />
                            {resp.email || "E-mail não informado"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dados Clínicos Específicos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="font-bold text-sm text-purple-500 flex items-center gap-2 uppercase tracking-wide">
                        <Activity className="h-4 w-4" />
                        Informações Médicas
                      </h3>
                      <div
                        className="p-4 rounded-xl border space-y-3 text-xs"
                        style={{ borderColor: "hsl(var(--border))" }}
                      >
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Medicamento de uso contínuo:</span>
                          <span className="font-semibold text-foreground">
                            {selectedPaciente.medicamentos?.join(", ") || "Nenhum"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Alergias conhecidas:</span>
                          <span className="font-semibold text-foreground">
                            {selectedPaciente.alergias?.join(", ") || "Nenhuma"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Neurologista Infantil:</span>
                          <span className="font-semibold text-foreground">
                            {selectedPaciente.medicosRef?.neurologista || "Não informado"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-muted-foreground">Notas Médicas:</span>
                          <p className="p-2 rounded bg-muted/50 italic text-muted-foreground">
                            {selectedPaciente.observacoesMed || "Nenhuma observação clínica extra."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-bold text-sm text-purple-500 flex items-center gap-2 uppercase tracking-wide">
                        <GraduationCap className="h-4 w-4" />
                        Ambiente Escolar
                      </h3>
                      <div
                        className="p-4 rounded-xl border space-y-3 text-xs"
                        style={{ borderColor: "hsl(var(--border))" }}
                      >
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Escola:</span>
                          <span className="font-semibold text-foreground">{selectedPaciente.escola || "Não informada"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Série:</span>
                          <span className="font-semibold text-foreground">{selectedPaciente.serie || "Não informada"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Turno:</span>
                          <span className="font-semibold text-foreground">{selectedPaciente.turnoEscolar || "Não informado"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Coordenação:</span>
                          <span className="font-semibold text-foreground">{selectedPaciente.coordenador || "Não informada"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. EVOLUÇÕES (PRONTUÁRIO) */}
              {activeProfileTab === "prontuario" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-purple-500 flex items-center gap-2 uppercase tracking-wide">
                      <ClipboardList className="h-4 w-4" />
                      Histórico de Atendimentos
                    </h3>
                    <span className="text-xs text-muted-foreground">Ordenado cronologicamente</span>
                  </div>

                  <div className="space-y-4 relative pl-4 border-l-2 border-purple-500/20">
                    {selectedPaciente.prontuario?.map((pront) => (
                      <div key={pront.id} className="relative space-y-1.5 p-4 rounded-xl border bg-card">
                        {/* Marcador na linha do tempo */}
                        <div className="absolute -left-[23px] top-5 w-2.5 h-2.5 rounded-full bg-purple-500 border border-card" />

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                            {pront.profissional}
                          </span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(pront.data)}
                          </span>
                        </div>
                        <p className="text-xs text-foreground leading-relaxed">
                          {pront.observacoes}
                        </p>
                      </div>
                    ))}

                    {(selectedPaciente.prontuario?.length ?? 0) === 0 && (
                      <div className="py-6 text-center text-xs text-muted-foreground">
                        Nenhuma evolução registrada para este paciente ainda.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3. PLANO TERAPÊUTICO */}
              {activeProfileTab === "plano" && (
                <div className="space-y-6">
                  {selectedPaciente.planosTerapeuticos?.map((plano) => (
                    <div key={plano.id} className="space-y-4">
                      <div className="p-4 rounded-xl border bg-muted/20" style={{ borderColor: "hsl(var(--border))" }}>
                        <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-purple-500" />
                          {plano.titulo}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {plano.descricao}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h5 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                          Metas Estabelecidas
                        </h5>
                        {plano.metas.map((meta) => (
                          <div key={meta.id} className="p-4 rounded-xl border space-y-2 bg-card">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-foreground">{meta.objetivo}</span>
                              <span className="font-bold text-purple-600 dark:text-purple-400">{meta.progresso}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full bg-purple-500 rounded-full"
                                style={{ width: `${meta.progresso}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {(selectedPaciente.planosTerapeuticos?.length ?? 0) === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                      <HeartHandshake className="h-10 w-10 text-muted-foreground/30 mb-2" />
                      <h4 className="font-bold text-sm text-foreground">Sem Plano Terapêutico Ativo</h4>
                      <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                        Inicie um planejamento clínico personalizado com metas focadas na evolução deste paciente.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 4. FINANCEIRO */}
              {activeProfileTab === "financeiro" && (
                <div className="space-y-4">
                  <h3 className="font-bold text-sm text-purple-500 flex items-center gap-2 uppercase tracking-wide">
                    <DollarSign className="h-4 w-4" />
                    Lançamentos Financeiros
                  </h3>

                  <div className="overflow-hidden border rounded-xl">
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
                        {selectedPaciente.financeiro?.map((lanc) => (
                          <tr key={lanc.id} className="hover:bg-muted/10 transition-colors">
                            <td className="p-3 font-medium text-foreground">{lanc.descricao}</td>
                            <td className="p-3 text-muted-foreground">{formatDate(lanc.vencimento)}</td>
                            <td className="p-3 font-semibold text-foreground">R$ {lanc.valor.toFixed(2)}</td>
                            <td className="p-3">
                              <span
                                className={cn(
                                  "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
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

                    {(selectedPaciente.financeiro?.length ?? 0) === 0 && (
                      <div className="py-6 text-center text-xs text-muted-foreground">
                        Nenhum lançamento financeiro registrado.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 5. EXERCÍCIOS E DOCUMENTOS */}
              {activeProfileTab === "docs" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Documentos */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-purple-500 flex items-center gap-2 uppercase tracking-wide">
                      <FileText className="h-4 w-4" />
                      Documentos Anexados
                    </h4>
                    <div className="space-y-2">
                      {selectedPaciente.documentos?.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-3 rounded-xl border flex items-center justify-between text-xs bg-card"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="h-4 w-4 text-purple-500 shrink-0" />
                            <span className="font-medium text-foreground truncate">{doc.nome}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground">{formatDate(doc.data)}</span>
                        </div>
                      ))}
                      {(selectedPaciente.documentos?.length ?? 0) === 0 && (
                        <div className="text-xs text-muted-foreground italic py-2">
                          Nenhum arquivo digitalizado ou contrato anexado.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Exercícios para Casa */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-purple-500 flex items-center gap-2 uppercase tracking-wide">
                      <BookOpen className="h-4 w-4" />
                      Atividades para Casa
                    </h4>
                    <div className="space-y-2">
                      {selectedPaciente.exercicios?.map((ex) => (
                        <div
                          key={ex.id}
                          className="p-3 rounded-xl border flex items-center justify-between text-xs bg-card"
                        >
                          <div>
                            <p className="font-medium text-foreground">{ex.titulo}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Tipo: {ex.tipo}</p>
                          </div>
                          <span
                            className={cn(
                              "text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider",
                              ex.realizado === true && "bg-emerald-500/10 text-emerald-500",
                              ex.realizado === null && "bg-muted text-muted-foreground"
                            )}
                          >
                            {ex.realizado === true ? "Realizado" : "Pendente"}
                          </span>
                        </div>
                      ))}
                      {(selectedPaciente.exercicios?.length ?? 0) === 0 && (
                        <div className="text-xs text-muted-foreground italic py-2">
                          Nenhuma atividade escolar ou domiciliar cadastrada.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 6. CONTRATOS DO PACIENTE (GESTÃO INTEGRADA NO PERFIL) */}
              {activeProfileTab === "contratos" && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-bold text-sm text-purple-500 flex items-center gap-2 uppercase tracking-wide">
                      <FileText className="h-4 w-4" />
                      Contratos de Prestação de Serviços & Termos LGPD
                    </h3>

                    <button
                      onClick={() => setIsNewContratoOpen(true)}
                      className="flex items-center gap-1 py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white gradient-primary shadow-xs cursor-pointer border-0"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Vincular Contrato</span>
                    </button>
                  </div>

                  {contratosLoading ? (
                    <div className="flex h-32 items-center justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-violet-600 border-t-transparent" />
                    </div>
                  ) : contratos.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500 bg-muted/10 border border-dashed rounded-xl space-y-1">
                      <Clock className="h-8 w-8 text-zinc-500 mx-auto" />
                      <p className="font-bold">Nenhum contrato ativo ou termo vinculado</p>
                      <p className="text-[10px] text-muted-foreground">Adicione contratos de mensalidades ou termos LGPD/imagem para este paciente.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {contratos.map((cont) => (
                        <div
                          key={cont.id}
                          className="rounded-xl border p-4 flex flex-col justify-between bg-card hover:shadow-xs transition-shadow relative"
                          style={{ borderColor: "hsl(var(--border))" }}
                        >
                          <div className="absolute top-3 right-3">
                            {cont.assinado ? (
                              <span className="flex items-center gap-0.5 text-[8px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full uppercase tracking-wider border border-emerald-500/20">
                                <Check className="h-3 w-3" /> Assinado
                              </span>
                            ) : (
                              <span className="flex items-center gap-0.5 text-[8px] font-bold bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full uppercase tracking-wider border border-amber-500/20">
                                <Clock className="h-3 w-3" /> Pendente
                              </span>
                            )}
                          </div>

                          <div className="space-y-2.5">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4.5 w-4.5 text-purple-400 shrink-0" />
                              <span className="font-bold text-foreground text-sm truncate pr-16">{cont.titulo}</span>
                            </div>

                            <div className="bg-muted/40 p-2.5 rounded-lg border text-[10px] space-y-1 text-muted-foreground">
                              {cont.valorMensal && (
                                <div className="flex justify-between">
                                  <span>Mensalidade:</span>
                                  <span className="font-bold text-foreground">{formatCurrency(Number(cont.valorMensal))}</span>
                                </div>
                              )}
                              {cont.qtdParcelas && (
                                <div className="flex justify-between">
                                  <span>Parcelas/Meses:</span>
                                  <span className="font-bold text-foreground">{cont.qtdParcelas}x</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span>Gênero Financeiro:</span>
                                <span className="font-bold text-foreground">{cont.gerouFinanceiro ? "Sim (Efetivado)" : "Pendente de Assinatura"}</span>
                              </div>
                            </div>
                          </div>

                          <div className="h-[1px] bg-border my-3" />

                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleDeleteContrato(cont.id)}
                              className="p-2 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-500 cursor-pointer"
                              title="Remover Contrato"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>

                            {!cont.assinado && (
                              <button
                                onClick={() => handleSignContrato(cont.id)}
                                className="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold text-white gradient-primary hover:shadow-xs uppercase tracking-wider cursor-pointer"
                              >
                                Assinar Digital
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* SUB-MODAL NOVO CONTRATO DO PACIENTE */}
                  <AnimatePresence>
                    {isNewContratoOpen && (
                      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                        <div className="absolute inset-0" onClick={() => setIsNewContratoOpen(false)} />

                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.95, opacity: 0 }}
                          className="relative w-full max-w-sm rounded-xl shadow-2xl border overflow-hidden bg-card"
                          style={{ borderColor: "hsl(var(--border))" }}
                        >
                          <div className="p-5 border-b flex items-center justify-between">
                            <div>
                              <h3 className="font-bold text-sm text-foreground">Gerar Contrato para {selectedPaciente.nome}</h3>
                              <p className="text-[9px] text-muted-foreground mt-0.5">Defina as diretrizes financeiras.</p>
                            </div>
                            <button onClick={() => setIsNewContratoOpen(false)} className="p-1 rounded hover:bg-muted text-muted-foreground cursor-pointer">
                              <X className="h-4.5 w-4.5" />
                            </button>
                          </div>

                          <form onSubmit={handleCreateContrato} className="p-5 space-y-3.5 text-xs">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase">Título do Contrato/Termo</label>
                              <input
                                type="text"
                                required
                                value={cTitulo}
                                onChange={(e) => setCTitulo(e.target.value)}
                                className="w-full p-2.5 rounded-lg border bg-background text-foreground outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase">Tipo</label>
                              <select
                                value={cTipo}
                                onChange={(e) => setCTipo(e.target.value)}
                                className="w-full p-2.5 rounded-lg border bg-background text-foreground outline-none cursor-pointer"
                              >
                                <option value="contrato">Contrato de Serviços</option>
                                <option value="lgpd">Termo LGPD</option>
                                <option value="autorizacao_imagem">Autorização de Imagem</option>
                                <option value="outro">Outro Termo</option>
                              </select>
                            </div>

                            {cTipo === "contrato" && (
                              <div className="space-y-3 p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-muted-foreground uppercase">Mensalidade (R$)</label>
                                    <input
                                      type="number"
                                      step="0.01"
                                      value={cValor}
                                      onChange={(e) => setCValor(e.target.value)}
                                      className="w-full p-2 rounded-lg border bg-background text-foreground font-bold outline-none"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-muted-foreground uppercase">Nº de Parcelas</label>
                                    <input
                                      type="number"
                                      value={cParcelas}
                                      onChange={(e) => setCParcelas(e.target.value)}
                                      className="w-full p-2 rounded-lg border bg-background text-foreground font-bold outline-none"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-muted-foreground uppercase">Dia do Vencimento</label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="31"
                                    value={cDiaVenc}
                                    onChange={(e) => setCDiaVenc(e.target.value)}
                                    className="w-full p-2 rounded-lg border bg-background text-foreground font-bold outline-none"
                                  />
                                </div>
                              </div>
                            )}

                            <div className="p-3 bg-muted/40 rounded-lg border space-y-2">
                              <div className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  id="vincularPdf"
                                  checked={vincularPDF}
                                  onChange={(e) => setVincularPDF(e.target.checked)}
                                  className="rounded border-border text-purple-500 w-4 h-4 cursor-pointer"
                                />
                                <label htmlFor="vincularPdf" className="font-bold text-foreground cursor-pointer">Vincular PDF Existente</label>
                              </div>
                              {vincularPDF && (
                                <div className="space-y-1 pt-1.5 border-t border-border/40">
                                  <label className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                                    <Upload className="h-3.5 w-3.5" /> Selecionar Arquivo PDF
                                  </label>
                                  <input
                                    type="file"
                                    accept=".pdf"
                                    required={vincularPDF}
                                    onChange={(e) => setCUploadFile(e.target.files?.[0] || null)}
                                    className="w-full text-[10px] text-muted-foreground cursor-pointer"
                                  />
                                </div>
                              )}
                            </div>

                            <div className="pt-3 border-t flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setIsNewContratoOpen(false)}
                                className="px-3 py-2 rounded-lg border font-bold text-zinc-400 border-border hover:bg-muted cursor-pointer"
                              >
                                Cancelar
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-2 rounded-lg font-semibold text-white gradient-primary cursor-pointer border-0 shadow-lg shadow-purple-500/10"
                              >
                                Gerar Contrato
                              </button>
                            </div>
                          </form>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>

                  {/* SUB-MODAL ASSINATURA DE PUNHO DIGITAL */}
                  <AnimatePresence>
                    {isSignatureModalOpen && (
                      <SignaturePadModal
                        onClose={() => {
                          setIsSignatureModalOpen(false);
                          setSigningContratoId(null);
                        }}
                        onSave={submitSignature}
                      />
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
