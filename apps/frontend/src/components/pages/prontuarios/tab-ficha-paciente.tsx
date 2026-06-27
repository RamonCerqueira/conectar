"use client";

import { User, GraduationCap, MapPin, Activity, Sparkles, MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface TabFichaPacienteProps {
  paciente: any;
}

export function TabFichaPaciente({ paciente }: TabFichaPacienteProps) {
  if (!paciente) return null;

  return (
    <div className="space-y-6 text-xs text-left animate-in fade-in duration-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Box 1: Pessoais */}
        <div className="p-5 rounded-2xl border bg-card space-y-4 shadow-sm border-border">
          <h4 className="font-bold text-xs uppercase tracking-wider text-purple-500 flex items-center gap-1.5">
            <User className="h-4 w-4" /> Informações Básicas
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] text-muted-foreground">Nome Completo</p>
              <p className="font-semibold text-foreground text-sm">{paciente.nome}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[10px] text-muted-foreground">Data Nasc.</p>
                <p className="font-semibold text-foreground font-mono">{formatDate(paciente.dataNascimento)}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">CPF</p>
                <p className="font-semibold text-foreground font-mono">{paciente.cpf || "—"}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Gênero</p>
              <p className="font-semibold text-foreground capitalize">{paciente.sexo?.toLowerCase() || "—"}</p>
            </div>
          </div>
        </div>

        {/* Box 2: Escola */}
        <div className="p-5 rounded-2xl border bg-card space-y-4 shadow-sm border-border">
          <h4 className="font-bold text-xs uppercase tracking-wider text-purple-500 flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4" /> Rotina Escolar
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] text-muted-foreground">Escola</p>
              <p className="font-semibold text-foreground">{paciente.escola || "—"}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[10px] text-muted-foreground">Série / Ano</p>
                <p className="font-semibold text-foreground">{paciente.serie || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Turno Escolar</p>
                <p className="font-semibold text-foreground">{paciente.turnoEscolar || "—"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[10px] text-muted-foreground">Professor(a)</p>
                <p className="font-semibold text-foreground">{paciente.nomeProf || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Coordenador(a)</p>
                <p className="font-semibold text-foreground">{paciente.coordenador || "—"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Box 3: Endereço */}
        <div className="p-5 rounded-2xl border bg-card space-y-4 shadow-sm border-border">
          <h4 className="font-bold text-xs uppercase tracking-wider text-purple-500 flex items-center gap-1.5">
            <MapPin className="h-4 w-4" /> Endereço Residencial
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] text-muted-foreground">Logradouro / CEP</p>
              <p className="font-semibold text-foreground">
                {paciente.logradouro ? `${paciente.logradouro}, ${paciente.numero}` : "—"}
                {paciente.cep && ` (${paciente.cep})`}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[10px] text-muted-foreground">Bairro</p>
                <p className="font-semibold text-foreground">{paciente.bairro || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Cidade / UF</p>
                <p className="font-semibold text-foreground">
                  {paciente.cidade ? `${paciente.cidade} - ${paciente.estado}` : "—"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Complemento</p>
              <p className="font-semibold text-foreground">{paciente.complemento || "—"}</p>
            </div>
          </div>
        </div>

        {/* Box 4: Clinical */}
        <div className="p-5 rounded-2xl border bg-card space-y-4 shadow-sm md:col-span-2 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 border-border">
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-purple-500 flex items-center gap-1.5">
              <Activity className="h-4 w-4" /> Perfil Clínico & Comportamento
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-muted-foreground">Alergias Alimentares / Meds</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {paciente.alergias && paciente.alergias.length > 0 ? (
                    paciente.alergias.map((a: string) => (
                      <span key={a} className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-500/10 text-red-600 border border-red-500/10">{a}</span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground italic">Nenhuma registrada</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Medicações contínuas</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {paciente.medicamentos && paciente.medicamentos.length > 0 ? (
                    paciente.medicamentos.map((m: string) => (
                      <span key={m} className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/10">{m}</span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground italic">Nenhuma medicação listada</span>
                  )}
                </div>
              </div>
              <div className="bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
                <p className="text-[9px] font-bold text-amber-600 uppercase tracking-wider mb-1">⚠️ Sensibilidade Sensorial</p>
                <p className="text-xs text-foreground/80 leading-relaxed">{paciente.sensibilidadeSensorial || "Nenhuma sensibilidade informada."}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-6 md:mt-0">
            <h4 className="font-bold text-xs uppercase tracking-wider text-purple-500 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> Interesses & Notas
            </h4>
            <div className="space-y-3">
              <div className="bg-teal-500/5 p-3 rounded-xl border border-teal-500/10">
                <p className="text-[9px] font-bold text-teal-600 uppercase tracking-wider mb-1">🎯 Hiperfoco / Área de interesse</p>
                <p className="text-xs text-foreground/80 leading-relaxed">{paciente.hiperfoco || "Nenhum hiperfoco listado."}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Observações Médicas / Gerais</p>
                <p className="text-xs text-foreground/80 mt-1 leading-relaxed">{paciente.observacoes || "Nenhuma observação geral."}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Box 5: Contact */}
        <div className="p-5 rounded-2xl border bg-card space-y-4 shadow-sm border-border">
          <h4 className="font-bold text-xs uppercase tracking-wider text-purple-500 flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4" /> Responsável & Contatos
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] text-muted-foreground">Nome Completo</p>
              <p className="font-semibold text-foreground">{paciente.responsaveis?.[0]?.nome || "—"}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[10px] text-muted-foreground">Vínculo / Parentesco</p>
                <p className="font-semibold text-foreground">{paciente.responsaveis?.[0]?.grauParent || "MAE"}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">WhatsApp / Tel</p>
                <p className="font-semibold text-foreground font-mono">{paciente.responsaveis?.[0]?.telefone || "—"}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">E-mail</p>
              <p className="font-semibold text-foreground">{paciente.responsaveis?.[0]?.email || "—"}</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
