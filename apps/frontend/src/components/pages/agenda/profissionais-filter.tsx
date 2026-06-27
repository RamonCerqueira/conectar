"use client";

import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfissionalAgenda } from "@/types";

interface ProfissionaisFilterProps {
  profissionais: ProfissionalAgenda[];
  selectedProf: string;
  onSelectProf: (profId: string) => void;
  totalAgendamentos: number;
}

export function ProfissionaisFilter({
  profissionais,
  selectedProf,
  onSelectProf,
  totalAgendamentos,
}: ProfissionaisFilterProps) {
  return (
    <div
      className="p-5 rounded-2xl border bg-card space-y-4"
      style={{ borderColor: "hsl(var(--border))" }}
    >
      <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wide">
        <User className="h-4 w-4 text-purple-500" /> Filtro por Profissional
      </h3>
      <div className="space-y-2">
        <button
          onClick={() => onSelectProf("TODOS")}
          className={cn(
            "w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between",
            selectedProf === "TODOS"
              ? "gradient-primary text-white"
              : "bg-muted hover:bg-muted/80 text-muted-foreground"
          )}
        >
          <span>Todos os Profissionais</span>
          <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-md">
            {totalAgendamentos}
          </span>
        </button>

        {profissionais.map((prof) => (
          <button
            key={prof.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", JSON.stringify({ type: "professional", item: prof }));
            }}
            onClick={() => onSelectProf(prof.id)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-grab active:cursor-grabbing flex items-center gap-2 border border-transparent hover:border-purple-400/20",
              selectedProf === prof.id
                ? "text-white"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            )}
            style={{ backgroundColor: selectedProf === prof.id ? prof.cor : undefined }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: selectedProf === prof.id ? "white" : prof.cor }}
            />
            <div className="flex-1 min-w-0">
              <p className="truncate leading-none">{prof.nome}</p>
              <p
                className={cn(
                  "text-[9px] mt-0.5 font-medium",
                  selectedProf === prof.id ? "text-white/80" : "text-muted-foreground"
                )}
              >
                {prof.cargo}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
