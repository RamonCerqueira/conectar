"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Search,
  Plus,
  X,
  Clock,
  Sparkles,
  User,
  Brain,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Prontuario } from "@/types/prontuario";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { getOfflineProntuarios } from "@/lib/offline-sync";

// Imports of refactored tab components
import { PacienteProfileBanner } from "./prontuarios/paciente-profile-banner";
import { TabEvolucoes } from "./prontuarios/tab-evolucoes";
import { TabPlanoTerapeutico } from "./prontuarios/tab-plano-terapeutico";
import { TabAvaliacoes } from "./prontuarios/tab-avaliacoes";
import { TabAtividades } from "./prontuarios/tab-atividades";
import { TabFrequencia } from "./prontuarios/tab-frequencia";
import { TabFichaPaciente } from "./prontuarios/tab-ficha-paciente";

interface ProntuariosPageProps {
  defaultTab?: "evolucao" | "plano" | "avaliacoes" | "frequencia" | "cadastro";
}

export function ProntuariosPage({ defaultTab = "evolucao" }: ProntuariosPageProps) {
  // Navigation & Patients
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [selectedPacienteId, setSelectedPacienteId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  // Search/Filter states
  const [searchPatientTerm, setSearchPatientTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  // Clinical data states
  const [prontuarios, setProntuarios] = useState<any[]>([]);
  const [planos, setPlanos] = useState<any[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
  const [frequencias, setFrequencias] = useState<any[]>([]);
  const [recursos, setRecursos] = useState<any[]>([]);

  // Modals Open State
  const [isModalOpen, setIsModalOpen] = useState(false); // Evolution
  const [isNewMetaModalOpen, setIsNewMetaModalOpen] = useState(false); // New Goal
  const [isNewAvaliacaoModalOpen, setIsNewAvaliacaoModalOpen] = useState(false); // New Assessment
  const [isNewRecursoModalOpen, setIsNewRecursoModalOpen] = useState(false); // New Resource / Media

  const getAge = (birthDateString: string) => {
    if (!birthDateString) return 0;
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.get("/pacientes");
        const data = res.data || [];
        if (data.length > 0) {
          const mapped = data.map((p: any) => ({
            ...p,
            idade: p.dataNascimento ? getAge(p.dataNascimento) : 8,
          }));
          setPacientes(mapped);
          setSelectedPacienteId(mapped[0].id);
          loadAllPatientData(mapped[0].id);
        }
      } catch (err) {
        console.error("API error loading patients", err);
      }
    };
    init();
  }, []);

  const loadAllPatientData = async (pacId: string) => {
    // 1. Evolutions
    try {
      const res = await api.get(`/prontuarios/paciente/${pacId}`);
      const serverPronts = res.data || [];
      const offlinePronts = getOfflineProntuarios().filter((p) => p.pacienteId === pacId);
      setProntuarios([...offlinePronts, ...serverPronts]);
    } catch (e) {
      const offlinePronts = getOfflineProntuarios().filter((p) => p.pacienteId === pacId);
      setProntuarios(offlinePronts);
    }

    // 2. Plans / Metas
    try {
      const res = await api.get(`/plano-terapeutico/paciente/${pacId}`);
      setPlanos(res.data || []);
    } catch (e) {
      setPlanos([]);
    }

    // 3. Assessments
    try {
      const res = await api.get(`/avaliacoes/paciente/${pacId}`);
      setAvaliacoes(res.data || []);
    } catch (e) {
      setAvaliacoes([]);
    }

    // 4. Frequencias
    try {
      const res = await api.get(`/frequencia/paciente/${pacId}`);
      setFrequencias(res.data || []);
    } catch (e) {
      setFrequencias([]);
    }

    // 5. Recursos / Exercicios
    try {
      const res = await api.get(`/exercicios/paciente/${pacId}`);
      setRecursos(res.data || []);
    } catch (e) {
      setRecursos([]);
    }
  };

  const handleSelectPatient = (pacId: string) => {
    setSelectedPacienteId(pacId);
    loadAllPatientData(pacId);
  };

  // callbacks to update parent state from child tab components
  const handleAddEvolution = (newPr: any) => {
    setProntuarios([newPr, ...prontuarios]);
  };

  const handleAddMeta = (planoId: string, newMeta: any) => {
    setPlanos(
      planos.map((plano) => {
        if (plano.id === planoId) {
          return { ...plano, metas: [newMeta, ...plano.metas] };
        }
        return plano;
      })
    );
    toast.success("Nova meta cadastrada!");
  };

  const handleUpdateMetaProgress = (
    planoId: string,
    metaId: string,
    val: number,
    nota: string
  ) => {
    setPlanos(
      planos.map((plano) => {
        if (plano.id === planoId) {
          return {
            ...plano,
            metas: plano.metas.map((meta: { id: string; historico: any; }) => {
              if (meta.id === metaId) {
                const histItem = {
                  data: new Date().toISOString().split("T")[0],
                  valor: val,
                  nota: nota || "Progresso atualizado.",
                };
                return {
                  ...meta,
                  progresso: val,
                  status: val >= 100 ? "CONCLUIDO" : "EM_ANDAMENTO",
                  historico: [histItem, ...meta.historico],
                };
              }
              return meta;
            }),
          };
        }
        return plano;
      })
    );
    toast.success("Progresso atualizado!");
  };

  const handleAddAvaliacao = (newAv: any) => {
    setAvaliacoes([newAv, ...avaliacoes]);
  };

  const activePaciente = pacientes.find((p) => p.id === selectedPacienteId);

  const filteredPatientsList = pacientes.filter((p) =>
    p.nome.toLowerCase().includes(searchPatientTerm.toLowerCase())
  );

  // Tab items metadata
  const clinicalTabs = [
    { id: "evolucao", label: "Prontuário & Evoluções", icon: ClipboardList },
    { id: "plano", label: "Plano Terapêutico (PTS)", icon: Sparkles },
    { id: "avaliacoes", label: "Avaliações & Escalas", icon: Brain },
    { id: "atividades", label: "Mídias & Atividades", icon: Share2 },
    { id: "frequencia", label: "Frequência & Presença", icon: Clock },
    { id: "cadastro", label: "Ficha do Paciente", icon: User },
  ] as const;

  return (
    <div className="space-y-6">

      {/* ─── SEARCH & AUTOCOMPLETE BAR (TOP ALIGN) ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-40 relative">
        <div className="relative w-full max-w-xl">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Digite o nome do paciente para iniciar o atendimento..."
              value={searchPatientTerm}
              onChange={(e) => {
                setSearchPatientTerm(e.target.value);
                setSearchFocused(true);
              }}
              onFocus={() => setSearchFocused(true)}
              className="w-full pl-11 pr-10 py-3 rounded-2xl border text-sm bg-card text-foreground outline-none shadow-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all border-border"
            />
            {searchPatientTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchPatientTerm("");
                  setSearchFocused(false);
                }}
                className="absolute right-3.5 top-3.5 p-0.5 rounded-full hover:bg-muted text-muted-foreground cursor-pointer bg-transparent border-0"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Floating Dropdown suggestions */}
          <AnimatePresence>
            {searchFocused && filteredPatientsList.length > 0 && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSearchFocused(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 mt-2 p-2 rounded-2xl border bg-card shadow-xl z-50 max-h-60 overflow-y-auto scrollbar-thin border-border"
                >
                  {filteredPatientsList.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        handleSelectPatient(p.id);
                        setSearchPatientTerm("");
                        setSearchFocused(false);
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left hover:bg-purple-500/10 hover:text-purple-700 dark:hover:text-purple-300 transition-colors text-xs text-foreground cursor-pointer bg-transparent border-0"
                    >
                      <div className="w-8 h-8 rounded-full gradient-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {p.nome.split(" ").slice(0, 2).map((n: string) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{p.nome}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {p.diagnosticos?.[0]?.descricao || "Sem diagnóstico"} • {p.idade || getAge(p.dataNascimento)} anos
                        </p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Contextual Action Buttons in top-right */}
        {activePaciente && (
          <div className="shrink-0 self-end sm:self-center">
            {activeTab === "evolucao" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-5 py-3 text-xs font-semibold text-white gradient-primary rounded-2xl shadow-md cursor-pointer border-0"
              >
                <Plus className="h-3.5 w-3.5" />
                Evoluir Sessão
              </button>
            )}
            {activeTab === "plano" && (
              <button
                onClick={() => setIsNewMetaModalOpen(true)}
                className="flex items-center gap-1.5 px-5 py-3 text-xs font-semibold text-white gradient-primary rounded-2xl shadow-md cursor-pointer border-0"
              >
                <Plus className="h-3.5 w-3.5" />
                Nova Meta
              </button>
            )}
            {activeTab === "avaliacoes" && (
              <button
                onClick={() => setIsNewAvaliacaoModalOpen(true)}
                className="flex items-center gap-1.5 px-5 py-3 text-xs font-semibold text-white gradient-primary rounded-2xl shadow-md cursor-pointer border-0"
              >
                <Plus className="h-3.5 w-3.5" />
                Nova Avaliação
              </button>
            )}
            {activeTab === "atividades" && (
              <button
                onClick={() => setIsNewRecursoModalOpen(true)}
                className="flex items-center gap-1.5 px-5 py-3 text-xs font-semibold text-white gradient-primary rounded-2xl shadow-md cursor-pointer border-0"
              >
                <Plus className="h-3.5 w-3.5" />
                Novo Recurso / Mídia
              </button>
            )}
          </div>
        )}
      </div>

      {/* ─── 360 PATIENT HEADER BANNER ─── */}
      {activePaciente ? (
        <PacienteProfileBanner paciente={activePaciente} prontuarios={prontuarios} />
      ) : (
        <div className="p-12 text-center text-xs text-muted-foreground border rounded-2xl bg-card border-border">
          Nenhum paciente selecionado. Digite o nome no campo de buscas acima para carregar o prontuário.
        </div>
      )}

      {/* ─── MAIN WORKSPACE CONTENTS ─── */}
      {activePaciente && (
        <div className="space-y-6">

          {/* Tabs bar */}
          <div className="border-b border-border">
            <div className="flex overflow-x-auto scrollbar-none">
              {clinicalTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-5 py-3.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 -mb-[2px] cursor-pointer bg-transparent border-t-0 border-x-0",
                      isActive
                        ? "border-purple-500 text-purple-600 dark:text-purple-400 font-bold"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Tab Panel */}
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                {activeTab === "evolucao" && (
                  <TabEvolucoes
                    paciente={activePaciente}
                    prontuarios={prontuarios}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onAddEvolution={handleAddEvolution}
                  />
                )}

                {activeTab === "plano" && (
                  <TabPlanoTerapeutico
                    paciente={activePaciente}
                    planos={planos}
                    isNewMetaModalOpen={isNewMetaModalOpen}
                    setIsNewMetaModalOpen={setIsNewMetaModalOpen}
                    onAddMeta={handleAddMeta}
                    onUpdateMetaProgress={handleUpdateMetaProgress}
                  />
                )}

                {activeTab === "avaliacoes" && (
                  <TabAvaliacoes
                    paciente={activePaciente}
                    avaliacoes={avaliacoes}
                    isNewAvaliacaoModalOpen={isNewAvaliacaoModalOpen}
                    setIsNewAvaliacaoModalOpen={setIsNewAvaliacaoModalOpen}
                    onAddAvaliacao={handleAddAvaliacao}
                  />
                )}

                {activeTab === "atividades" && (
                  <TabAtividades
                    paciente={activePaciente}
                    recursos={recursos}
                    setRecursos={setRecursos}
                    isNewRecursoModalOpen={isNewRecursoModalOpen}
                    setIsNewRecursoModalOpen={setIsNewRecursoModalOpen}
                  />
                )}

                {activeTab === "frequencia" && (
                  <TabFrequencia
                    paciente={activePaciente}
                    frequencias={frequencias}
                    setFrequencias={setFrequencias}
                  />
                )}

                {activeTab === "cadastro" && (
                  <TabFichaPaciente paciente={activePaciente} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
