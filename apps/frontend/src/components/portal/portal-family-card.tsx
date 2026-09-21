"use client";

import { motion } from "framer-motion";
import { User, ChevronRight, Heart } from "lucide-react";

interface PortalFamilyCardProps {
  childName: string;
  childAge: string;
  school?: string;
  onOpenFamilyProfile: () => void;
}

export function PortalFamilyCard({
  childName,
  childAge,
  school = "Educação Infantil",
  onOpenFamilyProfile,
}: PortalFamilyCardProps) {
  return (
    <motion.div
      id="family-profile-card"
      whileHover={{ y: -1.5 }}
      whileTap={{ scale: 0.985 }}
      onClick={onOpenFamilyProfile}
      className="rounded-[16px] h-[76px] p-3 border border-[#EEE8FA] bg-[#FAF8FF]/90 backdrop-blur-sm flex items-center justify-between shadow-2xs hover:shadow-xs hover:border-[#8D5BD1]/30 transition-all cursor-pointer relative overflow-hidden group select-none"
    >
      {/* Brilho suave de vidro no hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

      <div className="flex items-center flex-1 min-w-0">
        {/* Family Avatar (id: "family-avatar", size 48, borderRadius 50%, bg: #E9DEFF) */}
        <div
          id="family-avatar"
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#E9DEFF] to-[#F5EEFF] border border-[#8D5BD1]/20 flex items-center justify-center text-[#8D5BD1] shrink-0 relative shadow-2xs"
        >
          <User className="w-6 h-6 text-[#8D5BD1]" />
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#10B981] border-2 border-white flex items-center justify-center" title="Ativo no Instituto">
            <span className="w-1 h-1 rounded-full bg-white" />
          </span>
        </div>

        {/* Family Info (id: "family-info", flex 1, marginLeft 10) */}
        <div id="family-info" className="flex-1 ml-2.5 min-w-0">
          <div className="flex items-center gap-1.5 leading-none mb-0.5">
            <span id="family-label" className="text-[9px] font-extrabold uppercase tracking-wider text-[#77717E] block">
              PACIENTE ACOMPANHADO
            </span>
            <Heart className="w-2.5 h-2.5 text-[#F58A7E] fill-[#F58A7E]" />
          </div>

          <h2 id="family-name" className="text-[14px] font-extrabold text-[#29232F] truncate leading-snug group-hover:text-[#8D5BD1] transition-colors">
            {childName}
          </h2>

          <p id="family-secondary-info" className="text-[10px] text-[#77717E] truncate leading-none mt-0.5 font-medium">
            {childAge} • {school}
          </p>
        </div>
      </div>

      {/* Family Action (id: "family-action", icon: chevron-right, size 30) */}
      <div
        id="family-action"
        className="w-[30px] h-[30px] rounded-full bg-white/90 border border-[#EEE8FA] flex items-center justify-center text-[#8D5BD1] group-hover:bg-[#8D5BD1] group-hover:text-white transition-all shrink-0 ml-2 shadow-2xs"
      >
        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </motion.div>
  );
}
