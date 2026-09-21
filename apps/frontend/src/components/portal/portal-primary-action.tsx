"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface PortalPrimaryActionProps {
  onClick: () => void;
  label?: string;
}

export function PortalPrimaryAction({
  onClick,
  label = "Agendar atendimento",
}: PortalPrimaryActionProps) {
  return (
    <motion.button
      id="primary-action"
      whileHover={{ scale: 1.015, y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full h-[42px] rounded-[21px] bg-gradient-to-r from-[#8D5BD1] to-[#7B48C2] hover:from-[#7E4BC4] hover:to-[#6E3BB5] text-white font-extrabold text-[11px] flex items-center justify-center gap-1.5 shadow-md shadow-[#8D5BD1]/25 transition-all mt-3 cursor-pointer relative overflow-hidden group select-none"
    >
      {/* Reflexo suave glass no hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

      <Plus className="w-4 h-4 stroke-[3] group-hover:rotate-90 transition-transform duration-300" />
      <span className="tracking-wide">{label}</span>
    </motion.button>
  );
}
