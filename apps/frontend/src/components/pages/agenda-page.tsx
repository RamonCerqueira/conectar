"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ProfissionaisFilter } from "./agenda/profissionais-filter";
import { WaitList } from "./agenda/wait-list";
import { AgendaGrid } from "./agenda/agenda-grid";
import { AgendamentoModal } from "./agenda/agendamento-modal";
import { SlotDetailsModal } from "./agenda/slot-details-modal";
import { Agendamento, ProfissionalAgenda, WaitItem, Slot } from "@/types";

// ─── DADOS MOCKADOS COMPLETOS ───────────────────────────────────────────────
const initialAgendamentos: Agendamento[] = [
  {
    id: "ag-1",
    paciente: "Lucas Mendes",
    profissional: "Dra. Ana Lima",
    profissionalId: "prof-1",
    sala: "Sala 01",
    salaId: "sala-1",
    data: "2026-06-26T09:00:00",
    dataFim: "2026-06-26T10:00:00",
    tipo: "PRESENCIAL",
    status: "CONFIRMADO",
    cor: "#8E7BBE", // Roxo
  },
  {
    id: "ag-2",
    paciente: "Sofia Andrade",
    profissional: "Dra. Carla Souza",
    profissionalId: "prof-2",
    sala: "Sala 02",
    salaId: "sala-2",
    data: "2026-06-26T09:30:00",
    dataFim: "2026-06-26T10:30:00",
    tipo: "PRESENCIAL",
    status: "AGENDADO",
    cor: "#E98BAE", // Rosa
  },
  {
    id: "ag-3",
    paciente: "Pedro Oliveira",
    profissional: "Dr. Marcos Santos",
    profissionalId: "prof-3",
    sala: "Sala 04",
    salaId: "sala-4",
    data: "2026-06-26T14:00:00",
    dataFim: "2026-06-26T15:00:00",
    tipo: "ONLINE",
    status: "AGENDADO",
    cor: "#69C4B5", // Verde
  },
  {
    id: "ag-4",
    paciente: "Isabela Costa",
    profissional: "Dra. Ana Lima",
    profissionalId: "prof-1",
    sala: "Sala 01",
    salaId: "sala-1",
    data: "2026-06-26T10:30:00",
    dataFim: "2026-06-26T11:30:00",
    tipo: "PRESENCIAL",
    status: "PRESENTE",
    cor: "#8E7BBE", // Roxo
  },
  {
    id: "ag-5",
    paciente: "Gabriel Ferreira",
    profissional: "Dra. Paula Ramos",
    profissionalId: "prof-4",
    sala: "Sala Sensorial",
    salaId: "sala-3",
    data: "2026-06-26T11:00:00",
    dataFim: "2026-06-26T12:00:00",
    tipo: "PRESENCIAL",
    status: "FALTOU",
    cor: "#F3B357", // Amarelo
  },
];

const waitList: WaitItem[] = [
  { id: "w-1", nome: "Arthur Neves", especialidade: "Fonoaudiologia", desde: "15 dias" },
  { id: "w-2", nome: "Valentina Lima", especialidade: "Psicopedagogia", desde: "10 dias" },
  { id: "w-3", nome: "Bernardo Silva", especialidade: "Integração Sensorial", desde: "7 dias" },
];

const slotsHorarios = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

const profissionais: ProfissionalAgenda[] = [
  { id: "prof-1", nome: "Dra. Ana Lima", cor: "#8E7BBE", cargo: "Psicopedagoga" },
  { id: "prof-2", nome: "Dra. Carla Souza", cor: "#E98BAE", cargo: "Fonoaudióloga" },
  { id: "prof-3", nome: "Dr. Marcos Santos", cor: "#69C4B5", cargo: "Neuropsicólogo" },
  { id: "prof-4", nome: "Dra. Paula Ramos", cor: "#F3B357", cargo: "Terapeuta Ocupacional" },
];

export function AgendaPage() {
  const [agendamentos, setAgendamentos] = useState(initialAgendamentos);
  const [selectedProf, setSelectedProf] = useState("TODOS");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  
  // Prefill states for dragging and slot clicks
  const [initialPacienteNome, setInitialPacienteNome] = useState("");
  const [initialProfId, setInitialProfId] = useState("");
  const [initialDataHora, setInitialDataHora] = useState("");
  
  // Waiting list state
  const [waitingList, setWaitingList] = useState<WaitItem[]>(waitList);

  const loadAgendamentos = async () => {
    try {
      const res = await api.get("/agenda");
      if (res.data && res.data.length > 0) {
        const mapped = res.data.map((ag: any) => {
          const profInfo = profissionais.find((p) => p.id === ag.profissionalId) || profissionais[0];
          return {
            id: ag.id,
            paciente: ag.paciente?.nome || ag.pacienteNome || "Paciente",
            profissional: ag.profissional?.usuario?.nome || profInfo.nome,
            profissionalId: ag.profissionalId,
            sala: ag.sala?.nome || ag.salaNome || "Sala",
            salaId: ag.salaId,
            data: ag.data,
            dataFim: ag.dataFim || new Date(new Date(ag.data).getTime() + 60 * 60 * 1000).toISOString(),
            tipo: ag.tipo || "PRESENCIAL",
            status: ag.status || "AGENDADO",
            cor: ag.profissional?.cor || profInfo.cor,
          };
        });
        setAgendamentos(mapped);
      }
    } catch (err) {
      console.warn("Could not load real agendamentos, using mocks", err);
    }
  };

  useEffect(() => {
    loadAgendamentos();
  }, []);

  const handleCreateAgendamento = async (data: {
    pacienteNome: string;
    profId: string;
    salaNome: string;
    dataHora: string;
    tipoAtend: string;
    recorrente: boolean;
    numSemanas: number;
  }) => {
    const profissionalInfo = profissionais.find((p) => p.id === data.profId);
    
    const payload = {
      pacienteNome: data.pacienteNome,
      profissionalId: data.profId,
      salaNome: data.salaNome,
      data: new Date(data.dataHora).toISOString(),
      tipo: data.tipoAtend,
    };

    try {
      await api.post("/agenda", payload);
      toast.success("Consulta agendada com sucesso!");
      loadAgendamentos();
      setIsModalOpen(false);
    } catch (err) {
      console.warn("Could not save to real backend, fallback to local state", err);
      // Fallback
      const newAg = {
        id: `ag-${Date.now()}`,
        paciente: data.pacienteNome,
        profissional: profissionalInfo?.nome || "",
        profissionalId: data.profId,
        sala: data.salaNome,
        salaId: "sala-1",
        data: data.dataHora,
        dataFim: new Date(new Date(data.dataHora).getTime() + 60 * 60 * 1000).toISOString().slice(0, 19),
        tipo: data.tipoAtend,
        status: "AGENDADO",
        cor: profissionalInfo?.cor || "#8E7BBE",
      };

      setAgendamentos([...agendamentos, newAg]);
      setIsModalOpen(false);
      toast.success("Consulta agendada (Modo de Demonstração)");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      if (id.startsWith("ag-")) throw new Error("Mock ID");
      await api.patch(`/agenda/${id}/status`, { status: newStatus });
      toast.success("Status atualizado!");
      loadAgendamentos();
    } catch (err) {
      console.warn("Could not update status in backend, using local fallback", err);
      setAgendamentos(
        agendamentos.map((ag) => (ag.id === id ? { ...ag, status: newStatus } : ag))
      );
      toast.success("Status atualizado (Modo de Demonstração)");
    }
    setSelectedSlot(null);
  };

  const handleOpenCreateModal = () => {
    setInitialPacienteNome("");
    setInitialProfId(selectedProf !== "TODOS" ? selectedProf : "");
    setInitialDataHora("2026-06-26T09:00:00");
    setIsModalOpen(true);
  };

  const handleOpenCreateModalWithSlot = (slotTime: string, dateStr: string = "2026-06-26") => {
    setInitialPacienteNome("");
    setInitialProfId(selectedProf !== "TODOS" ? selectedProf : "");
    setInitialDataHora(`${dateStr}T${slotTime}:00`);
    setIsModalOpen(true);
  };

  const handleDropItem = (type: "patient" | "professional", item: any, slotTime: string, dateStr: string = "2026-06-26") => {
    const dataHoraString = `${dateStr}T${slotTime}:00`;
    
    if (type === "patient") {
      const waitItem = item as WaitItem;
      let defaultProfId = "";
      if (selectedProf !== "TODOS") {
        defaultProfId = selectedProf;
      } else {
        const matched = profissionais.find(p => 
          p.cargo.toLowerCase().includes(waitItem.especialidade.toLowerCase()) || 
          waitItem.especialidade.toLowerCase().includes(p.cargo.toLowerCase())
        );
        defaultProfId = matched ? matched.id : (profissionais[0]?.id || "prof-1");
      }
      
      setInitialPacienteNome(waitItem.nome);
      setInitialProfId(defaultProfId);
      setInitialDataHora(dataHoraString);
      setIsModalOpen(true);
      toast.info(`Agendando ${waitItem.nome} em ${dateStr.split("-")[2]}/${dateStr.split("-")[1]} às ${slotTime}`);
    } else if (type === "professional") {
      const profItem = item as ProfissionalAgenda;
      
      setInitialPacienteNome("");
      setInitialProfId(profItem.id);
      setInitialDataHora(dataHoraString);
      setIsModalOpen(true);
      toast.info(`Preenchendo agendamento com ${profItem.nome} em ${dateStr.split("-")[2]}/${dateStr.split("-")[1]} às ${slotTime}`);
    }
  };

  const filteredAgendamentos = agendamentos.filter(
    (ag) => selectedProf === "TODOS" || ag.profissionalId === selectedProf
  );

  const filteredWaitList = waitingList.filter(
    (item) => !agendamentos.some((ag) => ag.paciente.toLowerCase() === item.nome.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-120px)] overflow-hidden">
      {/* ─── LADO ESQUERDO: FILTROS E LISTA DE ESPERA (1 COLUNA) ────────────────── */}
      <div className="flex flex-col gap-6 xl:col-span-1 h-full overflow-y-auto pr-1">
        <ProfissionaisFilter
          profissionais={profissionais}
          selectedProf={selectedProf}
          onSelectProf={(p) => setSelectedProf(p)}
          totalAgendamentos={agendamentos.length}
        />
        <WaitList
          waitList={filteredWaitList}
          onAllocate={(item) => {
            setInitialPacienteNome(item.nome);
            setInitialProfId(selectedProf !== "TODOS" ? selectedProf : (profissionais[0]?.id || "prof-1"));
            setInitialDataHora("2026-06-26T09:00:00");
            setIsModalOpen(true);
            toast.info(`Preenchendo agendamento para ${item.nome}`);
          }}
        />
      </div>

      {/* ─── LADO DIREITO: GRID DO CALENDÁRIO DIÁRIO (3 COLUNAS) ───────────────── */}
      <AgendaGrid
        slotsHorarios={slotsHorarios}
        filteredAgendamentos={filteredAgendamentos}
        onSelectSlot={(ag) => setSelectedSlot(ag)}
        onOpenCreateModal={handleOpenCreateModal}
        onDropItem={handleDropItem}
        onOpenCreateModalWithSlot={handleOpenCreateModalWithSlot}
      />

      {/* MODAL DETALHE DO AGENDAMENTO */}
      <SlotDetailsModal
        selectedSlot={selectedSlot}
        onClose={() => setSelectedSlot(null)}
        onStatusChange={handleStatusChange}
      />

      {/* MODAL AGENDAR (NOVO) */}
      <AgendamentoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profissionais={profissionais}
        initialPacienteNome={initialPacienteNome}
        initialProfId={initialProfId}
        initialDataHora={initialDataHora}
        onSubmit={handleCreateAgendamento}
      />
    </div>
  );
}
