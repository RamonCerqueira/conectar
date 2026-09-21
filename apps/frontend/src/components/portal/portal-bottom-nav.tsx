"use client";

import { motion } from "framer-motion";
import { Home, Users, CalendarHeart, FileHeart, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type PortalTabId = "inicio" | "familia" | "agenda" | "conteudos" | "perfil";

interface PortalBottomNavProps {
  activeTab: PortalTabId;
  onChangeTab: (tabId: PortalTabId) => void;
}

export function PortalBottomNav({ activeTab, onChangeTab }: PortalBottomNavProps) {
  // Suporte a Haptic Feedback no mobile (Capacitor)
  const triggerHaptic = async () => {
    try {
      const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      // noop em browsers desktop
    }
  };

  const navItems = [
    { id: "inicio" as const, label: "Início", icon: Home },
    { id: "familia" as const, label: "Família", icon: Users },
    { id: "agenda" as const, label: "Agenda", icon: CalendarHeart },
    { id: "conteudos" as const, label: "Conteúdos", icon: FileHeart },
    { id: "perfil" as const, label: "Perfil", icon: User },
  ];

  return (
    <nav
      id="bottom-navigation"
      className="absolute bottom-0 left-0 right-0 h-[68px] bg-white/95 backdrop-blur-md border-t border-[#EEEAF4] px-2 flex items-center justify-around z-30 shadow-[0_-3px_12px_rgba(40,30,60,0.04)] select-none"
    >
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            onClick={() => {
              triggerHaptic();
              onChangeTab(item.id);
            }}
            className="flex flex-col items-center justify-center w-14 h-full group active:scale-95 transition-transform cursor-pointer relative"
          >
            {/* Ícone com microinteração de elevação */}
            <Icon
              className={cn(
                "w-5 h-5 transition-all duration-200",
                isActive
                  ? "text-[#8D5BD1] stroke-[2.5] -translate-y-0.5 scale-110"
                  : "text-[#77717E]/70 group-hover:text-[#8D5BD1]"
              )}
            />

            {/* Label com tipografia Nunito */}
            <span
              className={cn(
                "text-[9px] tracking-tight mt-1 transition-colors leading-none",
                isActive
                  ? "text-[#8D5BD1] font-black"
                  : "text-[#77717E]/70 font-semibold group-hover:text-[#8D5BD1]"
              )}
            >
              {item.label}
            </span>

            {/* Indicador Ativo com animação suave de transição */}
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="w-3.5 h-0.5 rounded-full bg-[#8D5BD1] mt-0.5 shadow-xs"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
