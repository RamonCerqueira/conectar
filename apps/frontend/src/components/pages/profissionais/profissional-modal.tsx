"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, ShieldAlert, Award, DollarSign, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfissionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
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
  }) => void;
}

type TabType = "dados" | "registro" | "contrato" | "perfil";

export function ProfissionalModal({ isOpen, onClose, onSubmit }: ProfissionalModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("dados");

  // Form State - Dados Gerais & Endereço
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");

  // Form State - Registro, Especialidades & Formação
  const [tipo, setTipo] = useState("PSICOPEDAGOGO");
  const [especialidade, setEspecialidade] = useState(""); // single fallback compatibility
  const [especialidades, setEspecialidades] = useState<string[]>([]);
  const [newEspecialidade, setNewEspecialidade] = useState("");
  const [formacao, setFormacao] = useState("");
  const [registro, setRegistro] = useState("");
  const [orgaoRegistro, setOrgaoRegistro] = useState("");

  // Form State - Contrato
  const [tipoContrato, setTipoContrato] = useState("PJ");
  const [cargaHoraria, setCargaHoraria] = useState("30h");
  const [salarioBase, setSalarioBase] = useState("");
  const [comissaoPorcentagem, setComissaoPorcentagem] = useState("");
  const [chavePix, setChavePix] = useState("");

  // Form State - Perfil
  const [cor, setCor] = useState("#8E7BBE");
  const [bio, setBio] = useState("");

  const tabs = [
    { id: "dados", label: "Dados & Endereço", icon: User },
    { id: "registro", label: "Especialidades & Reg.", icon: Award },
    { id: "contrato", label: "Contrato & Repasse", icon: DollarSign },
    { id: "perfil", label: "Biografia & Agenda", icon: Clock },
  ] as const;

  const handleCepChange = async (val: string) => {
    setCep(val);
    const cleanCep = val.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setLogradouro(data.logradouro || "");
          setBairro(data.bairro || "");
          setCidade(data.localidade || "");
          setUf(data.uf || "");
        }
      } catch (err) {
        console.error("Erro ao buscar CEP", err);
      }
    }
  };

  const addEspecialidade = (esp: string) => {
    const trimmed = esp.trim();
    if (trimmed && !especialidades.includes(trimmed)) {
      setEspecialidades([...especialidades, trimmed]);
    }
    setNewEspecialidade("");
  };

  const removeEspecialidade = (indexToRemove: number) => {
    setEspecialidades(especialidades.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email) {
      setActiveTab("dados");
      return;
    }

    // Se o usuário digitou algo na especialidade e não deu enter, adiciona automaticamente
    let finalEspecialidades = [...especialidades];
    if (newEspecialidade.trim() && !finalEspecialidades.includes(newEspecialidade.trim())) {
      finalEspecialidades.push(newEspecialidade.trim());
    }

    onSubmit({
      nome,
      email,
      tipo,
      especialidade: finalEspecialidades.join(", ") || especialidade,
      registro,
      orgaoRegistro,
      telefone,
      cor,
      bio,
      cpfCnpj,
      tipoContrato,
      cargaHoraria,
      salarioBase: salarioBase ? Number(salarioBase) : undefined,
      comissaoPorcentagem: comissaoPorcentagem ? Number(comissaoPorcentagem) : undefined,
      chavePix,
      especialidades: finalEspecialidades,
      formacao,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      uf,
    });

    // Reset
    setNome("");
    setEmail("");
    setTelefone("");
    setCpfCnpj("");
    setCep("");
    setLogradouro("");
    setNumero("");
    setComplemento("");
    setBairro("");
    setCidade("");
    setUf("");
    setTipo("PSICOPEDAGOGO");
    setEspecialidade("");
    setEspecialidades([]);
    setNewEspecialidade("");
    setFormacao("");
    setRegistro("");
    setOrgaoRegistro("");
    setTipoContrato("PJ");
    setCargaHoraria("30h");
    setSalarioBase("");
    setComissaoPorcentagem("");
    setChavePix("");
    setCor("#8E7BBE");
    setBio("");
    setActiveTab("dados");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden bg-card"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-foreground">Cadastrar Novo Profissional (Intake)</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Preencha o perfil completo, endereço, múltiplas especialidades e dados contratuais.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tab Navigation - Grid Layout responsivo para evitar cortes */}
            <div className="grid grid-cols-2 md:grid-cols-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center justify-center gap-2 px-3 py-3.5 text-[11px] md:text-xs font-semibold transition-all border-b-2 -mb-[2px] cursor-pointer",
                      isActive
                        ? "border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-500/5"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">

                {/* TAB 1: DADOS PESSOAIS & ENDEREÇO */}
                {activeTab === "dados" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Nome Completo *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Dra. Juliana Silveira"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">CPF ou CNPJ</label>
                        <input
                          type="text"
                          placeholder="Apenas números"
                          value={cpfCnpj}
                          onChange={(e) => setCpfCnpj(e.target.value)}
                          className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background focus:ring-1 focus:ring-purple-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Telefone / WhatsApp *</label>
                        <input
                          type="tel"
                          required
                          placeholder="Ex: (11) 99999-9999"
                          value={telefone}
                          onChange={(e) => setTelefone(e.target.value)}
                          className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">E-mail Corporativo *</label>
                      <input
                        type="email"
                        required
                        placeholder="Ex: juliana@conectar.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    {/* Endereço Division */}
                    <div className="pt-4 border-t space-y-4" style={{ borderColor: "hsl(var(--border))" }}>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-purple-500">Endereço Residencial/Comercial</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground">CEP (Busca Automática)</label>
                          <input
                            type="text"
                            placeholder="00000-000"
                            value={cep}
                            onChange={(e) => handleCepChange(e.target.value)}
                            className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background focus:ring-1 focus:ring-purple-500"
                          />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-xs font-semibold text-muted-foreground">Logradouro (Rua/Av.)</label>
                          <input
                            type="text"
                            placeholder="Rua das Flores"
                            value={logradouro}
                            onChange={(e) => setLogradouro(e.target.value)}
                            className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background focus:ring-1 focus:ring-purple-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground">Número</label>
                          <input
                            type="text"
                            placeholder="123"
                            value={numero}
                            onChange={(e) => setNumero(e.target.value)}
                            className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background focus:ring-1 focus:ring-purple-500"
                          />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-xs font-semibold text-muted-foreground">Complemento</label>
                          <input
                            type="text"
                            placeholder="Apto 45, Bloco B"
                            value={complemento}
                            onChange={(e) => setComplemento(e.target.value)}
                            className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background focus:ring-1 focus:ring-purple-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground">Bairro</label>
                          <input
                            type="text"
                            placeholder="Centro"
                            value={bairro}
                            onChange={(e) => setBairro(e.target.value)}
                            className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background focus:ring-1 focus:ring-purple-500"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground">Cidade</label>
                          <input
                            type="text"
                            placeholder="São Paulo"
                            value={cidade}
                            onChange={(e) => setCidade(e.target.value)}
                            className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background focus:ring-1 focus:ring-purple-500"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground">UF</label>
                          <input
                            type="text"
                            placeholder="SP"
                            maxLength={2}
                            value={uf}
                            onChange={(e) => setUf(e.target.value)}
                            className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background focus:ring-1 focus:ring-purple-500 uppercase"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: ESPECIALIDADES & REGISTRO */}
                {activeTab === "registro" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Tipo de Conselho/Atuação Principal</label>
                      <select
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="PSICOPEDAGOGO">Psicopedagogo</option>
                        <option value="FONOAUDIOLOGO">Fonoaudiólogo</option>
                        <option value="NEUROPSICÓLOGO">Neuropsicólogo</option>
                        <option value="PSICOLOGO">Psicólogo</option>
                        <option value="TERAPEUTA_OCUPACIONAL">Terapeuta Ocupacional</option>
                        <option value="PEDAGOGO">Pedagogo</option>
                      </select>
                    </div>

                    {/* MÚLTIPLAS ESPECIALIDADES */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Especialidades Clínicas (Pressione Enter ou clique em Adicionar)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Ex: TDAH, Autismo (TEA), Dislexia, Processamento Sensorial"
                          value={newEspecialidade}
                          onChange={(e) => setNewEspecialidade(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addEspecialidade(newEspecialidade);
                            }
                          }}
                          className="flex-1 p-2.5 rounded-xl border text-sm outline-none bg-background focus:ring-1 focus:ring-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => addEspecialidade(newEspecialidade)}
                          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          Adicionar
                        </button>
                      </div>

                      {/* Sugestões de cliques rápidos */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[10px] text-muted-foreground py-0.5 mr-1 font-semibold">Sugestões:</span>
                        {["TEA (Autismo)", "TDAH", "Dislexia", "Integração Sensorial", "Linguagem", "Processamento Auditivo"].map((esp) => (
                          <button
                            key={esp}
                            type="button"
                            onClick={() => addEspecialidade(esp)}
                            className="text-[10px] bg-muted hover:bg-purple-100 hover:text-purple-700 text-muted-foreground px-2 py-0.5 rounded-md border border-dashed transition-all cursor-pointer"
                          >
                            + {esp}
                          </button>
                        ))}
                      </div>

                      {/* Chips das especialidades */}
                      {especialidades.length > 0 ? (
                        <div className="flex flex-wrap gap-2 p-2.5 rounded-xl border bg-muted/30 mt-2">
                          {especialidades.map((esp, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 animate-in zoom-in-95 duration-100"
                            >
                              {esp}
                              <button
                                type="button"
                                onClick={() => removeEspecialidade(idx)}
                                className="hover:bg-purple-500/20 rounded p-0.5 text-purple-700 dark:text-purple-300 cursor-pointer"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-muted-foreground italic">Nenhuma especialidade específica adicionada ainda.</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Formação Acadêmica & Qualificações</label>
                      <input
                        type="text"
                        placeholder="Ex: Graduação em Fonoaudiologia (USP), Pós-Graduação em Neuropsicologia Clínica"
                        value={formacao}
                        onChange={(e) => setFormacao(e.target.value)}
                        className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Registro Profissional (Nº)</label>
                        <input
                          type="text"
                          placeholder="Ex: 12345/SP"
                          value={registro}
                          onChange={(e) => setRegistro(e.target.value)}
                          className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background focus:ring-1 focus:ring-purple-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Órgão Emissor</label>
                        <input
                          type="text"
                          placeholder="Ex: CRP, CREFONO, CREFITO"
                          value={orgaoRegistro}
                          onChange={(e) => setOrgaoRegistro(e.target.value)}
                          className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: CONTRATO & REPASSE */}
                {activeTab === "contrato" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Regime de Contratação</label>
                        <select
                          value={tipoContrato}
                          onChange={(e) => setTipoContrato(e.target.value)}
                          className="w-full p-2.5 rounded-xl border text-sm bg-background outline-none focus:ring-1 focus:ring-purple-500"
                        >
                          <option value="PJ">Prestador de Serviço (PJ)</option>
                          <option value="CLT">Consolidação das Leis do Trabalho (CLT)</option>
                          <option value="COMISSAO">Comissionamento / Repasse</option>
                          <option value="SOCIO">Sócio Clínico</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Carga Horária Semanal</label>
                        <input
                          type="text"
                          placeholder="Ex: 20h, 40h"
                          value={cargaHoraria}
                          onChange={(e) => setCargaHoraria(e.target.value)}
                          className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background focus:ring-1"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Salário Base / Valor Hora (R$)</label>
                        <input
                          type="number"
                          placeholder="Ex: 3500"
                          value={salarioBase}
                          onChange={(e) => setSalarioBase(e.target.value)}
                          className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background focus:ring-1"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Taxa de Comissão / Repasse (%)</label>
                        <input
                          type="number"
                          placeholder="Ex: 50"
                          value={comissaoPorcentagem}
                          onChange={(e) => setComissaoPorcentagem(e.target.value)}
                          className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background focus:ring-1"
                        />
                      </div>

                      <div className="space-y-1.5 col-span-full">
                        <label className="text-xs font-semibold text-muted-foreground">Chave PIX para Faturamento</label>
                        <input
                          type="text"
                          placeholder="Celular, CNPJ, CPF, E-mail ou Chave Aleatória"
                          value={chavePix}
                          onChange={(e) => setChavePix(e.target.value)}
                          className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background focus:ring-1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: BIOGRAFIA & AGENDA */}
                {activeTab === "perfil" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Biografia / Apresentação</label>
                      <textarea
                        placeholder="Resumo da carreira e especialidade clínica..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background focus:ring-1 focus:ring-purple-500 resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Cor na Agenda (Calendário)</label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="color"
                          value={cor}
                          onChange={(e) => setCor(e.target.value)}
                          className="w-12 h-10 rounded-xl border-0 outline-none cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono bg-muted px-2.5 py-1.5 rounded-xl border font-semibold">{cor}</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Sticky Footer */}
              <div className="p-6 border-t flex justify-between items-center bg-card">
                {/* Navigation helpers inside modal */}
                <div className="flex gap-2">
                  {activeTab !== "dados" && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === "registro") setActiveTab("dados");
                        else if (activeTab === "contrato") setActiveTab("registro");
                        else if (activeTab === "perfil") setActiveTab("contrato");
                      }}
                      className="px-4 py-2 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                    >
                      Voltar
                    </button>
                  )}
                  {activeTab !== "perfil" && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === "dados") setActiveTab("registro");
                        else if (activeTab === "registro") setActiveTab("contrato");
                        else if (activeTab === "contrato") setActiveTab("perfil");
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-colors cursor-pointer"
                    >
                      Avançar
                    </button>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
                  >
                    Salvar Cadastro
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
