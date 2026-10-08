"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { X } from "lucide-react";
import { ProfissionalAgenda } from "@/types";

interface AgendamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  profissionais: ProfissionalAgenda[];
  initialPacienteNome?: string;
  initialProfId?: string;
  initialDataHora?: string;
  initialSalaNome?: string;
  onSubmit: (data: {
    pacienteNome: string;
    pacienteId: string;
    salaId?: string;
    dataFim: string;
    profId: string;
    salaNome: string;
    dataHora: string;
    tipoAtend: string;
    recorrente: boolean;
    numSemanas: number;
  }) => Promise<boolean>;
}

export function AgendamentoModal({
  isOpen,
  onClose,
  profissionais,
  initialPacienteNome = "",
  initialProfId = "",
  initialDataHora = "",
  initialSalaNome = "",
  onSubmit,
}: AgendamentoModalProps) {
  const [pacientes, setPacientes] = useState<{ id: string; nome: string }[]>(
    [],
  );
  const [salas, setSalas] = useState<{ id: string; nome: string }[]>([]);
  const [pacienteId, setPacienteId] = useState("");
  const [salaId, setSalaId] = useState("");
  const [duracao, setDuracao] = useState(60);
  const [submitting, setSubmitting] = useState(false);
  const [pacienteNome, setPacienteNome] = useState(initialPacienteNome);
  const [profId, setProfId] = useState(
    initialProfId || profissionais[0]?.id || "",
  );
  const [salaNome, setSalaNome] = useState(initialSalaNome);
  const [dataHora, setDataHora] = useState(initialDataHora);
  const [tipoAtend, setTipoAtend] = useState("PRESENCIAL");
  const [recorrente, setRecorrente] = useState(false);
  const [numSemanas, setNumSemanas] = useState(4);

  useEffect(() => {
    if (isOpen) {
      setPacienteNome(initialPacienteNome);
      setProfId(initialProfId || profissionais[0]?.id || "");
      setSalaNome(initialSalaNome);
      setDataHora(initialDataHora);
      setTipoAtend("PRESENCIAL");
      setRecorrente(false);
      setNumSemanas(4);
    }
  }, [
    isOpen,
    initialPacienteNome,
    initialProfId,
    initialDataHora,
    initialSalaNome,
    profissionais,
  ]);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    Promise.all([
      api.get("/pacientes", { params: { limit: 100 } }),
      api.get("/salas"),
    ])
      .then(([patients, rooms]) => {
        if (!active) return;
        const list = Array.isArray(patients.data)
          ? patients.data
          : patients.data?.data || [];
        setPacientes(list);
        setSalas(rooms.data || []);
        const matches = list.filter(
          (p: { nome: string }) => p.nome === initialPacienteNome,
        );
        setPacienteId(matches.length === 1 ? matches[0].id : "");
        setSalaId(
          (rooms.data || []).find(
            (s: { nome: string }) => s.nome === initialSalaNome,
          )?.id || "",
        );
      })
      .catch(() => toast.error("Não foi possível carregar pacientes e salas."));
    return () => {
      active = false;
    };
  }, [isOpen, initialPacienteNome, initialSalaNome]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !pacienteId || !profId || !dataHora) return;
    setSubmitting(true);
    try {

    const saved = await onSubmit({
      pacienteNome,
      pacienteId,
      salaId: salaId || undefined,
      dataFim: new Date(
        new Date(dataHora).getTime() + duracao * 60000,
      ).toISOString(),
      profId,
      salaNome,
      dataHora,
      tipoAtend,
      recorrente,
      numSemanas,
    });

    if (saved) setPacienteNome("");
    } finally { setSubmitting(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden bg-card"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-foreground">
                  Novo Agendamento Clínico
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Cadastre consultas únicas ou recorrentes.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-muted text-muted-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Paciente
                </label>
                <select
                  required
                  aria-label="Paciente"
                  value={pacienteId}
                  onChange={(e) => {
                    setPacienteId(e.target.value);
                    setPacienteNome(
                      pacientes.find((p) => p.id === e.target.value)?.nome ||
                        "",
                    );
                  }}
                  className="w-full p-2.5 rounded-xl border text-sm bg-card"
                >
                  <option value="">Selecione um paciente cadastrado</option>
                  {pacientes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Profissional
                  </label>
                  <select
                    value={profId}
                    onChange={(e) => setProfId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-sm bg-card outline-none"
                  >
                    {profissionais.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome} ({p.cargo})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Sala
                  </label>
                  <select
                    value={salaId}
                    onChange={(e) => setSalaId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-sm bg-card outline-none"
                  >
                    <option value="">Sem sala definida</option>
                    {salas.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Data & Horário de Início
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={dataHora}
                    onChange={(e) => setDataHora(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-sm bg-card outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Tipo de Atendimento
                  </label>
                  <select
                    value={tipoAtend}
                    onChange={(e) => setTipoAtend(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-sm bg-card outline-none"
                  >
                    <option value="PRESENCIAL">Presencial</option>
                    <option value="ONLINE">Online / Teleatendimento</option>
                  </select>
                </div>
              </div>

              <label className="block text-xs font-semibold">
                Duração (minutos)
                <input
                  aria-label="Duração em minutos"
                  type="number"
                  min={1}
                  max={480}
                  required
                  value={duracao}
                  onChange={(e) => setDuracao(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border text-sm bg-card mt-1"
                />
              </label>
              {/* Recorrência */}
              <div className="p-3 bg-muted/40 rounded-xl space-y-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-foreground">
                  <input
                    type="checkbox"
                    checked={recorrente}
                    onChange={(e) => setRecorrente(e.target.checked)}
                    className="rounded border-border text-purple-500 outline-none"
                  />
                  Repetir semanalmente este horário
                </label>
                {recorrente && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Repetir por:</span>
                    <input
                      type="number"
                      min={2}
                      max={12}
                      value={numSemanas}
                      onChange={(e) =>
                        setNumSemanas(parseInt(e.target.value) || 2)
                      }
                      className="w-16 p-1.5 rounded border outline-none text-center bg-card"
                    />
                    <span className="text-muted-foreground">
                      semanas seguidas.
                    </span>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
                >
                  Salvar Agendamento
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
