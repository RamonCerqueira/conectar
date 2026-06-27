"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

// Import refactored components
import { SalaCard } from "./salas/sala-card";
import { SalaDetailsModal } from "./salas/sala-details-modal";
import { SalaAssignmentModal } from "./salas/sala-assignment-modal";
import { SalaReplaceDoctorModal } from "./salas/sala-replace-doctor-modal";

export function SalasPage() {
  const [salas, setSalas] = useState<any[]>([]);
  const [profissionais, setProfissionais] = useState<{ id: string; nome: string }[]>([]);
  const [loading, setLoading] = useState(true);
  
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

  const loadSalasAndProfs = async () => {
    try {
      const [salasRes, profsRes] = await Promise.all([
        api.get("/salas"),
        api.get("/profissionais")
      ]);
      setSalas(salasRes.data || []);
      setProfissionais((profsRes.data || []).map((p: any) => ({ id: p.id, nome: p.nome })));
    } catch (e) {
      console.error(e);
      toast.error("Erro ao conectar ao servidor de dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSalasAndProfs();
  }, []);

  const handleCreateSala = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNome) return;

    try {
      await api.post("/salas", {
        nome: newNome,
        descricao: newDesc,
        capacidade: newCapac,
        status: newStatus,
        cor: newCor,
      });
      toast.success("Sala clínica cadastrada com sucesso!");
      loadSalasAndProfs();
      setIsNewModalOpen(false);

      // Reset Form
      setNewNome("");
      setNewDesc("");
      setNewCapac(1);
      setNewStatus("DISPONIVEL");
    } catch (e) {
      toast.error("Erro ao criar nova sala clínica.");
    }
  };

  const handleDeleteSala = async (id: string) => {
    try {
      await api.delete(`/salas/${id}`);
      toast.success("Sala excluída com sucesso!");
      loadSalasAndProfs();
      if (selectedSala?.id === id) {
        setSelectedSala(null);
      }
    } catch (e) {
      toast.error("Erro ao excluir sala clínica.");
    }
  };

  // ─── WEEKLY ALLOCATIONS HANDLERS ──────────────────────────────────────────

  // Add or edit a room assignment
  const handleSaveAssignment = async (data: {
    id?: string;
    profissionalId: string;
    diasSemana: string[];
    horarioInicio: string;
    horarioFim: string;
  }) => {
    if (!selectedSala) return;

    try {
      if (data.id) {
        // Editing existing assignment
        await api.put(`/salas/${selectedSala.id}/alocacoes/${data.id}`, {
          profissionalId: data.profissionalId,
          diasSemana: data.diasSemana,
          horarioInicio: data.horarioInicio,
          horarioFim: data.horarioFim,
        });
        toast.success("Alocação de sala atualizada!");
      } else {
        // Adding new assignment
        await api.post(`/salas/${selectedSala.id}/alocacoes`, {
          profissionalId: data.profissionalId,
          diasSemana: data.diasSemana,
          horarioInicio: data.horarioInicio,
          horarioFim: data.horarioFim,
        });
        toast.success("Profissional vinculado à sala com sucesso!");
      }

      setIsAssignModalOpen(false);
      setEditingAssignment(null);
      
      // Refresh rooms and update detailed view room info
      const res = await api.get("/salas");
      const freshRooms = res.data || [];
      setSalas(freshRooms);
      const freshSelected = freshRooms.find((s: any) => s.id === selectedSala.id);
      if (freshSelected) {
        setSelectedSala(freshSelected);
      }
    } catch (e) {
      toast.error("Erro ao salvar alocação de profissional.");
    }
  };

  // Delete / cancel occupied slot
  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!selectedSala) return;

    try {
      await api.delete(`/salas/${selectedSala.id}/alocacoes/${assignmentId}`);
      toast.success("Ocupação / Dia de sala cancelado!");

      // Refresh rooms and update detailed view room info
      const res = await api.get("/salas");
      const freshRooms = res.data || [];
      setSalas(freshRooms);
      const freshSelected = freshRooms.find((s: any) => s.id === selectedSala.id);
      if (freshSelected) {
        setSelectedSala(freshSelected);
      }
    } catch (e) {
      toast.error("Erro ao remover alocação.");
    }
  };

  // Replace Doctor logic
  const handleReplaceDoctor = async (newDoctorId: string) => {
    if (!selectedSala || !replacingAssignment) return;

    try {
      await api.put(`/salas/${selectedSala.id}/alocacoes/${replacingAssignment.id}`, {
        profissionalId: newDoctorId,
      });
      toast.success("Profissional substituído com sucesso!");
      setReplacingAssignment(null);

      // Refresh rooms and update detailed view room info
      const res = await api.get("/salas");
      const freshRooms = res.data || [];
      setSalas(freshRooms);
      const freshSelected = freshRooms.find((s: any) => s.id === selectedSala.id);
      if (freshSelected) {
        setSelectedSala(freshSelected);
      }
    } catch (e) {
      toast.error("Erro ao substituir profissional.");
    }
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

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-muted-foreground">Carregando salas clínicas...</p>
        </div>
      ) : (
        <>
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

          {salas.length === 0 && (
            <div className="p-12 text-center text-xs text-muted-foreground border rounded-2xl border-dashed border-border bg-card">
              Nenhuma sala clínica cadastrada no sistema. Clique em "Nova Sala" para começar.
            </div>
          )}
        </>
      )}

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
            profissionais={profissionais}
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
            profissionais={profissionais}
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
