"use client";

import { motion } from "framer-motion";
import { Building2, Clock, Eye, Trash2, CheckCircle, AlertCircle, Wrench } from "lucide-react";

interface SalaCardProps {
  sala: any;
  onViewDetails: (sala: any) => void;
  onDelete: (id: string) => void;
}

export function SalaCard({ sala, onViewDetails, onDelete }: SalaCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DISPONIVEL":
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full uppercase tracking-wider">
            <CheckCircle className="h-3 w-3" /> Disponível
          </span>
        );
      case "OCUPADA":
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full uppercase tracking-wider">
            <AlertCircle className="h-3 w-3" /> Ocupada
          </span>
        );
      case "MANUTENCAO":
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full uppercase tracking-wider">
            <Wrench className="h-3 w-3" /> Manutenção
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-full uppercase tracking-wider">
            Bloqueada
          </span>
        );
    }
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className="rounded-2xl border p-5 flex flex-col justify-between relative overflow-hidden transition-all shadow-sm bg-card text-left"
      style={{ borderColor: "hsl(var(--border))" }}
    >
      {/* Status Top Right */}
      <div className="absolute top-4 right-4">{getStatusBadge(sala.status)}</div>

      {/* Nome/Design */}
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md shrink-0"
          style={{ backgroundColor: sala.cor }}
        >
          <Building2 className="h-5 w-5" />
        </div>
        <div className="min-w-0 pr-16">
          <h3 className="font-bold text-base leading-tight truncate text-foreground">
            {sala.nome}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Capacidade: {sala.capacidade} {sala.capacidade === 1 ? "criança" : "crianças"}
          </p>
        </div>
      </div>

      {/* Divisor */}
      <div className="h-[1px] bg-border my-4" />

      {/* Descrição */}
      <p className="text-xs text-muted-foreground leading-relaxed flex-1 line-clamp-3 mb-4 min-h-[48px]">
        {sala.descricao || "Sem descrição disponível."}
      </p>

      {/* Ocupação Hoje */}
      <div className="bg-muted/40 p-3 rounded-xl space-y-2 mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-sans">
          <Clock className="h-3.5 w-3.5 text-purple-500" />
          Ocupação de Hoje
        </span>
        <div className="space-y-1">
          {sala.agendaHoje && sala.agendaHoje.slice(0, 2).map((agenda: any) => (
            <div key={agenda.id} className="text-[11px] flex justify-between">
              <span className="font-medium text-foreground">
                {agenda.horario} — {agenda.paciente}
              </span>
              <span className="text-muted-foreground font-mono text-[10px]">{agenda.profissional}</span>
            </div>
          ))}
          {sala.agendaHoje && sala.agendaHoje.length > 2 && (
            <p className="text-[10px] text-purple-500 font-bold mt-1">
              + {sala.agendaHoje.length - 2} outros atendimentos
            </p>
          )}
          {(!sala.agendaHoje || sala.agendaHoje.length === 0) && (
            <p className="text-[11px] text-muted-foreground italic">Sem atendimentos hoje</p>
          )}
        </div>
      </div>

      {/* Divisor */}
      <div className="h-[1px] bg-border my-4" />

      {/* Botões */}
      <div className="flex gap-2">
        <button
          onClick={() => onViewDetails(sala)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer border-border text-foreground bg-transparent"
        >
          <Eye className="h-3.5 w-3.5 text-purple-500" />
          Visualizar Detalhes
        </button>

        <button
          onClick={() => onDelete(sala.id)}
          className="p-2.5 rounded-xl border border-red-500/10 hover:bg-red-500/10 text-red-500 transition-colors cursor-pointer bg-transparent"
          title="Excluir Sala"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
