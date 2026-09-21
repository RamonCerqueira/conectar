"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Shield,
  Bell,
  CreditCard,
  Building2,
  LogOut,
  ChevronRight,
  Sparkles,
  Lock,
  HeartHandshake,
} from "lucide-react";
import { toast } from "sonner";

interface PortalProfileScreenProps {
  parentName: string;
  childName: string;
  onOpenFinance: () => void;
  onLogout: () => void;
  onOpenWhatsApp: (msg?: string) => void;
}

export function PortalProfileScreen({
  parentName,
  childName,
  onOpenFinance,
  onLogout,
  onOpenWhatsApp,
}: PortalProfileScreenProps) {
  const [notifWhatsApp, setNotifWhatsApp] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifApp, setNotifApp] = useState(true);

  const initial = parentName ? parentName.charAt(0).toUpperCase() : "R";

  return (
    <div className="space-y-3.5 select-none pb-4">
      <div>
        <h1 className="text-[17px] font-extrabold text-[#29232F]">Meu Perfil</h1>
        <p className="text-[10px] text-[#77717E] font-medium">Dados cadastrais, segurança e preferências</p>
      </div>

      {/* Card do Responsável */}
      <div className="p-4 rounded-[20px] bg-gradient-to-r from-[#FAF8FF] to-[#F3EEFF] border border-[#EEE8FA] shadow-2xs space-y-3">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#8D5BD1] to-[#B388EB] flex items-center justify-center text-white font-black text-xl shadow-xs border-2 border-white">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <span className="px-2 py-0.5 rounded-full bg-[#E8DEFF] text-[#8D5BD1] text-[8.5px] font-extrabold">
              Responsável Legal
            </span>
            <h2 className="text-[15px] font-extrabold text-[#29232F] truncate leading-tight mt-0.5">
              {parentName}
            </h2>
            <p className="text-[10px] text-[#77717E] font-medium truncate">
              Acompanhando: <strong>{childName}</strong>
            </p>
          </div>
        </div>

        <div className="border-t border-[#EEE8FA] pt-2.5 space-y-1.5 text-[10.5px]">
          <div className="flex items-center justify-between">
            <span className="text-[#77717E] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#8D5BD1]" />
              <span>Telefone:</span>
            </span>
            <span className="font-bold text-[#29232F]">(11) 98765-4321</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#77717E] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#8D5BD1]" />
              <span>E-mail:</span>
            </span>
            <span className="font-bold text-[#29232F]">responsavel@email.com</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#77717E] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#8D5BD1]" />
              <span>CPF:</span>
            </span>
            <span className="font-bold text-[#29232F]">***.458.912-**</span>
          </div>
        </div>
      </div>

      {/* Atalho para Financeiro & Recibos */}
      <button
        onClick={onOpenFinance}
        className="w-full p-3.5 rounded-[16px] bg-white border border-[#EEEAF4] shadow-2xs hover:border-[#8D5BD1]/30 transition-all flex items-center justify-between cursor-pointer group text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[12px] bg-[#E8DEFF] text-[#8D5BD1] flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[12.5px] font-extrabold text-[#29232F] group-hover:text-[#8D5BD1] transition-colors">
              Financeiro & Recibos de Reembolso
            </h3>
            <p className="text-[9.5px] text-[#77717E] font-medium">
              Boletos, PIX e comprovantes para convênio
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-[#77717E] group-hover:text-[#8D5BD1] group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Preferências de Notificações */}
      <div className="p-3.5 rounded-[16px] bg-white border border-[#EEEAF4] shadow-2xs space-y-2.5">
        <h3 className="text-[12px] font-extrabold text-[#29232F] flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-[#8D5BD1]" />
          <span>Lembretes e Avisos de Consulta</span>
        </h3>

        <div className="space-y-2 text-[10.5px]">
          <div className="flex items-center justify-between">
            <span className="text-[#77717E]">Avisos 24h antes no WhatsApp</span>
            <input
              type="checkbox"
              checked={notifWhatsApp}
              onChange={(e) => {
                setNotifWhatsApp(e.target.checked);
                toast.success("Preferência de WhatsApp atualizada!");
              }}
              className="accent-[#8D5BD1] w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#77717E]">Notificações de Novos Laudos no App</span>
            <input
              type="checkbox"
              checked={notifApp}
              onChange={(e) => {
                setNotifApp(e.target.checked);
                toast.success("Preferência do App atualizada!");
              }}
              className="accent-[#8D5BD1] w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#77717E]">Recibos mensais por E-mail</span>
            <input
              type="checkbox"
              checked={notifEmail}
              onChange={(e) => {
                setNotifEmail(e.target.checked);
                toast.success("Preferência de E-mail atualizada!");
              }}
              className="accent-[#8D5BD1] w-4 h-4 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Unidade & Atendimento */}
      <div className="p-3.5 rounded-[16px] bg-[#FAF8FF] border border-[#EEE8FA] space-y-1.5 text-[10px] text-[#77717E]">
        <div className="flex items-center gap-1.5 text-[#8D5BD1] font-extrabold text-[11px]">
          <Building2 className="w-4 h-4" />
          <span>Instituto Conectar — Unidade Central</span>
        </div>
        <p>Av. Paulista, 1842 - 10º andar • Bela Vista, São Paulo/SP</p>
        <p>Recepção: (11) 3254-8800 • Horário: Seg a Sex, das 07h30 às 19h00</p>
      </div>

      {/* Botão Sair */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onLogout}
        className="w-full py-2.5 rounded-[12px] border border-rose-200 bg-rose-50 text-rose-600 font-extrabold text-[11px] flex items-center justify-center gap-1.5 hover:bg-rose-100 transition-colors cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>Sair do Portal</span>
      </motion.button>
    </div>
  );
}
