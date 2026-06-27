"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Users,
  ClipboardList,
  HeartHandshake,
  DollarSign,
  BookOpen,
  Phone,
  Mail,
  Activity,
  GraduationCap,
  Calendar,
  Sparkles,
  FileText,
} from "lucide-react";
import { cn, formatPhone, calculateAge, getInitials, formatDate } from "@/lib/utils";
import { Paciente } from "@/types";

interface PacienteDetailsDrawerProps {
  selectedPaciente: Paciente | null;
  onClose: () => void;
}

export function PacienteDetailsDrawer({ selectedPaciente, onClose }: PacienteDetailsDrawerProps) {
  const router = useRouter();
  const [activeProfileTab, setActiveProfileTab] = useState("dados");

  return (
    <AnimatePresence>
      {selectedPaciente && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs">
          {/* Fechar clicando fora */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-4xl h-full flex flex-col shadow-2xl border-l overflow-hidden"
            style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
          >
            {/* Header do Drawer */}
            <div className="p-6 border-b flex items-center justify-between gradient-primary text-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-xl shadow-inner text-white">
                  {getInitials(selectedPaciente.nome)}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedPaciente.nome}</h2>
                  <p className="text-xs text-purple-200">
                    ID: {selectedPaciente.id} • Nascimento: {formatDate(selectedPaciente.dataNascimento)} (
                    {calculateAge(selectedPaciente.dataNascimento)} anos)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    router.push(`/prontuarios?pacienteId=${selectedPaciente.id}`);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-purple-600 bg-white hover:bg-purple-50 transition-colors shadow cursor-pointer mr-1"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Iniciar Atendimento 360
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Abas */}
            <div className="flex border-b overflow-x-auto px-4 bg-muted/30">
              {[
                { id: "dados", label: "Dados Clínicos", icon: Users },
                { id: "prontuario", label: "Evoluções (Prontuário)", icon: ClipboardList },
                { id: "plano", label: "Plano Terapêutico", icon: HeartHandshake },
                { id: "financeiro", label: "Financeiro", icon: DollarSign },
                { id: "docs", label: "Exercícios & Docs", icon: BookOpen },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveProfileTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap",
                    activeProfileTab === tab.id
                      ? "border-purple-500 text-purple-600 dark:text-purple-400 bg-card"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Conteúdo da Aba */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* 1. DADOS CLÍNICOS E PESSOAIS */}
              {activeProfileTab === "dados" && (
                <div className="space-y-6">
                  {/* Responsáveis */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-purple-500 flex items-center gap-2 uppercase tracking-wide">
                      <Users className="h-4 w-4" />
                      Responsáveis Familiares
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedPaciente.responsaveis.map((resp) => (
                        <div
                          key={resp.id}
                          className="p-4 rounded-xl border space-y-2 relative"
                          style={{ background: "hsl(var(--muted)/0.3)", borderColor: "hsl(var(--border))" }}
                        >
                          {resp.isPrincipal && (
                            <span className="absolute top-3 right-3 text-[9px] font-bold bg-purple-500/10 text-purple-600 px-2 py-0.5 rounded-full">
                              Principal
                            </span>
                          )}
                          <p className="font-bold text-sm text-foreground">
                            {resp.nome} ({resp.grauParent})
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5" />
                            {formatPhone(resp.telefone || "")}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5" />
                            {resp.email || "E-mail não informado"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dados Clínicos Específicos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="font-bold text-sm text-purple-500 flex items-center gap-2 uppercase tracking-wide">
                        <Activity className="h-4 w-4" />
                        Informações Médicas
                      </h3>
                      <div
                        className="p-4 rounded-xl border space-y-3 text-xs"
                        style={{ borderColor: "hsl(var(--border))" }}
                      >
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Medicamento de uso contínuo:</span>
                          <span className="font-semibold text-foreground">
                            {selectedPaciente.medicamentos.join(", ") || "Nenhum"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Alergias conhecidas:</span>
                          <span className="font-semibold text-foreground">
                            {selectedPaciente.alergias.join(", ") || "Nenhuma"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Neurologista Infantil:</span>
                          <span className="font-semibold text-foreground">
                            {selectedPaciente.medicosRef.neurologista || "Não informado"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-muted-foreground">Notas Médicas:</span>
                          <p className="p-2 rounded bg-muted/50 italic text-muted-foreground">
                            {selectedPaciente.observacoesMed || "Nenhuma observação clínica extra."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-bold text-sm text-purple-500 flex items-center gap-2 uppercase tracking-wide">
                        <GraduationCap className="h-4 w-4" />
                        Ambiente Escolar
                      </h3>
                      <div
                        className="p-4 rounded-xl border space-y-3 text-xs"
                        style={{ borderColor: "hsl(var(--border))" }}
                      >
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Escola:</span>
                          <span className="font-semibold text-foreground">{selectedPaciente.escola || "Não informada"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Série:</span>
                          <span className="font-semibold text-foreground">{selectedPaciente.serie || "Não informada"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Turno:</span>
                          <span className="font-semibold text-foreground">{selectedPaciente.turnoEscolar || "Não informado"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Coordenação:</span>
                          <span className="font-semibold text-foreground">{selectedPaciente.coordenador || "Não informada"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. EVOLUÇÕES (PRONTUÁRIO) */}
              {activeProfileTab === "prontuario" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-purple-500 flex items-center gap-2 uppercase tracking-wide">
                      <ClipboardList className="h-4 w-4" />
                      Histórico de Atendimentos
                    </h3>
                    <span className="text-xs text-muted-foreground">Ordenado cronologicamente</span>
                  </div>

                  <div className="space-y-4 relative pl-4 border-l-2 border-purple-500/20">
                    {selectedPaciente.prontuario.map((pront) => (
                      <div key={pront.id} className="relative space-y-1.5 p-4 rounded-xl border bg-card">
                        {/* Marcador na linha do tempo */}
                        <div className="absolute -left-[23px] top-5 w-2.5 h-2.5 rounded-full bg-purple-500 border border-card" />

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                            {pront.profissional}
                          </span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(pront.data)}
                          </span>
                        </div>
                        <p className="text-xs text-foreground leading-relaxed">
                          {pront.observacoes}
                        </p>
                      </div>
                    ))}

                    {selectedPaciente.prontuario.length === 0 && (
                      <div className="py-6 text-center text-xs text-muted-foreground">
                        Nenhuma evolução registrada para este paciente ainda.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3. PLANO TERAPÊUTICO */}
              {activeProfileTab === "plano" && (
                <div className="space-y-6">
                  {selectedPaciente.planosTerapeuticos.map((plano) => (
                    <div key={plano.id} className="space-y-4">
                      <div className="p-4 rounded-xl border bg-muted/20" style={{ borderColor: "hsl(var(--border))" }}>
                        <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-purple-500" />
                          {plano.titulo}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {plano.descricao}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h5 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                          Metas Estabelecidas
                        </h5>
                        {plano.metas.map((meta) => (
                          <div key={meta.id} className="p-4 rounded-xl border space-y-2 bg-card">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-foreground">{meta.objetivo}</span>
                              <span className="font-bold text-purple-600 dark:text-purple-400">{meta.progresso}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full bg-purple-500 rounded-full"
                                style={{ width: `${meta.progresso}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {selectedPaciente.planosTerapeuticos.length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                      <HeartHandshake className="h-10 w-10 text-muted-foreground/30 mb-2" />
                      <h4 className="font-bold text-sm text-foreground">Sem Plano Terapêutico Ativo</h4>
                      <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                        Inicie um planejamento clínico personalizado com metas focadas na evolução deste paciente.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 4. FINANCEIRO */}
              {activeProfileTab === "financeiro" && (
                <div className="space-y-4">
                  <h3 className="font-bold text-sm text-purple-500 flex items-center gap-2 uppercase tracking-wide">
                    <DollarSign className="h-4 w-4" />
                    Lançamentos Financeiros
                  </h3>

                  <div className="overflow-hidden border rounded-xl">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="bg-muted/50 border-b text-muted-foreground font-semibold">
                          <th className="p-3">Descrição</th>
                          <th className="p-3">Vencimento</th>
                          <th className="p-3">Valor</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {selectedPaciente.financeiro.map((lanc) => (
                          <tr key={lanc.id} className="hover:bg-muted/10 transition-colors">
                            <td className="p-3 font-medium text-foreground">{lanc.descricao}</td>
                            <td className="p-3 text-muted-foreground">{formatDate(lanc.vencimento)}</td>
                            <td className="p-3 font-semibold text-foreground">R$ {lanc.valor.toFixed(2)}</td>
                            <td className="p-3">
                              <span
                                className={cn(
                                  "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                  lanc.status === "PAGO" && "bg-emerald-500/10 text-emerald-500",
                                  lanc.status === "PENDENTE" && "bg-amber-500/10 text-amber-500"
                                )}
                              >
                                {lanc.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {selectedPaciente.financeiro.length === 0 && (
                      <div className="py-6 text-center text-xs text-muted-foreground">
                        Nenhum lançamento financeiro registrado.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 5. EXERCÍCIOS E DOCUMENTOS */}
              {activeProfileTab === "docs" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Documentos */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-purple-500 flex items-center gap-2 uppercase tracking-wide">
                      <FileText className="h-4 w-4" />
                      Documentos Anexados
                    </h4>
                    <div className="space-y-2">
                      {selectedPaciente.documentos.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-3 rounded-xl border flex items-center justify-between text-xs bg-card"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="h-4 w-4 text-purple-500 shrink-0" />
                            <span className="font-medium text-foreground truncate">{doc.nome}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground">{formatDate(doc.data)}</span>
                        </div>
                      ))}
                      {selectedPaciente.documentos.length === 0 && (
                        <div className="text-xs text-muted-foreground italic py-2">
                          Nenhum arquivo digitalizado ou contrato anexado.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Exercícios para Casa */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-purple-500 flex items-center gap-2 uppercase tracking-wide">
                      <BookOpen className="h-4 w-4" />
                      Atividades para Casa
                    </h4>
                    <div className="space-y-2">
                      {selectedPaciente.exercicios.map((ex) => (
                        <div
                          key={ex.id}
                          className="p-3 rounded-xl border flex items-center justify-between text-xs bg-card"
                        >
                          <div>
                            <p className="font-medium text-foreground">{ex.titulo}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Tipo: {ex.tipo}</p>
                          </div>
                          <span
                            className={cn(
                              "text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider",
                              ex.realizado === true && "bg-emerald-500/10 text-emerald-500",
                              ex.realizado === null && "bg-muted text-muted-foreground"
                            )}
                          >
                            {ex.realizado === true ? "Realizado" : "Pendente"}
                          </span>
                        </div>
                      ))}
                      {selectedPaciente.exercicios.length === 0 && (
                        <div className="text-xs text-muted-foreground italic py-2">
                          Nenhuma atividade escolar ou domiciliar cadastrada.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
