"use client";

import { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

// ─── DADOS MOCKADOS COMPLETOS ───────────────────────────────────────────────
const initialEscolas = [
  {
    id: "esc-1",
    pacienteNome: "Lucas Mendes da Silva",
    escola: "Colégio Santa Maria",
    professor: "Profª Sandra L.",
    coordenador: "Helena Reis",
    telefone: "11963258741",
    reunioes: [
      { id: "r-1", data: "2026-04-15", objetivo: "Alinhamento sobre adaptação do Lucas", resumo: "Criança apresentou boa evolução com apoio visual em sala." },
    ],
  },
  {
    id: "esc-2",
    pacienteNome: "Sofia Andrade Rezende",
    escola: "Escola Maple Bear",
    professor: "Profª Camila G.",
    coordenador: "Renata Abreu",
    telefone: "11985214736",
    reunioes: [
      { id: "r-2", data: "2026-05-20", objetivo: "Discussão de condutas para o TEA", resumo: "Alinhamos uso de abafadores de ruído em eventos barulhentos." },
    ],
  },
];

export function EscolarPage() {
  const [escolas, setEscolas] = useState(initialEscolas);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEscola, setSelectedEscola] = useState<typeof initialEscolas[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [paciente, setPaciente] = useState("");
  const [escolaNome, setEscolaNome] = useState("");
  const [professor, setProfessor] = useState("");
  const [coordenador, setCoordenador] = useState("");

  const handleCreateContato = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paciente || !escolaNome) return;

    const newEsc = {
      id: `esc-${Date.now()}`,
      pacienteNome: paciente,
      escola: escolaNome,
      professor: professor,
      coordenador: coordenador,
      telefone: "",
      reunioes: [],
    };

    setEscolas([newEsc, ...escolas]);
    setIsModalOpen(false);
    setPaciente("");
    setEscolaNome("");
  };

  const filteredEscolas = escolas.filter(
    (e) =>
      e.pacienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.escola.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "hsl(var(--foreground))" }}>
            Acompanhamento e Controle Escolar
          </h1>
          <p className="text-sm text-muted-foreground">
            Alinhamento entre clínica e escola: registro de contatos escolares, reuniões de apoio e relatórios pedagógicos.
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
            placeholder="Buscar por escola ou criança..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none border transition-colors bg-muted border-transparent text-foreground"
          />
        </div>
      </div>

      {/* Grid de Escolas */}
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
              <div className="flex items-start gap-3 border-b pb-3">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">{esc.escola}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Aluno: {esc.pacienteNome}</p>
                </div>
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
              Ver Reuniões ({esc.reunioes.length})
            </button>
          </motion.div>
        ))}
      </div>

      {/* ─── MODAL DETALHE (REUNIÕES) ────────────────────────────────────── */}
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
                </div>
                <button
                  onClick={() => setSelectedEscola(null)}
                  className="p-2 rounded-xl hover:bg-white/10 text-white cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Corpo */}
              <div className="p-6 space-y-6 text-xs">
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-purple-500 uppercase tracking-wide">Reuniões com a Equipe Pedagógica</h4>
                  <div className="space-y-3 pl-3 border-l border-purple-500/20">
                    {selectedEscola.reunioes.map((re) => (
                      <div key={re.id} className="space-y-1 relative">
                        <div className="absolute -left-[16.5px] top-1.5 w-2 h-2 bg-purple-500 rounded-full border border-card" />
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-foreground">{re.objetivo}</span>
                          <span className="text-[10px] text-muted-foreground">{formatDate(re.data)}</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed italic">
                          "{re.resumo}"
                        </p>
                      </div>
                    ))}
                    {selectedEscola.reunioes.length === 0 && (
                      <p className="text-muted-foreground italic py-2">Nenhuma reunião de caso agendada ou documentada.</p>
                    )}
                  </div>
                </div>
              </div>
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
                  <h3 className="font-bold text-lg text-foreground">Vincular Escola do Paciente</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Cadastre o contato escolar da criança.</p>
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
                  <label className="text-xs font-semibold text-muted-foreground">Paciente</label>
                  <input
                    type="text"
                    required
                    placeholder="Nome completo do paciente"
                    value={paciente}
                    onChange={(e) => setPaciente(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none focus:ring-1"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Nome do Colégio</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Colégio Santa Maria"
                    value={escolaNome}
                    onChange={(e) => setEscolaNome(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Professor(a) Regente</label>
                    <input
                      type="text"
                      placeholder="Nome do docente"
                      value={professor}
                      onChange={(e) => setProfessor(e.target.value)}
                      className="w-full p-2.5 rounded-xl border text-xs outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Coordenador(a)</label>
                    <input
                      type="text"
                      placeholder="Nome da coordenação"
                      value={coordenador}
                      onChange={(e) => setCoordenador(e.target.value)}
                      className="w-full p-2.5 rounded-xl border text-xs outline-none"
                    />
                  </div>
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
                    Salvar Vínculo
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
