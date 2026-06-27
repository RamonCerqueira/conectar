"use client";

import { motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Consulta } from "@/types";

interface ConsultasListProps {
  consultas: Consulta[];
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function ConsultasList({ consultas }: ConsultasListProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="xl:col-span-2 rounded-2xl border overflow-hidden"
      style={{
        background: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
      }}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
        <div className="flex items-center gap-2">
          <CalendarCheck className="h-4 w-4 text-violet-500" />
          <h2 className="font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>
            Próximas Consultas
          </h2>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-500">
            HOJE
          </span>
        </div>
        <button className="text-xs font-medium text-violet-500 hover:text-violet-400 transition-colors">
          Ver agenda completa →
        </button>
      </div>
      <div className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
        {consultas.map((consulta, i) => (
          <motion.div
            key={consulta.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 px-5 py-3.5 hover:bg-[hsl(var(--muted)/0.5)] transition-colors"
            id={`consulta-item-${consulta.id}`}
          >
            {/* Horário */}
            <div className="text-center w-12 shrink-0">
              <p className="text-sm font-bold" style={{ color: "hsl(var(--foreground))" }}>
                {consulta.horario}
              </p>
            </div>

            {/* Avatar Paciente */}
            <div className="w-9 h-9 rounded-full bg-primary/20 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 flex items-center justify-center text-xs font-bold shrink-0">
              {consulta.foto}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: "hsl(var(--foreground))" }}>
                {consulta.paciente}
              </p>
              <p className="text-xs truncate" style={{ color: "hsl(var(--muted-foreground))" }}>
                {consulta.profissional} · {consulta.especialidade}
              </p>
            </div>

            {/* Sala */}
            <div className="hidden md:block text-right shrink-0">
              <p className="text-xs font-medium" style={{ color: "hsl(var(--foreground))" }}>
                {consulta.sala}
              </p>
              <p className="text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>
                {consulta.tipo}
              </p>
            </div>

            {/* Status */}
            <div className="shrink-0">
              <span
                className={cn(
                  "text-[10px] font-semibold px-2 py-1 rounded-full",
                  consulta.status === "confirmado" || consulta.status === "presente"
                    ? "bg-emerald-500/15 text-emerald-500"
                    : "bg-amber-500/15 text-amber-500"
                )}
              >
                {consulta.status === "confirmado" || consulta.status === "presente" ? "Confirmado" : "Aguardando"}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
