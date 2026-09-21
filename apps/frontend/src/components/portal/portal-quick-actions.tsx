"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  TrendingUp,
  Home,
  FileText,
  Heart,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { soundEffects } from "@/lib/sound-effects";

interface PortalQuickActionsProps {
  onSelectAction: (actionKey: "agenda" | "evolucao" | "atividades" | "documentos" | "jornada" | "financeiro") => void;
  pendingExercisesCount?: number;
  pendingInvoicesCount?: number;
}

export function PortalQuickActions({
  onSelectAction,
  pendingExercisesCount = 0,
  pendingInvoicesCount = 0,
}: PortalQuickActionsProps) {
  const actions = [
    {
      id: "quick-action-1",
      actionKey: "agenda" as const,
      bg: "#F0E8FF",
      border: "#E4D5FF",
      iconColor: "#8D5BD1",
      icon: Calendar,
      title: "Agenda",
      description: "Consultas",
      badge: null,
      sparkle: "🗓️",
    },
    {
      id: "quick-action-2",
      actionKey: "evolucao" as const,
      bg: "#DDF6ED",
      border: "#C5EFE0",
      iconColor: "#10B981",
      icon: TrendingUp,
      title: "Evolução",
      description: "Registros",
      badge: null,
      sparkle: "🌱",
    },
    {
      id: "quick-action-3",
      actionKey: "atividades" as const,
      bg: "#FFF0C9",
      border: "#FFE4A3",
      iconColor: "#D97706",
      icon: Home,
      title: "Atividades",
      description: "Para casa",
      badge: pendingExercisesCount > 0 ? `${pendingExercisesCount}` : null,
      sparkle: "✏️",
    },
    {
      id: "quick-action-4",
      actionKey: "documentos" as const,
      bg: "#FFDDE0",
      border: "#FFCCD1",
      iconColor: "#E11D48",
      icon: FileText,
      title: "Documentos",
      description: "Laudos",
      badge: null,
      sparkle: "📄",
    },
    {
      id: "quick-action-5",
      actionKey: "jornada" as const,
      bg: "#DDEEFF",
      border: "#C7E3FF",
      iconColor: "#0284C7",
      icon: Heart,
      title: "Jornada",
      description: "Metas PTS",
      badge: null,
      sparkle: "🎯",
    },
    {
      id: "quick-action-6",
      actionKey: "financeiro" as const,
      bg: "#E8DEFF",
      border: "#D5C2FF",
      iconColor: "#7C3AED",
      icon: CreditCard,
      title: "Financeiro",
      description: "Boletos/PIX",
      badge: pendingInvoicesCount > 0 ? "!" : null,
      sparkle: "💳",
    },
  ];

  const handleCardClick = (actionKey: any) => {
    soundEffects.playPop();
    onSelectAction(actionKey);
  };

  return (
    <section id="quick-actions" className="pt-0.5 select-none">
      <div id="quick-action-grid" className="grid grid-cols-3 gap-2">
        {actions.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              id={item.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: idx * 0.035,
                type: "spring",
                stiffness: 380,
                damping: 20,
              }}
              whileHover={{
                y: -4,
                scale: 1.03,
                boxShadow: "0 8px 20px rgba(141, 91, 209, 0.12)",
              }}
              whileTap={{ scale: 0.93, rotate: (idx % 2 === 0 ? -1 : 1) }}
              onClick={() => handleCardClick(item.actionKey)}
              className="h-[106px] rounded-[14px] p-2.5 flex flex-col justify-between cursor-pointer transition-colors shadow-2xs relative overflow-hidden group border"
              style={{
                backgroundColor: item.bg,
                borderColor: item.border,
              }}
            >
              {/* Efeito Glassmorphism: raio de luz passando na diagonal no hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

              {/* Topo do Card: Ícone animado e Badge com pulse suave */}
              <div className="flex items-center justify-between z-10">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.35 }}
                  className="w-7 h-7 flex items-center justify-center"
                  style={{ color: item.iconColor }}
                >
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </motion.div>

                {item.badge && (
                  <motion.span
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="px-1.5 py-0.2 rounded-full text-[8.5px] font-black text-white shadow-xs"
                    style={{ backgroundColor: item.iconColor }}
                  >
                    {item.badge}
                  </motion.span>
                )}
              </div>

              {/* Rodapé do Card: Título, Descrição e Chevron */}
              <div className="flex items-end justify-between z-10">
                <div className="min-w-0 pr-1">
                  <h3 className="text-[12px] font-extrabold text-[#29232F] leading-tight truncate group-hover:text-[#8D5BD1] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[9px] text-[#77717E] leading-tight truncate font-medium mt-0.5">
                    {item.description}
                  </p>
                </div>
                <ChevronRight
                  className="w-3.5 h-3.5 shrink-0 mb-0.5 transition-transform group-hover:translate-x-1"
                  style={{ color: item.iconColor }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
