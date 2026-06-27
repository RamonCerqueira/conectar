"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, AlertTriangle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatCard } from "@/types";
import { useState, useEffect } from "react";

interface StatCardProps {
  card: StatCard;
  index: number;
}

// Each card has its own accent identity
const ACCENTS: Record<
  string,
  { from: string; to: string; glow: string; iconBg: string; iconColor: string; darkIconBg: string }
> = {
  "atendimentos-hoje": {
    from: "#8E7BBE",
    to: "#B3A7DC",
    glow: "rgba(142,123,190,0.18)",
    iconBg: "#F4F2F9",
    darkIconBg: "rgba(142,123,190,0.18)",
    iconColor: "#A68EE0",
  },
  "novos-pacientes": {
    from: "#E98BAE",
    to: "#F3B8CE",
    glow: "rgba(233,139,174,0.18)",
    iconBg: "#FBE8F0",
    darkIconBg: "rgba(233,139,174,0.18)",
    iconColor: "#E98BAE",
  },
  "faltas-hoje": {
    from: "#F3B357",
    to: "#F8CF97",
    glow: "rgba(243,179,87,0.18)",
    iconBg: "#FEF0D9",
    darkIconBg: "rgba(243,179,87,0.18)",
    iconColor: "#F3B357",
  },
  "aguardando-avaliacao": {
    from: "#69C4B5",
    to: "#9CDCD5",
    glow: "rgba(105,196,181,0.18)",
    iconBg: "#D6F3EF",
    darkIconBg: "rgba(105,196,181,0.18)",
    iconColor: "#69C4B5",
  },
  "receita-mes": {
    from: "#69C4B5",
    to: "#9CDCD5",
    glow: "rgba(105,196,181,0.18)",
    iconBg: "#D6F3EF",
    darkIconBg: "rgba(105,196,181,0.18)",
    iconColor: "#69C4B5",
  },
  "pagamentos-pendentes": {
    from: "#EF4444",
    to: "#FCA5A5",
    glow: "rgba(239,68,68,0.15)",
    iconBg: "#FEE2E2",
    darkIconBg: "rgba(239,68,68,0.18)",
    iconColor: "#F87171",
  },
};

const DEFAULT_ACCENT = {
  from: "#8E7BBE",
  to: "#B3A7DC",
  glow: "rgba(142,123,190,0.18)",
  iconBg: "#F4F2F9",
  darkIconBg: "rgba(142,123,190,0.18)",
  iconColor: "#A68EE0",
};

export function StatCard({ card, index }: StatCardProps) {
  const Icon = card.icon;
  const accent = ACCENTS[card.id] ?? DEFAULT_ACCENT;

  // Reactive dark mode detection
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const iconBgValue = isDark ? accent.darkIconBg : accent.iconBg;

  const trendConfig = {
    up: {
      icon: TrendingUp,
      color: "#16A34A",
      bg: "rgba(22,163,74,0.08)",
      label: card.changeLabel,
    },
    down: {
      icon: TrendingDown,
      color: "#0284C7",
      bg: "rgba(2,132,199,0.08)",
      label: card.changeLabel,
    },
    alert: {
      icon: AlertTriangle,
      color: "#DC2626",
      bg: "rgba(220,38,38,0.08)",
      label: card.changeLabel,
    },
    neutral: {
      icon: ArrowRight,
      color: "#D97706",
      bg: "rgba(217,119,6,0.08)",
      label: card.changeLabel,
    },
  }[card.changeType];

  const TrendIcon = trendConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: index * 0.07, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.18, ease: "easeOut" } }}
      className={cn(
        "relative overflow-hidden rounded-2xl cursor-default",
        // Light: glassmorphism branco
        "bg-white/75 backdrop-blur-xl border border-white/80",
        // Dark: vidro escuro premium com borda iluminada
        "dark:bg-[hsl(252_15%_13%/0.9)] dark:border-[hsl(252_20%_24%/0.7)]",
        "dark:shadow-[0_0_0_1px_hsl(252_20%_22%/0.6),0_4px_20px_hsl(258_55%_20%/0.15)]"
      )}
      style={{
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: `0 2px 12px ${accent.glow}, 0 1px 3px rgba(0,0,0,0.04)`,
      }}
      id={`stat-card-${card.id}`}
    >
      {/* Top gradient bar — accent identity */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
        style={{
          background: `linear-gradient(90deg, ${accent.from}, ${accent.to})`,
        }}
      />

      {/* Ambient glow blob */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-3xl pointer-events-none opacity-50"
        style={{ background: accent.from }}
      />

      <div className="relative p-4 pt-5">
        {/* Icon */}
        <div
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl mb-3"
          style={{ background: iconBgValue }}
        >
          <Icon
            className="h-4 w-4"
            style={{ color: accent.iconColor }}
            strokeWidth={2}
          />
        </div>

        {/* Label */}
        <p
          className="text-[11px] font-semibold uppercase tracking-widest mb-1 leading-none text-[hsl(var(--muted-foreground))]"
        >
          {card.title}
        </p>

        {/* Value */}
        <p
          className="text-[26px] font-extrabold leading-tight tracking-tight mb-3 text-[hsl(var(--foreground))]"
        >
          {card.value}
        </p>

        {/* Trend */}
        <div
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg"
          style={{
            background: trendConfig.bg,
          }}
        >
          <TrendIcon
            className="h-3 w-3 flex-shrink-0"
            style={{ color: trendConfig.color }}
          />
          <span
            className="text-[11px] font-bold"
            style={{ color: trendConfig.color }}
          >
            {card.change}
          </span>
          <span className="text-[11px] text-[hsl(var(--muted-foreground))]">
            {trendConfig.label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
