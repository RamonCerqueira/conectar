"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, Smile, Zap, Coffee, ChevronDown, ChevronUp } from "lucide-react";
import { soundEffects } from "@/lib/sound-effects";
import { toast } from "sonner";

interface PortalMoodCheckinProps {
  childName: string;
}

const MOODS = [
  {
    id: "alegre",
    label: "Alegre",
    emoji: "🌟",
    bg: "#FFF9E6",
    border: "#FFE699",
    color: "#D97706",
    tip: "Dias alegres são fantásticos para estimular novas palavras e brincadeiras de troca de turno! 💜",
  },
  {
    id: "afeto",
    label: "Carinhoso(a)",
    emoji: "💖",
    bg: "#FFF0F3",
    border: "#FFCCD6",
    color: "#E11D48",
    tip: "Aproveite para criar momentos de conexão profunda, leitura compartilhada e abraço com pressão suave. 🌸",
  },
  {
    id: "calmo",
    label: "Focado(a)",
    emoji: "🧘",
    bg: "#EDFDF5",
    border: "#C2F7DA",
    color: "#10B981",
    tip: "Momento de ouro para atividades pedagógicas, quebra-cabeças e coordenação motora fina. 🌱",
  },
  {
    id: "agitado",
    label: "Agitado(a)",
    emoji: "⚡",
    bg: "#FFF4EB",
    border: "#FFD4B8",
    color: "#EA580C",
    tip: "Estimulação sensorial alta: ofereça atividades motoras grossas (pular na cama elástica, correr no parque) antes de tarefas paradas. 🏃",
  },
  {
    id: "cansado",
    label: "Sensível",
    emoji: "🥺",
    bg: "#F0F5FF",
    border: "#CFE0FF",
    color: "#2563EB",
    tip: "Dia de acolhimento: reduza o volume das conversas, diminua a luminosidade e priorize o descanso. 🛋️",
  },
];

export function PortalMoodCheckin({ childName }: PortalMoodCheckinProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [particles, setParticles] = useState<Array<{ id: number; char: string }>>([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const todayKey = `mood_${new Date().toISOString().slice(0, 10)}`;
      const saved = localStorage.getItem(todayKey);
      if (saved) setSelectedMood(saved);
    }
  }, []);

  const handleSelect = (mood: typeof MOODS[0]) => {
    soundEffects.playSparkle();
    setSelectedMood(mood.id);

    if (typeof window !== "undefined") {
      const todayKey = `mood_${new Date().toISOString().slice(0, 10)}`;
      localStorage.setItem(todayKey, mood.id);
    }

    // Partículas de emoção
    const newId = Date.now();
    setParticles((prev) => [...prev, { id: newId, char: mood.emoji }]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newId));
    }, 1000);

    toast.success(`Humor de ${childName} registrado!`, {
      description: mood.tip,
    });
  };

  const currentMoodObj = MOODS.find((m) => m.id === selectedMood);

  return (
    <div className="rounded-[16px] border border-[#EEE8FA] bg-[#FAF8FF]/95 p-3 shadow-2xs select-none relative overflow-hidden">
      {/* Topo do Widget: Título e Botão de Recolher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">🌈</span>
          <h3 className="text-[11.5px] font-extrabold text-[#29232F] leading-none">
            Como {childName.split(" ")[0]} está hoje?
          </h3>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-[#77717E] hover:text-[#8D5BD1] p-1 cursor-pointer transition-colors"
          title={collapsed ? "Expandir" : "Recolher"}
        >
          {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 space-y-2"
          >
            {/* 5 Botões de Emoção em Pastel */}
            <div className="grid grid-cols-5 gap-1.5 relative">
              {/* Partículas flutuantes ao clicar */}
              <AnimatePresence>
                {particles.map((p) => (
                  <motion.span
                    key={p.id}
                    initial={{ opacity: 1, scale: 0.8, y: 0 }}
                    animate={{ opacity: 0, scale: 1.6, y: -40 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute left-1/2 -translate-x-1/2 pointer-events-none text-xl z-20"
                  >
                    {p.char}
                  </motion.span>
                ))}
              </AnimatePresence>

              {MOODS.map((m) => {
                const isSelected = selectedMood === m.id;
                return (
                  <motion.button
                    key={m.id}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleSelect(m)}
                    className="flex flex-col items-center justify-center p-1.5 rounded-[12px] border transition-all cursor-pointer relative"
                    style={{
                      backgroundColor: isSelected ? m.bg : "#FFFFFF",
                      borderColor: isSelected ? m.border : "#EEE8FA",
                      boxShadow: isSelected ? "0 2px 8px rgba(141,91,209,0.12)" : "none",
                    }}
                    title={m.label}
                  >
                    <motion.span
                      animate={isSelected ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                      className="text-lg leading-none mb-1"
                    >
                      {m.emoji}
                    </motion.span>
                    <span
                      className="text-[8.5px] font-bold leading-none truncate max-w-full"
                      style={{ color: isSelected ? m.color : "#77717E" }}
                    >
                      {m.label}
                    </span>
                    {isSelected && (
                      <span
                        className="w-1 h-1 rounded-full mt-1"
                        style={{ backgroundColor: m.color }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Dica Clínica Multidisciplinar Imediata */}
            {currentMoodObj && (
              <motion.div
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2 rounded-xl text-[9.5px] leading-relaxed font-medium flex items-start gap-1.5 border"
                style={{
                  backgroundColor: currentMoodObj.bg,
                  borderColor: currentMoodObj.border,
                  color: currentMoodObj.color,
                }}
              >
                <Sparkles className="w-3 h-3 shrink-0 mt-0.5" />
                <p>
                  <strong>Dica Conectar:</strong> {currentMoodObj.tip}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
