"use client";

import { Instagram, Mail } from "lucide-react";
import { motion } from "framer-motion";

interface DoctorCardProps {
  name: string;
  role: string;
  register: string;
  img: string;
}

export default function DoctorCard({ name, role, register, img }: DoctorCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="p-6 bg-white border border-[#E7E7E7] rounded-3xl text-center space-y-4 shadow-sm hover:shadow-lg transition-all cursor-pointer"
    >
      {/* Circular photo cutout */}
      <div className="w-20 h-20 rounded-full overflow-hidden mx-auto bg-zinc-50 border border-[#E7E7E7]">
        <img src={img} alt={name} className="w-full h-full object-cover" />
      </div>

      <div className="space-y-1">
        <h4 className="font-extrabold text-xs text-[#4A4A4A]">{name}</h4>
        <p className="text-[10px] text-zinc-400 font-bold">{role}</p>
        <p className="text-[9px] text-zinc-400 font-semibold">{register}</p>
      </div>

      {/* Two pink social links circles */}
      <div className="flex gap-2 justify-center pt-2">
        <a 
          href="https://instagram.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-7 h-7 rounded-full border border-[#E98BAE]/25 flex items-center justify-center text-[#E98BAE] hover:bg-[#E98BAE]/5 transition-colors"
        >
          <Instagram className="w-3.5 h-3.5" />
        </a>
        <a 
          href="mailto:contato@institutoconectar.com.br" 
          className="w-7 h-7 rounded-full border border-[#E98BAE]/25 flex items-center justify-center text-[#E98BAE] hover:bg-[#E98BAE]/5 transition-colors"
        >
          <Mail className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
}
