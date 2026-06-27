"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, X, Clock, Layers, Mail, Award, BookOpen, MapPin, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ProfissionalCard } from "./profissionais/profissional-card";
import { ProfissionalModal } from "./profissionais/profissional-modal";
import { Profissional } from "@/types";


const renderContractBadge = (tipo?: string) => {
  if (!tipo) return null;
  const colors: Record<string, string> = {
    CLT: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    PJ: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    COMISSAO: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    SOCIO: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  };
  const label: Record<string, string> = {
    CLT: "CLT",
    PJ: "Prestador (PJ)",
    COMISSAO: "Comissão / Repasse",
    SOCIO: "Sócio Clínico",
  };
  return (
    <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold border shrink-0", colors[tipo] || "bg-muted text-muted-foreground border-border")}>
      {label[tipo] || tipo}
    </span>
  );
};

export function ProfissionaisPage() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSpecialty, setActiveSpecialty] = useState("TODOS");
  const [selectedProf, setSelectedProf] = useState<Profissional | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const loadProfissionais = async () => {
    setLoading(true);
    try {
      const res = await api.get("/profissionais");
      const data = res.data || [];
      const mapped = data.map((p: any) => {
        const nome = p.usuario?.nome || p.nome || "Profissional";
        const email = p.usuario?.email || p.email || "";
        return {
          id: p.id,
          nome,
          email,
          tipo: p.tipo || "OUTRO",
          especialidade: p.especialidade || "Terapeuta",
          registro: p.registro || "",
          orgaoRegistro: p.orgaoRegistro || "",
          bio: p.bio || "",
          cor: p.cor || "#8E7BBE",
          ativo: p.ativo !== undefined ? p.ativo : true,
          telefone: p.telefone || "",
          salas: p.salas || ["Sala Comum"],
          horarios: p.horariosTrabalho || { segunda: "08:00 - 18:00" },
          cpfCnpj: p.cpfCnpj || "",
          tipoContrato: p.tipoContrato || "PJ",
          cargaHoraria: p.cargaHoraria || "30h",
          salarioBase: p.salarioBase || undefined,
          comissaoPorcentagem: p.comissaoPorcentagem || undefined,
          chavePix: p.chavePix || "",
          especialidades: p.especialidades || (p.especialidade ? p.especialidade.split(", ") : []),
          formacao: p.formacao || "",
          cep: p.cep || "",
          logradouro: p.logradouro || "",
          numero: p.numero || "",
          complemento: p.complemento || "",
          bairro: p.bairro || "",
          cidade: p.cidade || "",
          uf: p.uf || "",
        };
      });
      setProfissionais(mapped);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar profissionais do servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfissionais();
  }, []);

  const handleCreateProf = async (data: {
    nome: string;
    email: string;
    tipo: string;
    especialidade: string;
    registro: string;
    orgaoRegistro: string;
    telefone: string;
    cor: string;
    bio: string;
    cpfCnpj?: string;
    tipoContrato?: string;
    cargaHoraria?: string;
    salarioBase?: number;
    comissaoPorcentagem?: number;
    chavePix?: string;
    especialidades?: string[];
    formacao?: string;
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
  }) => {
    const payload = {
      nome: data.nome,
      email: data.email,
      tipo: data.tipo,
      especialidade: data.especialidade,
      registro: data.registro,
      orgaoRegistro: data.orgaoRegistro,
      telefone: data.telefone.replace(/\D/g, ""),
      cor: data.cor,
      bio: data.bio,
      cpfCnpj: data.cpfCnpj,
      tipoContrato: data.tipoContrato,
      cargaHoraria: data.cargaHoraria,
      salarioBase: data.salarioBase,
      comissaoPorcentagem: data.comissaoPorcentagem,
      chavePix: data.chavePix,
      especialidades: data.especialidades,
      formacao: data.formacao,
      cep: data.cep,
      logradouro: data.logradouro,
      numero: data.numero,
      complemento: data.complemento,
      bairro: data.bairro,
      cidade: data.cidade,
      uf: data.uf,
    };

    try {
      await api.post("/profissionais", payload);
      toast.success("Profissional cadastrado com sucesso!");
      loadProfissionais();
      setIsNewModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cadastrar profissional no servidor.");
    }
  };

  const filteredProfissionais = profissionais.filter((p) => {
    const matchesSearch =
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.especialidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tipo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty = activeSpecialty === "TODOS" || p.tipo === activeSpecialty;

    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Corpo Clínico & Profissionais
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestão dos terapeutas, especialidades, registros de conselho, escala semanal e contratos.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Cadastrar Profissional</span>
        </motion.button>
      </div>

      {/* Busca e Filtros */}
      <div
        className="p-4 rounded-2xl border flex flex-col md:flex-row gap-4 bg-card border-border"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar profissional por nome ou especialidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none border transition-colors bg-muted border-transparent text-foreground"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {["TODOS", "PSICOPEDAGOGO", "FONOAUDIOLOGO", "NEUROPSICÓLOGO", "TERAPEUTA_OCUPACIONAL"].map((tipo) => (
            <button
              key={tipo}
              onClick={() => setActiveSpecialty(tipo)}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer",
                activeSpecialty === tipo
                  ? "gradient-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {tipo === "TODOS"
                ? "Todos"
                : tipo.replace("TERAPEUTA_OCUPACIONAL", "T.O.").replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-muted-foreground">Carregando profissionais...</p>
        </div>
      ) : (
        <>
          {/* Grid de Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfissionais.map((prof) => (
              <ProfissionalCard key={prof.id} prof={prof} onSelectProf={(p) => setSelectedProf(p)} />
            ))}
          </div>

          {filteredProfissionais.length === 0 && (
            <div className="p-12 text-center text-xs text-muted-foreground border rounded-2xl border-dashed border-border bg-card">
              Nenhum profissional encontrado.
            </div>
          )}
        </>
      )}

      {/* DETALHES DO PROFISSIONAL (MODAL / GAVETA DETALHADA) */}
      <AnimatePresence>
        {selectedProf && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="absolute inset-0" onClick={() => setSelectedProf(null)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden bg-card border-border"
            >
              {/* Header com cor personalizada */}
              <div
                className="p-6 text-white flex items-center justify-between shrink-0"
                style={{ backgroundColor: selectedProf.cor }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-xl shadow-inner">
                    {getInitials(selectedProf.nome)}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl leading-tight">{selectedProf.nome}</h3>
                    <p className="text-xs text-white/95 mt-1 flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold">{selectedProf.tipo.replace("_", " ")}</span>
                      <span>•</span>
                      <span>{selectedProf.orgaoRegistro} {selectedProf.registro}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProf(null)}
                  className="p-2 rounded-xl hover:bg-white/10 text-white cursor-pointer transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
                
                {/* Especialidades & Formação */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-500 flex items-center gap-1.5">
                    <Award className="h-4 w-4" /> Especialidades & Formação
                  </h4>
                  
                  {/* Especialidades tags */}
                  <div className="flex flex-wrap gap-2">
                    {((selectedProf.especialidades && selectedProf.especialidades.length > 0)
                      ? selectedProf.especialidades
                      : (selectedProf.especialidade ? selectedProf.especialidade.split(", ") : [selectedProf.especialidade || "Terapeuta"])
                    ).map((esp, i) => (
                      <span
                        key={i}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/10"
                      >
                        {esp}
                      </span>
                    ))}
                  </div>

                  {selectedProf.formacao && (
                    <div className="p-3 rounded-xl border border-border bg-muted/30 text-xs text-foreground mt-2 flex gap-2">
                      <BookOpen className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-purple-600 dark:text-purple-400 block mb-1">Qualificações Acadêmicas:</span>
                        {selectedProf.formacao}
                      </div>
                    </div>
                  )}
                </div>

                {/* Apresentação (Bio) */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Apresentação</h4>
                  <p className="text-xs text-foreground leading-relaxed italic bg-muted/20 p-3.5 rounded-xl border border-border">
                    "{selectedProf.bio || "Nenhuma biografia informada."}"
                  </p>
                </div>

                {/* Dados Contratuais & Financeiros */}
                <div className="p-4 rounded-xl border border-border space-y-4 bg-muted/30">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-500 flex items-center gap-1.5">
                      <DollarSign className="h-4 w-4" /> Contrato & Financeiro
                    </h4>
                    {renderContractBadge(selectedProf.tipoContrato)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-xs">
                    {selectedProf.cpfCnpj && (
                      <div className="flex justify-between py-1.5 border-b border-border">
                        <span className="text-muted-foreground">CPF / CNPJ:</span>
                        <span className="font-semibold text-foreground">{selectedProf.cpfCnpj}</span>
                      </div>
                    )}
                    {selectedProf.cargaHoraria && (
                      <div className="flex justify-between py-1.5 border-b border-border">
                        <span className="text-muted-foreground">Carga Horária:</span>
                        <span className="font-semibold text-foreground">{selectedProf.cargaHoraria} semanal</span>
                      </div>
                    )}
                    {selectedProf.salarioBase !== undefined && selectedProf.salarioBase > 0 ? (
                      <div className="flex justify-between py-1.5 border-b border-border">
                        <span className="text-muted-foreground">Salário Base:</span>
                        <span className="font-semibold text-foreground">
                          R$ {selectedProf.salarioBase.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ) : null}
                    {selectedProf.comissaoPorcentagem !== undefined && selectedProf.comissaoPorcentagem > 0 ? (
                      <div className="flex justify-between py-1.5 border-b border-border">
                        <span className="text-muted-foreground">Taxa de Repasse:</span>
                        <span className="font-semibold text-foreground">{selectedProf.comissaoPorcentagem}% por consulta</span>
                      </div>
                    ) : null}
                    {selectedProf.chavePix && (
                      <div className="flex justify-between py-1.5 border-b border-border col-span-full">
                        <span className="text-muted-foreground">Chave PIX Repasse:</span>
                        <span className="font-mono font-semibold text-foreground select-all">{selectedProf.chavePix}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Endereço */}
                {(selectedProf.cep || selectedProf.logradouro) && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-purple-500" /> Endereço de Contato
                    </h4>
                    <div className="text-xs text-foreground p-3.5 rounded-xl border border-border bg-card">
                      <p className="font-bold">{selectedProf.logradouro}{selectedProf.numero ? `, nº ${selectedProf.numero}` : ""}</p>
                      {selectedProf.complemento && <p className="text-muted-foreground text-[11px] mt-0.5">{selectedProf.complemento}</p>}
                      <p className="text-muted-foreground text-[11px] mt-0.5">{selectedProf.bairro} — {selectedProf.cidade}/{selectedProf.uf}</p>
                      {selectedProf.cep && <p className="text-muted-foreground text-[10px] mt-1.5 font-mono">CEP: {selectedProf.cep}</p>}
                    </div>
                  </div>
                )}

                {/* Escala & Salas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-500 flex items-center gap-1.5">
                      <Clock className="h-4 w-4" /> Escala Semanal
                    </h4>
                    <div className="divide-y border border-border rounded-xl p-3 bg-card text-xs">
                      {Object.entries(selectedProf.horarios).length > 0 ? (
                        Object.entries(selectedProf.horarios).map(([dia, hora]) => (
                          <div key={dia} className="flex justify-between py-2 border-b border-border last:border-0">
                            <span className="font-semibold capitalize text-foreground">{dia}</span>
                            <span className="text-muted-foreground font-medium">{hora}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground italic py-1">Nenhum horário cadastrado.</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-500 flex items-center gap-1.5">
                      <Layers className="h-4 w-4" /> Salas Vinculadas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProf.salas && selectedProf.salas.length > 0 ? (
                        selectedProf.salas.map((sala) => (
                          <span
                            key={sala}
                            className="text-xs font-medium px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/10"
                          >
                            {sala}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Nenhuma sala associada.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CADASTRO DE PROFISSIONAL (MODAL) */}
      <ProfissionalModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleCreateProf}
      />
    </div>
  );
}
