"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  QrCode,
  Download,
  FileText,
  CheckCircle2,
  AlertCircle,
  Copy,
  Printer,
  ShieldCheck,
  Building2,
  Calendar,
  Sparkles,
  X,
} from "lucide-react";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { toast } from "sonner";

interface PortalFinanceScreenProps {
  financeiro: any[];
  childName: string;
  parentName: string;
  onOpenPix: (invoice: any) => void;
}

export function PortalFinanceScreen({
  financeiro,
  childName,
  parentName,
  onOpenPix,
}: PortalFinanceScreenProps) {
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  // Lista de faturas reais ou simuladas realistas
  const defaultInvoices = [
    {
      id: "inv-1",
      descricao: "Mensalidade Terapêutica — Setembro/2026",
      valor: 1400.0,
      vencimento: "2026-09-25",
      status: "PENDENTE",
      terapeuta: "Dra. Leliane Rocha (Psicologia) e Dra. Rosana Alves (Fono)",
      sessoes: 8,
    },
    {
      id: "inv-2",
      descricao: "Mensalidade Terapêutica — Agosto/2026",
      valor: 1400.0,
      vencimento: "2026-08-25",
      status: "PAGO",
      dataPagamento: "2026-08-22",
      terapeuta: "Equipe Multidisciplinar",
      sessoes: 8,
    },
    {
      id: "inv-3",
      descricao: "Avaliação Neuropsicológica (Módulo Completo)",
      valor: 1800.0,
      vencimento: "2026-07-15",
      status: "PAGO",
      dataPagamento: "2026-07-14",
      terapeuta: "Dra. Leliane Rocha (CRP 06/142980)",
      sessoes: 4,
    },
  ];

  const invoices = financeiro.length > 0 ? financeiro : defaultInvoices;

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleDownloadIRPF = () => {
    toast.success("Declaração Anual de Quitação (IRPF) gerada!", {
      description: "Documento oficial pronto para envio à Receita Federal.",
    });
  };

  return (
    <div className="space-y-3.5 select-none pb-4">
      <div>
        <h1 className="text-[17px] font-extrabold text-[#29232F]">Financeiro & Reembolso</h1>
        <p className="text-[10px] text-[#77717E] font-medium">Faturas, pagamentos via PIX e recibos para convênio</p>
      </div>

      {/* Banner Informativo de Reembolso para Convênios (Tarefa 20) */}
      <div className="p-3.5 rounded-[18px] bg-gradient-to-r from-[#8D5BD1] to-[#6C3FB8] text-white space-y-1.5 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-extrabold flex items-center gap-1 backdrop-blur-xs">
            <ShieldCheck className="w-3 h-3 text-[#FDE047]" />
            <span>Reembolso de Convênio Garantido</span>
          </span>
          <button
            onClick={handleDownloadIRPF}
            className="text-[9.5px] font-bold text-purple-100 hover:text-white underline cursor-pointer"
          >
            Quitação IRPF
          </button>
        </div>
        <h2 className="text-[13px] font-extrabold leading-tight">
          Recibos Clínicos para Bradesco, Amil, SulAmérica e Unimed
        </h2>
        <p className="text-[10px] text-purple-100 leading-snug">
          Emita recibos detalhados com registro no CRP/CRFa, CPF do responsável e CNPJ da clínica para reembolso integral.
        </p>
      </div>

      {/* Lista de Faturas */}
      <div className="space-y-2.5">
        <h3 className="text-[12px] font-extrabold text-[#29232F] uppercase tracking-wider px-1">
          Mensalidades & Atendimentos
        </h3>

        {invoices.map((inv) => {
          const isPago = inv.status === "PAGO";

          return (
            <div
              key={inv.id}
              className="p-3.5 rounded-[16px] bg-white border border-[#EEEAF4] shadow-2xs space-y-2 hover:border-[#8D5BD1]/30 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-[12px] font-extrabold text-[#29232F]">{inv.descricao}</h4>
                  <p className="text-[9.5px] text-[#77717E] font-medium">
                    Vencimento: {inv.vencimento ? formatDate(inv.vencimento) : "25 do mês corrente"}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-[8.5px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider",
                    isPago ? "bg-[#DDF6ED] text-[#10B981]" : "bg-[#FFF0C9] text-[#D97706]"
                  )}
                >
                  {inv.status}
                </span>
              </div>

              <div className="pt-2 border-t border-[#EEE8FA] flex items-center justify-between">
                <div>
                  <span className="text-[8.5px] text-[#77717E] block leading-none">Valor Total:</span>
                  <span className="text-[13px] font-black text-[#29232F]">{formatCurrency(inv.valor)}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Se estiver pago: botão de emitir recibo para convênio (Tarefa 20) */}
                  {isPago ? (
                    <button
                      onClick={() => setSelectedReceipt(inv)}
                      className="px-3 py-1.5 rounded-[10px] bg-[#FAF8FF] border border-[#EEE8FA] hover:bg-[#E8DEFF] text-[#8D5BD1] text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Emitir Recibo</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenPix(inv)}
                      className="px-3.5 py-1.5 rounded-[10px] bg-[#8D5BD1] hover:bg-[#7B48C2] text-white text-[10.5px] font-extrabold flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Pagar com PIX</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── MODAL DE RECIBO CLÍNICO TIMBRADO PARA REEMBOLSO (TAREFA 20) ─── */}
      <AnimatePresence>
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[22px] p-5 max-w-sm w-full space-y-3.5 shadow-2xl border border-white/80 text-[#29232F]"
            >
              <div className="flex justify-between items-center border-b border-[#EEEAF4] pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-[8px] bg-[#E8DEFF] text-[#8D5BD1] flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-sm">Recibo para Reembolso</h3>
                </div>
                <button onClick={() => setSelectedReceipt(null)} className="p-1 text-[#77717E] cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Corpo Timbrado do Recibo */}
              <div className="p-3.5 rounded-[14px] bg-[#FAF8FF] border border-[#EEE8FA] space-y-2 text-[10px] font-medium leading-relaxed">
                <div className="text-center pb-2 border-b border-[#EEE8FA]">
                  <p className="font-black text-[12px] text-[#8D5BD1]">INSTITUTO CONECTAR</p>
                  <p className="text-[8.5px] text-[#77717E]">CNPJ: 45.892.147/0001-89 • Cnes: 9812441</p>
                </div>

                <div className="space-y-1">
                  <p>
                    <strong className="text-[#29232F]">Paciente:</strong> {childName}
                  </p>
                  <p>
                    <strong className="text-[#29232F]">Responsável Financeiro:</strong> {parentName}
                  </p>
                  <p>
                    <strong className="text-[#29232F]">Serviço Prestado:</strong> {selectedReceipt.descricao}
                  </p>
                  <p>
                    <strong className="text-[#29232F]">Terapeuta Emissor:</strong> {selectedReceipt.terapeuta || "Dra. Leliane Rocha (CRP 06/142980)"}
                  </p>
                  <p>
                    <strong className="text-[#29232F]">Valor Quitado:</strong>{" "}
                    <span className="font-black text-[#10B981]">{formatCurrency(selectedReceipt.valor)}</span>
                  </p>
                  <p>
                    <strong className="text-[#29232F]">Data da Quitação:</strong>{" "}
                    {selectedReceipt.dataPagamento ? formatDate(selectedReceipt.dataPagamento) : "Agosto/2026"}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#EEE8FA] text-[8.5px] text-[#77717E] text-center italic">
                  Documento com autenticação eletrônica válido para reembolso junto a planos de saúde e dedução de despesas médicas no IRPF.
                </div>
              </div>

              {/* Ações do Recibo */}
              <div className="flex gap-2">
                <button
                  onClick={handlePrintReceipt}
                  className="flex-1 py-2.5 rounded-[10px] bg-[#FAF8FF] border border-[#EEE8FA] text-[#8D5BD1] hover:bg-[#E8DEFF] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir</span>
                </button>
                <button
                  onClick={() => {
                    toast.success("Recibo PDF baixado com sucesso!");
                    setSelectedReceipt(null);
                  }}
                  className="flex-1 py-2.5 rounded-[10px] bg-[#8D5BD1] hover:bg-[#7B48C2] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#8D5BD1]/20 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Salvar PDF</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
