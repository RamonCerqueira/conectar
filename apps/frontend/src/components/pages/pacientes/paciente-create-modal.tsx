"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, GraduationCap, Heart, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface PacienteCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    nome: string;
    dataNascimento: string;
    sexo: string;
    cpf: string;
    status: string;
    escola: string;
    serie: string;
    turnoEscolar: string;
    nomeProf: string;
    coordenador: string;
    responsavelNome: string;
    responsavelTel: string;
    responsavelEmail: string;
    responsavelParentesco: string;
    responsavelProfissao: string;
    diagnosticoDesc: string;
    diagnosticoCid: string;
    medicamentos: string;
    alergias: string;
    observacoesMed: string;
    sensibilidadeSensorial: string;
    hiperfoco: string;
    observacoes: string;
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
  }) => void;
}

type TabType = "dados" | "contato" | "escola" | "clinico";

export function PacienteCreateModal({ isOpen, onClose, onSubmit }: PacienteCreateModalProps) {
  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>("dados");

  // Form State - Personal / Address
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("MASCULINO");
  const [cpf, setCpf] = useState("");
  const [status, setStatus] = useState("ATIVO");
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  // Form State - Responsável
  const [responsavelNome, setResponsavelNome] = useState("");
  const [responsavelTel, setResponsavelTel] = useState("");
  const [responsavelEmail, setResponsavelEmail] = useState("");
  const [responsavelParentesco, setResponsavelParentesco] = useState("MAE");
  const [responsavelProfissao, setResponsavelProfissao] = useState("");

  // Form State - Escola
  const [escola, setEscola] = useState("");
  const [serie, setSerie] = useState("");
  const [turnoEscolar, setTurnoEscolar] = useState("Manhã");
  const [nomeProf, setNomeProf] = useState("");
  const [coordenador, setCoordenador] = useState("");

  // Form State - Clínico
  const [diagnosticoDesc, setDiagnosticoDesc] = useState("");
  const [diagnosticoCid, setDiagnosticoCid] = useState("");
  const [medicamentos, setMedicamentos] = useState("");
  const [alergias, setAlergias] = useState("");
  const [observacoesMed, setObservacoesMed] = useState("");
  const [sensibilidadeSensorial, setSensibilidadeSensorial] = useState("");
  const [hiperfoco, setHiperfoco] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const tabs = [
    { id: "dados", label: "Dados e Endereço", icon: User },
    { id: "contato", label: "Responsável", icon: Phone },
    { id: "escola", label: "Vida Escolar", icon: GraduationCap },
    { id: "clinico", label: "Perfil Clínico", icon: Heart },
  ] as const;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !dataNascimento) {
      setActiveTab("dados");
      return;
    }

    onSubmit({
      nome,
      dataNascimento,
      sexo,
      cpf,
      status,
      escola,
      serie,
      turnoEscolar,
      nomeProf,
      coordenador,
      responsavelNome,
      responsavelTel,
      responsavelEmail,
      responsavelParentesco,
      responsavelProfissao,
      diagnosticoDesc,
      diagnosticoCid,
      medicamentos,
      alergias,
      observacoesMed,
      sensibilidadeSensorial,
      hiperfoco,
      observacoes,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
    });

    // Reset fields
    setNome("");
    setDataNascimento("");
    setSexo("MASCULINO");
    setCpf("");
    setStatus("ATIVO");
    setCep("");
    setLogradouro("");
    setNumero("");
    setComplemento("");
    setBairro("");
    setCidade("");
    setEstado("");
    setResponsavelNome("");
    setResponsavelTel("");
    setResponsavelEmail("");
    setResponsavelParentesco("MAE");
    setResponsavelProfissao("");
    setEscola("");
    setSerie("");
    setTurnoEscolar("Manhã");
    setNomeProf("");
    setCoordenador("");
    setDiagnosticoDesc("");
    setDiagnosticoCid("");
    setMedicamentos("");
    setAlergias("");
    setObservacoesMed("");
    setSensibilidadeSensorial("");
    setHiperfoco("");
    setObservacoes("");
    setActiveTab("dados");
  };

  const handleCepBlur = async () => {
    const cleanedCep = cep.replace(/\D/g, "");
    if (cleanedCep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setLogradouro(data.logradouro || "");
        setBairro(data.bairro || "");
        setCidade(data.localidade || "");
        setEstado(data.uf || "");
      }
    } catch (err) {
      console.warn("Could not fetch CEP details", err);
    }
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
                <h3 className="font-bold text-lg text-foreground">Cadastrar Novo Paciente (Intake)</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Preencha o perfil completo da criança. Terapeutas usarão estes dados para planejar as sessões.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tab Links */}
            <div className="flex border-b overflow-x-auto scrollbar-none" style={{ borderColor: "hsl(var(--border))" }}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-5 py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 -mb-[2px] cursor-pointer",
                      isActive
                        ? "border-purple-500 text-purple-600 dark:text-purple-400"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* TAB 1: DADOS GERAIS E ENDEREÇO */}
              {activeTab === "dados" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-500 mb-4">
                      Dados Pessoais
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5 col-span-full">
                        <label className="text-xs font-semibold text-muted-foreground">Nome Completo *</label>
                        <input
                          type="text"
                          required
                          placeholder="Nome completo da criança"
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          className="w-full p-2.5 rounded-xl border text-sm outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-background"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Data de Nascimento *</label>
                        <input
                          type="date"
                          required
                          value={dataNascimento}
                          onChange={(e) => setDataNascimento(e.target.value)}
                          className="w-full p-2.5 rounded-xl border text-sm outline-none focus:ring-1 focus:ring-purple-500 bg-background"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Sexo</label>
                        <select
                          value={sexo}
                          onChange={(e) => setSexo(e.target.value)}
                          className="w-full p-2.5 rounded-xl border text-sm outline-none focus:ring-1 bg-background"
                        >
                          <option value="MASCULINO">Masculino</option>
                          <option value="FEMININO">Feminino</option>
                          <option value="OUTRO">Outro</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">CPF (Opcional)</label>
                        <input
                          type="text"
                          placeholder="Apenas números"
                          value={cpf}
                          onChange={(e) => setCpf(e.target.value)}
                          className="w-full p-2.5 rounded-xl border text-sm outline-none focus:ring-1 bg-background"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Status do Paciente</label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="w-full p-2.5 rounded-xl border text-sm outline-none focus:ring-1 bg-background"
                        >
                          <option value="ATIVO">Ativo</option>
                          <option value="LISTA_ESPERA">Lista de Espera</option>
                          <option value="ALTA">Alta</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-500 mb-4 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> Endereço Residencial
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">CEP</label>
                        <input
                          type="text"
                          placeholder="00000-000"
                          value={cep}
                          onChange={(e) => setCep(e.target.value)}
                          onBlur={handleCepBlur}
                          className="w-full p-2.5 rounded-xl border text-sm outline-none focus:ring-1 bg-background"
                        />
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-semibold text-muted-foreground">Rua / Logradouro</label>
                        <input
                          type="text"
                          placeholder="Avenida, Rua, Travessa..."
                          value={logradouro}
                          onChange={(e) => setLogradouro(e.target.value)}
                          className="w-full p-2.5 rounded-xl border text-sm outline-none focus:ring-1 bg-background"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Número</label>
                        <input
                          type="text"
                          placeholder="123"
                          value={numero}
                          onChange={(e) => setNumero(e.target.value)}
                          className="w-full p-2.5 rounded-xl border text-sm outline-none focus:ring-1 bg-background"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Complemento</label>
                        <input
                          type="text"
                          placeholder="Apto, Bloco, etc."
                          value={complemento}
                          onChange={(e) => setComplemento(e.target.value)}
                          className="w-full p-2.5 rounded-xl border text-sm outline-none focus:ring-1 bg-background"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Bairro</label>
                        <input
                          type="text"
                          placeholder="Bairro"
                          value={bairro}
                          onChange={(e) => setBairro(e.target.value)}
                          className="w-full p-2.5 rounded-xl border text-sm outline-none focus:ring-1 bg-background"
                        />
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-semibold text-muted-foreground">Cidade</label>
                        <input
                          type="text"
                          placeholder="São Paulo"
                          value={cidade}
                          onChange={(e) => setCidade(e.target.value)}
                          className="w-full p-2.5 rounded-xl border text-sm outline-none focus:ring-1 bg-background"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Estado (UF)</label>
                        <input
                          type="text"
                          maxLength={2}
                          placeholder="SP"
                          value={estado}
                          onChange={(e) => setEstado(e.target.value.toUpperCase())}
                          className="w-full p-2.5 rounded-xl border text-sm outline-none focus:ring-1 bg-background"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: RESPONSÁVEL E CONTATO */}
              {activeTab === "contato" && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-500 mb-2">
                    Responsável Principal
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 col-span-full">
                      <label className="text-xs font-semibold text-muted-foreground">Nome do Responsável *</label>
                      <input
                        type="text"
                        required
                        placeholder="Nome completo do pai, mãe ou responsável legal"
                        value={responsavelNome}
                        onChange={(e) => setResponsavelNome(e.target.value)}
                        className="w-full p-2.5 rounded-xl border text-sm outline-none focus:ring-1 bg-background"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Parentesco / Vínculo</label>
                      <select
                        value={responsavelParentesco}
                        onChange={(e) => setResponsavelParentesco(e.target.value)}
                        className="w-full p-2.5 rounded-xl border text-sm outline-none focus:ring-1 bg-background"
                      >
                        <option value="MAE">Mãe</option>
                        <option value="PAI">Pai</option>
                        <option value="AVO_M">Avó Materna</option>
                        <option value="AVO_P">Avó Paterna</option>
                        <option value="AVO">Avô</option>
                        <option value="TIO">Tio(a)</option>
                        <option value="TUTOR">Tutor Legal</option>
                        <option value="OUTRO">Outro</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Profissão</label>
                      <input
                        type="text"
                        placeholder="Ex: Administrador, Professora"
                        value={responsavelProfissao}
                        onChange={(e) => setResponsavelProfissao(e.target.value)}
                        className="w-full p-2.5 rounded-xl border text-sm outline-none focus:ring-1 bg-background"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Telefone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="(99) 99999-9999"
                        value={responsavelTel}
                        onChange={(e) => setResponsavelTel(e.target.value)}
                        className="w-full p-2.5 rounded-xl border text-sm outline-none focus:ring-1 bg-background"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">E-mail de Contato</label>
                      <input
                        type="email"
                        placeholder="nome@email.com"
                        value={responsavelEmail}
                        onChange={(e) => setResponsavelEmail(e.target.value)}
                        className="w-full p-2.5 rounded-xl border text-sm outline-none focus:ring-1 bg-background"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: VIDA ESCOLAR */}
              {activeTab === "escola" && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-500 mb-2">
                    Informações Escolares
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 col-span-full">
                      <label className="text-xs font-semibold text-muted-foreground">Instituição de Ensino</label>
                      <input
                        type="text"
                        placeholder="Nome da escola ou creche"
                        value={escola}
                        onChange={(e) => setEscola(e.target.value)}
                        className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Série / Ano</label>
                      <input
                        type="text"
                        placeholder="Ex: 2º ano Fundamental, Maternal II"
                        value={serie}
                        onChange={(e) => setSerie(e.target.value)}
                        className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Turno</label>
                      <select
                        value={turnoEscolar}
                        onChange={(e) => setTurnoEscolar(e.target.value)}
                        className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background"
                      >
                        <option value="Manhã">Manhã</option>
                        <option value="Tarde">Tarde</option>
                        <option value="Integral">Integral</option>
                        <option value="Noite">Noite</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Professor(a) Regente</label>
                      <input
                        type="text"
                        placeholder="Nome do professor principal"
                        value={nomeProf}
                        onChange={(e) => setNomeProf(e.target.value)}
                        className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Coordenador(a) Pedagógico(a)</label>
                      <input
                        type="text"
                        placeholder="Nome do coordenador"
                        value={coordenador}
                        onChange={(e) => setCoordenador(e.target.value)}
                        className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PERFIL CLÍNICO */}
              {activeTab === "clinico" && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-500 mb-2">
                    Histórico Clínico e Comportamental
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Diagnóstico / Hipótese Diagnóstica</label>
                      <input
                        type="text"
                        placeholder="Ex: TEA Nível 1 de Suporte, TDAH"
                        value={diagnosticoDesc}
                        onChange={(e) => setDiagnosticoDesc(e.target.value)}
                        className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Código CID-10 / CID-11</label>
                      <input
                        type="text"
                        placeholder="Ex: F84.0, F90.0"
                        value={diagnosticoCid}
                        onChange={(e) => setDiagnosticoCid(e.target.value)}
                        className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Medicamentos de Uso Contínuo</label>
                      <input
                        type="text"
                        placeholder="Separados por vírgula (Ex: Ritalina 10mg)"
                        value={medicamentos}
                        onChange={(e) => setMedicamentos(e.target.value)}
                        className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Alergias Alimentares / Medicamentosas</label>
                      <input
                        type="text"
                        placeholder="Separados por vírgula (Ex: Lactose, Dipirona)"
                        value={alergias}
                        onChange={(e) => setAlergias(e.target.value)}
                        className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background"
                      />
                    </div>

                    <div className="space-y-1.5 col-span-full">
                      <label className="text-xs font-semibold text-muted-foreground">Sensibilidades Sensoriais</label>
                      <textarea
                        rows={2}
                        placeholder="Ex: Hipersensibilidade auditiva (ruídos altos), não tolera texturas pastosas, etc."
                        value={sensibilidadeSensorial}
                        onChange={(e) => setSensibilidadeSensorial(e.target.value)}
                        className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background resize-none"
                      />
                    </div>

                    <div className="space-y-1.5 col-span-full">
                      <label className="text-xs font-semibold text-muted-foreground">Hiperfocos / Interesses de Engajamento</label>
                      <input
                        type="text"
                        placeholder="Ex: Dinossauros, Carros de corrida, Quebra-cabeças, Desenhos de letras"
                        value={hiperfoco}
                        onChange={(e) => setHiperfoco(e.target.value)}
                        className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background"
                      />
                    </div>

                    <div className="space-y-1.5 col-span-full">
                      <label className="text-xs font-semibold text-muted-foreground">Observações Médicas / Gerais</label>
                      <textarea
                        rows={2}
                        placeholder="Outras informações importantes para a condução do plano de terapia..."
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                        className="w-full p-2.5 rounded-xl border text-sm outline-none bg-background resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-6 border-t flex justify-between items-center">
                {/* Navigation helpers inside modal */}
                <div className="flex gap-2">
                  {activeTab !== "dados" && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === "contato") setActiveTab("dados");
                        else if (activeTab === "escola") setActiveTab("contato");
                        else if (activeTab === "clinico") setActiveTab("escola");
                      }}
                      className="px-4 py-2 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                    >
                      Voltar
                    </button>
                  )}
                  {activeTab !== "clinico" && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === "dados") setActiveTab("contato");
                        else if (activeTab === "contato") setActiveTab("escola");
                        else if (activeTab === "escola") setActiveTab("clinico");
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
