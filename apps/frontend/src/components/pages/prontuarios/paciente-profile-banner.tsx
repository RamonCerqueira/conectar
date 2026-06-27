"use client";

import { cn, getInitials, formatDate } from "@/lib/utils";

interface PacienteProfileBannerProps {
  paciente: any;
  prontuarios: any[];
}

export function PacienteProfileBanner({ paciente, prontuarios }: PacienteProfileBannerProps) {
  if (!paciente) return null;

  // Rich metadata builder
  const responsavel = paciente.responsaveis?.[0]?.nome || paciente.responsavel || "Não informado";
  
  // Find last prontuario date and staff
  let ultimaConsulta = paciente.ultimaConsulta || "—";
  let ultimoProfissional = paciente.ultimoProfissional || "—";
  const patientPronts = prontuarios.filter(pr => pr.pacienteId === paciente.id);
  if (patientPronts.length > 0) {
    const sorted = [...patientPronts].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    ultimaConsulta = formatDate(sorted[0].data);
    ultimoProfissional = sorted[0].profissional.split(" (")[0]; // Clean title
  }

  const proximaConsulta = paciente.proximaConsulta || (paciente.id === "pac-1" ? "01/07/2026" : "02/07/2026");
  const statusFinanceiro = paciente.statusFinanceiro || "PAGO";

  return (
    <div className="p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm bg-card border-border">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-2xl shadow-inner shrink-0">
          {getInitials(paciente.nome)}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold tracking-tight text-foreground">{paciente.nome}</h2>
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full border",
              paciente.status === "ATIVO" 
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                : "bg-amber-500/10 text-amber-600 border-amber-500/20"
            )}>
              {paciente.status}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap font-medium">
            <span>{paciente.idade} anos</span>
            <span>•</span>
            <span className="capitalize">Gênero: {paciente.sexo.toLowerCase()}</span>
            <span>•</span>
            {paciente.diagnosticos?.map((d: any) => (
              <span key={d.id} className="bg-purple-500/10 text-purple-600 dark:text-purple-300 px-1.5 py-0.5 rounded text-[10px] font-bold border border-purple-500/10">
                {d.descricao}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Quick indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-x-6 gap-y-4 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-border">
        
        <div>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Responsável</p>
          <p className="text-xs font-bold text-foreground mt-0.5 truncate max-w-[120px]" title={responsavel}>{responsavel}</p>
        </div>

        <div>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Última Consulta</p>
          <p className="text-xs font-bold text-foreground mt-0.5">{ultimaConsulta}</p>
        </div>

        <div>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Profissional</p>
          <p className="text-xs font-bold text-foreground mt-0.5 truncate max-w-[100px]" title={ultimoProfissional}>{ultimoProfissional}</p>
        </div>

        <div>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Próxima Consulta</p>
          <p className="text-xs font-bold text-foreground mt-0.5">{proximaConsulta}</p>
        </div>

        <div>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Status Financeiro</p>
          <div className="mt-1">
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-md border",
              statusFinanceiro === "PAGO"
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                : "bg-red-500/10 text-red-600 border-red-500/20"
            )}>
              {statusFinanceiro}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
