"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alerta } from "@/types";

interface AlertasListProps {
  alertas: Alerta[];
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function AlertasList({ alertas }: AlertasListProps) {
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
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <h2 className="font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>
          Alertas
        </h2>
      </div>
      <div className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
        {alertas.map((alerta) => {
          const IconComponent = alerta.icon;
          return (
            <div
              key={alerta.id}
              className="flex items-start gap-3 px-4 py-3 hover:bg-[hsl(var(--muted)/0.5)] transition-colors"
              id={`alerta-${alerta.id}`}
            >
              <IconComponent
                className={cn(
                  "h-4 w-4 mt-0.5 shrink-0",
                  alerta.tipo === "warning" && "text-amber-500",
                  alerta.tipo === "info" && "text-blue-500",
                  alerta.tipo === "success" && "text-emerald-500",
                  alerta.tipo === "error" && "text-red-500"
                )}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs leading-snug" style={{ color: "hsl(var(--foreground))" }}>
                  {alerta.mensagem}
                </p>
                <button className="text-[10px] font-medium text-violet-500 hover:text-violet-400 mt-0.5 text-left">
                  {alerta.acao}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
