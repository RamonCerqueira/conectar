"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { PacienteCard } from "./pacientes/paciente-card";
import { PacienteDetailsDrawer } from "./pacientes/paciente-details-drawer";
import { PacienteCreateModal } from "./pacientes/paciente-create-modal";
import { Paciente } from "@/types";



export function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const loadPacientes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/pacientes");
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      const backendPacientes = data.map((p: any) => ({
        ...p,
        diagnosticos: p.diagnosticos || [],
        alergias: p.alergias || [],
        medicamentos: p.medicamentos || [],
        responsaveis: p.responsaveis || [],
        planosTerapeuticos: p.planosTerapeuticos || [],
        financeiro: p.financeiro || [],
        prontuario: p.prontuario || [],
        documentos: p.documentos || [],
        exercicios: p.exercicios || [],
      }));
      setPacientes(backendPacientes);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar pacientes do servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPacientes();
  }, []);

  const handleCreatePaciente = async (data: {
    nome: string;
    dataNascimento: string;
    sexo: string;
    cpf: string;
    status: string;
    escola: string;
    serie: string;
    turnoEscolar: string;
    nomeProf: string;
    coordenador: string;
    responsavelNome: string;
    responsavelTel: string;
    responsavelEmail: string;
    responsavelParentesco: string;
    responsavelProfissao: string;
    diagnosticoDesc: string;
    diagnosticoCid: string;
    medicamentos: string;
    alergias: string;
    observacoesMed: string;
    sensibilidadeSensorial: string;
    hiperfoco: string;
    observacoes: string;
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    modeloCobranca?: string;
    valorConsulta?: number;
  }) => {
    const payload = {
      nome: data.nome,
      dataNascimento: new Date(data.dataNascimento).toISOString(),
      sexo: data.sexo,
      cpf: data.cpf.replace(/\D/g, ""),
      status: data.status,
      escola: data.escola,
      serie: data.serie,
      turnoEscolar: data.turnoEscolar,
      nomeProf: data.nomeProf,
      coordenador: data.coordenador,
      responsavelNome: data.responsavelNome,
      responsavelTel: data.responsavelTel,
      responsavelEmail: data.responsavelEmail,
      responsavelParentesco: data.responsavelParentesco,
      responsavelProfissao: data.responsavelProfissao,
      diagnosticoDesc: data.diagnosticoDesc,
      diagnosticoCid: data.diagnosticoCid,
      medicamentos: data.medicamentos,
      alergias: data.alergias,
      observacoesMed: data.observacoesMed,
      sensibilidadeSensorial: data.sensibilidadeSensorial,
      hiperfoco: data.hiperfoco,
      observacoes: data.observacoes,
      cep: data.cep,
      logradouro: data.logradouro,
      numero: data.numero,
      complemento: data.complemento,
      bairro: data.bairro,
      cidade: data.cidade,
      estado: data.estado,
      modeloCobranca: data.modeloCobranca,
      valorConsulta: data.valorConsulta,
    };

    try {
      await api.post("/pacientes", payload);
      toast.success("Paciente cadastrado com sucesso!");
      loadPacientes();
      setIsNewModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cadastrar paciente no servidor.");
    }
  };

  const filteredPacientes = pacientes.filter((p) => {
    const matchesSearch =
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.escola?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.responsaveis.some((r) => r.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.diagnosticos.some((d) => d.descricao.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.cpf && p.cpf.includes(searchTerm));

    const matchesStatus = statusFilter === "TODOS" || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header da Página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "hsl(var(--foreground))" }}>
            Pacientes
          </h1>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            Gestão, prontuários, evoluções e planos terapêuticos das crianças.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Cadastrar Criança</span>
        </motion.button>
      </div>

      {/* Filtros e Busca */}
      <div
        className="p-4 rounded-2xl border flex flex-col md:flex-row gap-4"
        style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome da criança, responsável, escola ou diagnóstico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none border transition-colors"
            style={{
              background: "hsl(var(--muted))",
              borderColor: "transparent",
              color: "hsl(var(--foreground))",
            }}
          />
        </div>

        <div className="flex gap-2">
          {["TODOS", "ATIVO", "LISTA_ESPERA", "ALTA"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer",
                statusFilter === status
                  ? "gradient-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {status === "TODOS" ? "Todos" : status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-muted-foreground">Carregando crianças...</p>
        </div>
      ) : (
        /* Grid de Pacientes */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPacientes.map((paciente) => (
            <PacienteCard
              key={paciente.id}
              paciente={paciente}
              onViewDetails={(p) => setSelectedPaciente(p)}
            />
          ))}

          {filteredPacientes.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
              <Users className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <h3 className="font-bold text-lg text-foreground">Nenhum paciente encontrado</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Tente redefinir sua busca ou filtrar por outro status de atendimento.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Detalhes do Paciente (Drawer Lateral) */}
      <PacienteDetailsDrawer
        selectedPaciente={selectedPaciente}
        onClose={() => setSelectedPaciente(null)}
      />

      {/* Modal de Cadastro de Paciente */}
      <PacienteCreateModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleCreatePaciente}
      />
    </div>
  );
}
