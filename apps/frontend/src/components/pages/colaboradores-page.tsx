"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, X, Shield, Mail, Calendar, Eye, EyeOff, UserPlus, 
  ToggleLeft, ToggleRight, Edit2, Phone, FileText, DollarSign, Clock, HelpCircle 
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn, getInitials } from "@/lib/utils";

interface Colaborador {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  foto?: string | null;
  ativo: boolean;
  criadoEm: string;
  telefone?: string;
  cpfCnpj?: string;
  tipoContrato?: string;
  salarioBase?: number | string | null;
  cargaHoraria?: string;
  chavePix?: string;
}

export function ColaboradoresPage() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeRoleFilter, setActiveRoleFilter] = useState("TODOS");
  
  // Modals state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedColab, setSelectedColab] = useState<Colaborador | null>(null);

  // New Colaborador Form State
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("RECEPCAO");
  const [telefone, setTelefone] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [tipoContrato, setTipoContrato] = useState("CLT");
  const [salarioBase, setSalarioBase] = useState("");
  const [cargaHoraria, setCargaHoraria] = useState("");
  const [chavePix, setChavePix] = useState("");
  const [showSenha, setShowSenha] = useState(false);

  // Edit Colaborador Form State
  const [editNome, setEditNome] = useState("");
  const [editPerfil, setEditPerfil] = useState("");
  const [editTelefone, setEditTelefone] = useState("");
  const [editCpfCnpj, setEditCpfCnpj] = useState("");
  const [editTipoContrato, setEditTipoContrato] = useState("CLT");
  const [editSalarioBase, setEditSalarioBase] = useState("");
  const [editCargaHoraria, setEditCargaHoraria] = useState("");
  const [editChavePix, setEditChavePix] = useState("");
  const [editSenha, setEditSenha] = useState("");
  const [showEditSenha, setShowEditSenha] = useState(false);

  const loadColaboradores = async () => {
    setLoading(true);
    try {
      const res = await api.get("/usuarios");
      const data = res.data || [];
      
      const clinicalRoles = ["PSICOLOGO", "PSICOPEDAGOGO", "NEUROPSICÓLOGO", "FONOAUDIOLOGO", "TERAPEUTA_OCUPACIONAL", "PEDAGOGO", "PAIS"];
      const filtered = data.filter((u: any) => !clinicalRoles.includes(u.perfil));
      
      setColaboradores(filtered);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar colaboradores do servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadColaboradores();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const payload = {
        nome,
        email,
        senha,
        perfil,
        telefone: telefone || null,
        cpfCnpj: cpfCnpj || null,
        tipoContrato,
        salarioBase: salarioBase ? Number(salarioBase) : null,
        cargaHoraria: cargaHoraria || null,
        chavePix: chavePix || null,
      };

      await api.post("/usuarios", payload);
      toast.success("Colaborador cadastrado com sucesso!");
      setIsNewModalOpen(false);
      
      // Reset state
      setNome("");
      setEmail("");
      setSenha("");
      setPerfil("RECEPCAO");
      setTelefone("");
      setCpfCnpj("");
      setTipoContrato("CLT");
      setSalarioBase("");
      setCargaHoraria("");
      setChavePix("");
      
      loadColaboradores();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Erro ao cadastrar colaborador.");
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedColab) return;
    if (!editNome.trim()) {
      toast.error("O nome é obrigatório.");
      return;
    }

    try {
      const payload = {
        nome: editNome,
        perfil: editPerfil,
        telefone: editTelefone || null,
        cpfCnpj: editCpfCnpj || null,
        tipoContrato: editTipoContrato,
        salarioBase: editSalarioBase ? Number(editSalarioBase) : null,
        cargaHoraria: editCargaHoraria || null,
        chavePix: editChavePix || null,
      };

      // 1. Update basic and contract info
      await api.put(`/usuarios/${selectedColab.id}`, payload);

      // 2. Redefine password if filled
      if (editSenha.trim()) {
        await api.put(`/usuarios/${selectedColab.id}/senha`, { novaSenha: editSenha });
      }

      toast.success("Dados do colaborador atualizados com sucesso!");
      setIsEditModalOpen(false);
      setEditSenha("");
      setSelectedColab(null);
      loadColaboradores();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Erro ao atualizar colaborador.");
    }
  };

  const toggleStatus = async (colab: Colaborador) => {
    try {
      if (colab.ativo) {
        await api.delete(`/usuarios/${colab.id}`);
        toast.success(`Colaborador ${colab.nome} inativado com sucesso.`);
      } else {
        await api.put(`/usuarios/${colab.id}`, { ativo: true });
        toast.success(`Colaborador ${colab.nome} reativado com sucesso.`);
      }
      loadColaboradores();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Erro ao alterar status do colaborador.");
    }
  };

  const openEditModal = (colab: Colaborador) => {
    setSelectedColab(colab);
    setEditNome(colab.nome);
    setEditPerfil(colab.perfil);
    setEditTelefone(colab.telefone || "");
    setEditCpfCnpj(colab.cpfCnpj || "");
    setEditTipoContrato(colab.tipoContrato || "CLT");
    setEditSalarioBase(colab.salarioBase !== undefined && colab.salarioBase !== null ? String(colab.salarioBase) : "");
    setEditCargaHoraria(colab.cargaHoraria || "");
    setEditChavePix(colab.chavePix || "");
    setIsEditModalOpen(true);
  };

  const filteredColabs = colaboradores.filter((c) => {
    const matchesSearch = 
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.cpfCnpj && c.cpfCnpj.includes(searchTerm));
      
    const matchesRole = activeRoleFilter === "TODOS" || c.perfil === activeRoleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      RECEPCAO: "Recepção / Secretária",
      FINANCEIRO: "Financeiro",
      COORDENADOR: "Coordenador Geral",
      DIRETOR: "Diretor Clínico",
      SUPERVISOR: "Supervisor",
      ADMINISTRADOR: "Administrador",
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      RECEPCAO: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      FINANCEIRO: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      COORDENADOR: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      DIRETOR: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      SUPERVISOR: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      ADMINISTRADOR: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    };
    return colors[role] || "bg-zinc-500/10 text-zinc-600 border-zinc-500/20";
  };

  const getContractColor = (type?: string) => {
    if (type === "PJ") return "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20";
    return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
  };

  return (
    <div className="space-y-6">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "hsl(var(--foreground))" }}>
            Gestão de Colaboradores
          </h1>
          <p className="text-sm text-muted-foreground">
            Cadastre e gerencie a equipe administrativa, recepção, coordenadores e financeiro da clínica, incluindo detalhes contratuais (CLT/PJ).
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          <span>Cadastrar Colaborador</span>
        </button>
      </div>

      {/* Filter panel */}
      <div 
        className="p-4 rounded-2xl border bg-card flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ borderColor: "hsl(var(--border))" }}
      >
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou CPF/CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 p-2.5 rounded-xl border outline-none text-xs bg-background text-foreground"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {["TODOS", "RECEPCAO", "FINANCEIRO", "COORDENADOR", "ADMINISTRADOR"].map((role) => (
            <button
              key={role}
              onClick={() => setActiveRoleFilter(role)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border",
                activeRoleFilter === role
                  ? "gradient-primary text-white border-transparent"
                  : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
              )}
            >
              {role === "TODOS" ? "Todos" : getRoleLabel(role).split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Table grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-violet-600 border-t-transparent" />
        </div>
      ) : filteredColabs.length === 0 ? (
        <div 
          className="p-12 text-center rounded-2xl border bg-card flex flex-col items-center gap-2"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <Search className="h-8 w-8 text-zinc-500" />
          <h3 className="font-bold text-sm text-foreground">Nenhum colaborador encontrado</h3>
          <p className="text-xs text-muted-foreground">Cadastre novos funcionários ou refine a sua busca.</p>
        </div>
      ) : (
        <div 
          className="rounded-2xl border bg-card overflow-hidden"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold">
                  <th className="p-4">Colaborador</th>
                  <th className="p-4">Cargo / Perfil</th>
                  <th className="p-4">Contrato (Regime)</th>
                  <th className="p-4">Salário Base</th>
                  <th className="p-4">Contato & Documento</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredColabs.map((colab) => (
                  <tr key={colab.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-violet-500/10 text-violet-400 font-bold flex items-center justify-center border border-violet-500/20 shrink-0">
                          {colab.foto ? (
                            <img src={colab.foto} alt={colab.nome} className="w-full h-full object-cover rounded-full" />
                          ) : (
                            getInitials(colab.nome)
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-sm">{colab.nome}</p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Mail className="h-3 w-3" /> {colab.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold border", getRoleColor(colab.perfil))}>
                        {getRoleLabel(colab.perfil)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold border", getContractColor(colab.tipoContrato))}>
                        {colab.tipoContrato || "CLT"}
                      </span>
                      {colab.cargaHoraria && (
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" /> {colab.cargaHoraria}
                        </p>
                      )}
                    </td>
                    <td className="p-4 text-foreground font-bold">
                      {colab.salarioBase ? (
                        new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(colab.salarioBase))
                      ) : (
                        <span className="text-zinc-500 font-normal">Não informado</span>
                      )}
                    </td>
                    <td className="p-4 space-y-1 text-muted-foreground">
                      {colab.telefone && (
                        <p className="flex items-center gap-1 text-[10px]">
                          <Phone className="h-3 w-3" /> {colab.telefone}
                        </p>
                      )}
                      {colab.cpfCnpj && (
                        <p className="flex items-center gap-1 text-[10px]">
                          <FileText className="h-3 w-3" /> {colab.cpfCnpj}
                        </p>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                        colab.ativo 
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-red-500/10 text-red-500 border-red-500/20"
                      )}>
                        {colab.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(colab)}
                          className="p-2 hover:bg-muted rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          title="Editar colaborador"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleStatus(colab)}
                          className={cn(
                            "p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer",
                            colab.ativo ? "text-red-500/70 hover:text-red-500" : "text-emerald-500/70 hover:text-emerald-500"
                          )}
                          title={colab.ativo ? "Inativar colaborador" : "Reativar colaborador"}
                        >
                          {colab.ativo ? <ToggleRight className="h-5.5 w-5.5" /> : <ToggleLeft className="h-5.5 w-5.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Novo Colaborador */}
      <AnimatePresence>
        {isNewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-xl glass-card rounded-2xl border p-6 text-xs space-y-6 z-10 overflow-hidden"
              style={{
                background: "hsl(var(--card))",
                borderColor: "hsl(var(--border))"
              }}
            >
              <div className="flex justify-between items-center border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Novo Colaborador</h3>
                  <p className="text-[10px] text-muted-foreground">Cadastre os dados de contato e contratuais CLT/PJ do colaborador.</p>
                </div>
                <button 
                  onClick={() => setIsNewModalOpen(false)} 
                  className="p-1 rounded-lg text-zinc-400 hover:bg-muted hover:text-white transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                {/* 1. Dados Básicos */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-violet-400 border-b border-border/40 pb-1">Identificação & Acesso</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <label className="text-xs font-semibold text-muted-foreground">Nome Completo</label>
                      <input
                        type="text"
                        required
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="w-full p-2.5 rounded-xl border outline-none bg-background text-foreground"
                        placeholder="Ex: Clara Souza"
                      />
                    </div>

                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <label className="text-xs font-semibold text-muted-foreground">E-mail (Login)</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2.5 rounded-xl border outline-none bg-background text-foreground"
                        placeholder="exemplo@clinica.com"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Senha Provisória</label>
                      <div className="relative">
                        <input
                          type={showSenha ? "text" : "password"}
                          required
                          value={senha}
                          onChange={(e) => setSenha(e.target.value)}
                          className="w-full p-2.5 pr-10 rounded-xl border outline-none bg-background text-foreground"
                          placeholder="Mín. 6 caracteres"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSenha(!showSenha)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white cursor-pointer"
                        >
                          {showSenha ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Cargo / Perfil</label>
                      <select
                        value={perfil}
                        onChange={(e) => setPerfil(e.target.value)}
                        className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none cursor-pointer"
                      >
                        <option value="RECEPCAO">Recepção / Secretária</option>
                        <option value="FINANCEIRO">Financeiro</option>
                        <option value="COORDENADOR">Coordenador Geral</option>
                        <option value="SUPERVISOR">Supervisor</option>
                        <option value="DIRETOR">Diretor</option>
                        <option value="ADMINISTRADOR">Administrador</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Contato & Contrato */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-violet-400 border-b border-border/40 pb-1">Contato & Contrato (CLT ou PJ)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Telefone</label>
                      <input
                        type="text"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        className="w-full p-2.5 rounded-xl border outline-none bg-background text-foreground"
                        placeholder="(11) 99999-9999"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">CPF / CNPJ</label>
                      <input
                        type="text"
                        value={cpfCnpj}
                        onChange={(e) => setCpfCnpj(e.target.value)}
                        className="w-full p-2.5 rounded-xl border outline-none bg-background text-foreground"
                        placeholder="000.000.000-00"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Regime de Contrato</label>
                      <select
                        value={tipoContrato}
                        onChange={(e) => setTipoContrato(e.target.value)}
                        className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none cursor-pointer"
                      >
                        <option value="CLT">CLT (Consolidação das Leis do Trabalho)</option>
                        <option value="PJ">PJ (Pessoa Jurídica / Prestador)</option>
                        <option value="AUTONOMO">Autônomo</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Salário Base (R$)</label>
                      <input
                        type="number"
                        value={salarioBase}
                        onChange={(e) => setSalarioBase(e.target.value)}
                        className="w-full p-2.5 rounded-xl border outline-none bg-background text-foreground"
                        placeholder="Ex: 2800"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Carga Horária</label>
                      <input
                        type="text"
                        value={cargaHoraria}
                        onChange={(e) => setCargaHoraria(e.target.value)}
                        className="w-full p-2.5 rounded-xl border outline-none bg-background text-foreground"
                        placeholder="Ex: 40h semanais"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Chave PIX (Para repasses)</label>
                      <input
                        type="text"
                        value={chavePix}
                        onChange={(e) => setChavePix(e.target.value)}
                        className="w-full p-2.5 rounded-xl border outline-none bg-background text-foreground"
                        placeholder="CNPJ, E-mail ou Celular"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl font-bold border bg-card text-zinc-400 border-border hover:bg-muted transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
                  >
                    Salvar Cadastro
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Editar Colaborador */}
      <AnimatePresence>
        {isEditModalOpen && selectedColab && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-xl glass-card rounded-2xl border p-6 text-xs space-y-6 z-10 overflow-hidden"
              style={{
                background: "hsl(var(--card))",
                borderColor: "hsl(var(--border))"
              }}
            >
              <div className="flex justify-between items-center border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Editar Colaborador</h3>
                  <p className="text-[10px] text-muted-foreground">Edite o cargo, salário, contato ou redefina a senha de {selectedColab.nome}.</p>
                </div>
                <button 
                  onClick={() => setIsEditModalOpen(false)} 
                  className="p-1 rounded-lg text-zinc-400 hover:bg-muted hover:text-white transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleEdit} className="space-y-4">
                {/* 1. Identificação */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-violet-400 border-b border-border/40 pb-1">Identificação & Acesso</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <label className="text-xs font-semibold text-muted-foreground">Nome Completo</label>
                      <input
                        type="text"
                        required
                        value={editNome}
                        onChange={(e) => setEditNome(e.target.value)}
                        className="w-full p-2.5 rounded-xl border outline-none bg-background text-foreground"
                      />
                    </div>

                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <label className="text-xs font-semibold text-muted-foreground">Cargo / Perfil</label>
                      <select
                        value={editPerfil}
                        onChange={(e) => setEditPerfil(e.target.value)}
                        className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none cursor-pointer"
                      >
                        <option value="RECEPCAO">Recepção / Secretária</option>
                        <option value="FINANCEIRO">Financeiro</option>
                        <option value="COORDENADOR">Coordenador Geral</option>
                        <option value="SUPERVISOR">Supervisor</option>
                        <option value="DIRETOR">Diretor</option>
                        <option value="ADMINISTRADOR">Administrador</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 col-span-2">
                      <label className="text-xs font-semibold text-muted-foreground">E-mail (Não editável)</label>
                      <input
                        type="email"
                        disabled
                        value={selectedColab.email}
                        className="w-full p-2.5 rounded-xl border bg-muted text-muted-foreground outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Contato & Contrato */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-violet-400 border-b border-border/40 pb-1">Contato & Contrato (CLT ou PJ)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Telefone</label>
                      <input
                        type="text"
                        value={editTelefone}
                        onChange={(e) => setEditTelefone(e.target.value)}
                        className="w-full p-2.5 rounded-xl border outline-none bg-background text-foreground"
                        placeholder="(11) 99999-9999"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">CPF / CNPJ</label>
                      <input
                        type="text"
                        value={editCpfCnpj}
                        onChange={(e) => setEditCpfCnpj(e.target.value)}
                        className="w-full p-2.5 rounded-xl border outline-none bg-background text-foreground"
                        placeholder="000.000.000-00"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Regime de Contrato</label>
                      <select
                        value={editTipoContrato}
                        onChange={(e) => setEditTipoContrato(e.target.value)}
                        className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none cursor-pointer"
                      >
                        <option value="CLT">CLT (Consolidação das Leis do Trabalho)</option>
                        <option value="PJ">PJ (Pessoa Jurídica / Prestador)</option>
                        <option value="AUTONOMO">Autônomo</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Salário Base (R$)</label>
                      <input
                        type="number"
                        value={editSalarioBase}
                        onChange={(e) => setEditSalarioBase(e.target.value)}
                        className="w-full p-2.5 rounded-xl border outline-none bg-background text-foreground"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Carga Horária</label>
                      <input
                        type="text"
                        value={editCargaHoraria}
                        onChange={(e) => setEditCargaHoraria(e.target.value)}
                        className="w-full p-2.5 rounded-xl border outline-none bg-background text-foreground"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Chave PIX (Para repasses)</label>
                      <input
                        type="text"
                        value={editChavePix}
                        onChange={(e) => setEditChavePix(e.target.value)}
                        className="w-full p-2.5 rounded-xl border outline-none bg-background text-foreground"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Password */}
                <div className="space-y-1.5 bg-violet-500/5 p-4 rounded-xl border border-violet-500/10">
                  <label className="text-xs font-bold text-violet-400 block mb-1">Redefinir Senha (Opcional)</label>
                  <div className="relative">
                    <input
                      type={showEditSenha ? "text" : "password"}
                      value={editSenha}
                      onChange={(e) => setEditSenha(e.target.value)}
                      className="w-full p-2.5 pr-10 rounded-xl border outline-none bg-background text-foreground border-violet-500/20"
                      placeholder="Deixe em branco para manter a senha atual"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditSenha(!showEditSenha)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white cursor-pointer"
                    >
                      {showEditSenha ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl font-bold border bg-card text-zinc-400 border-border hover:bg-muted transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
                  >
                    Gravar Alterações
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
