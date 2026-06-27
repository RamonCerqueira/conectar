"use client";

import { motion } from "framer-motion";
import { Edit2, Calendar } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { Meta } from "@/types";

interface PlanoCardProps {
  meta: Meta;
  onUpdateProgresso: (metaId: string, currentProgresso: number) => void;
  onSelectMeta: (meta: Meta) => void;
}

export function PlanoCard({ meta, onUpdateProgresso, onSelectMeta }: PlanoCardProps) {
  return (
    <motion.div
      layout
      className="p-5 rounded-2xl border bg-card space-y-4 shadow-xs"
      style={{ borderColor: "hsl(var(--border))" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm text-foreground">{meta.objetivo}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{meta.descricao}</p>
        </div>
        <span
          className={cn(
            "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0",
            meta.status === "CONCLUIDO"
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-purple-500/10 text-purple-500"
          )}
        >
          {meta.status.replace("_", " ")}
        </span>
      </div>

      {/* Barra de Progresso */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> Prazo: {formatDate(meta.prazo)}
          </span>
          <span className="font-bold text-purple-600 dark:text-purple-400">{meta.progresso}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${meta.progresso}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onUpdateProgresso(meta.id, meta.progresso)}
          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
          style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
        >
          <Edit2 className="h-3.5 w-3.5 text-purple-500" />
          Atualizar Progresso
        </button>

        <button
          onClick={() => onSelectMeta(meta)}
          className="px-4 py-2 rounded-lg border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
          style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
        >
          Histórico
        </button>
      </div>
    </motion.div>
  );
}
