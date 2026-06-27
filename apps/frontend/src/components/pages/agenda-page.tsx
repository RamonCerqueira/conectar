"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, CheckCircle, Clock, Wallet, XCircle, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ProfissionaisFilter } from "./agenda/profissionais-filter";
import { WaitList } from "./agenda/wait-list";
import { AgendaGrid } from "./agenda/agenda-grid";
import { AgendamentoModal } from "./agenda/agendamento-modal";
import { SlotDetailsModal } from "./agenda/slot-details-modal";
import { Agendamento, ProfissionalAgenda, WaitItem, Slot } from "@/types";

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

export function AgendaPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [profissionais, setProfissionais] = useState<ProfissionalAgenda[]>([]);
  const [waitingList, setWaitingList] = useState<WaitItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProf, setSelectedProf] = useState("TODOS");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  
  // Prefill states for dragging and slot clicks
  const [initialPacienteNome, setInitialPacienteNome] = useState("");
  const [initialProfId, setInitialProfId] = useState("");
  const [initialDataHora, setInitialDataHora] = useState("");

  // Checkout billing modal state
  const [checkoutSlot, setCheckoutSlot] = useState<any | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutValor, setCheckoutValor] = useState("150.00");
  const [checkoutForma, setCheckoutForma] = useState("PIX");
  const [checkoutConta, setCheckoutConta] = useState("Caixa Geral");

  const loadData = async () => {
    try {
      const [profsRes, waitRes] = await Promise.all([
        api.get("/profissionais"),
        api.get("/lista-espera").catch(() => ({ data: [] }))
      ]);

      const mappedProfs = (profsRes.data || []).map((p: any) => ({
        id: p.id,
        nome: p.nome || p.usuario?.nome || "Profissional",
        cor: p.cor || "#8E7BBE",
        cargo: (p.tipo || "OUTRO").replace("_", " ").toLowerCase(),
      }));
      setProfissionais(mappedProfs);

      const mappedWait = (waitRes.data || []).map((w: any) => ({
        id: w.id,
        nome: w.nome,
        especialidade: w.especialidade || "Geral",
        desde: "Recente",
      }));
      setWaitingList(mappedWait);

      // Now load agenda with fresh professionals mapped list
      const res = await api.get("/agenda");
      const mappedAgendas = (res.data || []).map((ag: any) => {
        const profInfo = mappedProfs.find((p: any) => p.id === ag.profissionalId) || { nome: "Profissional", cor: "#8E7BBE" };
        return {
          id: ag.id,
          paciente: ag.paciente?.nome || ag.pacienteNome || "Paciente",
          profissional: ag.profissional?.usuario?.nome || profInfo.nome,
          profissionalId: ag.profissionalId,
          sala: ag.sala?.nome || ag.salaNome || "Sala Comum",
          salaId: ag.salaId,
          data: ag.data,
          dataFim: ag.dataFim || new Date(new Date(ag.data).getTime() + 60 * 60 * 1000).toISOString(),
          tipo: ag.tipo || "PRESENCIAL",
          status: ag.status || "AGENDADO",
          cor: ag.profissional?.cor || profInfo.cor,
        };
      });
      setAgendamentos(mappedAgendas);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar dados da agenda.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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
      loadData();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cadastrar consulta no servidor.");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (newStatus === "PRESENTE") {
      // Find patient and populate defaults
      const currentSlot = filteredAgendamentos.find(ag => ag.id === id);
      
      setCheckoutValor("150.00");
      setCheckoutForma("PIX");
      setCheckoutConta("Caixa Geral");
      setCheckoutSlot({ id, slot: selectedSlot, raw: currentSlot });
      setIsCheckoutOpen(true);
      return;
    }

    try {
      await api.patch(`/agenda/${id}/status`, { status: newStatus });
      toast.success("Status atualizado!");
      loadData();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar status do agendamento.");
    }
    setSelectedSlot(null);
  };

  const handleConfirmPendente = async () => {
    if (!checkoutSlot) return;
    try {
      await api.patch(`/agenda/${checkoutSlot.id}/status`, { status: "PRESENTE" });
      toast.success("Presença registrada e faturamento lançado como pendente!");
      loadData();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao registrar presença.");
    }
    setIsCheckoutOpen(false);
    setCheckoutSlot(null);
    setSelectedSlot(null);
  };

  const handleConfirmPago = async () => {
    if (!checkoutSlot) return;
    try {
      // 1. Create paid transaction in the finance ledger first
      const payload = {
        tipo: "RECEITA",
        descricao: `[Consulta] Atendimento - ${checkoutSlot.slot?.paciente || "Paciente"}`,
        valor: parseFloat(checkoutValor),
        formaPagamento: checkoutForma,
        status: "PAGO",
        vencimento: new Date().toISOString(),
        pagamento: new Date().toISOString(),
        pacienteId: checkoutSlot.raw?.pacienteId || null,
        observacoes: `Consulta particular paga na recepção. Agendamento Ref: ${checkoutSlot.id}`,
        contaCaixa: checkoutConta,
      };

      await api.post("/financeiro", payload);

      // 2. Set attendance status to PRESENTE
      await api.patch(`/agenda/${checkoutSlot.id}/status`, { status: "PRESENTE" });

      toast.success("Pagamento recebido com sucesso e presença registrada!");
      loadData();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao registrar pagamento imediato.");
    }
    setIsCheckoutOpen(false);
    setCheckoutSlot(null);
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
        defaultProfId = matched ? matched.id : (profissionais[0]?.id || "");
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] space-y-4">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-muted-foreground">Carregando agenda clínica...</p>
      </div>
    );
  }

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
            setInitialProfId(selectedProf !== "TODOS" ? selectedProf : (profissionais[0]?.id || ""));
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

      {/* DIÁLOGO DE FATURAMENTO / CHECKOUT (RECEPCAO) */}
      <AnimatePresence>
        {isCheckoutOpen && checkoutSlot && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="absolute inset-0" onClick={() => setIsCheckoutOpen(false)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden bg-card"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-foreground">Faturar Atendimento</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Paciente {checkoutSlot.slot?.paciente} está presente. Registre a receita da consulta.
                  </p>
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground cursor-pointer"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                {/* Billing fields */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Valor Cobrado (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={checkoutValor}
                    onChange={(e) => setCheckoutValor(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Forma de Pagamento</label>
                    <select
                      value={checkoutForma}
                      onChange={(e) => setCheckoutForma(e.target.value)}
                      className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none cursor-pointer"
                    >
                      <option value="PIX">PIX</option>
                      <option value="CARTAO_CREDITO">Cartão de Crédito</option>
                      <option value="CARTAO_DEBITO">Cartão de Débito</option>
                      <option value="DINHEIRO">Dinheiro</option>
                      <option value="TRANSFERENCIA">Transferência Bancária</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Conta Caixa / Destino</label>
                    <select
                      value={checkoutConta}
                      onChange={(e) => setCheckoutConta(e.target.value)}
                      className="w-full p-2.5 rounded-xl border bg-background text-foreground outline-none cursor-pointer"
                    >
                      <option value="Caixa Geral">Caixa Geral (Dinheiro)</option>
                      <option value="Banco Itaú">Banco Itaú</option>
                      <option value="Banco Inter">Banco Inter</option>
                      <option value="Banco Nubank">Banco Nubank</option>
                    </select>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/10 space-y-1">
                  <p className="font-bold text-foreground text-[10px] uppercase flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-purple-400" /> Fluxo Particular Ativo
                  </p>
                  <p className="text-[9px] text-muted-foreground leading-relaxed">
                    Você pode registrar o recebimento imediato ("Receber Agora") para conciliar a entrada na recepção, ou apenas lançar no faturamento pendente do cliente.
                  </p>
                </div>

                <div className="pt-4 border-t flex flex-col sm:flex-row gap-2 justify-between">
                  <button
                    type="button"
                    onClick={handleConfirmPendente}
                    className="w-full py-2.5 rounded-xl border font-bold text-zinc-400 border-border hover:bg-muted hover:text-white transition-colors cursor-pointer"
                  >
                    Apenas Presente (Pendente)
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmPago}
                    className="w-full py-2.5 rounded-xl font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
                  >
                    Receber Agora
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
