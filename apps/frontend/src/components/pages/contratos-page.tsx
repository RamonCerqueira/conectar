"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  X,
  Search,
  CheckCircle,
  Clock,
  Printer,
  Send,
  Download,
  Info,
  Sparkles,
  Users,
  Edit2,
  Trash2,
  Upload
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn, formatDate } from "@/lib/utils";

interface Template {
  id: string;
  titulo: string;
  tipo: string;
  descricao: string;
  conteudo: string;
  arquivoUrl?: string | null;
}

export function ContratosPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Send to patient modal state
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedPacienteId, setSelectedPacienteId] = useState("");
  const [cValor, setCValor] = useState("1200.00");
  const [cParcelas, setCParcelas] = useState("12");
  const [cDiaVenc, setCDiaVenc] = useState("10");

  // Template CRUD Modal States
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [tTitulo, setTTitulo] = useState("");
  const [tTipo, setTTipo] = useState("contrato");
  const [tDescricao, setTDescricao] = useState("");
  const [tConteudo, setTConteudo] = useState("");
  const [vincularPdfModelo, setVincularPdfModelo] = useState(false);
  const [tUploadFile, setTUploadFile] = useState<File | null>(null);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const res = await api.get("/contratos/modelos");
      setTemplates(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar modelos de contratos.");
    } finally {
      setLoading(false);
    }
  };

  const loadPacientes = async () => {
    try {
      const res = await api.get("/pacientes");
      setPacientes(Array.isArray(res.data) ? res.data : (res.data?.data || []));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTemplates();
    loadPacientes();
  }, []);

  const handlePrintBlank = (temp: Template) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>${temp.titulo}</title>
          <style>
            body { font-family: sans-serif; padding: 50px; line-height: 1.8; color: #111; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #7c3aed; padding-bottom: 20px; }
            .logo { font-size: 26px; font-weight: bold; color: #7c3aed; }
            .subtitle { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #666; margin-top: 5px; }
            .body-text { font-size: 14px; text-align: justify; white-space: pre-line; margin-bottom: 50px; }
            .footer { margin-top: 80px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">INSTITUTO CONECTAR</div>
            <div class="subtitle">${temp.titulo}</div>
          </div>
          <div class="body-text">
            ${temp.conteudo}
          </div>
          <div class="footer">
            Instituto Conectar Apoio à Aprendizagem LTDA | Telefone: (11) 99999-9999
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

  const handleSendToPaciente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate || !selectedPacienteId) return;

    const chosenPaciente = pacientes.find(p => p.id === selectedPacienteId);
    if (!chosenPaciente) return;

    try {
      await api.post("/contratos", {
        pacienteId: selectedPacienteId,
        tipo: selectedTemplate.tipo,
        titulo: selectedTemplate.titulo,
        caminho: selectedTemplate.arquivoUrl || `/storage/contratos/${chosenPaciente.nome.toLowerCase().replace(/ /g, "_")}_${Date.now()}.pdf`,
        valorMensal: selectedTemplate.tipo === "contrato" ? parseFloat(cValor) : null,
        qtdParcelas: selectedTemplate.tipo === "contrato" ? parseInt(cParcelas) : null,
        diaVencimento: selectedTemplate.tipo === "contrato" ? parseInt(cDiaVenc) : null,
        assinado: false
      });

      toast.success(`Contrato vinculado com sucesso no prontuário de ${chosenPaciente.nome}!`);
      setIsSendModalOpen(false);
      setSelectedTemplate(null);
      setSelectedPacienteId("");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao vincular contrato ao paciente.");
    }
  };

  // CRUD Template Submit Handler
  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tTitulo || !tDescricao) return;

    const payload = {
      titulo: tTitulo,
      tipo: tTipo,
      descricao: tDescricao,
      conteudo: tConteudo || "Contrato vinculado via PDF físico."
    };

    try {
      let savedModel;
      if (editingTemplate) {
        const res = await api.put(`/contratos/modelos/${editingTemplate.id}`, payload);
        savedModel = res.data;
        toast.success("Modelo de documento atualizado com sucesso!");
      } else {
        const res = await api.post("/contratos/modelos", payload);
        savedModel = res.data;
        toast.success("Novo modelo de documento cadastrado com sucesso!");
      }

      if (vincularPdfModelo && tUploadFile && savedModel?.id) {
        const formData = new FormData();
        formData.append("file", tUploadFile);
        await api.post(`/contratos/modelos/${savedModel.id}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Arquivo PDF do modelo anexado com sucesso!");
      }

      setIsTemplateModalOpen(false);
      setEditingTemplate(null);
      setVincularPdfModelo(false);
      setTUploadFile(null);
      loadTemplates();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar modelo de documento.");
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm("Deseja realmente remover este modelo de contrato permanentemente?")) return;
    try {
      await api.delete(`/contratos/modelos/${id}`);
      toast.success("Modelo de documento excluído.");
      loadTemplates();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao remover modelo.");
    }
  };

  const openCreateTemplate = () => {
    setEditingTemplate(null);
    setTTitulo("");
    setTTipo("contrato");
    setTDescricao("");
    setTConteudo("");
    setVincularPdfModelo(false);
    setTUploadFile(null);
    setIsTemplateModalOpen(true);
  };

  const openEditTemplate = (temp: Template) => {
    setEditingTemplate(temp);
    setTTitulo(temp.titulo);
    setTTipo(temp.tipo);
    setTDescricao(temp.descricao);
    setTConteudo(temp.conteudo);
    setVincularPdfModelo(!!temp.arquivoUrl);
    setTUploadFile(null);
    setIsTemplateModalOpen(true);
  };

  const filteredTemplates = templates.filter((t) =>
    t.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Modelos de Contratos & Termos
          </h1>
          <p className="text-sm text-muted-foreground">
            Visualize modelos em branco, envie para assinatura digital de um paciente ou crie novos modelos.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreateTemplate}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer border-0"
        >
          <Plus className="h-4 w-4" />
          <span>Cadastrar Modelo</span>
        </motion.button>
      </div>

      {/* Info Warning */}
      <div className="p-4 rounded-2xl border bg-card flex items-start gap-3" style={{ borderColor: "hsl(var(--border))" }}>
        <Info className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-foreground">💡 Centralização no Paciente</p>
          <p className="text-muted-foreground leading-relaxed">
            Esta tela gerencia os modelos gerais do Instituto. Os contratos emitidos/assinados específicos de cada criança estão armazenados diretamente na aba "Contratos & Termos" de seu respectivo prontuário.
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div
        className="p-4 rounded-2xl border flex flex-col md:flex-row gap-4 bg-card"
        style={{ borderColor: "hsl(var(--border))" }}
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar modelos de termos ou declarações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none border transition-colors bg-muted border-transparent text-foreground"
          />
        </div>
      </div>

      {/* Grid de Modelos */}
      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((temp) => (
            <motion.div
              layout
              key={temp.id}
              whileHover={{ y: -4 }}
              className="rounded-2xl border p-5 flex flex-col justify-between relative overflow-hidden transition-all shadow-sm bg-card text-xs"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground leading-tight">
                        {temp.titulo}
                      </h3>
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold border bg-purple-500/10 border-purple-500/20 text-purple-400 uppercase tracking-wider">
                        {temp.tipo}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => openEditTemplate(temp)}
                      className="p-1.5 hover:bg-muted text-muted-foreground rounded-lg cursor-pointer border-0 bg-transparent"
                      title="Editar Modelo"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(temp.id)}
                      className="p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer border-0 bg-transparent"
                      title="Excluir Modelo"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed text-[11px]">
                  {temp.descricao}
                </p>
              </div>

              <div className="space-y-2 mt-4 pt-4 border-t border-border">
                <div className="flex gap-2">
                  {temp.arquivoUrl ? (
                    <a
                      href={`${api.defaults.baseURL?.replace("/api", "")}${temp.arquivoUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border text-[10px] font-bold hover:bg-muted transition-colors text-center text-foreground decoration-none"
                      style={{ borderColor: "hsl(var(--border))" }}
                    >
                      <Download className="h-3.5 w-3.5" /> Ver PDF Modelo
                    </a>
                  ) : (
                    <button
                      onClick={() => handlePrintBlank(temp)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border text-[10px] font-bold hover:bg-muted transition-colors cursor-pointer bg-transparent"
                      style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
                    >
                      <Printer className="h-3.5 w-3.5" /> Imprimir Branco
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setSelectedTemplate(temp);
                      setIsSendModalOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg font-bold text-white gradient-primary shadow-xs hover:shadow-md transition-all cursor-pointer text-[10px] uppercase tracking-wider border-0"
                  >
                    <Send className="h-3.5 w-3.5" /> Enviar p/ Assinar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ─── MODAL ENVIAR PARA PACIENTE ────────────────────────────────────── */}
      <AnimatePresence>
        {isSendModalOpen && selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="absolute inset-0" onClick={() => { setIsSendModalOpen(false); setSelectedTemplate(null); }} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm rounded-2xl shadow-2xl border overflow-hidden bg-card"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              {/* Header */}
              <div className="p-5 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-foreground">Vincular e Despachar Termo</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Selecione o paciente que assinará digitalmente.</p>
                </div>
                <button
                  onClick={() => { setIsSendModalOpen(false); setSelectedTemplate(null); }}
                  className="p-1 rounded-lg hover:bg-muted text-muted-foreground cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSendToPaciente} className="p-5 space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-purple-400" />
                    Escolher Paciente
                  </label>
                  <select
                    required
                    value={selectedPacienteId}
                    onChange={(e) => setSelectedPacienteId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none cursor-pointer"
                  >
                    <option value="">Selecione uma criança...</option>
                    {pacientes.map(p => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </select>
                </div>

                {selectedTemplate.tipo === "contrato" && (
                  <div className="space-y-3 p-3 bg-purple-500/5 rounded-xl border border-purple-500/10">
                    <p className="font-bold text-foreground text-[10px] uppercase flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-purple-400" /> Acerto Financeiro Integrado
                    </p>
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

                <div className="pt-4 border-t flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => { setIsSendModalOpen(false); setSelectedTemplate(null); }}
                    className="px-4 py-2 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer bg-transparent"
                    style={{ borderColor: "hsl(var(--border))" }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer border-0"
                  >
                    Vincular e Enviar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL CRUD MODELOS DE DOCUMENTO (NOVO/EDITAR) ────────────────── */}
      <AnimatePresence>
        {isTemplateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="absolute inset-0" onClick={() => setIsTemplateModalOpen(false)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden bg-card"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <div className="p-5 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-foreground">
                    {editingTemplate ? "Editar Modelo de Documento" : "Cadastrar Novo Modelo"}
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Defina as cláusulas padrão do termo legal.</p>
                </div>
                <button
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-muted text-muted-foreground cursor-pointer border-0 bg-transparent"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleSaveTemplate} className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Título do Modelo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Contrato de Prestação de Serviços Multidisciplinares"
                      value={tTitulo}
                      onChange={(e) => setTTitulo(e.target.value)}
                      className="w-full p-2.5 rounded-lg border bg-background text-foreground outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Tipo de Termo</label>
                    <select
                      value={tTipo}
                      onChange={(e) => setTTipo(e.target.value)}
                      className="w-full p-2.5 rounded-lg border bg-background text-foreground outline-none cursor-pointer"
                    >
                      <option value="contrato">Contrato Financeiro</option>
                      <option value="lgpd">Termo LGPD</option>
                      <option value="autorizacao_imagem">Autorização de Imagem</option>
                      <option value="outro">Declaração / Outro</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Breve Descrição</label>
                  <input
                    type="text"
                    required
                    placeholder="Resumo explicativo do objetivo deste documento..."
                    value={tDescricao}
                    onChange={(e) => setTDescricao(e.target.value)}
                    className="w-full p-2.5 rounded-lg border bg-background text-foreground outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Corpo / Cláusulas do Documento</label>
                  <textarea
                    rows={8}
                    required={!vincularPdfModelo}
                    placeholder="Digite o texto completo do contrato ou termo aqui..."
                    value={tConteudo}
                    onChange={(e) => setTConteudo(e.target.value)}
                    className="w-full p-3 rounded-lg border bg-background text-foreground outline-none font-mono resize-none leading-relaxed text-[11px]"
                  />
                </div>

                <div className="p-3 bg-muted/40 rounded-lg border space-y-2">
                  <div className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="vincularPdfModelo"
                      checked={vincularPdfModelo}
                      onChange={(e) => setVincularPdfModelo(e.target.checked)}
                      className="rounded border-border text-purple-500 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="vincularPdfModelo" className="font-bold text-foreground cursor-pointer">Vincular PDF Pronto</label>
                  </div>
                  {vincularPdfModelo && (
                    <div className="space-y-1 pt-1.5 border-t border-border/40 font-bold text-muted-foreground uppercase">
                      <label className="text-[9px] flex items-center gap-1">
                        <Upload className="h-3.5 w-3.5" /> Selecionar Arquivo PDF
                      </label>
                      <input
                        type="file"
                        accept=".pdf"
                        required={vincularPdfModelo && !editingTemplate?.arquivoUrl}
                        onChange={(e) => setTUploadFile(e.target.files?.[0] || null)}
                        className="w-full text-[10px] text-muted-foreground cursor-pointer mt-1"
                      />
                      {editingTemplate?.arquivoUrl && (
                        <p className="text-[9px] text-purple-400 lowercase normal-case font-normal mt-1">
                          Já existe um arquivo PDF associado. Selecione outro para substituir.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsTemplateModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer bg-transparent"
                    style={{ borderColor: "hsl(var(--border))" }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer border-0"
                  >
                    Salvar Modelo
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
