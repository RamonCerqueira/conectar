"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Plus,
  X,
  Search,
  BookOpen,
  Calendar,
  Users,
  Briefcase,
  Layers,
  Sparkles,
  Trash2,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function EscolarPage() {
  const [escolas, setEscolas] = useState<any[]>([]);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEscola, setSelectedEscola] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewReuniaoModalOpen, setIsNewReuniaoModalOpen] = useState(false);

  // Form states - Contato Escolar
  const [pacienteId, setPacienteId] = useState("");
  const [escolaNome, setEscolaNome] = useState("");
  const [professor, setProfessor] = useState("");
  const [coordenador, setCoordenador] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [savingContato, setSavingContato] = useState(false);

  // Form states - Nova Reunião
  const [reuniaoData, setReuniaoData] = useState(new Date().toISOString().split("T")[0]);
  const [reuniaoObjetivo, setReuniaoObjetivo] = useState("");
  const [reuniaoResumo, setReuniaoResumo] = useState("");
  const [savingReuniao, setSavingReuniao] = useState(false);

  // Carregar contatos e pacientes
  const loadData = async () => {
    setLoading(true);
    try {
      const [resEscolar, resPacientes] = await Promise.all([
        api.get("/escolar"),
        api.get("/pacientes"),
      ]);

      const contatos = Array.isArray(resEscolar.data) ? resEscolar.data : [];
      setEscolas(contatos);

      const listaPacientes = Array.isArray(resPacientes.data)
        ? resPacientes.data
        : resPacientes.data?.data || [];
      setPacientes(listaPacientes);
      if (listaPacientes.length > 0 && !pacienteId) {
        setPacienteId(listaPacientes[0].id);
      }
    } catch (err: any) {
      console.error("Erro ao carregar dados escolares:", err);
      toast.error("Erro ao carregar dados do módulo escolar.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateContato = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteId || !escolaNome) {
      toast.error("Selecione o paciente e informe o nome do colégio.");
      return;
    }

    setSavingContato(true);
    try {
      const res = await api.post("/escolar/contatos", {
        pacienteId,
        escola: escolaNome,
        professor: professor || null,
        coordenador: coordenador || null,
        telefone: telefone || null,
        email: email || null,
        observacoes: observacoes || null,
      });

      toast.success("Vínculo escolar cadastrado com sucesso!");
      setIsModalOpen(false);
      setEscolaNome("");
      setProfessor("");
      setCoordenador("");
      setTelefone("");
      setEmail("");
      setObservacoes("");

      // Recarrega lista
      loadData();
    } catch (err: any) {
      console.error("Erro ao salvar contato escolar:", err);
      toast.error(err.response?.data?.message || "Erro ao salvar contato escolar.");
    } finally {
      setSavingContato(false);
    }
  };

  const handleDeleteContato = async (id: string) => {
    if (!confirm("Deseja realmente excluir este vínculo escolar e todas as reuniões anexadas?")) {
      return;
    }
    try {
      await api.delete(`/escolar/contatos/${id}`);
      toast.success("Vínculo escolar removido com sucesso.");
      setEscolas((prev) => prev.filter((e) => e.id !== id));
      if (selectedEscola?.id === id) setSelectedEscola(null);
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao excluir contato escolar.");
    }
  };

  const handleCreateReuniao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEscola || !reuniaoObjetivo) return;

    setSavingReuniao(true);
    try {
      const res = await api.post("/escolar/reunioes", {
        contatoId: selectedEscola.id,
        data: reuniaoData,
        objetivo: reuniaoObjetivo,
        resumo: reuniaoResumo || null,
      });

      toast.success("Reunião escolar registrada com sucesso!");
      setIsNewReuniaoModalOpen(false);
      setReuniaoObjetivo("");
      setReuniaoResumo("");

      // Atualiza o item localmente e no selectedEscola
      const novaReuniao = res.data;
      const updatedEscola = {
        ...selectedEscola,
        reunioes: [novaReuniao, ...(selectedEscola.reunioes || [])],
      };
      setSelectedEscola(updatedEscola);
      setEscolas((prev) =>
        prev.map((esc) => (esc.id === updatedEscola.id ? updatedEscola : esc))
      );
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao registrar reunião.");
    } finally {
      setSavingReuniao(false);
    }
  };

  const handleDeleteReuniao = async (reuniaoId: string) => {
    if (!confirm("Deseja excluir este registro de reunião?")) return;
    try {
      await api.delete(`/escolar/reunioes/${reuniaoId}`);
      toast.success("Reunião removida.");
      const updatedReunioes = (selectedEscola.reunioes || []).filter(
        (r: any) => r.id !== reuniaoId
      );
      const updatedEscola = { ...selectedEscola, reunioes: updatedReunioes };
      setSelectedEscola(updatedEscola);
      setEscolas((prev) =>
        prev.map((esc) => (esc.id === updatedEscola.id ? updatedEscola : esc))
      );
    } catch (err) {
      toast.error("Erro ao excluir reunião.");
    }
  };

  const filteredEscolas = escolas.filter((e) => {
    const term = searchTerm.toLowerCase();
    const nomeAluno = e.paciente?.nome?.toLowerCase() || "";
    const nomeEscola = e.escola?.toLowerCase() || "";
    const prof = e.professor?.toLowerCase() || "";
    return nomeAluno.includes(term) || nomeEscola.includes(term) || prof.includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Acompanhamento e Controle Escolar
          </h1>
          <p className="text-sm text-muted-foreground">
            Alinhamento entre clínica e escola: contatos pedagógicos, reuniões de caso e histórico escolar 100% integrado ao prontuário.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Vincular Escola</span>
        </motion.button>
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
            placeholder="Buscar por escola, criança ou professor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none border transition-colors bg-muted border-transparent text-foreground"
          />
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="p-16 text-center text-sm text-muted-foreground bg-card border rounded-2xl">
          <div className="animate-spin h-6 w-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-3" />
          Carregando vínculos escolares do banco de dados...
        </div>
      ) : (
        /* Grid de Escolas */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEscolas.map((esc) => (
            <motion.div
              layout
              key={esc.id}
              whileHover={{ y: -4 }}
              className="rounded-2xl border p-5 flex flex-col justify-between relative overflow-hidden transition-all shadow-sm bg-card"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <div>
                <div className="flex items-start justify-between gap-3 border-b pb-3">
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground">{esc.escola}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Aluno: <strong className="text-foreground">{esc.paciente?.nome || "Paciente"}</strong>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteContato(esc.id)}
                    title="Excluir vínculo escolar"
                    className="text-muted-foreground hover:text-red-500 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Professor(a):</span>
                    <span className="font-semibold text-foreground">{esc.professor || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Coordenador(a):</span>
                    <span className="font-semibold text-foreground">{esc.coordenador || "—"}</span>
                  </div>
                  {esc.telefone && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Telefone:</span>
                      <span className="font-semibold text-foreground">{esc.telefone}</span>
                    </div>
                  )}
                  {esc.email && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">E-mail:</span>
                      <span className="font-semibold text-foreground">{esc.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="h-[1px] bg-border my-4" />

              {/* Ações */}
              <button
                onClick={() => setSelectedEscola(esc)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
              >
                <Calendar className="h-3.5 w-3.5 text-purple-500" />
                Ver Reuniões ({esc.reunioes?.length || 0})
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredEscolas.length === 0 && (
        <div className="p-16 text-center text-sm text-muted-foreground border rounded-2xl bg-card">
          Nenhum vínculo escolar cadastrado. Clique em "Vincular Escola" para cadastrar o primeiro.
        </div>
      )}

      {/* ─── MODAL DETALHE (REUNIÕES ESCOLARES) ────────────────────────── */}
      <AnimatePresence>
        {selectedEscola && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="absolute inset-0" onClick={() => setSelectedEscola(null)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden bg-card"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              {/* Header */}
              <div className="p-6 border-b flex items-center justify-between gradient-primary text-white">
                <div>
                  <span className="text-[10px] uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                    Acompanhamento Escolar
                  </span>
                  <h3 className="font-bold text-lg text-white mt-1">{selectedEscola.escola}</h3>
                  <p className="text-xs text-white/80 mt-0.5">
                    Aluno: {selectedEscola.paciente?.nome}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedEscola(null)}
                  className="p-2 rounded-xl hover:bg-white/10 text-white cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Corpo */}
              <div className="p-6 space-y-6 text-xs max-h-[70vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-purple-500 uppercase tracking-wide">
                    Reuniões com a Equipe Pedagógica
                  </h4>
                  <button
                    onClick={() => setIsNewReuniaoModalOpen(true)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white gradient-primary shadow-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Nova Reunião
                  </button>
                </div>

                <div className="space-y-3 pl-3 border-l border-purple-500/20">
                  {(selectedEscola.reunioes || []).map((re: any) => (
                    <div key={re.id} className="space-y-1 relative group">
                      <div className="absolute -left-[16.5px] top-1.5 w-2 h-2 bg-purple-500 rounded-full border border-card" />
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-foreground">{re.objetivo}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground">{formatDate(re.data)}</span>
                          <button
                            onClick={() => handleDeleteReuniao(re.id)}
                            className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Excluir reunião"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      {re.resumo && (
                        <p className="text-muted-foreground leading-relaxed italic">
                          "{re.resumo}"
                        </p>
                      )}
                    </div>
                  ))}
                  {(!selectedEscola.reunioes || selectedEscola.reunioes.length === 0) && (
                    <p className="text-muted-foreground italic py-2">
                      Nenhuma reunião de caso registrada para esta escola.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL NOVA REUNIÃO ───────────────────────────────────────── */}
      <AnimatePresence>
        {isNewReuniaoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="absolute inset-0" onClick={() => setIsNewReuniaoModalOpen(false)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden bg-card"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-foreground">Nova Reunião com a Escola</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{selectedEscola?.escola}</p>
                </div>
                <button
                  onClick={() => setIsNewReuniaoModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-muted text-muted-foreground cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateReuniao} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Data da Reunião</label>
                  <input
                    type="date"
                    required
                    value={reuniaoData}
                    onChange={(e) => setReuniaoData(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none bg-muted border-transparent text-foreground"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Objetivo / Assunto</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Alinhamento de conduta pedagógica e adaptação escolar"
                    value={reuniaoObjetivo}
                    onChange={(e) => setReuniaoObjetivo(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none bg-muted border-transparent text-foreground"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Resumo / Acordos da Reunião</label>
                  <textarea
                    rows={3}
                    placeholder="Descreva o que foi discutido, condutas acordadas e encaminhamentos..."
                    value={reuniaoResumo}
                    onChange={(e) => setReuniaoResumo(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none bg-muted border-transparent text-foreground resize-none"
                  />
                </div>

                <div className="pt-4 border-t flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsNewReuniaoModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={savingReuniao}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer disabled:opacity-50"
                  >
                    {savingReuniao ? "Salvando..." : "Registrar Reunião"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL VINCULAR ESCOLA (NOVO) ─────────────────────────────────── */}
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
                  <h3 className="font-bold text-lg text-foreground">Vincular Escola ao Paciente</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Cadastre o contato da instituição de ensino no prontuário.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-muted text-muted-foreground cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateContato} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Paciente (Criança)</label>
                  <select
                    required
                    value={pacienteId}
                    onChange={(e) => setPacienteId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none bg-muted border-transparent text-foreground"
                  >
                    {pacientes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Nome da Instituição / Escola</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Colégio Santa Maria"
                    value={escolaNome}
                    onChange={(e) => setEscolaNome(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none bg-muted border-transparent text-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Professor(a) Regente</label>
                    <input
                      type="text"
                      placeholder="Ex: Profª Sandra"
                      value={professor}
                      onChange={(e) => setProfessor(e.target.value)}
                      className="w-full p-2.5 rounded-xl border text-xs outline-none bg-muted border-transparent text-foreground"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Coordenador(a)</label>
                    <input
                      type="text"
                      placeholder="Ex: Helena Reis"
                      value={coordenador}
                      onChange={(e) => setCoordenador(e.target.value)}
                      className="w-full p-2.5 rounded-xl border text-xs outline-none bg-muted border-transparent text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Telefone / WhatsApp</label>
                    <input
                      type="text"
                      placeholder="(11) 99999-9999"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border text-xs outline-none bg-muted border-transparent text-foreground"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">E-mail da Escola</label>
                    <input
                      type="email"
                      placeholder="coord@escola.com.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl border text-xs outline-none bg-muted border-transparent text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Observações / Adaptações</label>
                  <textarea
                    rows={2}
                    placeholder="Informações sobre adaptação curricular, mediador escolar, etc."
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none bg-muted border-transparent text-foreground resize-none"
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
                    disabled={savingContato}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer disabled:opacity-50"
                  >
                    {savingContato ? "Salvando..." : "Salvar Vínculo"}
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
