"use client";

import { motion } from "framer-motion";
import { Mail, Clock, Layers } from "lucide-react";
import { getInitials, cn } from "@/lib/utils";
import { Profissional } from "@/types";

interface ProfissionalCardProps {
  prof: Profissional;
  onSelectProf: (prof: Profissional) => void;
}

export function ProfissionalCard({ prof, onSelectProf }: ProfissionalCardProps) {
  const specialtiesList = (prof.especialidades && prof.especialidades.length > 0)
    ? prof.especialidades
    : (prof.especialidade ? prof.especialidade.split(", ") : []);

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className="rounded-2xl border p-5 flex flex-col justify-between relative overflow-hidden transition-all shadow-sm bg-card hover:shadow-md"
      style={{ borderColor: "hsl(var(--border))" }}
    >
      {/* Regime de Contratação Badge absolute no topo direito */}
      {prof.tipoContrato && (
        <span
          className={cn(
            "absolute top-4 right-4 text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider shrink-0",
            prof.tipoContrato === "CLT"
              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
              : prof.tipoContrato === "PJ"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : prof.tipoContrato === "COMISSAO"
              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
          )}
        >
          {prof.tipoContrato === "PJ" ? "PJ" : prof.tipoContrato}
        </span>
      )}

      {/* Top Info com cor do Profissional */}
      <div className="flex items-start gap-4 pr-12">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg text-white shadow-md shrink-0"
          style={{ backgroundColor: prof.cor }}
        >
          {getInitials(prof.nome)}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-base leading-tight truncate text-[hsl(var(--foreground))]">
            {prof.nome}
          </h3>
          <p className="text-xs font-semibold mt-1" style={{ color: prof.cor }}>
            {prof.tipo.replace("_", " ")}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {prof.orgaoRegistro} {prof.registro}
          </p>
        </div>
      </div>

      {/* Divisor */}
      <div className="h-[1px] bg-border my-4" />

      {/* Resumo e Detalhes */}
      <div className="space-y-3.5 text-xs flex-1">
        
        {/* Chips de Especialidades (até 3) */}
        {specialtiesList.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {specialtiesList.slice(0, 3).map((esp, i) => (
              <span
                key={i}
                className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-500/5 text-purple-600 dark:text-purple-400 border border-purple-500/10"
              >
                {esp}
              </span>
            ))}
            {specialtiesList.length > 3 && (
              <span className="text-[10px] text-muted-foreground font-semibold px-1 py-0.5">
                +{specialtiesList.length - 3}
              </span>
            )}
          </div>
        )}

        <p className="text-muted-foreground italic leading-relaxed line-clamp-2">
          "{prof.bio || "Nenhuma apresentação definida."}"
        </p>

        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Layers className="h-3.5 w-3.5" />
            <span className="truncate text-foreground font-medium">
              {prof.salas && prof.salas.length > 0 ? prof.salas.join(", ") : "Nenhuma sala vinculada"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="truncate text-foreground font-medium">
              {prof.horarios ? Object.keys(prof.horarios).length : 0} dias na semana
            </span>
          </div>
        </div>
      </div>

      {/* Divisor */}
      <div className="h-[1px] bg-border my-4" />

      {/* Botões de Ação */}
      <div className="flex gap-2">
        <button
          onClick={() => onSelectProf(prof)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
          style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
        >
          <Clock className="h-3.5 w-3.5 text-purple-500" />
          Ver Escala & Contrato
        </button>

        <a
          href={`mailto:${prof.email}`}
          className="flex items-center justify-center p-2.5 rounded-xl border hover:bg-purple-500/10 hover:border-purple-500 transition-colors text-purple-500"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <Mail className="h-4 w-4" />
        </a>
      </div>
    </motion.div>
  );
}
