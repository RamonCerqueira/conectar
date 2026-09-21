"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, User, MessageCircle, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import { soundEffects } from "@/lib/sound-effects";

interface PortalHeaderProps {
  parentName: string;
  onOpenProfile: () => void;
  onOpenNotifications?: () => void;
  onContactSupport?: () => void;
}

export function PortalHeader({
  parentName,
  onOpenProfile,
  onOpenNotifications,
  onContactSupport,
}: PortalHeaderProps) {
  const [soundEnabled, setSoundEnabled] = useState(soundEffects.isSoundEnabled());
  const initial = parentName ? parentName.charAt(0).toUpperCase() : "F";

  const handleToggleSound = () => {
    const newState = soundEffects.toggleSound();
    setSoundEnabled(newState);
    if (newState) {
      soundEffects.playPop();
      toast.success("Efeitos sonoros ativados! 🔔");
    } else {
      toast.info("Efeitos sonoros silenciados. 🔕");
    }
  };

  const handleNotifications = () => {
    soundEffects.playPop();
    if (onOpenNotifications) {
      onOpenNotifications();
    } else {
      toast.info("Você tem 1 novo relatório clínico e 1 atividade para casa disponível.", {
        description: "Equipe Multidisciplinar Conectar 💜",
      });
    }
  };

  return (
    <header
      id="top-header"
      className="px-4 py-2.5 bg-white/95 backdrop-blur-md flex items-center justify-between shrink-0 border-b border-[#EEEAF4] sticky top-0 z-20"
    >
      {/* Brand (id: "brand") */}
      <motion.div
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2"
      >
        <div className="flex -space-x-1.5 items-center">
          <span className="w-6 h-6 rounded-full bg-[#F58A7E] flex items-center justify-center text-white text-[10px] font-bold shadow-xs transition-transform hover:scale-110">
            💜
          </span>
          <span className="w-6 h-6 rounded-full bg-[#8D5BD1] flex items-center justify-center text-white text-[10px] font-bold shadow-xs transition-transform hover:scale-110">
            🌱
          </span>
          <span className="w-6 h-6 rounded-full bg-[#F3A43B] flex items-center justify-center text-white text-[10px] font-bold shadow-xs transition-transform hover:scale-110">
            💡
          </span>
        </div>

        <div className="leading-none">
          <div className="flex items-center gap-1">
            <span className="text-[16px] font-bold tracking-tight text-[#8D5BD1] uppercase font-sans">
              CONECTAR
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" title="Clínica Aberta" />
          </div>
          <p className="text-[8px] font-medium text-[#77717E] tracking-tight mt-0.5">
            Instituto de Desenvolvimento Infantil
          </p>
        </div>
      </motion.div>

      {/* Header Actions (id: "header-actions") */}
      <div id="header-actions" className="flex items-center gap-1.5">
        {/* Toggle de Sons e Efeitos */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleToggleSound}
          className={`w-8 h-8 rounded-full border border-[#EEEAF4] flex items-center justify-center transition-colors shadow-2xs cursor-pointer ${
            soundEnabled
              ? "bg-[#FAF8FF] text-[#8D5BD1] hover:bg-[#E8DEFF]"
              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
          }`}
          title={soundEnabled ? "Sons ativados (toque para silenciar)" : "Sons silenciados (toque para ativar)"}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </motion.button>

        {/* Sino de Notificações */}
        <motion.button
          id="notification"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleNotifications}
          className="w-8 h-8 rounded-full border border-[#EEEAF4] bg-[#FAF8FF] hover:bg-[#E8DEFF]/60 flex items-center justify-center text-[#8D5BD1] transition-colors relative shadow-2xs cursor-pointer"
          title="Notificações e Avisos"
        >
          <Bell className="w-4 h-4" />
          {/* Badge de aviso */}
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F58A7E] ring-2 ring-white animate-pulse" />
        </motion.button>

        {/* Avatar do Responsável */}
        <motion.button
          id="profile"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenProfile}
          className="w-[34px] h-[34px] rounded-full bg-gradient-to-tr from-[#8D5BD1] to-[#B388EB] text-white font-extrabold text-xs flex items-center justify-center shadow-xs border-2 border-white cursor-pointer relative"
          title={`Conectado como ${parentName}`}
        >
          <span>{initial}</span>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#10B981] border-2 border-white rounded-full" />
        </motion.button>
      </div>
    </header>
  );
}
