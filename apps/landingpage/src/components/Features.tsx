"use client";

import { Heart, Users, Home as HomeIcon, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function Features() {
  return (
    <section className="py-6 px-6 bg-white relative z-20">
      <motion.div 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto bg-white border border-[#E7E7E7] rounded-[24px] shadow-lg p-6 md:p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-0 items-center justify-around text-xs font-bold text-[#4A4A4A]">
          
          {/* Col 1 */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="flex items-center justify-center gap-3.5 px-4 md:border-r border-[#E7E7E7] h-10 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#E98BAE]/10 flex items-center justify-center text-[#E98BAE] group-hover:scale-110 transition-transform">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">Atendimento Humanizado</span>
          </motion.div>

          {/* Col 2 */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="flex items-center justify-center gap-3.5 px-4 md:border-r border-[#E7E7E7] h-10 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#8E7BBE]/10 flex items-center justify-center text-[#8E7BBE] group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">Equipe Especializada</span>
          </motion.div>

          {/* Col 3 */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="flex items-center justify-center gap-3.5 px-4 md:border-r border-[#E7E7E7] h-10 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#69C4B5]/10 flex items-center justify-center text-[#69C4B5] group-hover:scale-110 transition-transform">
              <HomeIcon className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">Ambiente Acolhedor</span>
          </motion.div>

          {/* Col 4 */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="flex items-center justify-center gap-3.5 px-4 h-10 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#F3B357]/10 flex items-center justify-center text-[#F3B357] group-hover:scale-110 transition-transform">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">Desenvolvimento Individual</span>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
