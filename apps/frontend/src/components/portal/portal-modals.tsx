"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Home,
  Heart,
  CreditCard,
  QrCode,
  Copy,
  Check,
  Phone,
  Clock,
  Loader2,
} from "lucide-react";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { toast } from "sonner";

// ─────────────────────────────────────────────────────────────────────────────
// 1. MODAL DE ATIVIDADES PARA CASA
// ─────────────────────────────────────────────────────────────────────────────
interface PortalExercisesModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercicios: any[];
  onCompleteExercise: (exercise: any) => void;
}

export function PortalExercisesModal({
  isOpen,
  onClose,
  exercicios,
  onCompleteExercise,
}: PortalExercisesModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white/95 backdrop-blur-md rounded-[22px] p-5 max-w-sm w-full space-y-3.5 shadow-2xl border border-white/80"
          >
            <div className="flex items-center justify-between border-b border-[#EEEAF4] pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[8px] bg-[#FFF0C9] text-[#D97706] flex items-center justify-center">
                  <Home className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-[#29232F] text-sm">Atividades para Casa</h3>
              </div>
              <button onClick={onClose} className="p-1 text-[#77717E] hover:text-[#29232F] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {exercicios.length > 0 ? (
                exercicios.map((ex) => (
                  <div key={ex.id} className="p-3 rounded-[12px] bg-[#FFF8EC] border border-[#FFE4A3] space-y-1.5">
                    <div className="flex justify-between items-start">
                      <h4 className="text-[11.5px] font-bold text-[#29232F]">{ex.titulo}</h4>
                      <span
                        className={cn(
                          "text-[8.5px] font-bold px-2 py-0.5 rounded-full",
                          ex.realizado ? "bg-[#DDF6ED] text-[#10B981]" : "bg-[#FFF0C9] text-[#D97706]"
                        )}
                      >
                        {ex.realizado ? "Concluído" : "Pendente"}
                      </span>
                    </div>
                    <p className="text-[9.5px] text-[#77717E]">{ex.descricao}</p>
                    {!ex.realizado && (
                      <button
                        onClick={() => onCompleteExercise(ex)}
                        className="w-full py-1.5 rounded-[8px] bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-[9.5px] cursor-pointer"
                      >
                        Marcar como Realizado
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-[12px] bg-[#FFF8EC] text-center text-[10.5px] text-[#D97706] font-medium">
                  Todas as tarefas domiciliares da semana foram concluídas! Parabéns! 🌟
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. MODAL DE JORNADA / METAS PTS
// ─────────────────────────────────────────────────────────────────────────────
interface PortalJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  metas: any[];
}

export function PortalJourneyModal({ isOpen, onClose, metas }: PortalJourneyModalProps) {
  const defaultMetas = [
    { title: "Comunicação e Linguagem Funcional", progresso: 80, desc: "Uso de sentenças estruturadas e pedidos espontâneos" },
    { title: "Autorregulação e Flexibilidade", progresso: 65, desc: "Transição suave de atividades sem crise de desorganização" },
    { title: "Coordenação Motora Fina & Escrita", progresso: 75, desc: "Pega trípode adequada no lápis e recorte com tesoura" },
  ];

  const list = metas.length > 0 ? metas : defaultMetas;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white/95 backdrop-blur-md rounded-[22px] p-5 max-w-sm w-full space-y-3.5 shadow-2xl border border-white/80"
          >
            <div className="flex items-center justify-between border-b border-[#EEEAF4] pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[8px] bg-[#DDEEFF] text-[#0284C7] flex items-center justify-center">
                  <Heart className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-[#29232F] text-sm">Metas Terapêuticas (PTS)</h3>
              </div>
              <button onClick={onClose} className="p-1 text-[#77717E] hover:text-[#29232F] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {list.map((item: any, idx: number) => (
                <div key={idx} className="p-3 rounded-[12px] bg-[#FAF8FF] border border-[#EEE8FA] space-y-1.5">
                  <div className="flex justify-between items-start">
                    <h4 className="text-[11.5px] font-bold text-[#29232F]">{item.title || item.objetivo}</h4>
                    <span className="text-[10px] font-extrabold text-[#8D5BD1]">{item.progresso}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#E8DEFF] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#8D5BD1] to-[#6C3FB8] rounded-full transition-all duration-500"
                      style={{ width: `${item.progresso}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-[#77717E]">{item.desc || item.descricao}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MODAL FINANCEIRO E PAGAMENTO PIX
// ─────────────────────────────────────────────────────────────────────────────
interface PortalFinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  financeiro: any[];
  onOpenPix: (invoice: any) => void;
}

export function PortalFinanceModal({
  isOpen,
  onClose,
  financeiro,
  onOpenPix,
}: PortalFinanceModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white/95 backdrop-blur-md rounded-[22px] p-5 max-w-sm w-full space-y-3.5 shadow-2xl border border-white/80"
          >
            <div className="flex items-center justify-between border-b border-[#EEEAF4] pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[8px] bg-[#E8DEFF] text-[#7C3AED] flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-[#29232F] text-sm">Financeiro e Boletos</h3>
              </div>
              <button onClick={onClose} className="p-1 text-[#77717E] hover:text-[#29232F] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {financeiro.length > 0 ? (
                financeiro.map((f) => (
                  <div key={f.id} className="p-3 rounded-[12px] bg-[#FAF8FF] border border-[#EEE8FA] space-y-1.5">
                    <div className="flex justify-between items-start">
                      <h4 className="text-[11.5px] font-bold text-[#29232F]">{f.descricao}</h4>
                      <span
                        className={cn(
                          "text-[8.5px] font-bold px-2 py-0.5 rounded-full",
                          f.status === "PAGO" ? "bg-[#DDF6ED] text-[#10B981]" : "bg-[#FFF0C9] text-[#D97706]"
                        )}
                      >
                        {f.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10.5px]">
                      <span className="font-extrabold text-[#8D5BD1]">{formatCurrency(f.valor)}</span>
                      {f.status !== "PAGO" && (
                        <button
                          onClick={() => onOpenPix(f)}
                          className="px-2.5 py-1 rounded-[6px] bg-[#8D5BD1] hover:bg-[#7B48C2] text-white font-bold text-[9.5px] cursor-pointer shadow-xs"
                        >
                          Pagar via PIX
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-[12px] bg-[#FAF8FF] text-center text-[10.5px] text-[#8D5BD1] font-medium">
                  Nenhuma fatura pendente. Suas mensalidades estão em dia! 💚
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MODAL DE PAGAMENTO PIX COPIA E COLA
// ─────────────────────────────────────────────────────────────────────────────
interface PortalPixModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentInvoice: any;
}

export function PortalPixModal({ isOpen, onClose, currentInvoice }: PortalPixModalProps) {
  const [copied, setCopied] = useState(false);

  const copyPixKey = () => {
    navigator.clipboard.writeText(
      "00020126580014BR.GOV.BCB.PIX01364589214700018952040000530398654051400.005802BR5925INSTITUTO CONECTAR LTDA6009SAO PAULO62070503***6304E8F2"
    );
    setCopied(true);
    toast.success("Código PIX Copia e Cola copiado com sucesso!");
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white/95 backdrop-blur-md rounded-[22px] p-5 max-w-xs w-full space-y-3.5 shadow-2xl border border-white/80 text-center"
          >
            <div className="flex justify-between items-center border-b border-[#EEEAF4] pb-2">
              <h3 className="font-extrabold text-[#29232F] text-sm">Pagamento com PIX</h3>
              <button onClick={onClose} className="p-1 text-[#77717E] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-[14px] bg-[#FAF8FF] border border-[#EEE8FA] flex flex-col items-center gap-1.5">
              <QrCode className="w-28 h-28 text-[#8D5BD1]" />
              <p className="text-[11px] font-black text-[#29232F]">
                {currentInvoice ? formatCurrency(currentInvoice.valor) : "R$ 1.400,00"}
              </p>
              <p className="text-[9px] text-[#77717E]">Escaneie com o app do seu banco</p>
            </div>

            <button
              onClick={copyPixKey}
              className="w-full py-2.5 rounded-[12px] bg-[#8D5BD1] hover:bg-[#7B48C2] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#8D5BD1]/20 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Código Copiado!" : "Copiar Código PIX"}</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. MODAL DE NOVO AGENDAMENTO
// ─────────────────────────────────────────────────────────────────────────────
interface PortalSchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  profissionais: any[];
  onSubmit: (data: { profId: string; date: string; time: string; tipo: "PRESENCIAL" | "ONLINE"; obs: string }) => Promise<void>;
}

export function PortalSchedulingModal({
  isOpen,
  onClose,
  profissionais,
  onSubmit,
}: PortalSchedulingModalProps) {
  const [schedProf, setSchedProf] = useState("");
  const [schedDate, setSchedDate] = useState("");
  const [schedTime, setSchedTime] = useState("");
  const [schedTipo, setSchedTipo] = useState<"PRESENCIAL" | "ONLINE">("PRESENCIAL");
  const [schedObs, setSchedObs] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedProf || !schedDate || !schedTime) {
      toast.error("Preencha profissional, data e horário.");
      return;
    }
    try {
      setLoading(true);
      await onSubmit({ profId: schedProf, date: schedDate, time: schedTime, tipo: schedTipo, obs: schedObs });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white/95 backdrop-blur-md rounded-[22px] p-5 max-w-sm w-full space-y-3 shadow-2xl border border-white/80"
          >
            <div className="flex items-center justify-between border-b border-[#EEEAF4] pb-2.5">
              <h3 className="font-extrabold text-[#29232F] text-sm flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[#8D5BD1]" />
                <span>Solicitar Atendimento</span>
              </h3>
              <button onClick={onClose} className="p-1 text-[#77717E] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
              <div>
                <label className="font-bold text-[#29232F] block mb-1">Terapeuta / Especialidade:</label>
                <select
                  value={schedProf}
                  onChange={(e) => setSchedProf(e.target.value)}
                  className="w-full p-2 rounded-[10px] border border-[#EEE8FA] bg-[#FAF8FF] text-[#29232F] font-medium focus:outline-[#8D5BD1]"
                >
                  <option value="">Selecione o profissional...</option>
                  {profissionais.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.usuario?.nome || "Terapeuta"} — {p.especialidade}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-[#29232F] block mb-1">Data:</label>
                  <input
                    type="date"
                    value={schedDate}
                    onChange={(e) => setSchedDate(e.target.value)}
                    className="w-full p-2 rounded-[10px] border border-[#EEE8FA] bg-[#FAF8FF] text-[#29232F] font-medium focus:outline-[#8D5BD1]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#29232F] block mb-1">Horário:</label>
                  <input
                    type="time"
                    value={schedTime}
                    onChange={(e) => setSchedTime(e.target.value)}
                    className="w-full p-2 rounded-[10px] border border-[#EEE8FA] bg-[#FAF8FF] text-[#29232F] font-medium focus:outline-[#8D5BD1]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#29232F] block mb-1">Modalidade:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSchedTipo("PRESENCIAL")}
                    className={cn(
                      "py-1.5 rounded-[10px] font-bold border transition-colors cursor-pointer",
                      schedTipo === "PRESENCIAL"
                        ? "bg-[#8D5BD1] text-white border-[#8D5BD1]"
                        : "bg-[#FAF8FF] text-[#8D5BD1] border-[#EEE8FA]"
                    )}
                  >
                    Presencial
                  </button>
                  <button
                    type="button"
                    onClick={() => setSchedTipo("ONLINE")}
                    className={cn(
                      "py-1.5 rounded-[10px] font-bold border transition-colors cursor-pointer",
                      schedTipo === "ONLINE"
                        ? "bg-[#8D5BD1] text-white border-[#8D5BD1]"
                        : "bg-[#FAF8FF] text-[#8D5BD1] border-[#EEE8FA]"
                    )}
                  >
                    Online
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#29232F] block mb-1">Observações:</label>
                <textarea
                  rows={2}
                  value={schedObs}
                  onChange={(e) => setSchedObs(e.target.value)}
                  placeholder="Algum recado para o terapeuta?"
                  className="w-full p-2 rounded-[10px] border border-[#EEE8FA] bg-[#FAF8FF] text-[#29232F] font-medium focus:outline-[#8D5BD1]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-[12px] bg-[#8D5BD1] hover:bg-[#7B48C2] text-white font-bold text-xs shadow-md shadow-[#8D5BD1]/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>Confirmar Solicitação</span>
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. MODAL DE DETALHES DA SESSÃO E REAGENDAMENTO
// ─────────────────────────────────────────────────────────────────────────────
interface PortalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAppointment: any;
  childName: string;
  onWhatsApp: (msg: string) => void;
}

export function PortalDetailsModal({
  isOpen,
  onClose,
  selectedAppointment,
  childName,
  onWhatsApp,
}: PortalDetailsModalProps) {
  if (!selectedAppointment) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white/95 backdrop-blur-md rounded-[22px] p-5 max-w-xs w-full space-y-3.5 shadow-2xl border border-white/80"
          >
            <div className="flex justify-between items-center border-b border-[#EEEAF4] pb-2">
              <h3 className="font-extrabold text-[#29232F] text-sm">Detalhes da Sessão</h3>
              <button onClick={onClose} className="p-1 text-[#77717E] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[9.5px] text-[#77717E] block font-semibold">Atendimento:</span>
                <p className="font-extrabold text-[#8D5BD1]">
                  {selectedAppointment.tipoAtendimento || "Avaliação Neuropsicopedagógica"}
                </p>
              </div>
              <div>
                <span className="text-[9.5px] text-[#77717E] block font-semibold">Terapeuta:</span>
                <p className="font-bold text-[#29232F]">
                  {selectedAppointment.profissional?.usuario?.nome || "Dra. Leliane Dantas"}
                </p>
              </div>
              <div>
                <span className="text-[9.5px] text-[#77717E] block font-semibold">Horário & Local:</span>
                <p className="font-bold text-[#29232F]">
                  {formatDate(selectedAppointment.data)} às 09:00h
                </p>
                <p className="text-[9.5px] text-[#8D5BD1] font-medium">
                  {selectedAppointment.sala?.nome || "Sala 02 - Psicologia e Ludoterapia"}
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                onWhatsApp(
                  `Olá, gostaria de verificar o agendamento de ${childName} do dia ${formatDate(
                    selectedAppointment.data
                  )}.`
                )
              }
              className="w-full py-2.5 rounded-[12px] border border-[#8D5BD1]/30 bg-[#FAF8FF] text-[#8D5BD1] hover:bg-[#E8DEFF] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Falar com a Recepção</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
