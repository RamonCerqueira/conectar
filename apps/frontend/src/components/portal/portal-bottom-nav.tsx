"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Home, Users, CalendarHeart, FileHeart, User, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { soundEffects } from "@/lib/sound-effects";

export type PortalTabId = "inicio" | "familia" | "agenda" | "conteudos" | "perfil";

interface PortalBottomNavProps {
  activeTab: PortalTabId;
  onChangeTab: (tabId: PortalTabId) => void;
}

export function PortalBottomNav({ activeTab, onChangeTab }: PortalBottomNavProps) {
  const [soundOn, setSoundOn] = useState(true);

  // Suporte a Haptic Feedback no mobile (Capacitor nativo ou Web Vibration API)
  const triggerHaptic = () => {
    try {
      if (typeof window !== "undefined" && (window as any).Capacitor?.Plugins?.Haptics) {
        (window as any).Capacitor.Plugins.Haptics.impact({ style: "LIGHT" }).catch(() => {});
      } else if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(10);
      }
    } catch {
      // noop
    }
  };

  const navItems = [
    { id: "inicio" as const, label: "Início", icon: Home },
    { id: "familia" as const, label: "Família", icon: Users },
    { id: "agenda" as const, label: "Agenda", icon: CalendarHeart },
    { id: "conteudos" as const, label: "Conteúdos", icon: FileHeart },
    { id: "perfil" as const, label: "Perfil", icon: User },
  ];

  const handleTabClick = (tabId: PortalTabId) => {
    soundEffects.playTabSwitch();
    triggerHaptic();
    onChangeTab(tabId);
  };

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
            onClick={() => handleTabClick(item.id)}
            className="flex flex-col items-center justify-center w-14 h-full group active:scale-90 transition-transform cursor-pointer relative"
          >
            {/* Ícone com microinteração de elevação e mola */}
            <motion.div
              animate={isActive ? { y: -2, scale: [1, 1.25, 1] } : { y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-colors duration-200",
                  isActive
                    ? "text-[#8D5BD1] stroke-[2.6]"
                    : "text-[#77717E]/70 group-hover:text-[#8D5BD1]"
                )}
              />
            </motion.div>

            {/* Label com tipografia Nunito */}
            <span
              className={cn(
                "text-[9px] tracking-tight mt-1 transition-colors leading-none",
                isActive
                  ? "text-[#8D5BD1] font-black scale-105"
                  : "text-[#77717E]/70 font-semibold group-hover:text-[#8D5BD1]"
              )}
            >
              {item.label}
            </span>

            {/* Indicador Ativo com animação suave de mola */}
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="w-4 h-0.5 rounded-full bg-[#8D5BD1] mt-0.5 shadow-xs"
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
