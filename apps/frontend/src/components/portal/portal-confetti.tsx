"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  char: string;
}

interface PortalConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

const SHAPES = ["✨", "💖", "⭐", "🎉", "💜", "🌱", "🌟"];
const COLORS = ["#8D5BD1", "#F58A7E", "#10B981", "#F3A43B", "#0284C7", "#E8DEFF"];

export function PortalConfetti({ active, onComplete }: PortalConfettiProps) {
  if (!active) return null;

  const particles: Particle[] = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 260,
    y: -Math.random() * 280 - 40,
    rotation: (Math.random() - 0.5) * 720,
    scale: Math.random() * 0.7 + 0.7,
    color: COLORS[i % COLORS.length],
    char: SHAPES[i % SHAPES.length],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
      <AnimatePresence onExitComplete={onComplete}>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0.2, rotate: 0 }}
            animate={{
              opacity: [1, 1, 0],
              x: p.x,
              y: p.y,
              scale: p.scale,
              rotate: p.rotation,
            }}
            transition={{
              duration: 1.4,
              ease: [0.25, 1, 0.5, 1],
            }}
            className="absolute text-lg select-none"
            style={{ color: p.color }}
          >
            {p.char}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
