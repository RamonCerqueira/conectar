"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string; // e.g. text-[#8E7BBE] bg-[#8E7BBE]/10
}

export default function ServiceCard({ title, description, icon: Icon, color }: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="p-6 bg-white border border-[#E7E7E7] rounded-[24px] shadow-sm text-left space-y-4 hover:shadow-lg hover:border-[#8E7BBE]/20 transition-all cursor-pointer select-none group min-w-[220px]"
    >
      {/* Icon */}
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>

      {/* Description text */}
      <div className="space-y-1">
        <h4 className="font-extrabold text-[13px] text-[#4A4A4A]">{title}</h4>
        <p className="text-zinc-400 text-[10px] leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
