"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Building2 } from "lucide-react";
import { toast } from "sonner";

// Import refactored components
import { SalaCard } from "./salas/sala-card";
import { SalaDetailsModal } from "./salas/sala-details-modal";
import { SalaAssignmentModal } from "./salas/sala-assignment-modal";
import { SalaReplaceDoctorModal } from "./salas/sala-replace-doctor-modal";

const listProfissionais = [
  "Dra. Ana Lima",
  "Dra. Carla Souza",
  "Dra. Paula Ramos",
  "Dr. Marcos Santos",
  "Dra. Julia Santos"
];

// ─── DADOS MOCKADOS COMPLETOS COM ALOCAÇÕES ────────────────────────────────────
const initialSalas = [
  {
    id: "sala-1",
    nome: "Sala 01 — Psicopedagogia",
    descricao: "Equipada com recursos pedagógicos, jogos e livros para intervenções de aprendizagem.",
    capacidade: 2,
    status: "DISPONIVEL" as const,
    cor: "#8E7BBE", // Roxo
    ativa: true,
    profissionais: ["Dra. Ana Lima"],
    agendaHoje: [
      { id: "a1", horario: "09:00 - 10:00", paciente: "Lucas Mendes", profissional: "Dra. Ana Lima" },
      { id: "a2", horario: "10:30 - 11:30", paciente: "Isabela Costa", profissional: "Dra. Ana Lima" },
    ],
    alocacoes: [
      { id: "as-1", profissional: "Dra. Ana Lima", diasSemana: ["SEGUNDA", "QUARTA"], horarioInicio: "08:00", horarioFim: "12:00" }
    ],
  },
  {
    id: "sala-2",
    nome: "Sala 02 — Linguagem & Fono",
    descricao: "Sala com isolamento acústico parcial, espelhos e brinquedos para estimulação fonológica.",
    capacidade: 2,
    status: "OCUPADA" as const,
    cor: "#E98BAE", // Rosa
    ativa: true,
    profissionais: ["Dra. Carla Souza"],
    agendaHoje: [
      { id: "a3", horario: "09:30 - 10:30", paciente: "Sofia Andrade", profissional: "Dra. Carla Souza" },
    ],
    alocacoes: [
      { id: "as-2", profissional: "Dra. Carla Souza", diasSemana: ["TERCA", "QUINTA"], horarioInicio: "14:00", horarioFim: "18:00" }
    ],
  },
  {
    id: "sala-3",
    nome: "Sala Sensorial — T.O.",
    descricao: "Espaço amplo com balanços, piscina de bolinhas, texturas e equipamentos de Integração Sensorial.",
    capacidade: 3,
    status: "DISPONIVEL" as const,
    cor: "#F3B357", // Amarelo
    ativa: true,
    profissionais: ["Dra. Paula Ramos"],
    agendaHoje: [
      { id: "a4", horario: "11:00 - 12:00", paciente: "Gabriel Ferreira", profissional: "Dra. Paula Ramos" },
    ],
    alocacoes: [
      { id: "as-3", profissional: "Dra. Paula Ramos", diasSemana: ["QUARTA", "SEXTA"], horarioInicio: "09:00", horarioFim: "17:00" }
    ],
  },
  {
    id: "sala-4",
    nome: "Sala 04 — Avaliações",
    descricao: "Ambiente neutro e silencioso ideal para testes de inteligência e avaliações neuropsicológicas.",
    capacidade: 1,
    status: "MANUTENCAO" as const,
    cor: "#69C4B5", // Verde-água
    ativa: true,
    profissionais: ["Dr. Marcos Santos"],
    agendaHoje: [],
    alocacoes: [
      { id: "as-4", profissional: "Dr. Marcos Santos", diasSemana: ["SEGUNDA", "SEXTA"], horarioInicio: "13:00", horarioFim: "19:00" }
    ],
  },
];

export function SalasPage() {
  const [salas, setSalas] = useState(initialSalas);
  
  // Modal visibility and details tracking
  const [selectedSala, setSelectedSala] = useState<any | null>(null);
  
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<any | null>(null);
  const [replacingAssignment, setReplacingAssignment] = useState<any | null>(null);

  // Form states - Nova Sala
  const [newNome, setNewNome] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCapac, setNewCapac] = useState(1);
  const [newCor, setNewCor] = useState("#69C4B5");
  const [newStatus, setNewStatus] = useState("DISPONIVEL");

  const handleCreateSala = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNome) return;

    const newSala = {
      id: `sala-${Date.now()}`,
      nome: newNome,
      descricao: newDesc,
      capacidade: newCapac,
      status: newStatus as any,
      cor: newCor,
      ativa: true,
      profissionais: [],
      agendaHoje: [],
      alocacoes: [],
    };

    setSalas([...salas, newSala]);
    setIsNewModalOpen(false);

    // Reset Form
    setNewNome("");
    setNewDesc("");
    setNewCapac(1);
    setNewStatus("DISPONIVEL");
    toast.success("Sala clínica cadastrada com sucesso!");
  };

  const handleDeleteSala = (id: string) => {
    setSalas(salas.filter((s) => s.id !== id));
    toast.success("Sala excluída com sucesso!");
  };

  // ─── WEEKLY ALLOCATIONS HANDLERS ──────────────────────────────────────────

  // Add or edit a room assignment
  const handleSaveAssignment = (data: {
    id?: string;
    profissional: string;
    diasSemana: string[];
    horarioInicio: string;
    horarioFim: string;
  }) => {
    if (!selectedSala) return;

    let updatedAlocacoes = [];
    
    if (data.id) {
      // Editing existing assignment
      updatedAlocacoes = selectedSala.alocacoes.map((a: any) =>
        a.id === data.id ? { ...a, ...data } : a
      );
      toast.success("Alocação de sala atualizada!");
    } else {
      // Adding new assignment
      const newAloc = {
        id: `as-${Date.now()}`,
        ...data,
      };
      updatedAlocacoes = [...(selectedSala.alocacoes || []), newAloc];
      toast.success("Profissional vinculado à sala com sucesso!");
    }

    // Determine unique therapists list from all allocations
    const uniqueProfs = Array.from(
      new Set(updatedAlocacoes.map((a: any) => a.profissional))
    ) as string[];

    const updatedSala = {
      ...selectedSala,
      alocacoes: updatedAlocacoes,
      profissionais: uniqueProfs,
    };

    setSalas(salas.map((s) => (s.id === selectedSala.id ? updatedSala : s)));
    setSelectedSala(updatedSala);
    setIsAssignModalOpen(false);
    setEditingAssignment(null);
  };

  // Delete / cancel occupied slot
  const handleDeleteAssignment = (assignmentId: string) => {
    if (!selectedSala) return;

    const updatedAlocacoes = selectedSala.alocacoes.filter((a: any) => a.id !== assignmentId);
    
    // Update professionals list accordingly
    const uniqueProfs = Array.from(
      new Set(updatedAlocacoes.map((a: any) => a.profissional))
    ) as string[];

    const updatedSala = {
      ...selectedSala,
      alocacoes: updatedAlocacoes,
      profissionais: uniqueProfs,
    };

    setSalas(salas.map((s) => (s.id === selectedSala.id ? updatedSala : s)));
    setSelectedSala(updatedSala);
    toast.success("Ocupação / Dia de sala cancelado!");
  };

  // Replace Doctor logic
  const handleReplaceDoctor = (newDoctor: string) => {
    if (!selectedSala || !replacingAssignment) return;

    const updatedAlocacoes = selectedSala.alocacoes.map((a: any) =>
      a.id === replacingAssignment.id ? { ...a, profissional: newDoctor } : a
    );

    const uniqueProfs = Array.from(
      new Set(updatedAlocacoes.map((a: any) => a.profissional))
    ) as string[];

    const updatedSala = {
      ...selectedSala,
      alocacoes: updatedAlocacoes,
      profissionais: uniqueProfs,
    };

    setSalas(salas.map((s) => (s.id === selectedSala.id ? updatedSala : s)));
    setSelectedSala(updatedSala);
    setReplacingAssignment(null);
    toast.success("Profissional substituído com sucesso!");
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Salas Clínicas & Ambientes
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerenciamento de espaços clínicos, capacidade, ocupação diária e prevenção de conflitos.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer border-0"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Sala</span>
        </motion.button>
      </div>

      {/* Grid de Salas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {salas.map((sala) => (
          <SalaCard
            key={sala.id}
            sala={sala}
            onViewDetails={(s) => setSelectedSala(s)}
            onDelete={handleDeleteSala}
          />
        ))}
      </div>

      {/* ─── DETALHES DA SALA (MODAL) ─── */}
      <AnimatePresence>
        {selectedSala && (
          <SalaDetailsModal
            sala={selectedSala}
            onClose={() => setSelectedSala(null)}
            onAddAssignment={() => {
              setEditingAssignment(null);
              setIsAssignModalOpen(true);
            }}
            onEditAssignment={(as) => {
              setEditingAssignment(as);
              setIsAssignModalOpen(true);
            }}
            onDeleteAssignment={handleDeleteAssignment}
            onReplaceDoctor={(as) => {
              setReplacingAssignment(as);
            }}
          />
        )}
      </AnimatePresence>

      {/* ─── ATRIBUIR / EDITAR ALOCAÇÃO SEMANAL (MODAL) ─── */}
      <AnimatePresence>
        {isAssignModalOpen && (
          <SalaAssignmentModal
            assignment={editingAssignment}
            profissionais={listProfissionais}
            onClose={() => {
              setIsAssignModalOpen(false);
              setEditingAssignment(null);
            }}
            onSave={handleSaveAssignment}
          />
        )}
      </AnimatePresence>

      {/* ─── SUBSTITUIR PROFISSIONAL (MODAL) ─── */}
      <AnimatePresence>
        {replacingAssignment && (
          <SalaReplaceDoctorModal
            assignment={replacingAssignment}
            profissionais={listProfissionais}
            onClose={() => setReplacingAssignment(null)}
            onReplace={handleReplaceDoctor}
          />
        )}
      </AnimatePresence>

      {/* ─── CADASTRO DE NOVA SALA (MODAL) ─── */}
      <AnimatePresence>
        {isNewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 text-left">
            <div className="absolute inset-0" onClick={() => setIsNewModalOpen(false)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden bg-card border-border z-50 text-foreground text-xs"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-foreground">Cadastrar Nova Sala</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Crie um novo espaço de atendimento clínico.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-muted text-muted-foreground cursor-pointer bg-transparent border-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSala} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Nome da Sala</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Sala 05 — Integração Sensorial"
                    value={newNome}
                    onChange={(e) => setNewNome(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none bg-background text-foreground border-border focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Descrição do Espaço</label>
                  <textarea
                    placeholder="Quais recursos, brinquedos e ferramentas estão disponíveis nesta sala..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows={3}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none bg-background text-foreground border-border focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Capacidade Máxima</label>
                    <input
                      type="number"
                      min={1}
                      value={newCapac}
                      onChange={(e) => setNewCapac(parseInt(e.target.value) || 1)}
                      className="w-full p-2.5 rounded-xl border text-xs bg-background text-foreground border-border outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Status Inicial</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full p-2.5 rounded-xl border text-xs bg-background text-foreground border-border outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="DISPONIVEL">Disponível</option>
                      <option value="OCUPADA">Ocupada</option>
                      <option value="MANUTENCAO">Manutenção</option>
                      <option value="BLOQUEADA">Bloqueada</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Cor da Sala</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={newCor}
                      onChange={(e) => setNewCor(e.target.value)}
                      className="w-10 h-10 rounded border-0 outline-none cursor-pointer p-0 bg-transparent"
                    />
                    <span className="text-xs font-mono text-foreground font-semibold">{newCor}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-end gap-3 bg-card">
                  <button
                    type="button"
                    onClick={() => setIsNewModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer border-border text-foreground bg-transparent"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer border-0"
                  >
                    Cadastrar Sala
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
