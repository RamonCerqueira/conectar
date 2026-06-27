"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, ClipboardList, MessageSquare } from "lucide-react";
import { cn, calculateAge, getInitials, formatDate } from "@/lib/utils";
import { Paciente } from "@/types";

interface PacienteCardProps {
  paciente: Paciente;
  onViewDetails: (paciente: Paciente) => void;
}

export function PacienteCard({ paciente, onViewDetails }: PacienteCardProps) {
  const principalResp = paciente.responsaveis.find((r) => r.isPrincipal);

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className="rounded-2xl border p-5 flex flex-col justify-between relative overflow-hidden transition-all shadow-sm"
      style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
    >
      {/* Tag Status */}
      <div className="absolute top-4 right-4">
        <span
          className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
            paciente.status === "ATIVO" && "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
            paciente.status === "LISTA_ESPERA" && "bg-amber-500/10 text-amber-500 dark:text-amber-400",
            paciente.status === "ALTA" && "bg-blue-500/10 text-blue-500 dark:text-blue-400"
          )}
        >
          {paciente.status.replace("_", " ")}
        </span>
      </div>

      {/* Cabeçalho do Card */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl gradient-primary text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
          {getInitials(paciente.nome)}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-base text-[hsl(var(--foreground))] leading-tight truncate">
            {paciente.nome}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {calculateAge(paciente.dataNascimento)} anos • Nascimento: {formatDate(paciente.dataNascimento)}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {paciente.diagnosticos.map((diag) => (
              <span
                key={diag.id}
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-300"
              >
                {diag.descricao}
              </span>
            ))}
            {paciente.diagnosticos.length === 0 && (
              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">
                Sem diagnóstico
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Divisor */}
      <div className="h-[1px] bg-border my-4" />

      {/* Responsável e Contato */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5" />
            Responsável:
          </span>
          <span className="font-semibold text-foreground truncate max-w-[150px]">
            {principalResp?.nome || "Não informado"}
          </span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5" />
            Escola:
          </span>
          <span className="font-medium text-foreground truncate max-w-[150px]">
            {paciente.escola || "Não informada"}
          </span>
        </div>
      </div>

      {/* Divisor */}
      <div className="h-[1px] bg-border my-4" />

      {/* Ações */}
      <div className="flex gap-2">
        <button
          onClick={() => onViewDetails(paciente)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold transition-colors hover:bg-muted cursor-pointer"
          style={{ color: "hsl(var(--foreground))", borderColor: "hsl(var(--border))" }}
        >
          <ClipboardList className="h-3.5 w-3.5 text-purple-500" />
          Ver Prontuário
        </button>

        {principalResp?.whatsapp && (
          <a
            href={`https://wa.me/${principalResp.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-2.5 rounded-xl border transition-colors hover:bg-emerald-500/10 hover:border-emerald-500 text-emerald-500"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <MessageSquare className="h-4 w-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
}
