"use client";

import { Clock } from "lucide-react";
import { WaitItem } from "@/types";

interface WaitListProps {
  waitList: WaitItem[];
  onAllocate?: (item: WaitItem) => void;
}

export function WaitList({ waitList, onAllocate }: WaitListProps) {
  return (
    <div
      className="p-5 rounded-2xl border bg-card flex-1 flex flex-col space-y-4 min-h-[300px]"
      style={{ borderColor: "hsl(var(--border))" }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wide">
          <Clock className="h-4 w-4 text-purple-500" /> Fila de Espera
        </h3>
        <span className="bg-amber-500/10 text-amber-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
          {waitList.length} Clínicas
        </span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {waitList.map((wait) => (
          <div
            key={wait.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", JSON.stringify({ type: "patient", item: wait }));
            }}
            className="p-3.5 rounded-xl border bg-muted/30 hover:bg-muted/50 hover:border-purple-400/50 transition-all space-y-2 text-xs relative overflow-hidden cursor-grab active:cursor-grabbing"
          >
            <div className="absolute top-0 right-0 w-1 h-full bg-amber-400" />
            <div className="flex items-center justify-between">
              <p className="font-bold text-foreground">{wait.nome}</p>
              <span className="text-[10px] text-muted-foreground">{wait.desde}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">{wait.especialidade}</p>
            <button
              onClick={() => onAllocate?.(wait)}
              className="w-full mt-2 py-1 rounded bg-purple-500 text-white font-semibold text-[10px] uppercase hover:bg-purple-600 transition-colors cursor-pointer"
            >
              Alocar Horário
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
