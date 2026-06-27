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
      whileHover={{ 
        y: -6,
        scale: 1.01,
        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
      }}
      className="p-6 bg-white border border-[#E7E7E7]/60 rounded-[24px] text-left space-y-4 shadow-premium-sm hover:shadow-premium-md hover:border-[#8E7BBE]/20 transition-all duration-300 cursor-pointer select-none group min-w-[220px]"
    >
      {/* Icon Wrapper with bounce hover effect */}
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${color}`}>
        <Icon className="w-6 h-6 transition-transform group-hover:scale-105" />
      </div>

      {/* Description text with delicate layout adjustments */}
      <div className="space-y-1.5">
        <h4 className="font-extrabold text-[13px] text-[#4A4A4A] group-hover:text-[#8E7BBE] transition-colors duration-200">
          {title}
        </h4>
        <p className="text-zinc-400 text-[10px] leading-relaxed font-medium">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
