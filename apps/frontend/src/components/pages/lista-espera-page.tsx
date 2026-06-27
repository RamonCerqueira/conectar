"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Plus,
  X,
  Search,
  CheckCircle,
  Phone,
  Briefcase,
  Layers,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

// ─── DADOS MOCKADOS COMPLETOS ───────────────────────────────────────────────
const waitList = [
  { id: "w-1", nome: "Arthur Neves", telefone: "11988887777", especialidade: "Fonoaudiologia", desde: "15 dias", observacoes: "Aguardando horário vespertino." },
  { id: "w-2", nome: "Valentina Lima", telefone: "11977776666", especialidade: "Psicopedagogia", desde: "10 dias", observacoes: "Preferência para terças ou quintas pela manhã." },
  { id: "w-3", nome: "Bernardo Silva", telefone: "11966665555", especialidade: "Terapia Ocupacional", desde: "7 dias", observacoes: "Necessita de Integração Sensorial." },
];

export function ListaEsperaPage() {
  const [list, setList] = useState(waitList);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [especialidade, setEspecialidade] = useState("Psicopedagogia");
  const [obs, setObs] = useState("");

  const handleCreateWait = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome) return;

    const newWait = {
      id: `w-${Date.now()}`,
      nome: nome,
      telefone: telefone,
      especialidade: especialidade,
      desde: "Hoje",
      observacoes: obs,
    };

    setList([...list, newWait]);
    setIsModalOpen(false);

    // Reset
    setNome("");
    setTelefone("");
    setObs("");
  };

  const handleRemove = (id: string) => {
    setList(list.filter((item) => item.id !== id));
  };

  const filteredList = list.filter((item) =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.especialidade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "hsl(var(--foreground))" }}>
            Lista de Espera / Fila de Alocação
          </h1>
          <p className="text-sm text-muted-foreground">
            Acompanhamento de novos pacientes aguardando agendamento clínico por especialidade.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar à Fila</span>
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
            placeholder="Buscar paciente ou especialidade na fila..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none border transition-colors bg-muted border-transparent text-foreground"
          />
        </div>
      </div>

      {/* Grid de Fila */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredList.map((wait) => (
          <motion.div
            layout
            key={wait.id}
            whileHover={{ y: -4 }}
            className="rounded-2xl border p-5 flex flex-col justify-between relative overflow-hidden transition-all shadow-sm bg-card"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">{wait.nome}</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Aguardando desde: {wait.desde}</p>
                </div>
              </div>

              <div className="h-[1px] bg-border" />

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Especialidade:</span>
                  <span className="font-semibold text-foreground">{wait.especialidade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Telefone:</span>
                  <span className="font-semibold text-foreground">{wait.telefone}</span>
                </div>
                <p className="p-2 rounded bg-muted/50 italic text-muted-foreground text-[10px] leading-relaxed">
                  "{wait.observacoes || "Nenhuma observação extra."}"
                </p>
              </div>
            </div>

            <div className="h-[1px] bg-border my-4" />

            {/* Ações */}
            <div className="flex gap-2">
              <button
                onClick={() => handleRemove(wait.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold hover:bg-emerald-500/10 hover:border-emerald-500 hover:text-emerald-500 transition-colors cursor-pointer"
                style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
              >
                <CheckCircle className="h-3.5 w-3.5 text-purple-500" />
                Alocar Criança
              </button>
            </div>
          </motion.div>
        ))}

        {filteredList.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-muted-foreground">
            Fila de espera vazia.
          </div>
        )}
      </div>

      {/* ─── MODAL ADD FILA (NOVO) ────────────────────────────────────────── */}
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
                  <h3 className="font-bold text-lg text-foreground">Adicionar à Lista de Espera</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Registre o interesse por uma vaga terapêutica.</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-muted text-muted-foreground cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateWait} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Nome da Criança</label>
                  <input
                    type="text"
                    required
                    placeholder="Nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none focus:ring-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Telefone Responsável</label>
                    <input
                      type="tel"
                      required
                      placeholder="(99) 99999-9999"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border text-xs outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Especialidade Desejada</label>
                    <select
                      value={especialidade}
                      onChange={(e) => setEspecialidade(e.target.value)}
                      className="w-full p-2.5 rounded-xl border text-xs bg-card outline-none"
                    >
                      <option value="Psicopedagogia">Psicopedagogia</option>
                      <option value="Fonoaudiologia">Fonoaudiologia</option>
                      <option value="Terapia Ocupacional">Terapia Ocupacional</option>
                      <option value="Neuropsicologia">Neuropsicologia</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Observações / Restrição de Horários</label>
                  <textarea
                    placeholder="Ex: Disponível apenas às terças à tarde..."
                    value={obs}
                    onChange={(e) => setObs(e.target.value)}
                    rows={3}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none"
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
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
                  >
                    Registrar na Fila
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
