"use client";

import { motion } from "framer-motion";
import { Cake, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Aniversariante } from "@/types";

interface AniversariantesListProps {
  aniversariantes: Aniversariante[];
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function AniversariantesList({ aniversariantes }: AniversariantesListProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="rounded-2xl border overflow-hidden"
      style={{
        background: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
      }}
    >
      <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
        <Cake className="h-4 w-4 text-pink-500" />
        <h2 className="font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>
          Aniversariantes Hoje
        </h2>
      </div>
      <div className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
        {aniversariantes.map((aniv) => (
          <div
            key={aniv.id}
            className="flex items-center gap-3 px-4 py-3"
            id={`aniversariante-${aniv.id}`}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                aniv.profissional
                  ? "bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300"
                  : "bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300"
              )}
            >
              {aniv.foto}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold" style={{ color: "hsl(var(--foreground))" }}>
                {aniv.nome}
              </p>
              <p className="text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>
                {aniv.profissional ? "Profissional" : `${aniv.idade} anos`}
              </p>
            </div>
            <button className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors">
              <Phone className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
